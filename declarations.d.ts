declare module "next/server" {
  export class NextRequest extends Request {
    readonly ip?: string;
    readonly geo?: any;
    nextUrl: URL;
    cookies: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(): NextResponse;
  }
}

declare module "next/server.js" {
  export * from "next/server";
}

declare module "next/types.js" {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  export type Metadata = any;
  export type Viewport = any;
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}
