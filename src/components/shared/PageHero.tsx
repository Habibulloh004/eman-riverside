import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[100px] sm:h-[120px] lg:h-[140px] mt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      {/* Watermark Text */}
      <div className="absolute inset-0 flex items-end justify-end overflow-hidden pointer-events-none pr-4 lg:pr-8">
        <span className="text-[60px] sm:text-[80px] lg:text-[100px] font-serif text-white/10 lowercase whitespace-nowrap select-none">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full flex items-center">
        <div>
          {subtitle && (
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 lg:w-10 h-px bg-white/60" />
              <p className="text-[9px] sm:text-[10px] text-white/80 font-medium uppercase tracking-[0.15em]">
                {subtitle}
              </p>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
