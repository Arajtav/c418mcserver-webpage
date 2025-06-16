import { NextRequest, NextResponse } from "next/server";
import rawTextures from "./textures.json";

const textures = new Map<string, string>(
    Object.entries(rawTextures).map(([key, value]) => [key, value.texture])
);

export async function GET(request: NextRequest) {
    let t = request.nextUrl.searchParams.get("t");
    if (!t) {
        return new NextResponse("T cannot be empty", {
            status: 400,
        });
    }

    let texture = textures.get(t);
    if (!texture) {
        return new NextResponse(Buffer.from(textures.get("missing")!, "base64"), {
            status: 404,
            headers: {
                "Content-Type": "image/png",
            },
        });
    }

    return new NextResponse(Buffer.from(texture, "base64"), {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "max-age=31536000, immutable",
        },
    });
}
