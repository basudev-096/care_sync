import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PhysicianDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Welcome back, Dr. Jenkins!</h1>
          <p className="text-[#64748b] mt-1">You have 8 consultations scheduled for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="col-span-1 lg:col-span-2 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-lg">Today's Queue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="py-4 flex justify-between items-center bg-[#d9f2e6]/30 px-4 -mx-4">
                <div>
                  <p className="font-bold text-[#0b1c30]">Alex Rodriguez (Age 34)</p>
                  <p className="text-sm text-[#64748b]">10:00 AM • Routine Checkup</p>
                </div>
                <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Start Consultation</Button>
              </div>
              <div className="py-4 flex justify-between items-center px-4 -mx-4">
                <div>
                  <p className="font-medium text-[#0b1c30]">Maria Garcia (Age 28)</p>
                  <p className="text-sm text-[#64748b]">10:30 AM • Blood Test Follow-up</p>
                </div>
                <Button variant="outline" className="text-[#2f7c57] border-[#2f7c57]">View Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
