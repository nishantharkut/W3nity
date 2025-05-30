// components/proposal/Checklist.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Checklist = ({
  coverLetter,
  proposedBudget,
  deliveryTime,
}: {
  coverLetter: string;
  proposedBudget: string;
  deliveryTime: string;
}) => {
  const items = [
    { label: "Cover letter written", valid: coverLetter.trim() },
    { label: "Budget proposed", valid: proposedBudget },
    { label: "Delivery time set", valid: deliveryTime },
  ];

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-lg">Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 ${
              item.valid ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                item.valid ? "bg-green-600 border-green-600" : "border-muted-foreground"
              }`}
            >
              {item.valid && <span className="text-white text-xs">✓</span>}
            </div>
            {item.label}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Checklist;
