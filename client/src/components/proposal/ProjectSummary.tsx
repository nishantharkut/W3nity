// components/proposal/ProjectSummary.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProjectSummary = ({ gig }: { gig: any }) => (
  <Card className="glass-effect">
    <CardHeader>
      <CardTitle className="text-lg">Project Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div>
        <p className="font-medium text-muted-foreground">Client Budget</p>
        <p className="font-semibold">${gig.minBudget} - ${gig.maxBudget}</p>
      </div>
      <div>
        <p className="font-medium text-muted-foreground">Required Skills</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {gig.skills.map((skill: string) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <p className="font-medium text-muted-foreground">Category</p>
        <p className="capitalize">{gig.category.replace("-", " ")}</p>
      </div>
    </CardContent>
  </Card>
);

export default ProjectSummary;
