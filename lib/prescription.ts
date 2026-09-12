export type Medicine = {
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
};

/**
 * Prescription.medicineDetails stores the structured lines as JSON. Older or
 * hand-written rows may hold plain text, so fall back to a single unnamed line
 * rather than throwing.
 */
export function parseMedicines(raw: string): Medicine[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((m) => ({
        name: String(m?.name ?? ""),
        dosage: String(m?.dosage ?? ""),
        frequency: String(m?.frequency ?? ""),
        timing: String(m?.timing ?? ""),
        duration: String(m?.duration ?? ""),
      }));
    }
  } catch {
    // not JSON - treat the whole value as one free-text line
  }
  return [{ name: raw, dosage: "", frequency: "", timing: "", duration: "" }];
}

export function describeMedicine(m: Medicine) {
  return [m.dosage, m.frequency, m.timing, m.duration].filter(Boolean).join(" · ");
}
