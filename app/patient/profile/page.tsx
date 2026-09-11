import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientProfile() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">My Profile</h1>

      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
          <CardTitle className="text-[#0b3d20] text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">First Name</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">Alex</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Last Name</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">Rodriguez</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Email Address</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">alex.rodriguez@example.com</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Phone Number</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">(555) 123-4567</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Date of Birth</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">May 14, 1992</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Sex</label>
              <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md text-[#0b1c30]">Male</div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
