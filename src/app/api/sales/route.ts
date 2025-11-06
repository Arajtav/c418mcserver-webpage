import { NextResponse } from "next/server";
import { SaleDataT } from "@/types";
import { Database } from "@/sql";
import { createKysely } from "@vercel/postgres-kysely";
import { nestObject } from "@/app/utils";

export const revalidate = 3600;

const db = createKysely<Database>();

export async function GET() {
    try {
        const result = await db.selectFrom("sales").selectAll().execute();
        return NextResponse.json(
            result.map(sale => nestObject(sale) as SaleDataT),
            {
                status: 200,
                headers: {
                    "Cache-Control": `max-age=${revalidate}`,
                },
            }
        );
    } catch (error) {
        console.error("db fetch for sales failed");
    }

    return NextResponse.json([], { status: 500 });
}
