import Image from "next/image";
import { Metadata } from "next";
import {
  Header,
  Footer,
  AboutUsHero,
  AboutCompanySection,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Узнайте больше о EMAN RIVERSIDE: о компании, проектах, преимуществах и сертификатах.",
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main>
        <AboutUsHero />

        <div className="relative pt-5">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/3">
              <Image
                src="/images/hero/background.png"
                alt=""
                fill
                className="object-cover object-right"
                sizes="33vw"
              />
            </div>
            <div className="absolute right-0 top-0 h-full w-2/3">
              <Image
                src="/images/hero/background.png"
                alt=""
                fill
                className="object-cover object-left"
                sizes="67vw"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(249, 239, 231, 0.85) 0%, rgba(249, 239, 231, 0.85) 50%, rgba(249, 239, 231, 0.95) 80%, #F9EFE7 100%)",
              }}
            />
          </div>

          <div className="relative z-10">
            <AboutCompanySection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
