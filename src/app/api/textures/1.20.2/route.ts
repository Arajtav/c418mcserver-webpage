import { NextRequest, NextResponse } from "next/server";
import { textures } from "./textures";

export async function GET(request: NextRequest) {
    let t: string | null = request.nextUrl.searchParams.get("t");
    if (t === null || textures[t] === undefined) {
        return new NextResponse(Buffer.from(textures["missing"].texture, 'base64'), {
            status: 404,
            headers: {
                "Content-Type": "image/png",
            }
        });
    }

    return new NextResponse(Buffer.from(textures[t].texture, 'base64'), {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "max-age=31536000, immutable",
        }
    });
}
