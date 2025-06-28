
import React from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Globe,
  Heart,
  Target,
  Lightbulb,
  Shield,
  Rocket,
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Active Writers", value: "10,000+", icon: Users },
    { label: "Blog Posts", value: "50,000+", icon: BookOpen },
    { label: "Countries", value: "150+", icon: Globe },
    { label: "Monthly Readers", value: "1M+", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To democratize content creation and provide a platform where every voice can be heard, every story can be shared, and every idea can inspire others.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve our platform with cutting-edge technology to provide the best writing and reading experience for our community.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "We maintain a safe, respectful environment where creators can express themselves freely while respecting community guidelines.",
    },
    {
      icon: Rocket,
      title: "Growth",
      description:
        "We help content creators grow their audience, improve their writing skills, and build meaningful connections with readers worldwide.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former tech journalist with 15 years of experience in digital media and content strategy.",
      avatar: "/api/placeholder/150/150",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Software architect passionate about building scalable platforms that empower creators worldwide.",
      avatar: "/api/placeholder/150/150",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      bio: "Community builder dedicated to fostering inclusive spaces for writers and readers of all backgrounds.",
      avatar: "/api/placeholder/150/150",
    },
    {
      name: "David Kim",
      role: "Lead Designer",
      bio: "UX/UI designer focused on creating intuitive, accessible experiences for content creators.",
      avatar: "/api/placeholder/150/150",
    },
  ];

  return (
    <PageWrapper className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">BlogHub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the future of content creation. A platform where
            writers, thinkers, and storytellers come together to share ideas,
            inspire others, and build meaningful connections through the power
            of words.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-6">
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                BlogHub was born from a simple observation: great ideas deserve
                great platforms. In 2023, our founder Sarah Johnson noticed that
                while there were many blogging platforms available, none truly
                captured the modern creator's needs for simplicity, community,
                and powerful tools.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Starting as a weekend project, BlogHub quickly grew into
                something much bigger. We realized we weren't just building a
                blogging platform – we were creating a movement. A place where
                authentic voices could rise above the noise, where quality
                content could find its audience, and where creators could focus
                on what they do best: creating.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, BlogHub serves over 10,000 active writers and reaches
                millions of readers worldwide. But we're just getting started.
                Our vision is to become the definitive platform for thoughtful,
                long-form content creation in the digital age.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you're a seasoned writer or just starting your content
                creation journey, BlogHub is here to support you every step of
                the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Start Writing Today
                </a>
                <a
                  href="/contact"
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
