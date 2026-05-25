import { BrowseEventLink } from "@/features/storefront/catalog/browse-event-link";
import { buildHomepageCategoryItems } from "@/features/storefront/catalog/homepage-categories";
import { STOREFRONT_BROWSE_EVENTS } from "@/lib/storefront/logging";
import type { StorefrontCategory } from "@/lib/storefront/types";

type CategoryDirectoryProps = {
  categories: StorefrontCategory[];
};

export function CategoryDirectory({ categories }: CategoryDirectoryProps) {
  const items = buildHomepageCategoryItems(categories);

  return (
    <section className="md:sticky md:top-28 md:self-start">
      {/* Desktop Category List */}
      <div className="hidden flex-col gap-3 rounded-xl border border-[var(--border-light)] bg-white p-3 shadow-[var(--shadow-sm)] md:flex">
        <div className="flex items-center gap-2 border-b border-[var(--border-light)] px-2 pb-2">
          <svg className="h-4 w-4 text-[var(--brand-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h2 className="text-sm font-bold text-[var(--text-primary)]">全部分类</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item, index) => (
            <CategoryLink className="min-h-10 px-3 py-2.5" index={index} item={item} key={item.name} />
          ))}
        </nav>
      </div>

      {/* Mobile Category List */}
      <div className="md:hidden">
        <div className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none]">
          <nav className="flex min-w-max gap-2">
            {items.map((item, index) => (
              <CategoryLink className="min-w-[90px] px-4 py-3" index={index} item={item} key={item.name} />
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

type CategoryLinkProps = {
  item: ReturnType<typeof buildHomepageCategoryItems>[number];
  className: string;
  index: number;
};

function CategoryLink({ item, className, index }: CategoryLinkProps) {
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
  const gradient = gradients[index % gradients.length];

  return (
    <BrowseEventLink
      className={`group relative flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-transparent bg-gradient-to-r from-gray-50 to-white text-sm font-semibold text-[var(--text-primary)] transition-all duration-300 hover:shadow-md ${className}`}
      eventName={STOREFRONT_BROWSE_EVENTS.categoryEnter}
      eventPayload={{ categoryId: item.categoryId ?? item.name, source: "category-directory" }}
      href={item.href}
    >
      {/* Left accent line */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

      <span className="truncate transition-colors group-hover:text-[var(--brand-primary)]">{item.name}</span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-[var(--text-hint)] transition-all group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-orange-500 group-hover:text-white">
        →
      </span>
    </BrowseEventLink>
  );
}
