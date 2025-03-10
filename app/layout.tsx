import type { Metadata } from "next";
import { Lilita_One, Wendy_One } from "next/font/google";
import "./globals.css";
import './styles/globals.sass';


const lilitaOne = Lilita_One({
  weight: '400',
  subsets: ['latin'],
});

const wendyOne = Wendy_One({
  weight: '400',
  subsets: ['latin'],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lilitaOne.className} ${wendyOne.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
