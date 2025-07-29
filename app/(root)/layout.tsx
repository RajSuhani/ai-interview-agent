// app/(root)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const user = await getCurrentUser(); // ✅ more reliable than isAuthenticated

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="root-layout">
            <nav className="p-4 border-b border-white/10 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Logo" width={38} height={32} />
                    <h2 className="text-primary-100 font-semibold">Intvu</h2>
                </Link>
            </nav>

            <main className="p-6">{children}</main>
        </div>
    );
};

export default RootLayout;
