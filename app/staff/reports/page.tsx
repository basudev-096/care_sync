import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Administrative Reports</h1>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Generate Custom Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Monthly Patient Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-[#64748b]">
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#e2e8f0] rounded-md bg-gray-50">
              Chart Placeholder
            </div>
            <Button variant="outline" className="mt-4 w-full">Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Appointment Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-[#64748b]">
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#e2e8f0] rounded-md bg-gray-50">
              Chart Placeholder
            </div>
            <Button variant="outline" className="mt-4 w-full">Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
            <CardTitle className="text-[#0b3d20] text-lg">Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-[#64748b]">
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#e2e8f0] rounded-md bg-gray-50">
              Chart Placeholder
            </div>
            <Button variant="outline" className="mt-4 w-full">Export PDF</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
