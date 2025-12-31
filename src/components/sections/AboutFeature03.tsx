import Image from "next/image";

export default function AboutFeature03() {
  return (
    <section id="feature-03" className="relative py-24 lg:py-32 scroll-mt-20 bg-[#F9EFE7] overflow-hidden">
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
          {/* Content */}
          <div className="relative">
            {/* Large number background */}
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              03
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  ВАША КВАРТИРА
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                Ваша<br />квартира
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Продуманные планировки квартир с панорамными окнами.
                  Высота потолков 3 метра. Готовая отделка white box.
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Панорамные окна
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Высота потолков 3 метра
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Отделка white box
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Продуманные планировки
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src="/images/hero/1.png"
              alt="Интерьер квартиры"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
