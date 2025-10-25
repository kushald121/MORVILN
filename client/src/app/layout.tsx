import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./providers/theme.provider";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MORVILN - Premium Fashion Store",
  description: "Discover premium fashion at unbeatable prices. Shop the latest trends with free shipping on orders over $75.",
  keywords: "fashion, clothing, premium, online store, shopping",
  authors: [{ name: "MORVILN" }],
  creator: "MORVILN",
  publisher: "MORVILN",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://morviln.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MORVILN - Premium Fashion Store",
    description: "Discover premium fashion at unbeatable prices. Shop the latest trends with free shipping on orders over $75.",
    url: "https://morviln.com",
    siteName: "MORVILN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MORVILN - Premium Fashion Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MORVILN - Premium Fashion Store",
    description: "Discover premium fashion at unbeatable prices. Shop the latest trends with free shipping on orders over $75.",
    images: ["/og-image.jpg"],
    creator: "@morviln",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light' || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <div className="relative min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1 max-w-full overflow-x-hidden pt-16 lg:pt-16 pb-14 lg:pb-0">
                    {children}
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>

        {/* Performance optimization: Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Theme color for mobile browsers - Dynamic theme support */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="theme-color" content="#ffffff" />

        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MORVILN" />

        {/* Microsoft specific meta tags */}
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </body>
    </html>
  );
}
