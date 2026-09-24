# Crown & Clipper Barber Co.

Public website: [crown-and-clipper-barber.vercel.app](https://crown-and-clipper-barber.vercel.app).

## Run locally

The Vercel project root is `crown-clipper-vercel/` within the GitHub repository.

```bash
cd crown-clipper-vercel
npm ci
npm run dev
```

Open `http://localhost:3000`. If port 3000 is already in use, stop the other server or run `npm run dev -- -p 3001`.

## Publishing

Vercel deploys commits to the `main` branch of [lastnamelekabe/crown-and-clipper-barber](https://github.com/lastnamelekabe/crown-and-clipper-barber) automatically. The Vercel project's Root Directory must stay set to `crown-clipper-vercel`.

## Photos and barber names

[Manage photos and names](https://crown-and-clipper-barber.otttt.chatgpt.site/photos) uses the existing photo password. Upload JPG or JPEG photos of up to 5 MB. The About barber-at-work image must be landscape, at least 1000 × 700 pixels and at least 1.2 times wider than it is tall; portraits should be at least 800 × 900 pixels. An old portrait upload in the About slot falls back to the bundled landscape JPG. A crisp 1536 × 1024 JPG is bundled as the About fallback image. Saved photo uploads take precedence over the fallback.

Barber names saved in the photo manager appear on the About page and in the booking form. The public Vercel site reads photo and name data from the Sites backend through `/api/images` and `/api/team`; the password remains on that backend.

## Booking and coupon

Bookings are sent through Vercel to the Sites booking backend. Opening hours are Monday to Friday 09:00–18:30 and Saturday 08:30–17:00 (Africa/Johannesburg); Sunday is closed. The backend checks available slots before confirming a booking.

`FIRSTCUT10` takes 10% off a customer's first confirmed booking. The backend validates the code and returns the actual total. Bookings, coupon use, and reserved time slots are stored in its D1 database. The Google Calendar and `.ics` links use the confirmed appointment time.

The business details are fictional assessment content. Vercel Hobby is free within its usage limits and does not provide a 24/7 uptime guarantee.
