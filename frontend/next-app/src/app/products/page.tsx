import { HomeShortcut } from "@/features/storefront/catalog/home-shortcut";
import { SearchForm } from "@/features/storefront/catalog/search-form";
import { StorefrontProductList } from "@/features/storefront/catalog/product-list";
import { getServerStorefrontProducts } from "@/lib/storefront/server";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? "1");
  const result = await getServerStorefrontProducts({
    page: Number.isNaN(currentPage) ? 1 : currentPage
  });

  return (
    <main className="page-shell">
      <div className="page-stack">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <HomeShortcut />
          <SearchForm />
        </div>
        <StorefrontProductList
          buildPageHref={(nextPage) => `/products?page=${nextPage}`}
          emptyDescription="暂无商品，敬请期待。"
          page={result.page}
          pageSize={result.pageSize}
          products={result.items}
          total={result.total}
          title="全部商品"
        />
      </div>
    </main>
  );
}
