import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Protege apenas /admin. Qualquer falha (env ausente, Supabase fora do ar)
 * redireciona para /login em vez de derrubar a rota — o resto do site
 * nunca passa por aqui (ver `matcher`).
 */
export async function middleware(request: NextRequest) {
  const toLogin = (error?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    if (error) url.searchParams.set("error", error);
    return NextResponse.redirect(url);
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return toLogin("config");

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email?.toLowerCase();
    if (!user || !email || !ADMIN_EMAILS.includes(email)) {
      return toLogin(user ? "not_admin" : undefined);
    }
  } catch (err) {
    console.error("middleware auth error:", err);
    return toLogin("auth");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
