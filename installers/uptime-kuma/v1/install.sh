#!/usr/bin/env bash
# Selfhost Uptime Kuma v1 — experimental, NOT deployment-verified.
# Requires Bash, an existing local Docker daemon and Docker Compose v2.
set -euo pipefail
umask 077
fail() { printf 'Error: %s\n' "$1" >&2; exit 1; }
mode=check
directory="${HOME:?HOME must be set}/selfhost-uptime-kuma-v1"
mode_set=no
while (( $# )); do
  case "$1" in
    --check|--dry-run|--apply)
      [[ "$mode_set" == no ]] || fail 'Specify only one mode.'
      mode_set=yes; mode="${1#--}"; shift ;;
    --directory)
      (( $# >= 2 )) || fail '--directory requires an absolute path.'
      directory="$2"; shift 2 ;;
    --help)
      printf '%s\n' 'Usage: bash install.sh [--check|--dry-run|--apply] [--directory /absolute/new-directory]' 'Default: read-only preflight. --apply creates a NEW directory and starts Docker.'
      exit 0 ;;
    *) fail 'Unknown argument. Use --help.' ;;
  esac
done
[[ "$directory" =~ ^/[a-zA-Z0-9_./\ -]+$ ]] || fail 'Directory must be absolute and contain only letters, numbers, spaces, /, ., _, -.'
[[ "$directory" != */ && "$directory" != *'/../'* && "$directory" != */.. && "$directory" != *'/./'* && "$directory" != */. ]] || fail 'Directory must be canonical, without trailing slash or dot components.'
[[ "$(id -u)" != 0 ]] || fail 'Do not run as root or with sudo.'
case "$(uname -s)" in
  Linux) ;;
  Darwin) printf '%s\n' 'macOS: prerequisite preflight only; Docker Desktop deployment is untested.'; [[ "$mode" != apply ]] || fail 'macOS --apply is not supported by this pilot.' ;;
  *) fail 'Unsupported OS. Windows users: use a Linux WSL2 shell; native Windows is unsupported.' ;;
esac
case "$(uname -m)" in x86_64|aarch64|arm64) ;; *) fail 'Unsupported architecture; only amd64 and arm64 are eligible.' ;; esac
[[ ! -e "$directory" && ! -L "$directory" ]] || fail 'Destination already exists; refusing to change any files, .env or data. Inspect manually.'
parent="${directory%/*}"; [[ -n "$parent" ]] || parent=/
[[ -d "$parent" && -w "$parent" ]] || fail 'Parent directory must already exist and be writable.'
[[ "$(cd -- "$parent" && pwd -P)" == "$parent" ]] || fail 'Parent path must be canonical and contain no symlinks.'
command -v docker >/dev/null 2>&1 || fail 'Install Docker and Compose separately using official instructions; this script never installs them.'
# Fail closed on remote/TCP contexts: host-local port claims require a local daemon.
endpoint="$(docker context inspect --format '{{.Endpoints.docker.Host}}' 2>/dev/null)" || fail 'Cannot inspect Docker context.'
[[ "$endpoint" == unix://* && -z "${DOCKER_HOST:-}" && -z "${DOCKER_CONTEXT:-}" ]] || fail 'Use an explicit local Unix-socket Docker context without environment overrides.'
engine="$(docker info --format '{{.OSType}}' 2>/dev/null)" || fail 'Local Docker daemon is unavailable or permission denied.'
[[ "$engine" == linux ]] || fail 'Docker must be running Linux containers.'
compose="$(docker compose version --short 2>/dev/null)" || fail 'Docker Compose v2 is required.'
[[ "$compose" == 2.* || "$compose" == v2.* ]] || fail 'Docker Compose v2 is required.'
existing="$(docker ps -aq --filter label=com.docker.compose.project=selfhost-kuma-v1 2>/dev/null)" || fail 'Cannot check existing pilot containers.'
[[ -z "$existing" ]] || fail 'Pilot containers already exist. Refusing to replace them.'
printf '%s\n' 'Experimental pilot: shell/stub-tested only, not deployment-verified.' 'Plan: new private directory; pinned Kuma 2.5.5 image; local data; 127.0.0.1:3001 only.' 'No sudo, package installs, firewall changes, Docker socket mount, or placeholder secrets.' 'FIRST RUN: promptly create the administrator account at http://127.0.0.1:3001.' 'Do not expose or proxy it before bootstrap. Other local users may access this port.' 'Use local storage, not NFS. Review disk space and backups yourself.'
if [[ "$mode" != apply ]]; then
  printf '%s\n' 'Preflight complete. No files changed or containers started. Review then pass --apply explicitly.'
  exit 0
fi
# Atomic mkdir refuses races/existing destinations. Failure leaves files for inspection; no destructive cleanup.
mkdir -- "$directory" || fail 'Could not create a fresh directory.'
mkdir -- "$directory/data"
cat > "$directory/compose.yaml" <<'COMPOSE'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2.5.5@sha256:c74379ac4509ce2d2c2633f509e67003ee2e45b6e995c5e43fc101f45a0e1fbe
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    ports:
      - "127.0.0.1:3001:3001"
COMPOSE
# Disable ambient Compose/env-file discovery. Do not print resolved config or logs.
unset COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES COMPOSE_ENV_FILES
export COMPOSE_DISABLE_ENV_FILE=1
cd -- "$directory"
docker compose --project-name selfhost-kuma-v1 --file "$directory/compose.yaml" config --quiet || fail 'Compose validation failed. Files retained; inspect manually.'
docker compose --project-name selfhost-kuma-v1 --file "$directory/compose.yaml" up --detach || fail 'Docker startup failed; files retained. No successful deployment claimed.'
printf '%s\n' 'Docker accepted startup; readiness is NOT verified. Open http://127.0.0.1:3001 and create the administrator immediately.'
