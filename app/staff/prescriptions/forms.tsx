"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ActionForm, SubmitButton, Disclosure } from "@/components/forms";
import { inputClass, textareaClass, labelClass, btn } from "@/components/ui-kit";
import { digitizePrescription } from "../actions";

/**
 * WBS 5.2.2-5.2.4 - the prescription template. Each row captures medicine name,
 * dosage, frequency, intake timing and duration, and the staff member reviews
 * the rows before the PDF is generated.
 */
export function DigitizeForm({ consultationId }: { consultationId: string }) {
  return (
    <Disclosure label="Enter prescription">
      <ActionForm action={digitizePrescription} className="space-y-4 max-w-3xl">
        <input type="hidden" name="consultationId" value={consultationId} />
        <MedicineRows />
        <div>
          <label className={labelClass} htmlFor={`ins-${consultationId}`}>
            Additional instructions
          </label>
          <textarea
            id={`ins-${consultationId}`}
            name="instructions"
            rows={2}
            className={textareaClass}
            placeholder="Anything written on the slip that is not a medicine line"
          />
        </div>
        <p className="text-[12px] text-muted-foreground">
          Check every line against the paper prescription before generating.
        </p>
        <SubmitButton pendingLabel="Generating…">Review and generate PDF</SubmitButton>
      </ActionForm>
    </Disclosure>
  );
}

function MedicineRows() {
  const [rows, setRows] = useState([0]);
  const [nextId, setNextId] = useState(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass + " mb-0"}>Medicines</span>
        <button
          type="button"
          onClick={() => {
            setRows((r) => [...r, nextId]);
            setNextId((n) => n + 1);
          }}
          className={btn.outline}
        >
          <Plus className="size-4" strokeWidth={2} />
          Add medicine
        </button>
      </div>

      {rows.map((row, index) => (
        <div key={row} className="panel p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Medicine {index + 1}</span>
            {rows.length > 1 ? (
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((x) => x !== row))}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove medicine ${index + 1}`}
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            ) : null}
          </div>

          <input
            name="medicine"
            required={index === 0}
            className={inputClass}
            placeholder="Medicine name"
            aria-label="Medicine name"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <input name="dosage" className={inputClass} placeholder="Dosage" aria-label="Dosage" />
            <input name="frequency" className={inputClass} placeholder="Frequency" aria-label="Frequency" />
            <input name="timing" className={inputClass} placeholder="Timing" aria-label="Intake timing" />
            <input name="duration" className={inputClass} placeholder="Duration" aria-label="Duration" />
          </div>
        </div>
      ))}
    </div>
  );
}
