import Image from "next/image";

const floorPlans = [
  {
    id: 1,
    type: "3-комнатные",
    area: "от 56.79 до 61 м²",
    description: "Оптимально для семьи с двумя детьми",
    image: "/images/hero/planirovka1.png",
  },
  {
    id: 2,
    type: "2-комнатные",
    area: "от 56.79 до 61 м²",
    description: "Комфортная семейная планировка",
    image: "/images/hero/planirovka1.png",
  },
];

export default function FloorPlans() {
  return (
    <section id="plans" className="py-16 lg:py-24 bg-[#F9EFE7]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
              ПЛАНИРОВКА КОМПЛЕКСА
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif">
            Планировки
          </h2>
        </div>

        {/* Floor Plans */}
        <div className="space-y-16 lg:space-y-24">
          {floorPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Plan Image - always on left for first, right for second */}
              <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={plan.image}
                    alt={plan.type}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Plan Info - always on right for first, left for second */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-2xl lg:text-4xl font-serif mb-4">
                  {plan.type}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {plan.area}
                </p>
                <p className="text-muted-foreground italic">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
