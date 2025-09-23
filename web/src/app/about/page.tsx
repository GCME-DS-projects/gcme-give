import Footer from "@/components/public/common/footer";
import Header from "@/components/public/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Globe, Target, Award, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Love in Action",
      description:
        "We believe love is demonstrated through sacrificial service to others, especially the marginalized and forgotten.",
    },
    {
      icon: Users,
      title: "Community Partnership",
      description:
        "We work alongside local communities, respecting their culture while bringing hope and transformation.",
    },
    {
      icon: Globe,
      title: "Ethiopian Focus",
      description:
        "We are committed to serving all regions of Ethiopia, from urban centers to the most remote rural areas.",
    },
    {
      icon: Target,
      title: "Sustainable Impact",
      description:
        "We focus on long-term solutions that empower communities to thrive independently.",
    },
    {
      icon: Award,
      title: "Excellence & Integrity",
      description:
        "We maintain the highest standards in all our work, ensuring transparency and accountability.",
    },
    {
      icon: BookOpen,
      title: "Holistic Ministry",
      description:
        "We address spiritual, physical, educational, and economic needs in every community we serve.",
    },
  ];

  const leadership = [
    {
      name: "Samuel Yeja",
      role: "Executive Director",
      image: "/images/missionaries/samuel.png?height=200&width=200",
      bio: "With over 20 years of ministry experience in Ethiopia, Dr. Alemayehu leads our organization with wisdom and passion for reaching the unreached.",
    },
    {
      name: "Senay Kumlachew",
      role: "Director of Operations",
      image: "/images/missionaries/senay.png?height=200&width=200",
      bio: "Bethlehem oversees all field operations and missionary support, ensuring our teams have everything they need to serve effectively.",
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header currentPage="about" />

      {/* Add top padding to account for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6">
                Our Mission in
                <br />
                <span className="text-primary-600">Ethiopia</span>
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed">
                Great Commission Ethiopia exists to empower indigenous
                missionaries and support sustainable community development
                across all regions of Ethiopia, bringing hope, healing, and
                transformation to those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/partnership">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 text-lg"
                  >
                    Partner With Us
                  </Button>
                </Link>
                <Link href="/missionaries">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-600 text-primary-600 hover:text-white hover:bg-primary-600 px-8 py-3 text-lg"
                  >
                    Meet Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-stone-700 leading-relaxed">
                    <p>
                      Great Commission Ethiopia was founded in 2015 with a
                      simple but powerful vision: to support Ethiopian believers
                      who felt called to serve their own people. We recognized
                      that the most effective missionaries are often those who
                      understand the local culture, speak the language, and have
                      deep roots in the communities they serve.
                    </p>
                    <p>
                      What started as support for just three missionary families
                      has grown into a network of over 127 missionaries serving
                      across all 11 regions of Ethiopia. Our approach is unique
                      because we don't send foreign missionaries to Ethiopia –
                      instead, we empower Ethiopians to reach Ethiopians.
                    </p>
                    <p>
                      Today, our missionaries are planting churches, providing
                      medical care, educating children, empowering women,
                      translating Scripture, and addressing the holistic needs
                      of communities from the highlands of Tigray to the
                      lowlands of Afar, from the bustling streets of Addis Ababa
                      to the remote villages of Gambela.
                    </p>
                    <p>
                      Every project we support and every missionary we partner
                      with shares our commitment to sustainable, community-led
                      transformation that honors Ethiopian culture while
                      bringing the hope of the Gospel to those who need it most.
                    </p>
                  </div>
                </div>
                <div className="relative h-96 lg:h-full">
                  <Image
                    src="/images/group-pic.png?height=500&width=600"
                    alt="Ethiopian missionaries serving their communities"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape how we serve
                communities across Ethiopia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-shadow duration-300 bg-white border-stone-200"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary-600" />
                      </div>
                      <CardTitle className="text-xl text-stone-800">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                Our Leadership
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Meet the dedicated leaders who guide our mission and ensure
                excellence in everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {leadership.map((leader, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300 bg-white border-stone-200"
                >
                  <CardHeader>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={leader.image || "/placeholder.svg"}
                        alt={leader.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <CardTitle className="text-lg text-stone-800">
                      {leader.name}
                    </CardTitle>
                    <p className="text-primary-600 font-semibold">
                      {leader.role}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600 text-sm">{leader.bio}</p>
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
              Join Our Mission
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Whether through prayer, financial partnership, or volunteer
              service, there are many ways to be part of what God is doing in
              Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partnership">
                <Button
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-stone-50 px-8 py-3 text-lg"
                >
                  Become a Partner
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg bg-white/20 backdrop-blur-sm"
                >
                  Get in Touch
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
