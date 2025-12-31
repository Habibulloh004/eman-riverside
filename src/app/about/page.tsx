import Image from "next/image";
import { Metadata } from "next";
import { PageHero } from "@/components/shared";
import {
  Header,
  Footer,
  SideNav,
  AboutFeature01,
  AboutFeature02,
  AboutFeature03,
  Location,
  FloorPlans,
} from "@/components/sections";

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
        <PageHero
          title="О Проекте"
          subtitle="СЕМЕЙНЫЙ КОМФОРТ В ПРИРОДНОЙ ТИШИНЕ"
          image="/images/hero/1.png"
        />

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
            <AboutFeature01 />
          </div>
        </div>

        <AboutFeature02 />
        <AboutFeature03 />
        <Location />
        <FloorPlans />
      </main>
      <Footer />
    </>
  );
}
