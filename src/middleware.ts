export { default } from "next-auth/middleware"

export const config = {
    matcher: ['/((?!sign-in|sign-up|api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)']
}