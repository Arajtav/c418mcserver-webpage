import { NextRequest, NextResponse } from "next/server";
import { SaleDataT } from "@/types";

export async function GET(request: NextRequest) {
    // this will be fetched from database in future
    let sales: SaleDataT[] = [
        {mcItemId: "stone",     quantity: 2*64, price: 1, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
        {mcItemId: "calcite",   quantity: 2*64, price: 3, shop: {seller: "Arajtav", location: {x: 0, y: 0, z: 0}}},
    ];

    // There is no search by price, because this will be done on client side, so ui can have slider with price range
    sales = sales.filter((s: SaleDataT) => {
        // ts moment
        let tmp: string | null;
        tmp = request.nextUrl.searchParams.get("mcitem");
        if (tmp != null && !s.mcItemId.includes(tmp.toLowerCase())) { return false; }
        tmp = request.nextUrl.searchParams.get("seller");
        if (tmp != null && !s.shop.seller.toLowerCase().includes(tmp.toLowerCase())) { return false; }
        return true;
    });

    return new NextResponse(JSON.stringify(sales), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
}