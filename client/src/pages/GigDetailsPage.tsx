import { useParams, useNavigate, } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Clock, Users, MapPin } from "lucide-react";
import { mockGigs } from "@/lib/mockData";
import { useState, useEffect } from "react";

const GigDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGig() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/gigs/${id}`);
        if (!res.ok) {
          throw new Error("Gig not found");
        }
        const data = await res.json();
        setGig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGig();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading gig details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Button onClick={() => navigate("/freelance")}>
          Back to Freelance
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/freelance")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Freelance
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{gig.title}</CardTitle>
                  <div className="text-3xl font-bold text-gradient mb-4">
                    ${gig.minBudget.toLocaleString()} - $
                    {gig.maxBudget.toLocaleString()}
                  </div>
                </div>
                <Badge>{gig.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{gig.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Experience Level</h4>
                  <Badge className="capitalize">{gig.experienceLevel}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <span className="text-muted-foreground">{gig.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={gig?.client?.avatar}
                    alt={gig?.client?.username}
                  />
                  <AvatarFallback>
                    {gig?.client?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{gig?.client?.username}</div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{gig?.client?.rating}</span>
                    <span>({gig?.client?.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              {gig?.client?.isVerified && (
                <Badge variant="secondary" className="mb-4">
                  Verified Client
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Proposals</span>
                  <span className="font-medium">{gig?.proposalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{gig?.duration}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 glow-button"
                onClick={() => navigate(`/gig/${gig._id}/proposal`)}
              >
                Submit Proposal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GigDetailsPage;
