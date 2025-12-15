# Restaurant Message Page

A beautiful single-page Next.js application where customers can scan a QR code to listen to a personalized audio message from the restaurant and leave a rating.

## Features

- 🎵 Audio player with play/pause controls and progress bar
- ⭐ Interactive star rating system (default 4.5 stars)
- 🖼️ Restaurant logo display with fallback
- 📱 Fully responsive design
- 🎨 Beautiful Italian restaurant-themed styling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Configuration

### Changing the Audio File

Edit `app/page.tsx` and update the audio source URL:
```tsx
<audio
  ref={audioRef}
  preload="metadata"
  src="YOUR_AUDIO_URL_HERE"
>
```

### Updating Restaurant Logo

The logo URL is already configured in `app/page.tsx`. To change it, update:
```tsx
src="https://orderbyte.io/api/v1/download/brands/85854185-aaf6-4780-ba06-d4b988a0452e.png"
```

### Adding Review Links

Update the review platform links in `app/page.tsx`:
```tsx
<a href="YOUR_GOOGLE_REVIEWS_URL" ...>
<a href="YOUR_YELP_URL" ...>
```

## Project Structure

```
qrscan/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (optional)
│   ├── page.module.css      # Page styles
│   ├── globals.css          # Global styles
│   └── greetings/
│       ├── page.tsx         # Greetings page (/greetings)
│       └── page.module.css # Greetings page styles
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript configuration
├── nginx.conf              # Nginx configuration
├── ecosystem.config.js     # PM2 configuration
└── deploy.sh               # Deployment script
```

## Production URL

The application is available at: **https://flintridgepizzakitchen.com/greetings**

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling

## License

MIT

