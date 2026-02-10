import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import ScrollToTop from "@/components/layout/ScrollToTop"; // Importation du composant de scroll

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "JEaLiFe Pictures | Photos Premium du Gabon",
    template: "%s | JEaLiFe Pictures"
  },
  description: "La plus grande bibliothèque de photos premium et gratuites du Gabon. Découvrez la beauté du Gabon à travers les yeux de nos talentueux photographes locaux.",
  keywords: ["Gabon", "Photo Gabon", "Libreville", "Nature Gabon", "Culture Gabonaise", "Photographie Gabon", "JEaLiFe", "Stock Photo Gabon"],
  authors: [{ name: "JEaLiFe Team" }],
  creator: "JEaLiFe Gabon",
  publisher: "JEaLiFe Gabon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "JEaLiFe Pictures | Photos Premium du Gabon",
    description: "La source de visuels sur le Gabon. Alimentée par des créateurs et créatrices du monde entier.",
    url: "https://pictures.jealife.ga",
    siteName: "JEaLiFe Pictures",
    locale: "fr_GA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JEaLiFe Pictures | Photos Premium du Gabon",
    description: "La plus grande bibliothèque de photos premium du Gabon.",
    creator: "@jealife",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#ffffff",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JEaLiFe Pix",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="fr-GA">
      <body className={`${inter.variable} font-sans antialiased text-slate-900 bg-white overflow-x-hidden`}>
        <AuthProvider>
          <ScrollToTop /> {/* Ajout du composant ici */}
          <div className="flex w-full overflow-x-hidden">
            {/* Sidebar - Desktop Only Fixed Narrow Rail (60px) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex min-h-screen w-full flex-1 flex-col transition-all duration-300 md:pl-[60px] overflow-x-hidden">
              <Header />
              <main className="flex-1 w-full overflow-x-hidden pt-[150px] md:pt-[110px]">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
