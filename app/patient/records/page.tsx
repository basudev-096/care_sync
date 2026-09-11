import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientRecords() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Medical Records</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Consultations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0b1c30]">General Checkup</p>
                  <p className="text-sm text-[#64748b]">Dr. Emily Lee • Aug 15, 2026</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#2f7c57]">View Notes</Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0b1c30]">Cardiology Consultation</p>
                  <p className="text-sm text-[#64748b]">Dr. Sarah Jenkins • May 10, 2026</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#2f7c57]">View Notes</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Lab Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0b1c30]">Comprehensive Blood Panel</p>
                  <p className="text-sm text-[#64748b]">Ordered by Dr. Sarah Jenkins • Sept 1, 2026</p>
                </div>
                <Button variant="outline" size="sm" className="text-[#0b3d20] border-[#0b3d20]">Download PDF</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Active Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-lg">Amoxicillin (500mg)</h3>
                  <p className="text-[#64748b]">Take 1 tablet every 8 hours for 7 days</p>
                  <p className="text-xs text-[#64748b] mt-1">Prescribed: Aug 15, 2026</p>
                </div>
                <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Request Refill</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
