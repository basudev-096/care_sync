import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PhysicianConsultation() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-inter text-[#0b3d20]">Consultation: Alex Rodriguez</h1>
          <p className="text-[#64748b] mt-1">Oct 12, 2026 • 10:00 AM</p>
        </div>
        <Button className="bg-[#0b3d20] hover:bg-[#2f7c57] text-white">
          Complete & Save
        </Button>
      </div>

      <div className="flex-1 overflow-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-[#e2e8f0] shadow-sm h-full flex flex-col">
            <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
              <CardTitle className="text-[#0b3d20] text-sm">Subjective (Symptoms)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <textarea 
                className="w-full h-full min-h-[150px] resize-none border-none focus:ring-0 p-0 text-[#0b1c30]" 
                placeholder="Enter patient symptoms and complaints here..."
              ></textarea>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border-[#e2e8f0] shadow-sm h-full flex flex-col">
            <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
              <CardTitle className="text-[#0b3d20] text-sm">Assessment & Plan (Diagnosis/Advice)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <textarea 
                className="w-full h-full min-h-[150px] resize-none border-none focus:ring-0 p-0 text-[#0b1c30]" 
                placeholder="Enter diagnosis and treatment plan here..."
              ></textarea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm mt-6">
        <CardHeader className="bg-[#f8f9ff] border-b border-[#e2e8f0] py-4">
          <CardTitle className="text-[#0b3d20] text-sm">E-Prescription</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center justify-between">
          <span className="text-sm text-[#64748b]">No medications prescribed yet.</span>
          <Button variant="outline" className="text-[#2f7c57] border-[#2f7c57]">Add Medication</Button>
        </CardContent>
      </Card>
    </div>
  );
}
