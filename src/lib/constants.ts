export const siteConfig = {
  name: "EMAN RIVERSIDE",
  description: "Toshkent shahridagi zamonaviy turar-joy majmuasi. Qulay joylashuv, premium infratuzilma va tabiat qo'ynida hayot.",
  url: "https://eman-riverside.uz",
  phone: "+998 90 123 45 67",
  email: "info@eman-riverside.uz",
  address: "Toshkent shahri, Sergeli tumani",
  workHours: "Пн-Сб: 9:00 - 18:00",
  social: {
    telegram: "https://t.me/emanriverside",
    instagram: "https://instagram.com/emanriverside",
    facebook: "https://facebook.com/emanriverside",
    youtube: "https://youtube.com/@emanriverside",
    threads: "https://www.threads.net/@emanriverside",
  },
};

export const navLinks = [
  { href: "/projects", label: "О проекте" },
  { href: "/catalog", label: "Каталог квартир" },
  { href: "/location", label: "Локация" },
  { href: "/payment", label: "Схема покупки" },
  { href: "/construction", label: "Строительство" },
  { href: "/contacts", label: "Контакты" },
];

export const apartments = [
  { id: 1, type: "Студия", floor: "2-15", area: 28, rooms: 1, price: 280000000, status: "available", image: "/images/apartments/studio.jpg" },
  { id: 2, type: "1-комнатная", floor: "3-15", area: 45, rooms: 1, price: 450000000, status: "available", image: "/images/apartments/1room.jpg" },
  { id: 3, type: "1-комнатная", floor: "5-12", area: 52, rooms: 1, price: 520000000, status: "reserved", image: "/images/apartments/1room-2.jpg" },
  { id: 4, type: "2-комнатная", floor: "2-15", area: 70, rooms: 2, price: 700000000, status: "available", image: "/images/apartments/2room.jpg" },
  { id: 5, type: "2-комнатная", floor: "4-10", area: 85, rooms: 2, price: 850000000, status: "available", image: "/images/apartments/2room-2.jpg" },
  { id: 6, type: "3-комнатная", floor: "2-8", area: 105, rooms: 3, price: 1050000000, status: "sold", image: "/images/apartments/3room.jpg" },
  { id: 7, type: "3-комнатная", floor: "3-12", area: 120, rooms: 3, price: 1200000000, status: "available", image: "/images/apartments/3room-2.jpg" },
  { id: 8, type: "Пентхаус", floor: "15", area: 180, rooms: 4, price: 2500000000, status: "available", image: "/images/apartments/penthouse.jpg" },
];

export const paymentPlans = [
  {
    title: "1 млн сум",
    description: "Ежемесячный платеж",
    features: ["Первоначальный взнос 30%", "Рассрочка до 36 месяцев", "Без процентов", "Гибкий график"],
  },
  {
    title: "2 млн сум",
    description: "Ежемесячный платеж",
    features: ["Первоначальный взнос 20%", "Рассрочка до 24 месяцев", "Без процентов", "Скидка 5%"],
  },
];

export const constructionProgress = [
  { date: "Январь 2024", title: "Начало строительства", description: "Заложен фундамент", completed: true },
  { date: "Апрель 2024", title: "Возведение каркаса", description: "Завершены работы по каркасу 1-5 этажей", completed: true },
  { date: "Август 2024", title: "Фасадные работы", description: "Начаты работы по фасаду", completed: true },
  { date: "Декабрь 2024", title: "Внутренняя отделка", description: "Отделочные работы в квартирах", completed: false },
  { date: "Июнь 2025", title: "Благоустройство", description: "Озеленение и благоустройство территории", completed: false },
  { date: "Декабрь 2025", title: "Сдача объекта", description: "Ввод в эксплуатацию", completed: false },
];

export const aboutFeatures = [
  {
    number: "01",
    title: "Архитектура и материалы",
    description: "Современная архитектура с использованием высококачественных материалов. Фасады выполнены из натурального камня и стекла.",
    image: "/images/about/architecture.jpg",
  },
  {
    number: "02",
    title: "Дворовое пространство",
    description: "Благоустроенная территория с детскими площадками, зонами отдыха и озеленением. Закрытый двор без машин.",
    image: "/images/about/courtyard.jpg",
  },
  {
    number: "03",
    title: "Ваша квартира",
    description: "Продуманные планировки квартир с панорамными окнами. Высота потолков 3 метра. Готовая отделка white box.",
    image: "/images/about/apartment.jpg",
  },
];

export const locationFeatures = [
  { label: "До центра города", value: "15 мин" },
  { label: "До метро", value: "5 мин" },
  { label: "Школы рядом", value: "3" },
  { label: "Детские сады", value: "5" },
];

export const infrastructureItems = [
  "Детские площадки",
  "Фитнес зал",
  "Подземный паркинг",
  "Зоны отдыха",
  "Охрана 24/7",
  "Видеонаблюдение",
];

export const galleryImages = [
  { src: "/images/gallery/1.jpg", alt: "Фасад здания" },
  { src: "/images/gallery/2.jpg", alt: "Гостиная" },
  { src: "/images/gallery/3.jpg", alt: "Кухня" },
  { src: "/images/gallery/4.jpg", alt: "Спальня" },
  { src: "/images/gallery/5.jpg", alt: "Двор" },
  { src: "/images/gallery/6.jpg", alt: "Территория" },
];

export const floorPlans = {
  "1-комнатные": [
    {
      id: 1,
      rooms: 1,
      area: "45-52",
      price: "от 450 млн",
      image: "/images/plans/1-room-1.jpg",
    },
    {
      id: 2,
      rooms: 1,
      area: "48-55",
      price: "от 480 млн",
      image: "/images/plans/1-room-2.jpg",
    },
  ],
  "2-комнатные": [
    {
      id: 3,
      rooms: 2,
      area: "70-85",
      price: "от 700 млн",
      image: "/images/plans/2-room-1.jpg",
    },
    {
      id: 4,
      rooms: 2,
      area: "75-90",
      price: "от 750 млн",
      image: "/images/plans/2-room-2.jpg",
    },
  ],
  "3-комнатные": [
    {
      id: 5,
      rooms: 3,
      area: "100-120",
      price: "от 1 млрд",
      image: "/images/plans/3-room-1.jpg",
    },
    {
      id: 6,
      rooms: 3,
      area: "110-130",
      price: "от 1.1 млрд",
      image: "/images/plans/3-room-2.jpg",
    },
  ],
};

export const faqItems = [
  {
    question: "Когда будут готовы квартиры?",
    answer: "Первая очередь квартир будет готова к концу 2025 года. Вторая очередь запланирована на весну 2026 года.",
  },
  {
    question: "Какие условия оплаты?",
    answer: "Мы предлагаем гибкий план оплаты: 30% первоначальный взнос, остальную часть можно оплатить в рассрочку до 24 месяцев. Также доступна ипотека через банки-партнеры.",
  },
  {
    question: "Какие типы квартир доступны?",
    answer: "Доступны 1-комнатные (45-55 м²), 2-комнатные (70-85 м²), 3-комнатные (100-120 м²) и пентхаусы (150-200 м²).",
  },
  {
    question: "Какая инфраструктура?",
    answer: "На территории комплекса: супермаркет, аптека, детский сад, школа, фитнес-зал, бассейн и другие удобства.",
  },
];
