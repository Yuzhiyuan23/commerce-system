"use client";

import { useRouter } from "next/navigation";

const tagMap: Record<string, string> = {
  "百亿补贴": "/promotion/billion-subsidy",
  "限时秒杀": "/promotion/flash-sale",
  "官方好货": "/promotion/official-goods"
};

type ProductTagProps = {
  tag: string;
};

export function ProductTag({ tag }: ProductTagProps) {
  const router = useRouter();
  const tagHref = tagMap[tag];

  if (!tagHref) {
    return (
      <span className="rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#ff6b6b] ring-1 ring-rose-100">
        {tag}
      </span>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(tagHref);
  };

  return (
    <button
      className="rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#ff6b6b] ring-1 ring-rose-100 transition-colors hover:from-rose-100 hover:to-orange-100"
      onClick={handleClick}
      type="button"
    >
      {tag}
    </button>
  );
}
