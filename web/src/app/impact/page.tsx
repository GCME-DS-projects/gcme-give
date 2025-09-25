import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Globe,
  Target,
  TrendingUp,
  Droplets,
  Stethoscope,
  GraduationCap,
  Home,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";

export default function ImpactPage() {
  const impactStats = [
    { label: "Lives Impacted", value: "8,500+", icon: Users },
    { label: "Regions Reached", value: "11", icon: Globe },
    { label: "Communities Served", value: "127", icon: Home },
    { label: "Projects Completed", value: "43", icon: Target },
  ];

  const impactCategories = [
    {
      category: "Water & Sanitation",
      icon: Droplets,
      color: "bg-primary-100 text-primary-800",
      stats: [
        { label: "Clean Water Wells", value: "28" },
        { label: "People with Water Access", value: "12,400" },
        { label: "Sanitation Facilities", value: "35" },
        { label: "Waterborne Disease Reduction", value: "78%" },
      ],
      story: {
        title: "Transforming Tigray Through Clean Water",
        content:
          "In the remote village of Adwa, families once walked 6 hours daily to collect contaminated water. After installing solar-powered wells and providing hygiene education, waterborne diseases have decreased by 80%. Children now attend school regularly instead of collecting water, and agricultural productivity has increased by 40% through irrigation access.",
        image: "/placeholder.svg?height=300&width=500",
      },
    },
    {
      category: "Healthcare",
      icon: Stethoscope,
      color: "bg-primary-100 text-primary-800",
      stats: [
        { label: "Mobile Clinics Established", value: "12" },
        { label: "Patients Treated", value: "18,750" },
        { label: "Health Workers Trained", value: "87" },
        { label: "Vaccination Coverage Increase", value: "65%" },
      ],
      story: {
        title: "Mobile Healthcare Reaching the Unreached",
        content:
          "Our mobile clinics have brought essential healthcare to communities that previously had no medical access. In the SNNP region, maternal mortality has decreased by 70% through skilled birth attendance, and child mortality from preventable diseases has dropped by 60%. Local health workers have been trained to provide ongoing care between clinic visits.",
        image: "/placeholder.svg?height=300&width=500",
      },
    },
    {
      category: "Education",
      icon: GraduationCap,
      color: "bg-primary-100 text-primary-800",
      stats: [
        { label: "Schools Built/Renovated", value: "15" },
        { label: "Students Enrolled", value: "3,200" },
        { label: "Teachers Trained", value: "124" },
        { label: "Literacy Rate Improvement", value: "55%" },
      ],
      story: {
        title: "Education Transforming Oromia Communities",
        content:
          "In rural Jimma, our education centers have provided quality education to children who previously had no access to schools. Literacy rates have increased from 30% to 85% in five years. Our scholarship program has enabled 45 promising students from rural areas to attend university, many of whom have returned to serve their communities.",
        image: "/placeholder.svg?height=300&width=500",
      },
    },
    {
      category: "Agriculture",
      icon: Sprout,
      color: "bg-primary-100 text-primary-800",
      stats: [
        { label: "Community Gardens", value: "32" },
        { label: "Families with Food Security", value: "1,850" },
        { label: "Crop Yield Increase", value: "150%" },
        { label: "Sustainable Farming Trainees", value: "720" },
      ],
      story: {
        title: "Sustainable Farming in Amhara Region",
        content:
          "Our community garden projects have transformed food security in drought-prone areas of Amhara. By introducing drought-resistant crops, improved seeds, and water-efficient irrigation systems, 800 families have increased food production by 150%. Malnutrition rates have decreased by 50%, and 200 women now generate income through vegetable and fruit sales.",
        image: "/placeholder.svg?height=300&width=500",
      },
    },
  ];

  const testimonials = [
    {
      quote:
        "Before the clean water well came to our village, my children were always sick. Now they are healthy and can attend school regularly. This has changed everything for us.",
      name: "Tigist Haile",
      role: "Mother of four, Tigray Region",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "The mobile clinic saved my wife's life during a difficult childbirth. Now we have a healthy baby boy, and my wife received the care she needed. We are so grateful.",
      name: "Abebe Tadesse",
      role: "Farmer, SNNP Region",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "I never thought I would learn to read and write at my age. Now I can read the Bible in my own language and help my grandchildren with their schoolwork.",
      name: "Desta Bekele",
      role: "Elder, Amhara Region",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  const annualImpact = [
    {
      year: "2023",
      highlights: [
        "Completed 8 clean water projects serving 5,400 people",
        "Established 3 new mobile clinics in remote areas",
        "Graduated 45 students from our education centers",
        "Trained 120 farmers in sustainable agriculture",
      ],
    },
    {
      year: "2022",
      highlights: [
        "Built 2 new education centers in Oromia region",
        "Expanded healthcare access to 7 new communities",
        "Established 12 community gardens improving food security",
        "Trained 35 community health workers",
      ],
    },
    {
      year: "2021",
      highlights: [
        "Completed translation of Scripture in Kemant language",
        "Provided emergency relief to 1,200 displaced families",
        "Established women's microfinance program in Dire Dawa",
        "Built 6 clean water wells in drought-affected areas",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header currentPage="impact" />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6">
                Our Impact in
                <br />
                <span className="text-primary-600">Ethiopia</span>
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed">
                Through the faithful support of our partners and the dedicated
                work of our missionaries, we`&apos;`re seeing transformation across all
                regions of Ethiopia. These are the stories of hope and change.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Impact by the Numbers
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Every number represents lives changed and communities
                transformed through sustainable, holistic ministry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-shadow duration-300 bg-white border-stone-200"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary-600" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-stone-800 mb-2">
                        {stat.value}
                      </CardTitle>
                      <p className="text-stone-600">{stat.label}</p>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Impact by Category */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Impact by Category
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Our holistic approach addresses the physical, spiritual,
                educational, and economic needs of communities.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Tabs
                defaultValue={impactCategories[0].category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                  {impactCategories.map((category) => (
                    <TabsTrigger
                      key={category.category}
                      value={category.category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                      className="flex items-center space-x-2"
                    >
                      {React.createElement(category.icon, {
                        className: "w-4 h-4 mr-2",
                      })}
                      <span>{category.category}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {impactCategories.map((category) => (
                  <TabsContent
                    key={category.category}
                    value={category.category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="bg-white border-stone-200">
                        <CardHeader>
                          <div className="flex items-center space-x-2 mb-4">
                            {React.createElement(category.icon, {
                              className: "w-6 h-6",
                            })}
                            <Badge className={category.color}>
                              {category.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl text-stone-800">
                            {category.story.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="relative h-64 rounded-lg overflow-hidden">
                            <Image
                              src={category.story.image || "/placeholder.svg"}
                              alt={category.story.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-stone-700 leading-relaxed">
                            {category.story.content}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-stone-200">
                        <CardHeader>
                          <CardTitle className="text-xl text-stone-800">
                            Key Achievements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-6">
                            {category.stats.map((stat, index) => (
                              <div
                                key={index}
                                className="text-center p-4 bg-stone-50 rounded-lg"
                              >
                                <div className="text-2xl font-bold text-primary-600 mb-2">
                                  {stat.value}
                                </div>
                                <div className="text-sm text-stone-600">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8">
                            <Link href={`/projects`}>
                              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                                Support {category.category} Projects
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* Annual Impact */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Annual Impact
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Year by year, we`&apos;`re seeing sustainable growth and lasting
                transformation across Ethiopia.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {annualImpact.map((year) => (
                  <Card key={year.year} className="bg-white border-stone-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-stone-800">
                          <TrendingUp className="inline-block w-6 h-6 mr-2 text-primary-600" />
                          {year.year} Impact Highlights
                        </CardTitle>
                        <Badge className="bg-primary-100 text-primary-800">
                          {year.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {year.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-stone-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/transparency">
                  <Button
                    variant="outline"
                    className="border-primary-600 text-primary-600 hover:bg-primary-50"
                  >
                    View Detailed Annual Reports
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Voices of Transformation
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Hear directly from those whose lives have been transformed
                through our work in Ethiopia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white border-stone-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="pt-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <blockquote className="text-stone-700 italic mb-6 text-center">
                      {`"${testimonial.quote}"`}
                    </blockquote>
                    <div className="text-center">
                      <div className="font-semibold text-stone-800">
                        {testimonial.name}
                      </div>
                      <div className="text-stone-600 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of the Transformation
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Your partnership makes this impact possible. Join us in continuing
              to transform lives across Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partnership">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-stone-50 px-8 py-3 text-lg"
                >
                  Become a Partner
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg bg-white/20 backdrop-blur-sm"
                >
                  Support a Project
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
