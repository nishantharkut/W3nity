
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Gig } from '@/hooks/useGigs';
import { Clock, MapPin, Users, DollarSign, Calendar } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'web-development': 'Web Dev',
      'mobile-development': 'Mobile',
      'blockchain': 'Blockchain',
      'ai-ml': 'AI/ML',
      'design': 'Design',
      'devops': 'DevOps'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary-500 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {getCategoryLabel(gig.category)}
          </Badge>
          <Badge className={`${getExperienceColor(gig.experienceLevel)} text-xs`}>
            {gig.experienceLevel}
          </Badge>
        </div>
        <CardTitle className="text-base md:text-lg leading-tight hover:text-primary-600 transition-colors line-clamp-2">
          {gig.title}
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-1 text-green-600">
            <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-xl md:text-2xl font-bold">{gig.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              <span>{gig.proposals}</span>
            </div>
            <Badge variant={gig.status === 'open' ? 'default' : 'secondary'} className="text-xs">
              {gig.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
          {gig.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {gig.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {gig.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{gig.skills.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 mb-4 text-xs md:text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">By {gig.clientName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-400 flex-shrink-0" />
            <span>Deadline: {new Date(gig.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Button asChild className="w-full bg-primary-600 hover:bg-primary-700 mt-auto">
          <Link to={`/freelance/gig/${gig.id}`}>
            View Details & Apply
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GigCard;
