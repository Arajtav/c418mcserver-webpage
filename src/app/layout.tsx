import "./globals.css";

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
        <html lang="en">
            <body className="text-neutral-200">{children}</body>
        </html>
    );
}
