import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Rindaan Cafe & Cuisine — authentic Pakistani Dhaba-style food in Karachi, Sindh.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        About Rindaan Cafe &amp; Cuisine
      </h1>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Our Story
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Founded with a passion for authentic Pakistani flavors, Rindaan Cafe
          &amp; Cuisine brings the rich culinary heritage of the Dhaba
          tradition to the heart of Karachi. Every dish is prepared fresh with
          time-honoured recipes, using quality ingredients and traditional
          cooking methods that have been passed down through generations. From
          sizzling barbeque to aromatic curries and freshly fried snacks, we
          invite you to experience the true taste of Pakistan — served warm,
          with a smile.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Whether you are dining with us or ordering delivery, our commitment
          remains the same: bold flavours, generous portions, and the warm
          hospitality that Pakistani Dhabas are known for.
        </p>
      </section>

      <section className="mb-12 grid gap-6 rounded-xl border border-border bg-card p-8 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">15+</p>
          <p className="mt-1 text-sm text-muted-foreground">Authentic Dishes</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">100%</p>
          <p className="mt-1 text-sm text-muted-foreground">Fresh Ingredients</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">COD</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cash on Delivery
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Visit Us
        </h2>
        <p className="text-muted-foreground">
          Gharib Shah Road, Chakiwara, Lyari, Karachi
        </p>
        <p className="mt-1 text-muted-foreground">
          Open daily: 7:00 PM to 3:00 AM
        </p>
      </section>
    </main>
  );
}
