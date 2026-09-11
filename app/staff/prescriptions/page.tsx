import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffPrescriptions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Digitize Prescriptions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Scans */}
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Pending Uploads (12)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0b1c30]">Consultation - Dr. Jenkins</p>
                  <p className="text-sm text-[#64748b]">Patient: Alex Rodriguez</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-2">Urgent</span>
                </div>
                <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Upload Scan</Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0b1c30]">Consultation - Dr. Lee</p>
                  <p className="text-sm text-[#64748b]">Patient: John Doe</p>
                </div>
                <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Upload Scan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Digitized */}
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Recently Digitized</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 flex items-center justify-between opacity-70">
                <div>
                  <p className="font-bold text-[#0b1c30]">Consultation - Dr. Smith</p>
                  <p className="text-sm text-[#64748b]">Patient: Jane Smith</p>
                  <p className="text-xs text-[#64748b] mt-1">Processed: Today, 9:15 AM</p>
                </div>
                <Button variant="outline" className="text-[#2f7c57] border-[#2f7c57]">View PDF</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
