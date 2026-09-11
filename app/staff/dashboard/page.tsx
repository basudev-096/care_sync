import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Welcome back, Admin!</h1>
          <p className="text-[#64748b] mt-1">Here is the clinic overview for today.</p>
        </div>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">
          New Patient Registration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card className="col-span-1 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-sm">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-[#0b1c30]">24</p>
            <p className="text-sm text-[#2f7c57] mt-2">+4 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-sm">Pending Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-[#0b1c30]">7</p>
            <p className="text-sm text-[#64748b] mt-2">Next at 10:15 AM</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-sm">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-[#0b1c30]">3</p>
            <p className="text-sm text-[#2f7c57] mt-2">Dr. Jenkins, Dr. Smith, Dr. Lee</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
            <CardTitle className="text-[#0b3d20] text-sm">Pending Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-[#0b1c30]">12</p>
            <p className="text-sm text-[#dc2626] mt-2">Requires digitization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
