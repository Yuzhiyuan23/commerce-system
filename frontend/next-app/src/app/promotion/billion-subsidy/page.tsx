import Link from "next/link";

import { HomeShortcut } from "@/features/storefront/catalog/home-shortcut";
import { ProductCard } from "@/features/storefront/catalog/product-card";
import { SearchForm } from "@/features/storefront/catalog/search-form";
import { getServerStorefrontProductsByTag } from "@/lib/storefront/server";

export default async function BillionSubsidyPage() {
  const result = await getServerStorefrontProductsByTag("百亿补贴", { pageSize: 24 });

  return (
    <main className="page-shell">
      <div className="page-stack">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <HomeShortcut />
          <SearchForm />
        </div>

        {/* Promotion Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-3xl">💎</span>
              <h1 className="text-2xl font-black md:text-3xl">百亿补贴</h1>
            </div>
            <p className="mt-2 text-sm font-medium text-white/90">爆款直降，品质保证，全场包邮</p>
          </div>
        </section>

        {/* Other Promotions Link */}
        <div className="flex gap-3">
          <Link
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-center text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
            href="/promotion/flash-sale"
          >
            ⚡ 限时秒杀
          </Link>
          <Link
            className="flex-1 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-center text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
            href="/promotion/official-goods"
          >
            ✨ 官方好货
          </Link>
        </div>

        {/* Products Grid */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-400 to-pink-400" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              补贴商品
              <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">共 {result.total} 件</span>
            </h2>
          </div>

          {result.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {result.items.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="surface-card border-dashed px-6 py-10 text-center">
              <p className="text-sm text-[var(--text-secondary)]">暂无百亿补贴商品</p>
              <Link className="btn-primary mt-4 inline-block px-5 py-2" href="/">
                返回首页
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
