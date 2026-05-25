"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileBottomNavProps = {
  cartQuantity: number;
  isAuthenticated: boolean;
};

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  match: (pathname: string) => boolean;
  badge?: number;
};

export function MobileBottomNav({ cartQuantity, isAuthenticated }: MobileBottomNavProps) {
  const pathname = usePathname();

  if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/pay/")) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "首页",
      icon: (active) => (
        <svg className={`h-5 w-5 ${active ? "text-[var(--brand-primary)]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      match: (value) => value === "/"
    },
    {
      href: "/categories",
      label: "分类",
      icon: (active) => (
        <svg className={`h-5 w-5 ${active ? "text-[var(--brand-primary)]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      match: (value) => value.startsWith("/categories")
    },
    {
      href: "/cart",
      label: "购物车",
      icon: (active) => (
        <svg className={`h-5 w-5 ${active ? "text-[var(--brand-primary)]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      match: (value) => value.startsWith("/cart") || value.startsWith("/checkout"),
      badge: cartQuantity
    },
    {
      href: isAuthenticated ? "/account" : "/login",
      label: "我的",
      icon: (active) => (
        <svg className={`h-5 w-5 ${active ? "text-[var(--brand-primary)]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      match: (value) => value.startsWith("/account") || value.startsWith("/orders") || value.startsWith("/login")
    }
  ];

  const showCheckoutAction =
    pathname.startsWith("/products/") || pathname.startsWith("/cart") || pathname.startsWith("/checkout") || pathname.startsWith("/orders/");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-light)] bg-white/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-3 py-2">
        <nav className="grid min-w-0 flex-1 grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-rose-50 to-orange-50 text-[var(--brand-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-gray-50"
                }`}
                href={item.href}
              >
                <div className="relative">
                  {item.icon(active)}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-1 text-[9px] font-bold text-white shadow-sm">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : null}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {showCheckoutAction ? (
          <Link
            className="btn-primary shrink-0 px-5 py-3 text-xs font-bold shadow-lg"
            href={pathname.startsWith("/products/") ? "/cart" : "/checkout-summary"}
          >
            {pathname.startsWith("/products/") ? "去购物车" : "去结算"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
