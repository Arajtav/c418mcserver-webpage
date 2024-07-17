import { NextRequest, NextResponse } from "next/server";
import { SaleDataT } from "@/types";

export async function GET(request: NextRequest) {
    // this will be fetched from database in future
    let sales: SaleDataT[] = [
        {mcItemId: "stone",     quantity: 2*64, price: 1, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
        {mcItemId: "calcite",   quantity: 2*64, price: 3, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
        {mcItemId: "mud",       quantity: 4*64, price: 5, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}}
    ];

    return new NextResponse(JSON.stringify(sales), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}
