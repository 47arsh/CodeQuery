import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

export async function middleware(request: NextRequest) {
    await Promise.all([
        getOrCreateDB(),
        getOrCreateStorage()
    ])
    return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", //this is a regex which implies to avoid these paths, however matcher matches and runs only where it matches!
  ],
};