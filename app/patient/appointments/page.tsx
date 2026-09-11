import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientAppointments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">My Appointments</h1>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">
          Book New Appointment
        </Button>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
          <CardTitle className="text-[#0b3d20] text-lg">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#e2e8f0]">
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-[#d9f2e6] rounded-lg flex flex-col items-center justify-center text-[#0b3d20]">
                  <span className="text-sm font-semibold uppercase">Oct</span>
                  <span className="text-xl font-bold leading-none">12</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-lg">Dr. Sarah Jenkins</h3>
                  <p className="text-[#64748b]">Cardiology • 10:00 AM - 10:30 AM</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    Confirmed
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="text-[#2f7c57] border-[#2f7c57] hover:bg-[#d9f2e6]">Reschedule</Button>
                <Button variant="outline" className="text-[#dc2626] border-[#dc2626] hover:bg-red-50">Cancel</Button>
              </div>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-[#d9f2e6] rounded-lg flex flex-col items-center justify-center text-[#0b3d20]">
                  <span className="text-sm font-semibold uppercase">Nov</span>
                  <span className="text-xl font-bold leading-none">05</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-lg">Dr. Michael Smith</h3>
                  <p className="text-[#64748b]">Dermatology • 2:15 PM - 2:45 PM</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    Pending
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="text-[#2f7c57] border-[#2f7c57] hover:bg-[#d9f2e6]">Reschedule</Button>
                <Button variant="outline" className="text-[#dc2626] border-[#dc2626] hover:bg-red-50">Cancel</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0] shadow-sm mt-8">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
          <CardTitle className="text-[#0b3d20] text-lg">Past Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#e2e8f0]">
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-70">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-[#e2e8f0] rounded-lg flex flex-col items-center justify-center text-[#64748b]">
                  <span className="text-sm font-semibold uppercase">Aug</span>
                  <span className="text-xl font-bold leading-none">15</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-lg">Dr. Emily Lee</h3>
                  <p className="text-[#64748b]">General Practice • 9:00 AM - 9:30 AM</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                    Completed
                  </span>
                </div>
              </div>
              <Button variant="outline" className="text-[#0b3d20] border-[#0b3d20]">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
