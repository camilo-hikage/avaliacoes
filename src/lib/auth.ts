import { createClient } from "@/lib/supabase/server";

function adminList(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Retorna o usuário logado se ele estiver na lista ADMIN_EMAILS, senão null. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;
  return adminList().includes(user.email.toLowerCase()) ? user : null;
}

export function isAdminEmail(email: string | null | undefined) {
  return !!email && adminList().includes(email.toLowerCase());
}
