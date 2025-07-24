import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Correct variable name: monaSans (lowercase 'm')
const monaSans = Mona_Sans({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "InterviewCr",
    description: "ai-powered mock-interview",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${monaSans.className} antialiased pattern`} suppressHydrationWarning={true}>
        {children}

        <Toaster />
        </body>
        </html>
    );
}
