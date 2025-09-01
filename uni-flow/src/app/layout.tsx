import type { Metadata } from "next";
import "./globals.css";
import { Header, Navbar, Footer } from "@/widgets/common";

export const metadata: Metadata = {
  title: "UniLife",
  description: "Student app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased py-[16px]"
      >
        <Header />
        <div className="flex flex-row">
          <Navbar />
          <main className="flex flex-col">  
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}