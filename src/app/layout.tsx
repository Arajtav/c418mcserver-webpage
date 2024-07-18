import "./globals.css";

import { VT323 } from "next/font/google";

// no fallbacks, also maybe change that font so something more readable
const font = VT323({
    weight: ['400'],
    subsets: ["latin-ext"],
    display: 'swap',
    fallback: ['VT323'],
});

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "c418 mc server",
    description: "not ready yet",
    authors: [{name: "Aräjtav"}],
    creator: "Aräjtav",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={font.className}>
            <body className="text-neutral-200">{children}</body>
        </html>
    );
}