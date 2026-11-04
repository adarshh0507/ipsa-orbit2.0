import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IPSA ORBIT',
    short_name: 'IPSA ORBIT',
    description: 'Timetable, notes, assignments and notices for B.Tech Data Science, IPS Academy Indore.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0908',
    theme_color: '#0B0908',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
