import { BrowseEventLink } from "@/features/storefront/catalog/browse-event-link";
import { buildProductCardViewModel } from "@/features/storefront/catalog/product-card-view-model";
import { ProductTag } from "@/features/storefront/catalog/product-tag";
import { STOREFRONT_BROWSE_EVENTS } from "@/lib/storefront/logging";
import type { StorefrontProductCard } from "@/lib/storefront/types";

type ProductCardProps = {
  product: StorefrontProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  const view = buildProductCardViewModel(product);

  return (
    <BrowseEventLink
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
      eventName={STOREFRONT_BROWSE_EVENTS.productClick}
      eventPayload={{ categoryId: product.categoryId, productId: product.id, source: "product-list-card" }}
      href={`/products/${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {product.coverImageUrl ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            src={product.coverImageUrl}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-[var(--text-hint)]">
            <svg className="h-10 w-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            暂无图片
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Tags */}
        <div className="flex min-h-5 flex-wrap gap-1 overflow-hidden">
          {view.tags.slice(0, 2).map((tag) => (
            <ProductTag key={tag} tag={tag} />
          ))}
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-[40px] text-[13px] font-semibold leading-5 text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand-primary)]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex min-w-0 items-end gap-2">
          {product.salePrice ? (
            <>
              <p className="min-w-0 leading-none" style={{ fontFamily: "var(--font-price)" }}>
                <span className="text-xs font-bold text-[var(--price)]">¥</span>
                <span className="text-xl font-extrabold tracking-tight text-[var(--price)]">{view.price}</span>
              </p>
              {view.originalPrice ? (
                <span className="mb-0.5 text-xs text-[var(--price-strike)] line-through">¥{view.originalPrice}</span>
              ) : null}
            </>
          ) : (
            <p className="price-tag text-lg">{view.price}</p>
          )}
        </div>

        {/* Footer info */}
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--text-hint)]">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate font-medium">{view.shopName}</span>
          <span className="text-[var(--border-normal)]">·</span>
          <span>{view.sales}</span>
        </div>
      </div>
    </BrowseEventLink>
  );
}
