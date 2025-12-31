import Image from "next/image";

const feature02Details = {
  landscaping: {
    title: "ОЗЕЛЕНЕНИЕ",
    description: "ТЕРРИТОРИЯ НАПОЛНЕНА ДЕРЕВЬЯМИ, ГАЗОНАМИ И РАСТЕНИЯМИ, СОЗДАЮЩИМИ МИКРОКЛИМАТ СВЕЖЕСТИ.",
  },
  playground: {
    title: "ДЕТСКАЯ ПЛОЩАДКА",
    description: "БЕЗОПАСНОЕ ПРОСТРАНСТВО С СОВРЕМЕННЫМ ОБОРУДОВАНИЕМ.",
  },
  sports: {
    title: "СПОРТИВНАЯ ЗОНА",
    description: "ПЛОЩАДКИ ДЛЯ АКТИВНОГО ОТДЫХА И СПОРТА.",
  },
};

export default function AboutFeature02() {
  return (
    <section id="feature-02" className="relative py-24 lg:py-32 scroll-mt-20 bg-[#F9EFE7] overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden lg:order-1 bg-muted">
            <Image
              src="/images/hero/1.png"
              alt="Дворовое пространство"
              fill
              className="object-cover "
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="relative lg:order-2">
            {/* Large number background */}
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              02
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  ДВОРОВОЕ ПРОСТРАНСТВО
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                Дворовое<br />пространство
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                    {feature02Details.landscaping.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wide">
                    {feature02Details.landscaping.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                    {feature02Details.playground.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wide">
                    {feature02Details.playground.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                    {feature02Details.sports.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wide">
                    {feature02Details.sports.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
