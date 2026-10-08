# Versioned Uptime Kuma installer pilot

**Experimental / draft / not deployment-verified.** Only Uptime Kuma has a hosted installer. Authentik is deferred: its existing `latest` / placeholder-secrets example is unsuitable for automation. Other project examples stay explicitly unverified and link to official documentation.

## Artifacts and publication

The version-controlled `installers/uptime-kuma/v1/{install.sh,SHA256SUMS,metadata.json}` files are served byte-for-byte by `/install/uptime-kuma/v1/<file>`. Only those three filenames and that slug/version are allowlisted; other paths return 404. Downloads carry attachment, nosniff and one-year immutable cache headers. The intended production origin is `https://selfhost.io.vn`; these routes are not claimed live until this revision is deployed.

Before first publication the pilot remains a draft. After publication, **never change any v1 artifact**. Fixes, image changes, policy changes or additional support require v2/new paths. Preserve old URLs and bytes, or withdraw a compromised version explicitly rather than silently replacing it. Maintain the version directory in source control; no runtime-generated script or user interpolation. Site deployment/update is separate from installing Kuma. Keep artifact directories in the deployed build (Next prerenders the allowlisted downloads).

Actual computed script SHA256:

```text
8e4c349924b3dfce76cc8a4bb2bda2009ef264e2a84aedceb7d70b735f378035
```

Same-origin checksum detects corruption and byte mismatch, not a compromised publisher; it is not a signature. Independently compare the reviewed source/hash when trust matters.

## Review then opt in

Use a fresh download directory; curl overwrites its output filename if it already exists. Do not pipe a network response to a shell.

```bash
curl --fail --show-error --location --output install.sh https://selfhost.io.vn/install/uptime-kuma/v1/install.sh
curl --fail --show-error --location --output SHA256SUMS https://selfhost.io.vn/install/uptime-kuma/v1/SHA256SUMS
sha256sum --check SHA256SUMS
# macOS checksum alternative: shasum -a 256 -c SHA256SUMS
less install.sh
bash -n install.sh
bash install.sh --check
# Linux only, AFTER review/checks: explicit opt-in
bash install.sh --apply --directory "$HOME/selfhost-uptime-kuma-v1"
```

Bash is explicit. Default, `--check` and `--dry-run` perform read-only prerequisite checks, not image pulls, rendered-secret config dumps or container startup. `--apply` creates a **new** directory and data subdirectory under umask 077, writes compose, validates it quietly, then invokes Compose. Existing directories, files and symlinks are rejected in every mode, including reruns; `.env` and data are never overwritten. This is refusal-based idempotence, not an upgrade/reconcile tool. Directory paths must be absolute, canonical with a pre-existing writable non-symlink parent; spaces are supported, shell metacharacters/dot traversal rejected. Partial failures retain files for inspection, with no destructive cleanup or automatic retry.

Root is refused. No sudo, package/runtime installs, Docker-socket mount, firewall changes, deletion or migrations. Existing Docker daemon must run Linux containers via a local Unix-socket context; remote contexts and environment overrides are rejected. Compose v2 required; a reused pilot project is refused. Ambient Compose-file/project/profile/env-file discovery is disabled at startup. Docker commands may emit their ordinary diagnostics, but the script never reads `.env`, prints app secrets, dumps config or collects container logs.

The fixed bind is `127.0.0.1:3001:3001`. Port collision/startup readiness is not verified by preflight; Docker errors retain artifacts. Docker accepting `up` is **not** app readiness. Docker administrators and concurrent same-user tampering are outside this script's trust boundary. Back up local `data/` per upstream before any manual changes; never use NFS.

**Trusted single-user hosts only.** Another local user could claim the first administrator account; do not apply this pilot on an untrusted multi-user host.

**First run has no pre-provisioned credentials.** Open `http://127.0.0.1:3001` and immediately create the administrator before proxying or exposing it. Localhost limits network exposure, but other local users can access the port. Enter notification/monitor secrets in Kuma itself; do not paste them into chat, source control or logs. No HTTPS/proxy is configured by this pilot.

## Truthful OS scope

- Linux amd64/arm64: eligible for preflight/apply, **only tested using stub commands**, not a real deployment. Rootless/local Docker or a reviewed Docker-group setup must already be usable; membership in the Docker group effectively grants host-level privileges.
- macOS Intel/Apple Silicon: prerequisite preflight only, deployment with [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/) is **untested**; `--apply` deliberately refuses Darwin. Bash 3-compatible syntax is used but no macOS execution was performed.
- Windows: no native installer or PowerShell support. Install/configure [WSL2 integration](https://docs.docker.com/desktop/features/wsl/) independently, then use a Linux distribution shell and its local filesystem (not `/mnt/c` or NFS). This is guidance, **not tested WSL support**. Docker Desktop/WSL setup is not performed by the script.

## Upstream evidence retrieved 2026-10-08

- [GitHub latest-release API](https://api.github.com/repos/louislam/uptime-kuma/releases/latest): `tag_name=2.5.5`, `draft=false`, `prerelease=false`, published `2026-09-16T13:31:07Z`, target commit `c98982ac60eccb74cdab1d04c30e18057895ce87`. [Version release](https://github.com/louislam/uptime-kuma/releases/tag/2.5.5).
- [Official 2.5.5 Compose template](https://raw.githubusercontent.com/louislam/uptime-kuma/2.5.5/compose.yaml): service `uptime-kuma`, image `louislam/uptime-kuma:2`, restart `unless-stopped`, `./data:/app/data`, `3001:3001`. Pilot deliberately changes the floating major tag to exact version + digest and host binding to localhost; no opaque third-party template.
- [Docker Hub official repository tag API](https://hub.docker.com/v2/repositories/louislam/uptime-kuma/tags/2.5.5): tag `2.5.5`, active OCI image index digest `sha256:c74379ac4509ce2d2c2633f509e67003ee2e45b6e995c5e43fc101f45a0e1fbe`, Linux amd64/arm64/arm-v7 records. Pilot intentionally supports only amd64/arm64. Registry metadata was read; image was **not pulled/run**.
- [Official README](https://github.com/louislam/uptime-kuma): local storage, no NFS, localhost bind guidance. [Official wiki](https://github.com/louislam/uptime-kuma/wiki).

## Verification

`tests/installer.test.ts`: route byte/checksum/metadata equality and unknown target 404, English/Vietnamese UI, default/dry-run/check, explicit apply in isolated temp filesystem with fake `docker`/`id`/`uname`, rerun refusal preserving `.env` and data, root/OS/arch/Compose/daemon/path/argument failures, remote daemon refusal, and `bash -n`. The fake Docker command only records arguments; it does not test Compose semantics, image startup, filesystem ownership inside the container, bootstrap, health, networking or persistence. All sandbox directories are removed in `finally`; no test servers or real services are started.

No Docker executable was available on the development host. **Do not promote to deployment-verified until a separately authorized isolated real-Docker test checks first bootstrap, image/digest, local-only exposure, persistence, failures and backups.** macOS/WSL remain separately untested regardless of Linux results.
