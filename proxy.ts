import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isMerchantArea = path.startsWith("/merchant") &&
    path !== "/merchant/login" &&
    path !== "/merchant/signup";

  if (isMerchantArea && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/merchant/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  const isCustomerArea = path.startsWith("/account") &&
    path !== "/account/login" &&
    path !== "/account/signup";

  if (isCustomerArea && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  const isAdminArea = path.startsWith("/admin") && path !== "/admin/login";

  if (isAdminArea && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/merchant/:path*", "/account/:path*", "/admin/:path*"],
};
