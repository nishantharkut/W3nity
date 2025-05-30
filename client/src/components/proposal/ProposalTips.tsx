// components/proposal/ProposalTips.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProposalTips = () => (
  <Card className="glass-effect border-blue-200 bg-blue-50/50">
    <CardHeader>
      <CardTitle className="text-blue-800 text-lg">💡 Proposal Tips</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-blue-700 space-y-3">
      <p>• Personalize your message to the project</p>
      <p>• Highlight relevant experience & work</p>
      <p>• Be realistic about time & budget</p>
      <p>• Ask clarifying questions</p>
      <p>• Proofread before submitting</p>
    </CardContent>
  </Card>
);

export default ProposalTips;
