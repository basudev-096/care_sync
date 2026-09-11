import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffPatients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Patient Registry</h1>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">Add New Patient</Button>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#0b3d20] text-lg">All Patients</CardTitle>
            <input 
              type="text" 
              placeholder="Search by name, ID, or phone..." 
              className="border border-[#e2e8f0] rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#63b995]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#e2e8f0]">
                <th className="p-4 text-sm font-medium text-[#64748b]">Patient ID</th>
                <th className="p-4 text-sm font-medium text-[#64748b]">Name</th>
                <th className="p-4 text-sm font-medium text-[#64748b]">DOB</th>
                <th className="p-4 text-sm font-medium text-[#64748b]">Contact</th>
                <th className="p-4 text-sm font-medium text-[#64748b]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-[#0b1c30]">PT-10045</td>
                <td className="p-4 font-bold text-[#0b1c30]">Alex Rodriguez</td>
                <td className="p-4 text-[#64748b]">May 14, 1992</td>
                <td className="p-4 text-[#64748b]">(555) 123-4567</td>
                <td className="p-4"><Button variant="ghost" className="text-[#2f7c57]">View Profile</Button></td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-[#0b1c30]">PT-10046</td>
                <td className="p-4 font-bold text-[#0b1c30]">Maria Garcia</td>
                <td className="p-4 text-[#64748b]">Nov 2, 1988</td>
                <td className="p-4 text-[#64748b]">(555) 987-6543</td>
                <td className="p-4"><Button variant="ghost" className="text-[#2f7c57]">View Profile</Button></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
