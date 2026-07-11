import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type StaffUser = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export async function requireStaff(): Promise<StaffUser> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Unauthorized");

  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (!profile || !["staff", "admin"].includes(profile.role)) {
    throw new Error("Forbidden");
  }

  return {
    id: user.id,
    email: user.email,
    role: profile.role,
    name: profile.name,
  };
}
