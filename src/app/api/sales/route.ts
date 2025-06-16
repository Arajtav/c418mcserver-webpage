import { NextResponse } from "next/server";
import { SaleDataT } from "@/types";
import { Database } from "@/sql";
import { createKysely } from "@vercel/postgres-kysely";
import { nestObject } from "@/app/utils";

export const revalidate = 3600;

const db = createKysely<Database>();

export async function GET() {
    let sales: SaleDataT[];
    try {
        const result = await db.selectFrom("sales").selectAll().execute();
        sales = result.map(sale => nestObject(sale) as SaleDataT);
    } catch (error) {
        console.error("db fetch for sales failed");
        return new NextResponse("[]", {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return new NextResponse(JSON.stringify(sales), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": `max-age=${revalidate}`,
        },
    });
}
