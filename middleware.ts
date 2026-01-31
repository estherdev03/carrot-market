import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  //Check if user request one of the public routes or not
  const pbRoute = publicUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!pbRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (pbRoute) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

//Restrict when to run middleware --> Run on every requests except one starts with _next/static, _next/image, favicon.ico
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
