import Link from "next/link";
import { portfolio } from "@/lib/portfolio";

export default function NotFound() {
  return (
    <main className="paper-grid grid min-h-[100svh] place-items-center px-5">
      <div className="max-w-md">
        <p className="font-display text-8xl font-extrabold leading-none">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">This page doesn&apos;t exist.</h1>
        <p className="mt-3 text-muted">The link may be old or mistyped. Head back to {portfolio.personal.shortName}&apos;s portfolio.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-ink px-5 font-medium text-paper hover:bg-blue">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
