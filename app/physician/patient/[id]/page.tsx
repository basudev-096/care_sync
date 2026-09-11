import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PhysicianPatientProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Alex Rodriguez</h1>
          <p className="text-[#64748b] mt-1">PT-10045 • Male • 34 Years Old</p>
        </div>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">
          Start Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1 space-y-6">
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
              <CardTitle className="text-[#0b3d20] text-sm">Vitals & Measurements</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Height</span>
                  <span className="font-medium text-[#0b1c30]">5' 11"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Weight</span>
                  <span className="font-medium text-[#0b1c30]">175 lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Blood Pressure</span>
                  <span className="font-medium text-[#0b1c30]">120/80 mmHg</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
              <CardTitle className="text-[#0b3d20] text-sm">Active Medications</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-4 space-y-2 text-sm text-[#0b1c30]">
                <li>Lisinopril 10mg - Daily</li>
                <li>Atorvastatin 20mg - Nightly</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-[#e2e8f0] shadow-sm">
            <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[#0b3d20] text-lg">Clinical History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-[#e2e8f0]">
                <div className="py-4">
                  <h4 className="font-bold text-[#0b1c30]">Annual Checkup</h4>
                  <p className="text-xs text-[#64748b] mb-2">Aug 15, 2026 • Dr. Emily Lee</p>
                  <p className="text-sm text-[#0b1c30]">Patient reported feeling generally well. No new complaints. BP slightly elevated compared to last visit. Advised to reduce sodium intake and maintain regular exercise.</p>
                </div>
                <div className="py-4">
                  <h4 className="font-bold text-[#0b1c30]">Mild Hypertension Follow-up</h4>
                  <p className="text-xs text-[#64748b] mb-2">Feb 10, 2026 • Dr. Sarah Jenkins</p>
                  <p className="text-sm text-[#0b1c30]">BP has stabilized on 10mg Lisinopril. Patient denies any side effects (no cough, no dizziness). Will continue current regimen.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
