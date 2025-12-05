"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <main
            className={`flex-1 max-w-full overflow-x-hidden ${isHomePage ? "pt-0" : "pt-24 lg:pt-28"
                }`}
        >
            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-24">
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                }
            >
                {children}
            </Suspense>
        </main>
    );
}
