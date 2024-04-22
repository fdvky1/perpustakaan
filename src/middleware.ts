// export { default } from "next-auth/middleware"
// import { withAuth } from "next-auth/middleware";
// import { NextRequest, NextResponse } from "next/server";
// function yourOwnMiddleware(request: NextRequest) {
//     return NextResponse.next()
// }
  
// export default withAuth(yourOwnMiddleware, {
//     callbacks: {
//         authorized: ({ token, req }) => {
//             if(["/user", "/category", "/api/user", "/api/stats"].includes(req.nextUrl.pathname) && token?.role == "user") return false
//             return req.nextUrl.pathname == "/" || !!token
//         }
//     }
// });
  
// export const config = {
//     matcher: ['/((?!sign-in|sign-up|api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)']
// }


import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.SECRET });

  if (!token && request.nextUrl.pathname != "/") return NextResponse.redirect(new URL("/sign-in", request.url));

  // Check the role and redirect based on the role
  switch (token.role) {
    case "operator":
      if (request.nextUrl.pathname.startsWith("/user") || request.nextUrl.pathname.startsWith("/api/user")) {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }
      break;
    case "user":
      if (
        request.nextUrl.pathname.startsWith("/user") ||
        request.nextUrl.pathname.startsWith("/api/user") ||
        request.nextUrl.pathname.startsWith("/category") ||
        request.nextUrl.pathname.startsWith("/api/category")
      ) {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }
      break;
    case "admin":
    break
    default:
      return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
    matcher: ['/((?!sign-in|sign-up|api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)']
}
