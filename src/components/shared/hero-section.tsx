import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#4A2C17] via-[#6B4226] to-[#8B5E3C] px-4 py-24 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,242,223,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,184,150,0.06),transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium tracking-widest uppercase text-[#D4B896]">
          Authentic Pakistani Dhaba
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Rindaan Cafe &amp; Cuisine
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#FFF2DF] sm:text-xl">
          Freshly prepared Pakistani flavors in Karachi, Sindh — Cash on
          Delivery
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/menu"
            className="rounded-lg bg-[#D4A86A] px-8 py-3 text-base font-semibold text-[#3A1F0D] transition-all hover:bg-[#E0B87A] hover:shadow-lg hover:shadow-[#D4A86A]/30"
          >
            Explore Menu
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-[#FFF2DF]/30 px-8 py-3 text-base font-semibold text-[#FFF2DF] transition-all hover:border-[#FFF2DF]/60 hover:bg-white/5"
          >
            About Us
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
