import type { Metadata } from "next";
import HeroSection from "@/components/shared/hero-section";
import CategoryTiles from "@/components/shared/category-tiles";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Order authentic Pakistani Dhaba-style food from Rindaan Cafe & Cuisine in Karachi, Sindh. Freshly prepared, Cash on Delivery.",
};

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Rindaan Cafe & Cuisine",
    description:
      "Authentic Pakistani Dhaba-style food in Karachi, Sindh. Freshly prepared, Cash on Delivery.",
    servesCuisine: "Pakistani",
    address: {
      "@type": "PostalAddress",
      streetAddress: "[Full address — to be provided by client]",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    telephone: "[Phone number — to be provided by client]",
    openingHours: "[Operating hours — to be provided by client]",
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <footer className="w-full border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Rindaan Cafe &amp; Cuisine
      </footer>
    </main>
  );
}
