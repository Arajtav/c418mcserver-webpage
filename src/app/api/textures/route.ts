// TODO: THIS IS BAD, EITHER MAKE IT RETURN REAL IMAGE INSTEAD URL TO IMAGE/BASE64 ENCODED PNG

import { NextRequest, NextResponse } from "next/server";

const mcAssets = require("minecraft-assets")("1.20.2");

export async function GET(request: NextRequest) {
    let tmp: string | null = request.nextUrl.searchParams.get("t");
    let texture: any | undefined = mcAssets.textureContent[tmp === null ? "missing" : tmp];

    return new NextResponse(texture === undefined ? "/missing.png" : texture.texture, {
        status: texture === undefined ? 404 : 200,
        headers: {
            "Content-Type": "plain",
        }
    });
}