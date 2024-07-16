import { NextRequest, NextResponse } from "next/server";
import { SaleDataT } from "@/types";

export async function GET(request: NextRequest) {
    // this will be fetched from database in future
    let sales: SaleDataT[] = [
        {mcItemId: "stone",     quantity: 2*64, price: 1, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
        {mcItemId: "calcite",   quantity: 2*64, price: 3, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
    ];

    // TODO: search by price, where price is quantity/price*64, so price per stack
    sales = sales.filter((s: SaleDataT) => {
        if (request.nextUrl.searchParams.has("mcitem") && s.mcItemId != request.nextUrl.searchParams.get("mcitem")) { return false; }
        if (request.nextUrl.searchParams.has("seller") && s.shop.seller != request.nextUrl.searchParams.get("seller")) { return false; }
        return true;
    });

    return new NextResponse(JSON.stringify(sales), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}