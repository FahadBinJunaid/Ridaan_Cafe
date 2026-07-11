import Link from "next/link";
import HeroSection from "@/components/shared/hero-section";
import CategoryTiles from "@/components/shared/category-tiles";
import { supabase } from "@/lib/supabase/client";

type Category = {
  name: string;
  slug: string;
};

export default async function Home() {
  const { data: categories } = await supabase
    .from("categories")
    .select("name")
    .order("display_order");

  const categoryList: Category[] = (categories ?? []).map((c) => ({
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <>
      <header className="w-full border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-primary"
          >
            Rindaan Cafe &amp; Cuisine
          </Link>
          <nav aria-label="Main navigation">
            <Link
              href="/menu"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Full Menu
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <HeroSection />

        <CategoryTiles categories={categoryList} />

        <section
          aria-labelledby="contact-heading"
          className="border-t border-border bg-card px-4 py-12"
        >
          <div className="mx-auto max-w-lg text-center">
            <h2
              id="contact-heading"
              className="mb-6 text-2xl font-semibold text-foreground"
            >
              Contact &amp; Location
            </h2>
            <dl className="space-y-4 text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Restaurant</dt>
                <dd>[Restaurant Name — to be provided by client]</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Address</dt>
                <dd>[Full address — to be provided by client]</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Phone</dt>
                <dd>[Phone number — to be provided by client]</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Operating Hours</dt>
                <dd>[Operating hours — to be provided by client]</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Rindaan Cafe &amp; Cuisine
      </footer>
    </>
  );
}
