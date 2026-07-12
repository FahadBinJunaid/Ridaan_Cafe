import type { Metadata } from "next";
import Link from "next/link";
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
      streetAddress: "Gharib Shah Road, Chakiwara, Lyari",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    telephone: "03260701111",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday", "Sunday",
      ],
      opens: "19:00",
      closes: "03:00",
    },
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
        <div className="mx-auto max-w-4xl">
          <h2
            id="contact-heading"
            className="mb-8 text-center text-2xl font-semibold text-foreground"
          >
            Contact &amp; Location
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Restaurant</dt>
                <dd>Rindaan Cafe &amp; Cuisine</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Address</dt>
                <dd>Gharib Shah Road, Chakiwara, Lyari, Karachi</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Phone</dt>
                <dd>
                  <a
                    href="tel:03260701111"
                    className="text-primary hover:underline"
                  >
                    03260701111
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">
                  Operating Hours
                </dt>
                <dd>7:00 PM to 3:00 AM — All 7 days</dd>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                About Us
              </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <iframe
                title="Rindaan Cafe location on Google Maps"
                src="https://www.google.com/maps?q=Gharib+Shah+Road+Chakiwara+Lyari+Karachi&output=embed"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Rindaan Cafe &amp; Cuisine
      </footer>
    </main>
  );
}
