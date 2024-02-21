// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
function yourOwnMiddleware(request: NextRequest) {
    return NextResponse.next()
}
  
export default withAuth(yourOwnMiddleware);
  
export const config = {
    matcher: ['/((?!sign-in|sign-up|api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)']
}