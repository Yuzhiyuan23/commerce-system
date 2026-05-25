import { describe, expect, it } from "vitest";

import { buildHomepageCategoryItems, HOMEPAGE_CATEGORY_NAMES } from "./homepage-categories";
import type { StorefrontCategory } from "@/lib/storefront/types";

describe("buildHomepageCategoryItems", () => {
  it("returns fixed homepage categories in approved order", () => {
    const categories: StorefrontCategory[] = [
      { id: 3, name: "服饰鞋包" },
      { id: 1, name: "手机数码" },
      { id: 2, name: "电脑办公" }
    ];

    const items = buildHomepageCategoryItems(categories);

    expect(items.map((item) => item.name)).toEqual(HOMEPAGE_CATEGORY_NAMES);
    expect(items[0]).toMatchObject({ name: "手机数码", href: "/categories/1", isFallback: false });
    expect(items[1]).toMatchObject({ name: "电脑办公", href: "/categories/2", isFallback: false });
    expect(items[3]).toMatchObject({ name: "服饰鞋包", href: "/categories/3", isFallback: false });
  });

  it("links unmatched fixed categories to search fallback", () => {
    const items = buildHomepageCategoryItems([{ id: 8, name: "运动户外" }]);

    expect(items[0]).toMatchObject({ name: "手机数码", href: "/search?keyword=%E6%89%8B%E6%9C%BA%E6%95%B0%E7%A0%81", isFallback: true });
    expect(items[7]).toMatchObject({ name: "运动户外", href: "/categories/8", isFallback: false });
  });
});
