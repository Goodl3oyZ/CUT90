import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistOptions } from 'serwist';
import { Serwist, NetworkOnly } from 'serwist';

declare const self: {
  __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
} & Record<string, any>;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkOnly(),
    },
  ],
} satisfies SerwistOptions);

serwist.addEventListeners();
