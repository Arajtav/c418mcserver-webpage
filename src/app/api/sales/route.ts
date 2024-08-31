import { NextRequest, NextResponse } from "next/server";
import { SaleDataT } from "@/types";
import { Database } from "@/sql";
import { createKysely } from '@vercel/postgres-kysely';

const db = createKysely<Database>();

export async function GET(request: NextRequest) {
    try {
        // pls tell me if i can avoid that remap somehow, while keeping ts types the same
        const result = await db.selectFrom('sales').selectAll().execute();
        const sales: SaleDataT[] = result.map(sale => {
            return {
                mcItemId: sale.mcItemId,
                quantity: sale.quantity,
                price:    sale.price,
                shop: {
                    seller: sale.shop_seller,
                    location: {
                        x: sale.shop_location_x,
                        y: sale.shop_location_y,
                        z: sale.shop_location_z,
                    },
                },
            };
        });

        return new NextResponse(JSON.stringify(sales), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=21600",
            }
        });
    } catch (error) {
        console.error("db fetch for sales failed");
        return new NextResponse("[]", {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}
