import Image from "next/image";

const nearbyPlaces = [
  "Супермаркет Korzinka",
  "Team University",
  "Национальный детский медицинский центр",
  "Городская клиническая больница №4",
  "Школы и детские сады",
];

export default function Location() {
  return (
    <section id="location" className="relative py-16 lg:py-24 bg-[#F9EFE7] overflow-hidden">
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
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
              Где мы находимся
            </h2>

            <p className="text-muted-foreground mb-8 italic">
              Локация сочетает природу и городскую инфраструктуру —<br />
              идеальный баланс
            </p>

            {/* Nearby Places */}
            <ul className="space-y-4">
              {nearbyPlaces.map((place) => (
                <li key={place} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">{place}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Map */}
          <div className="relative aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            {/* Grayscale Map iframe - Tashkent center */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47980.98675893856!2d69.21992457431642!3d41.31147339999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703955000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            {/* Map Pin Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-primary p-3 rounded-lg shadow-lg">
                <Image
                  src="/logo.svg"
                  alt="EMAN RIVERSIDE"
                  width={60}
                  height={30}
                  className="h-6 w-auto brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
