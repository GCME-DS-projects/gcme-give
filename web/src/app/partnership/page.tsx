"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import DonationModal from "@/components/public/common/donation-modal";

export default function PartnershipPage() {
  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: "project" | "missionary";
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "missionary",
    title: "",
    description: "",
  });

  const openDonationModal = (
    type: "project" | "missionary",
    title: string,
    description?: string,
  ) => {
    setDonationModal({
      isOpen: true,
      type,
      title,
      description,
    });
  };

  const closeDonationModal = () => {
    setDonationModal({
      isOpen: false,
      type: "missionary",
      title: "",
      description: "",
    });
  };

  const partnershipLevels = [
    {
      name: "Prayer Partner",
      amount: "ብር 0",
      description: "Commit to regular prayer support",
      benefits: [
        "Monthly prayer updates",
        "Access to private prayer requests",
        "Quarterly prayer partner calls",
        "Special prayer partner newsletter",
      ],
      color: "bg-primary-50 border-primary-200",
      buttonColor: "bg-primary-600 hover:bg-primary-700",
    },
    {
      name: "Support Partner",
      amount: "ብር 2,500-10,000",
      description: "Monthly financial partnership",
      benefits: [
        "All Prayer Partner benefits",
        "Monthly ministry updates with photos",
        "Annual impact report",
        "Direct communication with missionaries",
        "Recognition in annual report",
      ],
      color: "bg-primary-50 border-primary-200",
      buttonColor: "bg-primary-600 hover:bg-primary-700",
      popular: true,
    },
    {
      name: "Champion Partner",
      amount: "ብር 10,000-25,000",
      description: "Significant monthly investment",
      benefits: [
        "All Support Partner benefits",
        "Quarterly video calls with missionaries",
        "Personalized thank you letters",
        "Special project updates",
        "Invitation to annual partner gathering",
        "Custom prayer card with missionary photo",
      ],
      color: "bg-primary-50 border-primary-200",
      buttonColor: "bg-primary-600 hover:bg-primary-700",
    },
    {
      name: "Legacy Partner",
      amount: "ብር 30,000+",
      description: "Transformational partnership",
      benefits: [
        "All Champion Partner benefits",
        "Monthly personal phone/video calls",
        "Opportunity to visit mission field",
        "Input on ministry strategy and direction",
        "Named recognition in major projects",
        "Exclusive legacy partner events",
        "Personal missionary liaison",
      ],
      color: "bg-primary-50 border-primary-200",
      buttonColor: "bg-primary-600 hover:bg-primary-700",
    },
  ];

  const partnerStories = [
    {
      name: "Sarah & Michael Johnson",
      partnership: "Champion Partners since 2019",
      image: "/placeholder.svg?height=100&width=100",
      story:
        "Supporting Ethiopian missionaries has been one of the most rewarding experiences of our lives. Seeing the monthly updates and knowing we're part of transforming communities gives us such joy. We've even been able to visit the field and see our impact firsthand.",
      missionary: "Almaz & Dawit Tadesse",
    },
    {
      name: "Grace Chen",
      partnership: "Support Partner since 2021",
      image: "/placeholder.svg?height=100&width=100",
      story:
        "As a single professional, I wanted to make a meaningful difference with my resources. Monthly partnership allows me to consistently support Dr. Hanna's medical work in Tigray. The updates she sends show exactly how my contributions are saving lives.",
      missionary: "Dr. Hanna Bekele",
    },
    {
      name: "David & Ruth Martinez",
      partnership: "Legacy Partners since 2018",
      image: "/placeholder.svg?height=100&width=100",
      story:
        "Our partnership with Samuel and Ruth Girma has become like supporting family. We pray for them daily, support their education work monthly, and have developed a deep friendship. It's partnership in the truest sense.",
      missionary: "Samuel & Ruth Girma",
    },
  ];

  const faqItems = [
    {
      question: "How does monthly partnership work?",
      answer:
        "Monthly partnership involves committing to regular financial support and prayer for specific missionaries. You choose your level of support, and funds are automatically transferred each month. You'll receive regular updates showing exactly how your partnership is making a difference.",
    },
    {
      question: "Can I change my partnership level?",
      answer:
        "You can increase, decrease, or pause your partnership at any time. We understand that circumstances change, and we're grateful for any level of support you can provide.",
    },
    {
      question: "How do I know my money is being used effectively?",
      answer:
        "We provide detailed monthly reports showing exactly how funds are used. Our missionaries submit receipts and impact reports. We also undergo annual independent audits and maintain the highest standards of financial transparency.",
    },
    {
      question: "Can I support multiple missionaries?",
      answer:
        "Yes! Many partners support multiple missionaries or divide their giving between missionaries and specific projects. You can customize your partnership to match your heart and capacity.",
    },
    {
      question: "What if I want to visit the mission field?",
      answer:
        "We organize annual mission trips for partners who want to see their impact firsthand. Champion and Legacy Partners receive priority invitations, but all partners are welcome to join these transformational experiences.",
    },
    {
      question: "How do I communicate with missionaries?",
      answer:
        "Communication varies by partnership level. All partners receive monthly updates. Higher-level partners have opportunities for direct communication through calls, emails, and video chats with their supported missionaries.",
    },
  ];

  const impactStats = [
    { label: "Active Monthly Partners", value: "847", icon: Users },
    { label: "Years of Average Partnership", value: "3.2", icon: Calendar },
    {
      label: "Lives Transformed Through Partnership",
      value: "12,500+",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header currentPage="partnership" />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Become a
              <br />
              <span className="text-primary-200">Mission Partner</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
              Join hundreds of faithful partners who are transforming Ethiopia
              through consistent support of our missionaries. Your partnership
              creates lasting impact that extends far beyond financial support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-stone-50 px-8 py-3 text-lg"
                onClick={() =>
                  openDonationModal(
                    "missionary",
                    "Monthly Partnership",
                    "Join our community of faithful monthly partners",
                  )
                }
              >
                Start Your Partnership
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="#partnership-levels">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg w-full bg-white/20 backdrop-blur-sm"
                >
                  Explore Partnership Levels
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Partnership Impact
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                See how our community of partners is making a difference across
                Ethiopia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-stone-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partnership Levels */}
        <section id="partnership-levels" className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Partnership Levels
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Choose the level of partnership that fits your heart and
                capacity. Every level makes a meaningful difference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {partnershipLevels.map((level, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 ${level.color}`}
                >
                  {level.popular && (
                    <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl text-stone-800 mb-2">
                      {level.name}
                    </CardTitle>
                    <div className="text-2xl font-bold text-stone-800 mb-2">
                      {level.amount}
                    </div>
                    <p className="text-stone-600 text-sm">
                      {level.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <li
                          key={benefitIndex}
                          className="flex items-start text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-stone-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full text-white ${level.buttonColor}`}
                      onClick={() =>
                        openDonationModal(
                          "missionary",
                          `${level.name} Partnership`,
                          level.description,
                        )
                      }
                    >
                      {level.name === "Prayer Partner"
                        ? "Join as Prayer Partner"
                        : "Start Partnership"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partnership Matters */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                  Why Partnership Matters
                </h2>
                <p className="text-xl text-stone-600">
                  Monthly partnership provides the stability and consistency
                  that enables missionaries to focus on ministry rather than
                  fundraising.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-stone-50 border-stone-200">
                  <CardHeader>
                    <CardTitle className="text-xl text-stone-800 flex items-center">
                      <Heart className="w-6 h-6 mr-3 text-primary-600" />
                      For Missionaries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Predictable income allows focus on ministry instead of
                          constant fundraising
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Knowing they have faithful partners provides emotional
                          and spiritual encouragement
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Consistent support enables long-term planning and
                          sustainable ministry development
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Partnership creates accountability and motivation for
                          excellence in ministry
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-stone-50 border-stone-200">
                  <CardHeader>
                    <CardTitle className="text-xl text-stone-800 flex items-center">
                      <Users className="w-6 h-6 mr-3 text-primary-600" />
                      For Partners
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Regular updates show exactly how your investment is
                          transforming lives
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Personal relationships develop with missionaries
                          through ongoing communication
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Automatic giving makes consistent generosity simple
                          and sustainable
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">
                          Being part of a community of partners provides
                          encouragement and shared purpose
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Stories */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Partner Stories
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Hear from faithful partners about how missionary partnership has
                enriched their lives and expanded their impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {partnerStories.map((story, index) => (
                <Card
                  key={index}
                  className="bg-white border-stone-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={story.image || "/placeholder.svg"}
                        alt={story.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <CardTitle className="text-lg text-stone-800">
                      {story.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-primary-100 text-primary-800"
                    >
                      {story.partnership}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-stone-700 italic mb-4 text-sm leading-relaxed">
                      "{story.story}"
                    </blockquote>
                    <div className="text-xs text-stone-500">
                      <strong>Supporting:</strong> {story.missionary}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                How Partnership Works
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Starting your partnership is simple. Here's how to begin your
                journey of transformational giving.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    Choose Your Level
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Select the partnership level that matches your heart and
                    capacity for giving.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    Select Missionaries
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Choose specific missionaries to support or let us match you
                    with those who need partners.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    Set Up Giving
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Establish automatic monthly giving through our secure
                    donation system.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    Stay Connected
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Receive regular updates and build relationships with your
                    supported missionaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Get answers to common questions about missionary partnership and
                how it works.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  {faqItems.slice(0, 2).map((item, index) => (
                    <Card key={index} className="bg-white border-stone-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-stone-800">
                          {item.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone-700">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="financial" className="space-y-4">
                  {faqItems.slice(2, 4).map((item, index) => (
                    <Card key={index} className="bg-white border-stone-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-stone-800">
                          {item.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone-700">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="communication" className="space-y-4">
                  {faqItems.slice(4, 6).map((item, index) => (
                    <Card key={index} className="bg-white border-stone-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-stone-800">
                          {item.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-stone-700">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Partnership?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of faithful partners who are transforming Ethiopia
              through consistent support of our missionaries. Your partnership
              creates lasting impact that extends far beyond financial support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-stone-50 px-8 py-3 text-lg"
                onClick={() =>
                  openDonationModal(
                    "missionary",
                    "Monthly Partnership",
                    "Join our community of faithful monthly partners",
                  )
                }
              >
                Become a Partner Today
              </Button>
              <Link href="/missionaries">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg bg-white/20 backdrop-blur-sm"
                >
                  Meet Our Missionaries
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={closeDonationModal}
        type={donationModal.type}
        title={donationModal.title}
        description={donationModal.description}
      />
    </div>
  );
}
