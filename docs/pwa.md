# Next.js + PWA’da Image Optimization (Cache, SSG, ISR)

Bu hujjat **Next.js (App Router)** asosida yaratilgan **PWA** loyihada rasmlarni (images) maksimal darajada **tez ochilishi**, **cache bo‘lishi** va **SEO + performance** jihatdan optimal ishlashi uchun **to‘liq texnik yo‘riqnoma** hisoblanadi. Ushbu `.md` fayl **Codex / loyiha hujjati** sifatida ishlatish uchun mos.

---

## 1. Maqsadlar

* Images **tez yuklanishi** (LCP, CLS, FCP yaxshilanishi)
* Offline rejimda ham ishlashi (PWA cache)
* Server yukini kamaytirish
* SEO va Core Web Vitals’ni oshirish
* SSG / ISR orqali statik kontentni tez yetkazish

---

## 2. Texnologiyalar

* **Next.js 14+ (App Router)**
* **next/image** (built‑in optimization)
* **PWA (service worker)**
* **SSG (Static Site Generation)**
* **ISR (Incremental Static Regeneration)**
* **Cache-Control headers**
* **Workbox (PWA cache strategiyasi)**

---

## 3. Project Structure (Tavsiya etiladi)

```
/app
  /(public)
    page.tsx            # SSG
  /blog
    [slug]
      page.tsx          # ISR
/public
  /images
    hero.webp
    logo.svg
/lib
  images.ts             # image config helper
/next.config.js
/manifest.json
/service-worker.js
```

---

## 4. next/image bilan Image Optimization

### 4.1 Asosiy qoida

❌ `img` ishlatmang
✅ Har doim `next/image`

```tsx
import Image from 'next/image'

<Image
  src="/images/hero.webp"
  alt="Hero image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
```

### 4.2 Nima uchun bu tez?

* Lazy loading (default)
* Responsive sizes
* WebP / AVIF auto
* CDN caching

---

## 5. next.config.js – Image va Cache sozlamalari

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 yil
  },
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

module.exports = nextConfig
```

---

## 6. SSG (Static Site Generation)

### 6.1 Qachon SSG ishlatamiz?

* Landing page
* About, Contact
* Static images ko‘p bo‘lgan sahifalar

### 6.2 App Router’da SSG

```ts
export const dynamic = 'force-static'

export default function Page() {
  return <h1>Static Page</h1>
}
```

Natija:

* HTML oldindan build qilinadi
* Images CDN’da cache bo‘ladi
* Juda tez ochiladi

---

## 7. ISR (Incremental Static Regeneration)

### 7.1 Qachon ISR?

* Blog
* Yangilanadigan lekin tez ochilishi kerak bo‘lgan sahifalar

```ts
export const revalidate = 60 // 60 sekund

export default async function BlogPage() {
  const data = await fetch('https://api.example.com/posts').then(res => res.json())
  return <Blog data={data} />
}
```

ISR afzalligi:

* Birinchi request statik
* Background’da yangilanadi

---

## 8. PWA va Image Cache (Service Worker)

### 8.1 Workbox Cache Strategy

```js
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 kun
      }),
    ],
  })
)
```

Natija:

* Image bir marta yuklanadi
* Keyin offline ham ishlaydi

---

## 9. PWA manifest.json (Muhim)

```json
{
  "name": "Next PWA App",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 10. Performance Best Practices

* Hero image → `priority`
* SVG → inline yoki public
* Katta image → `sizes` ishlatish
* CDN (Vercel, Cloudflare)
* Lighthouse tekshirish

---

## 11. Yakuniy Xulosa

✔ next/image → majburiy
✔ Static pages → SSG
✔ Dynamic lekin tez → ISR
✔ Offline images → PWA cache
✔ Cache-Control → 1 yil

Bu kombinatsiya **maksimal tezlik + minimal server yuk** beradi.

---

*Agar xohlasang:*

* real repo example
* next-pwa bilan full setup
* Lighthouse 100 score strategy

berib chiqaman.
