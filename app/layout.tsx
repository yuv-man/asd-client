import type { Metadata } from "next";
import SocketInitializer from "./components/common/SocketInitializer";
import { Lilita_One, Wendy_One, Fredoka } from "next/font/google";
import './styles/globals.scss';
const lilitaOne = Lilita_One({
  weight: '400',
  subsets: ['latin'],
});

const wendyOne = Wendy_One({
  weight: '400',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  weight: '400',
  subsets: ['hebrew'],
});

export const metadata: Metadata = {
  title: "WonderKid",
  description: "WonderKid",
  icons: {
    icon: '/wonderkid.svg'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${lilitaOne.className} ${wendyOne.className} ${fredoka.className} antialiased`}
        suppressHydrationWarning
      >
          <SocketInitializer />
            {children}
      </body>
    </html>
  );
}
