import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import {
  Briefcase,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Event, Gig } from "@/types";

const Index = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const [events, setEvents] = useState([]); // will store fetched events
  const [gigs, setGigs] = useState([]); // will store fetched events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const features = [
    {
      icon: Briefcase,
      title: "Freelance Marketplace",
      description:
        "Connect with top talent and discover amazing projects in the tech space.",
      link: "/freelance",
    },
    {
      icon: Calendar,
      title: "Tech Events",
      description:
        "Join conferences, workshops, and networking events in your area.",
      link: "/events",
    },
    {
      icon: Users,
      title: "Community Chat",
      description:
        "Real-time collaboration with developers, designers, and entrepreneurs.",
      link: "/community",
    },
  ];

  const stats = [
    { label: "Active Freelancers", value: 50000, icon: Users, suffix: "+" },
    { label: "Projects Completed", value: 25000, icon: Briefcase, suffix: "+" },
    { label: "Events Hosted", value: 1200, icon: Calendar, suffix: "+" },
    { label: "Community Members", value: 100000, icon: Globe, suffix: "+" },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick matching and instant payments with Web3 integration.",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Blockchain-verified profiles and smart contract payments.",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description:
        "Build your reputation and grow your network in the tech community.",
    },
  ];

  // Reset counters on scroll to top or page refresh
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setResetKey(prev => prev + 1);
      }
    };

    // Reset on page load/refresh
    setResetKey(prev => prev + 1);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        console.log("Fetched Events:", data);

        setEvents(data);

        // ✅ Take first 3 events as featured
        const featured = data.slice(0, 3);
        setFeaturedEvents(featured);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchGigs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gigs`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        setGigs(data);

        const featured = data.slice(0, 3);
        setFeaturedGigs(featured);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
    fetchEvents();
  }, []);

  // const featuredGigs = [
  //   {
  //     id: '1',
  //     title: 'Build a DeFi Dashboard',
  //     budget: '$2,500 - $5,000',
  //     skills: ['React', 'Web3', 'TypeScript'],
  //     client: 'CryptoStart',
  //     rating: 4.9,
  //     proposals: 12,
  //   },
  //   {
  //     id: '2',
  //     title: 'Mobile App UI/UX Design',
  //     budget: '$1,200 - $2,500',
  //     skills: ['Figma', 'UI/UX', 'Mobile'],
  //     client: 'TechFlow',
  //     rating: 4.8,
  //     proposals: 8,
  //   },
  //   {
  //     id: '3',
  //     title: 'Smart Contract Development',
  //     budget: '$3,000 - $6,000',
  //     skills: ['Solidity', 'Ethereum', 'Web3'],
  //     client: 'BlockChain Inc',
  //     rating: 5.0,
  //     proposals: 15,
  //   },
  // ];

  // const featuredEvents = [
  //   {
  //     id: '1',
  //     title: 'Web3 Developer Conference 2024',
  //     date: 'Dec 15, 2024',
  //     location: 'San Francisco, CA',
  //     attendees: 250,
  //     category: 'Conference',
  //   },
  //   {
  //     id: '2',
  //     title: 'React Workshop: Advanced Patterns',
  //     date: 'Dec 20, 2024',
  //     location: 'Online',
  //     attendees: 150,
  //     category: 'Workshop',
  //   },
  //   {
  //     id: '3',
  //     title: 'Startup Networking Night',
  //     date: 'Dec 22, 2024',
  //     location: 'New York, NY',
  //     attendees: 80,
  //     category: 'Networking',
  //   },
  // ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-gradient">W3nity</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The ultimate platform for tech collaboration. Connect with
              freelancers, discover events, and build communities in the Web3
              era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="glow-button text-lg px-8 py-3"
                asChild
              >
                <Link to="/freelance">Explore Gigs</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-effect text-lg px-8 py-3"
                asChild
              >
                <Link to="/events">Join Events</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={`${resetKey}-${index}`}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                suffix={stat.suffix}
                duration={2500}
                delay={index * 200}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-b from-background to-background/50"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for Tech Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in the modern tech landscape
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card key={index} className="glass-effect card-hover group">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-spark rounded-xl flex items-center justify-center mb-4 group-hover:animate-glow">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-6">
                        {feature.description}
                      </p>
                      <Button asChild className="w-full">
                        <Link to={feature.link}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Featured Gigs */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Gigs</h2>
              <p className="text-muted-foreground">
                Discover high-quality projects from top clients
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/freelance">View All</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredGigs?.map((gig, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Card
                  key={gig._id}
                  className="glass-effect card-hover cursor-pointer"
                  onClick={() => navigate(`/gig/${gig._id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {gig?.title}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {gig.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gradient">
                      ${gig.minBudget}-{gig.maxBudget}
                    </p>
                    {/* <p className="text-2xl font-bold text-gradient">{gig.budget.min}-{gig.budget.max}/{gig.budget.type}</p> */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {gig.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>by {gig.createdBy.username}</span>
                      <span>{gig.proposalCount} proposals</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Events */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-b from-background/50 to-background"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">
                Join the tech community at these amazing events
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">View All</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => {
              const dateObj = new Date(event.startDate);
              const datePart = dateObj.toLocaleDateString();
              const timePart = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Card
                  key={event._id}
                  className="glass-effect card-hover cursor-pointer"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{event.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {datePart} {timePart}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.location.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{event.maxAttendees} attendees</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/${event._id}`);
                      }}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of tech professionals who are already building
              their future on W3nity
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Button
                size="lg"
                className="glow-button text-lg px-8 py-3"
                asChild
              >
                <Link to="/register">Get Started for Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-effect text-lg px-8 py-3"
                asChild
              >
                <Link to="/community">Join Community</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Index;
