import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cut 90 Planner - แผนลดไขมัน 90 วัน',
    short_name: 'Cut 90',
    description: 'โปรแกรมวางแผนและบันทึกการลดไขมันแบบวิทยาศาสตร์ 90 วัน',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1319',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
