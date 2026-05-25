import Link from "next/link";

import { EmptyState } from "@/features/storefront/catalog/empty-state";
import { ProductCard } from "@/features/storefront/catalog/product-card";
import type { StorefrontProductCard } from "@/lib/storefront/types";

type StorefrontProductListProps = {
  title: string;
  products: StorefrontProductCard[];
  emptyDescription: string;
  page?: number;
  pageSize?: number;
  total?: number;
  buildPageHref?: (page: number) => string;
};

export function StorefrontProductList({
  title,
  products,
  emptyDescription,
  page = 1,
  pageSize = 12,
  total = products.length,
  buildPageHref
}: StorefrontProductListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-400 to-orange-400" />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
            共 {total} 件商品
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState description={emptyDescription} title="暂时没有可展示商品" />
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {buildPageHref ? (
            <div className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                第 <span className="font-bold text-[var(--text-primary)]">{page}</span> / {totalPages} 页
              </p>
              <div className="flex items-center gap-2">
                {canGoPrevious ? (
                  <Link
                    className="btn-secondary px-4 py-2 text-sm"
                    href={buildPageHref(page - 1)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    上一页
                  </Link>
                ) : (
                  <button className="btn-secondary btn-disabled px-4 py-2 text-sm" disabled>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    上一页
                  </button>
                )}
                <span className="px-2 text-sm text-[var(--text-hint)]">
                  {page} / {totalPages}
                </span>
                {canGoNext ? (
                  <Link
                    className="btn-primary px-4 py-2 text-sm"
                    href={buildPageHref(page + 1)}
                  >
                    下一页
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <button className="btn-primary btn-disabled px-4 py-2 text-sm" disabled>
                    下一页
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
