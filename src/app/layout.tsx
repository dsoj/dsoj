import { Metadata } from 'next';
import Script from 'next/script';

import "@/style/index.css";
import "@/style/code-input.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "@/component/Navbar";
import { SessionProvider } from '@/context/sessionState';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

export const defaultMetadata: OpenGraph = {
  title: "DSOJ",
  description: "DSOJ is an Online Judge platform developed by DSCS-Club, designed to meet the needs of coding enthusiasts. It supports technical growth, learning, culture, and beliefs, providing a space where coders can improve both their skills and sense of identity.",
  // url: "https://dsoj.tw",
  siteName: "DSOJ - DongShan High School Online Judge",
  images: [
    {
      url: "/logo_s.png",
      width: 128,
      height: 128,
      alt: "dsoj",
    },
  ],
  type: "website",
};

export const metadata: Metadata = {
  title: "DSOJ",
  description: "DongShan High School Online Judge",
  // metadataBase: new URL('https://dsoj.tw'),
  openGraph: defaultMetadata,
  keywords: ['DSOJ', 'Online Judge', 'Coding', 'Programming'],
  authors: [{ name: 'DSCS-Club' }],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/logo_s.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/logo_s.png" />
      </head>
      <body>
        <SessionProvider>
          <NavBar />
          {children}
        </SessionProvider>
      </body>
      <Script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@2.3/code-input.min.js" />
    </html>
  );
}
