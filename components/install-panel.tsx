import { CopyCodeBlock } from "@/components/copy-code-block";
import type { Locale } from "@/lib/i18n";
import metadata from "@/installers/uptime-kuma/v1/metadata.json";

export function InstallPanel({ slug, docsUrl, locale }: { slug: string; docsUrl: string; locale: Locale }) {
  const vi = locale === "vi";
  if (slug !== "uptime-kuma") return (
    <section className="installer-panel" aria-label={vi ? "Trình cài đặt" : "Installer"}>
      <h2>{vi ? "Chưa có trình cài đặt được lưu trữ" : "No hosted installer"}</h2>
      <p>{vi ? "Ví dụ bên dưới chưa được kiểm chứng; không phải trình cài đặt. Hãy đọc tài liệu chính thức và thay secrets trước khi sử dụng." : "The examples below are unverified, not installers. Consult official documentation and replace secrets before use."}</p>
      {slug === "authentik" && <p>{vi ? "Authentik được hoãn: ví dụ hiện có dùng phiên bản latest và secrets mẫu, chưa an toàn để tự động cài đặt." : "Authentik is explicitly deferred: the existing latest-version / placeholder-secrets example is not safe for an automated installer."}</p>}
      <a href={docsUrl} target="_blank" rel="noreferrer">{vi ? "Tài liệu chính thức" : "Official documentation"}</a>
    </section>
  );
  const base = "https://selfhost.io.vn/install/uptime-kuma/v1";
  const download = `curl --fail --show-error --location --output install.sh ${base}/install.sh\ncurl --fail --show-error --location --output SHA256SUMS ${base}/SHA256SUMS\nsha256sum --check SHA256SUMS\n# macOS: shasum -a 256 -c SHA256SUMS\nless install.sh\nbash -n install.sh\nbash install.sh --check`;
  return (
    <section className="installer-panel" aria-label={vi ? "Trình cài đặt thử nghiệm" : "Experimental installer"}>
      <h2>{vi ? "Uptime Kuma · trình cài đặt thử nghiệm v1" : "Uptime Kuma · experimental installer v1"}</h2>
      <p role="note">{vi ? "Bản nháp, chưa kiểm chứng triển khai. Chỉ dùng máy tin cậy một người dùng: người dùng cục bộ khác có thể chiếm tài khoản quản trị đầu tiên. Chỉ kiểm tra cú pháp và thử nghiệm Docker giả lập; chưa chạy Docker thật." : "Draft / not deployment-verified. Trusted single-user hosts only: another local user could claim the first administrator account. Syntax and isolated fake-Docker tests only; no real Docker deployment."}</p>
      <p>{vi ? "Tải về → kiểm tra SHA256 → đọc script → kiểm tra → tự chọn --apply. Không tải trực tiếp vào shell. Dùng tên tệp mới để tránh ghi đè tệp tải xuống cũ." : "Download → verify SHA256 → inspect → check → opt in to --apply. Never pipe a download into a shell. Use fresh download filenames to avoid replacing existing files."}</p>
      <div className="installer-links">
        <a href="/install/uptime-kuma/v1/install.sh" download>install.sh</a>
        <a href="/install/uptime-kuma/v1/SHA256SUMS" download>SHA256SUMS</a>
        <a href="/install/uptime-kuma/v1/metadata.json" download>metadata.json</a>
        <a href={docsUrl} target="_blank" rel="noreferrer">{vi ? "Tài liệu chính thức" : "Official documentation"}</a>
      </div>
      <p>SHA256: <code className="installer-digest">{metadata.sha256}</code></p>
      <p>{vi ? "Ảnh được ghim: Uptime Kuma 2.5.5 và digest OCI. Kiểm tra nguồn ngày 2026-10-08; checksum cùng website không phải chữ ký độc lập." : "Pinned: Uptime Kuma 2.5.5 and OCI digest. Sources checked 2026-10-08; a same-site checksum is not an independent signature."}</p>
      <ul>
        <li>{vi ? "Linux amd64/arm64: đủ điều kiện preflight, chưa kiểm chứng triển khai. Cần Docker cục bộ và Compose v2 đã cài, tài khoản không phải root." : "Linux amd64/arm64: eligible for preflight, deployment unverified. Requires existing local Docker + Compose v2, non-root user."}</li>
        <li>{vi ? "macOS: chỉ preflight, Docker Desktop chưa thử nghiệm; --apply bị từ chối." : "macOS: preflight only, Docker Desktop untested; --apply is refused."}</li>
        <li>{vi ? "Windows: không có PowerShell/native installer. Chỉ hướng dẫn Linux WSL2 với Docker Desktop tích hợp; chưa thử nghiệm." : "Windows: no PowerShell/native installer. Linux WSL2 with Docker Desktop integration guidance only; untested."}</li>
      </ul>
      <p role="alert">{vi ? "Lần đầu: tạo tài khoản quản trị ngay tại http://127.0.0.1:3001. Không proxy/mở ra Internet trước bootstrap; người dùng cục bộ khác vẫn có thể truy cập. Không cần secrets mẫu; secrets giám sát/thông báo phải nhập trong ứng dụng và không chia sẻ." : "First run: immediately create the administrator at http://127.0.0.1:3001. Do not expose/proxy before bootstrap; other local users can still access it. No placeholder secrets are needed; enter monitor/notification secrets in the app and never share them."}</p>
      <CopyCodeBlock code={download} label={vi ? "1. Tải, kiểm tra, đọc" : "1. Download, verify, inspect"} language="bash" copyLabel="Copy" copiedLabel={vi ? "Đã copy" : "Copied"} />
      <p>{vi ? "Chỉ Linux: sau khi kiểm tra thành công và hiểu nội dung, chọn thư mục mới trên ổ cục bộ (không NFS). Không ghi đè .env/data, không sudo/cài runtime/đổi firewall. Chạy lại sẽ bị từ chối nếu thư mục tồn tại." : "Linux only: after successful checks and review, choose a new directory on local storage (not NFS). No .env/data overwrite, sudo, runtime installation or firewall changes. Reruns refuse existing destinations."}</p>
      <CopyCodeBlock code={'bash install.sh --apply --directory "$HOME/selfhost-uptime-kuma-v1"'} label={vi ? "2. Tự chọn khởi động" : "2. Explicit startup opt-in"} language="bash" copyLabel="Copy" copiedLabel={vi ? "Đã copy" : "Copied"} />
    </section>
  );
}
