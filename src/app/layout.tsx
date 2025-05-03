import HeadComponent from "@/components/head"
import { Html, Main } from "next/document"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Html>
      <HeadComponent />
      <body>
        <Main />
      </body>
    </Html>
  )
}
