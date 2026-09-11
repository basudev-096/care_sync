import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffSchedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Master Schedule</h1>
        <div className="flex space-x-3">
          <Button variant="outline" className="text-[#0b3d20] border-[#0b3d20]">Select Date</Button>
          <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">New Appointment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor 1 Schedule */}
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Dr. Sarah Jenkins</CardTitle>
            <p className="text-sm text-[#64748b]">Cardiology</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 bg-[#d9f2e6]/30">
                <p className="font-bold text-[#0b1c30]">10:00 AM - Alex Rodriguez</p>
                <p className="text-sm text-[#64748b]">Routine Checkup</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">Checked In</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-[#0b1c30]">10:30 AM - Maria Garcia</p>
                <p className="text-sm text-[#64748b]">Blood Test Follow-up</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">Waiting</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-[#0b1c30]">11:00 AM - BLOCK</p>
                <p className="text-sm text-[#64748b]">Administrative Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor 2 Schedule */}
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Dr. Emily Lee</CardTitle>
            <p className="text-sm text-[#64748b]">General Practice</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#e2e8f0]">
              <div className="p-4 bg-gray-50 opacity-70">
                <p className="font-bold text-[#0b1c30]">9:00 AM - John Doe</p>
                <p className="text-sm text-[#64748b]">Annual Physical</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 mt-2">Completed</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-[#0b1c30]">10:15 AM - Jane Smith</p>
                <p className="text-sm text-[#64748b]">Vaccination</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">Confirmed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Doctor 3 Schedule */}
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Dr. Michael Smith</CardTitle>
            <p className="text-sm text-[#64748b]">Dermatology</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 text-center text-[#64748b]">
              No appointments scheduled for today.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
