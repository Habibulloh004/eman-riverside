import Image from "next/image";
import { Metadata } from "next";
import {
  Header,
  Footer,
  SideNav,
  AboutFeatures,
  Location,
  FloorPlans,
} from "@/components/sections";
import AboutProjectHero from "@/components/sections/AboutProjectHero";

export const metadata: Metadata = {
  title: "О проекте",
  description: "Узнайте больше о жилом комплексе EMAN RIVERSIDE - современная архитектура, благоустроенная территория и комфортные квартиры.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <SideNav />
      <main>
        <AboutProjectHero />

        {/* About sections with background */}
        <div className="relative">
          {/* Background Images */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-1/3 h-full">
              <Image
                src="/images/hero/background.png"
                alt=""
                fill
                className="object-cover object-right"
              />
            </div>
            <div className="absolute right-0 top-0 w-2/3 h-full">
              <Image
                src="/images/hero/background.png"
                alt=""
                fill
                className="object-cover object-left"
              />
            </div>
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(249, 239, 231, 0.85) 0%, rgba(249, 239, 231, 0.85) 50%, rgba(249, 239, 231, 0.95) 80%, #F9EFE7 100%)"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <AboutFeatures />
          </div>
        </div>

        <Location />
        <FloorPlans />
      </main>
      <Footer />
    </>
  );
}
