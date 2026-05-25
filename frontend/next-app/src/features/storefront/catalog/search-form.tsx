"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { recordBrowseEvent, STOREFRONT_BROWSE_EVENTS } from "@/lib/storefront/logging";

type SearchFormProps = {
  defaultKeyword?: string;
  className?: string;
};

export function SearchForm({ defaultKeyword = "", className }: SearchFormProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [isPending, setIsPending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      className={`w-full ${className ?? ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        const normalizedKeyword = keyword.trim();
        setIsPending(true);
        recordBrowseEvent(STOREFRONT_BROWSE_EVENTS.searchSubmit, {
          keyword: normalizedKeyword,
          source: "search-form"
        });
        startTransition(() => {
          router.push(normalizedKeyword ? `/search?keyword=${encodeURIComponent(normalizedKeyword)}` : "/search");
          setIsPending(false);
        });
      }}
    >
      <label
        className={`flex w-full items-center gap-2 rounded-full border bg-white px-4 py-2.5 transition-all duration-300 ${
          isFocused
            ? "border-[var(--brand-primary)] shadow-[0_0_0_3px_rgba(255,107,107,0.1)]"
            : "border-[var(--border-light)] shadow-[var(--shadow-sm)] hover:border-[var(--border-normal)]"
        }`}
      >
        <svg
          className={`h-5 w-5 transition-colors ${isFocused ? "text-[var(--brand-primary)]" : "text-[var(--text-hint)]"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-hint)]"
          onChange={(event) => setKeyword(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="搜索你想要的商品..."
          value={keyword}
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="rounded-full p-1 text-[var(--text-hint)] hover:bg-gray-100 hover:text-[var(--text-secondary)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          className={`btn-primary shrink-0 px-5 py-2 text-sm ${isPending ? "opacity-70" : ""}`}
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              搜索中
            </span>
          ) : (
            "搜索"
          )}
        </button>
      </label>
    </form>
  );
}
