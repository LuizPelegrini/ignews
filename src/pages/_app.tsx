import type { AppProps } from 'next/app';

import '@/styles/global.scss';
import { Header } from '@/components/Header';
import { SessionProvider } from 'next-auth/react';

export default function App({
  Component,
  pageProps
}: AppProps) {
  return (
    // Wrap with SessionProvider so useSession() is accessible on all pages
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
