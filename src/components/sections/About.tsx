import Image from "next/image";

const feature01Details = {
  facades: [
    "Декоративная покраска",
    "Фрезерованный металл",
    "Металл под покраску",
    "Природные оттенки",
    "Современные формы",
  ],
  commonAreas: [
    "Керамогранит",
    "Травертин",
    "Устойчивые материалы",
  ],
};

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

export default function About() {
  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 lg:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary" />
            <span className="text-sm text-primary font-medium uppercase tracking-[0.2em]">
              EMAN RIVERSIDE
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif">
            Почему Именно{" "}
            <span className="text-primary">EMAN</span>
            <br />
            <span className="text-primary">RIVERSIDE!</span>
          </h2>
        </div>

        {/* Feature 01 - Architecture */}
        <div id="feature-01" className="mb-24 lg:mb-32 scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Content */}
            <div className="relative">
              {/* Large number background */}
              <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
                01
              </span>

              <div className="relative z-10 pt-16 lg:pt-24">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-px bg-primary" />
                  <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                    АРХИТЕКТУРА И МАТЕРИАЛЫ
                  </span>
                </div>

                <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                  Архитектура и<br />материалы
                </h3>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Фасады</h4>
                    <ul className="space-y-1.5">
                      {feature01Details.facades.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Общие зоны</h4>
                    <ul className="space-y-1.5">
                      {feature01Details.commonAreas.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/images/hero/1.png"
                  alt="Архитектура здания"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 02 - Courtyard */}
        <div id="feature-02" className="mb-24 lg:mb-32 scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Image */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden lg:order-1 bg-muted">
              <Image
                src="/images/hero/1.png"
                alt="Дворовое пространство"
                fill
                className="object-cover"
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

        {/* Feature 03 - Apartment */}
        <div id="feature-03" className="scroll-mt-20">
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
      </div>
    </section>
  );
}
