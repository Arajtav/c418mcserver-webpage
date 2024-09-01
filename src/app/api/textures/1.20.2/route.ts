import { NextRequest, NextResponse } from "next/server";

const mcAssets = require("minecraft-assets")("1.20.2");

const dataTextureMissing = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAsSAAALEgHS3X78AAAAEElEQVQIHWNgYGD4D4UMDAAb8gP96WVavQAAAABJRU5ErkJggg==", 'base64');

export async function GET(request: NextRequest) {
    let t: string | null = request.nextUrl.searchParams.get("t");
    let tx;
    if (t === null || (tx = mcAssets.textureContent[t]) === undefined || tx === null || tx.texture === null) {
        return new NextResponse(dataTextureMissing, {
            status: 404,
            headers: {
                "Content-Type": "image/png",
            }
        });
    }

    let data: string = tx.texture.substr(22, mcAssets.textureContent[t].texture.length); // trim to only have base64 data of image

    return new NextResponse(Buffer.from(data, 'base64'), {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "max-age=31536000, immutable",
        }
    });
}
