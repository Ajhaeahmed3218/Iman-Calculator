import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Iman Calculator - Check Your Iman",
  description: "Evaluate and track your Iman level with our interactive quiz",
};

export default function RootLayout({ children }) {
              
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar />
          <div className="h-screen">
            {children}  
          </div>  
        </SessionProvider>
      </body>
    </html>
  );
}
