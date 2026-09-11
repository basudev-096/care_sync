import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Welcome back, Alex!</h1>
          <p className="text-[#64748b] mt-1">Here is a summary of your upcoming appointments and recent records.</p>
        </div>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">
          Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Next Appointment Card */}
        <Card className="col-span-1 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-lg">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-[#d9f2e6] rounded-full flex items-center justify-center text-[#0b3d20] font-bold text-xl">
                12
              </div>
              <div>
                <p className="font-bold text-[#0b1c30]">Dr. Sarah Jenkins</p>
                <p className="text-sm text-[#64748b]">Cardiology • 10:00 AM</p>
              </div>
              <Button variant="outline" className="w-full text-[#2f7c57] border-[#2f7c57] hover:bg-[#d9f2e6]">
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Records Card */}
        <Card className="col-span-1 md:col-span-2 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[#0b3d20] text-lg">Recent Medical Records</CardTitle>
            <a href="/patient/records" className="text-sm text-[#2f7c57] hover:underline">View All</a>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#0b1c30]">Blood Test Results</p>
                  <p className="text-xs text-[#64748b]">Sept 1, 2026</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#0b3d20]">View</Button>
              </div>
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#0b1c30]">General Checkup Notes</p>
                  <p className="text-xs text-[#64748b]">Aug 15, 2026</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#0b3d20]">View</Button>
              </div>
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#0b1c30]">Prescription: Amoxicillin</p>
                  <p className="text-xs text-[#64748b]">Aug 15, 2026</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#0b3d20]">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
