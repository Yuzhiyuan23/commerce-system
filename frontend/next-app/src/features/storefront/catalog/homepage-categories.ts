import type { StorefrontCategory } from "@/lib/storefront/types";

export const HOMEPAGE_CATEGORY_NAMES = [
  "手机数码",
  "电脑办公",
  "家用电器",
  "服饰鞋包",
  "美妆护肤",
  "食品生鲜",
  "图书音像",
  "运动户外"
] as const;

export type HomepageCategoryName = (typeof HOMEPAGE_CATEGORY_NAMES)[number];

export type HomepageCategoryItem = {
  name: HomepageCategoryName;
  href: string;
  isFallback: boolean;
  categoryId?: number;
};

export function buildHomepageCategoryItems(categories: StorefrontCategory[]): HomepageCategoryItem[] {
  const categoriesByName = new Map(categories.map((category) => [category.name, category]));

  return HOMEPAGE_CATEGORY_NAMES.map((name) => {
    const category = categoriesByName.get(name);
    if (category) {
      return {
        name,
        href: `/categories/${category.id}`,
        isFallback: false,
        categoryId: category.id
      };
    }

    // 如果数据库中没有该分类，使用搜索链接
    return {
      name,
      href: searchHref(name),
      isFallback: true
    };
  });
}

function searchHref(keyword: string): string {
  return `/search?keyword=${encodeURIComponent(keyword)}`;
}
