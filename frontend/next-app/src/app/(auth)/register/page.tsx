"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { registerWithEmail } from "@/lib/auth/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SALES">("CUSTOMER");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await registerWithEmail({ email, password, nickname, role });
        router.replace(`/login?email=${encodeURIComponent(email)}`);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "注册失败");
      }
    });
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-[32px] border border-black/10 bg-[var(--surface)] p-8 shadow-[0_20px_60px_rgba(74,42,18,0.08)] md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="space-y-4">
          <span className="w-fit rounded-full bg-[var(--accent)] px-4 py-1 text-sm font-semibold text-white">
            Register
          </span>
          <h1 className="text-4xl font-bold tracking-tight">{role === "SALES" ? "注册成为商家" : "创建一个顾客账号"}</h1>
          <p className="max-w-xl text-base leading-7 text-black/70">
            {role === "SALES"
              ? "注册成为商家后，您可以管理商品目录、修改商品信息、监控销售状态。"
              : "注册成功后会创建 CUSTOMER 默认角色。当前版本会带你回到登录页，由你显式完成首次登录。"}
          </p>
          {role === "SALES" && (
            <div className="rounded-[24px] border border-[var(--accent)]/15 bg-white/70 p-5 text-sm leading-6 text-black/65">
              <p className="font-medium text-[var(--foreground)]">商家功能：</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>商品目录管理（添加/删除商品类别）</li>
                <li>商品信息修改（价格、库存）</li>
                <li>销售状态监控</li>
                <li>用户浏览/购买日志记录</li>
              </ul>
            </div>
          )}
        </div>

        <form className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(29,20,13,0.08)]" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">注册类型</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  role === "CUSTOMER"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-black/10 bg-[#fffaf5] text-black/70 hover:border-[var(--accent)]/50"
                }`}
              >
                顾客
              </button>
              <button
                type="button"
                onClick={() => setRole("SALES")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  role === "SALES"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-black/10 bg-[#fffaf5] text-black/70 hover:border-[var(--accent)]/50"
                }`}
              >
                商家
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium">
            邮箱
            <input
              className="rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            昵称
            <input
              className="rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            密码
            <input
              className="rounded-2xl border border-black/10 bg-[#fffaf5] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            className="rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "注册中..." : "注册"}
          </button>

          <p className="text-sm text-black/65">
            已有账号？{" "}
            <Link className="font-semibold text-[var(--accent)]" href="/login">
              去登录
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
