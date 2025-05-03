
import NavBar from "@/component/Navbar";

import { Metadata } from 'next';
import Script from 'next/script';

import "@/style/index.css";
import "@/style/code-input.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from '@/context/sessionState';



export const metadata: Metadata = {
  title: "DSOJ",
  description: "DongShan High School Online Judge",
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
      <Script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@2.3/code-input.min.js"></Script>
    </html>
  );
}
