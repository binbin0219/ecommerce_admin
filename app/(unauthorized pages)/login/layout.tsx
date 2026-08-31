import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Store Admin",
    description: "Store admin login page",
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        children
    );
}
