export function Footer({ name, lastUpdated }: { name: string; lastUpdated: string }) {
  return (
    <footer className="border-t border-night-rule bg-night pb-24 pt-6 text-sm text-paper/60 md:pb-8">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-2 px-5 md:px-8">
        <p>
          &copy; {new Date().getFullYear()} {name}
        </p>
        {lastUpdated && <p>Last updated {lastUpdated}</p>}
      </div>
    </footer>
  );
}
