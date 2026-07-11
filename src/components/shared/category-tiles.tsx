import Link from "next/link";

type Category = {
  name: string;
  slug: string;
};

export default function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="categories-heading" className="px-4 py-12">
      <h2
        id="categories-heading"
        className="mb-8 text-center text-2xl font-semibold text-foreground"
      >
        Explore Our Menu
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/menu#${cat.slug}`}
            className="flex items-center justify-center rounded-lg bg-secondary px-4 py-6 text-center font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
