import Image from "next/image";
import {
  Header,
  Hero,
  AboutHeader,
  AboutFeatures,
  Location,
  Gallery,
  FloorPlans,
  Contact,
  Footer,
  SideNav,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <SideNav />
      <main>
        {/* Hero + AboutHeader with shared background */}
        <div className="relative">
          {/* Background Images - Left and Right buildings */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Left building image */}
            <div className="absolute left-0 top-0 w-1/3 h-full">
              <Image
                src="/images/hero/background.png"
                alt="Background Left"
                fill
                className="object-cover object-right"
                priority
                quality={90}
                sizes="33vw"
              />
            </div>
            {/* Right building image */}
            <div className="absolute right-0 top-0 w-2/3 h-full">
              <Image
                src="/images/hero/background.png"
                alt="Background Right"
                fill
                className="object-cover object-left"
                priority
                quality={90}
                sizes="67vw"
              />
            </div>
            {/* Gradient Overlay - starts with some opacity at top */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(249, 239, 231, 0.7) 0%, rgba(249, 239, 231, 0.7) 50%, rgba(249, 239, 231, 0.9) 80%, #F9EFE7 100%)"
              }}
            />
          </div>

          {/* Content on top of background */}
          <div className="relative z-10">
            <Hero />
            <AboutHeader />
          </div>
        </div>

        {/* About Features - dynamically loaded from API */}
        <AboutFeatures />

        <Location />
        <Gallery />
        <FloorPlans />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
