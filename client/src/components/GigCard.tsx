
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gig } from '@/types';
import { Star, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GigCardProps {
  gig: Gig;
  onViewDetails?: (gigId: string) => void;
  onPropose?: (gigId: string) => void;
}

const GigCard = ({ gig, onViewDetails, onPropose }: GigCardProps) => {
  const formatBudget = (gig: Gig) => {
  if (
    typeof gig.minBudget !== "number" ||
    typeof gig.maxBudget !== "number" ||
    isNaN(gig.minBudget) ||
    isNaN(gig.maxBudget)
  ) {
    return "Budget not specified";
  }

  const min = gig.minBudget.toLocaleString();
  const max = gig.maxBudget.toLocaleString();

  return `$${min} - $${max}`;
};


  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expert':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-effect card-hover h-full">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">{gig.title}</CardTitle>
            <div className="text-2xl font-bold text-gradient mb-2">
              {formatBudget(gig)}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusBadgeColor(gig.status)}>
              {gig.status}
            </Badge>
            <Badge className={getExperienceBadgeColor(gig.experienceLevel)}>
              {gig.experienceLevel}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground line-clamp-3">{gig.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {gig.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {gig.skills.length > 4 && (
            <Badge variant="outline">+{gig.skills.length - 4} more</Badge>
          )}
        </div>

        {/* Client Info */}
        <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={gig?.client?.avatar} alt={gig?.client?.username} />
            <AvatarFallback>{gig?.client?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{gig?.client?.username}</span>
              {gig?.client?.isVerified && (
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{gig?.client?.rating}</span>
              <span>({gig?.client?.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Due {formatDistanceToNow(gig?.deadline, { addSuffix: true })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{gig?.proposals?.length} proposals</span>
          </div>
        </div>

        {/* Posted Time */}
        <div className="text-xs text-muted-foreground">
          Posted {formatDistanceToNow(gig?.createdAt, { addSuffix: true })}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails?.(gig._id)}
          >
            View Details
          </Button>
          {gig.status === 'open' && (
            <Button 
              className="flex-1 glow-button"
              onClick={() => onPropose?.(gig._id)}
            >
              Submit Proposal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GigCard;
