import type { Locale } from "@/lib/i18n";
import { planningCopy } from "@/lib/planning-copy";
export function HardwareFields({ locale }: { locale: Locale }) {
  const t = planningCopy[locale];
  return (
    <fieldset className="hardware-fields">
      <legend>{t.calculator}</legend>
      {(["cpu", "ramGiB", "diskGiB"] as const).map((key) => (
        <label key={key}>
          {t[key]}
          <input
            name={key}
            type="number"
            min="0.01"
            max={key === "cpu" ? 1024 : key === "ramGiB" ? 65536 : 10000000}
            step="any"
            required
          />
        </label>
      ))}
      <label>
        {t.architecture}
        <select name="architecture">
          <option value="amd64">amd64</option>
          <option value="arm64">arm64</option>
        </select>
      </label>
    </fieldset>
  );
}
export function hardwareFromForm(form: FormData) {
  return {
    cpu: Number(form.get("cpu")),
    ramGiB: Number(form.get("ramGiB")),
    diskGiB: Number(form.get("diskGiB")),
    architecture: form.get("architecture"),
  };
}
