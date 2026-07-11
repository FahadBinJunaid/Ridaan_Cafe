type MenuItemCardProps = {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export default function MenuItemCard({
  name,
  description,
  price,
  imageUrl,
}: MenuItemCardProps) {
  return (
    <article className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} — food item`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
            🍽
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <p className="mt-2 font-bold text-primary">
          Rs. {price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
