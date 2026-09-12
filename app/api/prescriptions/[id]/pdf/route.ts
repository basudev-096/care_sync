import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { parseMedicines, describeMedicine } from "@/lib/prescription";

/**
 * WBS 5.3.1 / 5.4.2 - generate and serve the official prescription PDF.
 *
 * Authorization is enforced here, not just on the page that links to it: a
 * patient may only fetch their own prescription, a physician only ones they
 * wrote, and staff any of them. Guessing an id gets a 404, which also avoids
 * confirming whether that id exists.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: true,
      physician: true,
      consultation: { include: { appointment: true } },
    },
  });

  if (!prescription) return new NextResponse("Not found", { status: 404 });

  const permitted =
    user.role === "STAFF" ||
    (user.role === "PATIENT" && prescription.patientId === user.profile.id) ||
    (user.role === "PHYSICIAN" && prescription.physicianId === user.profile.id);

  if (!permitted) return new NextResponse("Not found", { status: 404 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.08, 0.09, 0.12);
  const muted = rgb(0.37, 0.4, 0.45);
  const teal = rgb(0.06, 0.42, 0.36);
  const margin = 56;
  let y = 786;

  const text = (
    value: string,
    opts: { size?: number; font?: typeof font; color?: typeof ink; x?: number } = {},
  ) => {
    page.drawText(value, {
      x: opts.x ?? margin,
      y,
      size: opts.size ?? 10,
      font: opts.font ?? font,
      color: opts.color ?? ink,
    });
  };

  const rule = () => {
    page.drawLine({
      start: { x: margin, y },
      end: { x: 595 - margin, y },
      thickness: 0.75,
      color: rgb(0.89, 0.89, 0.87),
    });
  };

  // Header
  text("CareClinic", { size: 17, font: bold });
  y -= 15;
  text("Prescription", { size: 10, color: teal, font: bold });
  y -= 18;
  rule();
  y -= 22;

  // Patient / prescriber block
  const p = prescription.patient;
  const d = prescription.physician;
  const issued = prescription.consultation.appointment.date ?? prescription.createdAt;

  text("PATIENT", { size: 7.5, color: muted, font: bold });
  text("PRESCRIBER", { size: 7.5, color: muted, font: bold, x: 320 });
  y -= 13;
  text(`${p.firstName} ${p.lastName}`, { size: 11, font: bold });
  text(`Dr ${d.firstName} ${d.lastName}`, { size: 11, font: bold, x: 320 });
  y -= 13;
  text(p.email, { size: 9, color: muted });
  text(d.specialty ?? "General medicine", { size: 9, color: muted, x: 320 });
  y -= 12;
  if (p.phone) text(p.phone, { size: 9, color: muted });
  text(`Issued ${new Date(issued).toLocaleDateString()}`, { size: 9, color: muted, x: 320 });
  y -= 24;
  rule();
  y -= 20;

  // Medicines
  text("MEDICATION", { size: 7.5, color: muted, font: bold });
  y -= 17;

  const medicines = parseMedicines(prescription.medicineDetails);
  medicines.forEach((m, i) => {
    if (y < 110) {
      y = 786;
      pdf.addPage([595, 842]);
    }
    text(`${i + 1}.  ${m.name}`, { size: 11, font: bold });
    y -= 13;
    const detail = describeMedicine(m);
    if (detail) {
      text(detail, { size: 9.5, color: muted, x: margin + 16 });
      y -= 15;
    } else {
      y -= 4;
    }
  });

  if (prescription.instructions) {
    y -= 8;
    rule();
    y -= 18;
    text("INSTRUCTIONS", { size: 7.5, color: muted, font: bold });
    y -= 14;
    // Wrap on width so long instructions do not run off the page.
    for (const line of wrap(prescription.instructions, 84)) {
      text(line, { size: 9.5 });
      y -= 13;
    }
  }

  // Footer
  page.drawText(
    "This is a digitised copy of the prescription issued at CareClinic.",
    { x: margin, y: 56, size: 8, font, color: muted },
  );

  const bytes = await pdf.save();
  const filename = `prescription-${p.lastName.toLowerCase()}-${new Date(issued)
    .toISOString()
    .slice(0, 10)}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function wrap(value: string, width: number): string[] {
  const out: string[] = [];
  for (const paragraph of value.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if ((line + " " + word).trim().length > width) {
        if (line) out.push(line);
        line = word;
      } else {
        line = (line + " " + word).trim();
      }
    }
    out.push(line);
  }
  return out.filter((l) => l.length > 0);
}
