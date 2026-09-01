import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AiraChat } from "@/components/AiraChat";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.edufyitechsolutions.com"),
  title: {
    default: "Edufyi Tech Solutions — Learn. Build. Get Placed.",
    template: "%s | Edufyi Tech Solutions",
  },
  description:
    "Edufyi Tech Solutions is a technology solutions and EdTech company offering immersive programs in AI/ML, Data Science, Cybersecurity, and HR — with real projects, mentors, and placement assistance.",
  keywords: [
    "AI course",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "HR Analytics",
    "internships",
    "EdTech India",
    "Edufyi",
  ],
  openGraph: {
    title: "Edufyi Tech Solutions — Learn. Build. Get Placed.",
    description:
      "Immersive tech programs with real projects, mentors, and placement assistance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050c13",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <ScrollProgressBar />
        <Cursor />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <AiraChat />
      </body>
    </html>
  );
}
