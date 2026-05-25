import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { CategoryDirectory } from "@/features/storefront/catalog/category-list";
import { ProductCard } from "@/features/storefront/catalog/product-card";
import { StorefrontProductList } from "@/features/storefront/catalog/product-list";
import { SearchForm } from "@/features/storefront/catalog/search-form";
import { getSessionUser } from "@/lib/auth/server";
import {
  getServerStorefrontCategories,
  getServerStorefrontProducts,
  getServerStorefrontRecommendations
} from "@/lib/storefront/server";

export default async function HomePage() {
  const user = await getSessionUser();
  const [categories, products, recommendations] = await Promise.all([
    getServerStorefrontCategories(),
    getServerStorefrontProducts({ pageSize: 12 }),
    getServerStorefrontRecommendations({ type: "home", n: 10 })
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg-page)] pb-24">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-light)] bg-white/80 px-3 py-3 backdrop-blur-xl md:px-4">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link className="shrink-0 text-xl font-black tracking-tight" href="/" style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              优选购
            </Link>
            <SearchForm className="min-w-0 flex-1" />
          </div>
          <AccountQuickLinks user={user} />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-3 py-4 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-5 md:px-4">
        <CategoryDirectory categories={categories} />

        <section className="flex min-w-0 flex-col gap-4">
          {/* Modern Hero Banner */}
          <section className="gradient-border-card relative overflow-hidden p-[1px]">
            <div className="relative rounded-[15px] bg-[linear-gradient(135deg,#ff6b6b_0%,#ff8e53_50%,#4ecdc4_100%)] px-5 py-6 text-white md:px-8 md:py-8">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">百亿补贴</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">今日爆款</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight md:text-4xl">发现好物</h1>
                  <p className="max-w-md text-sm font-medium text-white/90">精选好物，品质保证。限时优惠，越逛越划算。</p>
                </div>
                <Link className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#ff6b6b] shadow-lg transition-all hover:shadow-xl hover:scale-105" href="/products">
                  立即探索
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Modern Quick Actions - 链接到营销活动页面 */}
          <section className="grid grid-cols-3 gap-3">
            <ModernOperationCard
              href="/promotion/flash-sale"
              icon="⚡"
              title="限时秒杀"
              desc="爆款手机"
              subDesc="立省500"
              gradient="from-amber-400 to-orange-500"
            />
            <ModernOperationCard
              href="/promotion/billion-subsidy"
              icon="💎"
              title="百亿补贴"
              desc="家用电器"
              subDesc="低至5折"
              gradient="from-rose-400 to-pink-500"
            />
            <ModernOperationCard
              href="/promotion/official-goods"
              icon="✨"
              title="官方好货"
              desc="潮流服饰"
              subDesc="品质保证"
              gradient="from-teal-400 to-cyan-500"
            />
          </section>

          {/* Recommendations */}
          {recommendations.length > 0 ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="chip-badge">HOT</span>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">热门推荐</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {recommendations.slice(0, 8).map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Category Quick Filter */}
          <CategoryQuickFilter categories={categories} />

          {/* Products Grid - 猜你喜欢显示所有商品，确保与分类关联 */}
          {products.items.length > 0 ? (
            <StorefrontProductList
              emptyDescription="当前还没有可展示的首页商品。"
              page={products.page}
              pageSize={products.pageSize}
              products={products.items}
              title="猜你喜欢"
              total={products.total}
            />
          ) : (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-400 to-orange-400" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">猜你喜欢</h2>
              </div>
              <div className="surface-card border-dashed px-6 py-10 text-center">
                <p className="text-sm text-[var(--text-secondary)]">商品加载中...</p>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

type AccountQuickLinksProps = {
  user: Awaited<ReturnType<typeof getSessionUser>>;
};

function AccountQuickLinks({ user }: AccountQuickLinksProps) {
  if (user) {
    return (
      <nav className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
        <span className="mr-1 text-[var(--text-secondary)]">
          欢迎回来，<span className="font-semibold text-[var(--brand-primary)]">{user.nickname}</span>
        </span>
        <div className="flex items-center gap-1">
          <Link className="rounded-full px-3 py-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--text-primary)]" href="/account">
            我的账户
          </Link>
          <Link className="rounded-full px-3 py-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--text-primary)]" href="/orders">
            我的订单
          </Link>
          <Link className="rounded-full px-3 py-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:bg-gray-100 hover:text-[var(--text-primary)]" href="/cart">
            购物车
          </Link>
          <Link className="rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-3 py-1.5 font-medium text-[var(--brand-primary)] transition-colors hover:from-rose-100 hover:to-orange-100" href="/admin">
            后台管理
          </Link>
          <LogoutButton className="ml-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs md:text-sm">
      <Link className="rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-1.5 font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105" href="/login">
        登录
      </Link>
      <Link className="rounded-full px-4 py-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:bg-gray-100" href="/register"
      >
        注册
      </Link>
      <Link className="rounded-full px-4 py-1.5 font-medium text-[var(--text-secondary)] transition-colors hover:bg-gray-100" href="/search">
        搜索
      </Link>
    </nav>
  );
}

type CategoryQuickFilterProps = {
  categories: { id: number; name: string }[];
};

function CategoryQuickFilter({ categories }: CategoryQuickFilterProps) {
  if (categories.length === 0) return null;

  const gradients = [
    "from-rose-400 to-orange-400",
    "from-orange-400 to-amber-400",
    "from-amber-400 to-yellow-400",
    "from-emerald-400 to-teal-400",
    "from-cyan-400 to-blue-400",
    "from-blue-400 to-indigo-400",
    "from-violet-400 to-purple-400",
    "from-pink-400 to-rose-400"
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-400 to-orange-400" />
        <h2 className="text-sm font-bold text-[var(--text-primary)]">热门分类</h2>
      </div>
      <div className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none]">
        <div className="flex min-w-max gap-2">
          {categories.slice(0, 8).map((category, index) => (
            <Link
              key={category.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:shadow-md"
              href={`/categories/${category.id}`}
            >
              <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradients[index % gradients.length]}`} />
              <span className="pl-2 transition-colors group-hover:text-[var(--brand-primary)]">{category.name}</span>
            </Link>
          ))}
          <Link
            className="group flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 text-sm font-semibold text-[var(--brand-primary)] shadow-sm transition-all hover:shadow-md"
            href="/categories"
          >
            全部分类
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

type ModernOperationCardProps = {
  href: string;
  icon: string;
  title: string;
  desc: string;
  subDesc?: string;
  gradient: string;
};

function ModernOperationCard({ href, icon, title, desc, subDesc, gradient }: ModernOperationCardProps) {
  return (
    <Link className="group surface-card overflow-hidden" href={href}>
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
      <div className="flex flex-col items-center p-4 text-center">
        <span className="mb-2 text-2xl transition-transform group-hover:scale-110">{icon}</span>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{desc}</p>
        {subDesc ? (
          <span className="mt-1 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#ff6b6b]">
            {subDesc}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
