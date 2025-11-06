import { NextRequest, NextResponse } from "next/server";
import rawTextures from "./textures.json";

const textures = new Map<string, string>(Object.entries(rawTextures));

const missing = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAsSAAALEgHS3X78AAAAEElEQVQIHWNgYGD4D4UMDAAb8gP96WVavQAAAABJRU5ErkJggg==",
    "base64"
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
        return new NextResponse(missing, {
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
