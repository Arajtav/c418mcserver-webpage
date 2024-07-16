"use client"

import { SaleDataT } from "@/types";

function nicePriceString(price: number, quantity: number): string {
    return `${quantity % 64 ? quantity : quantity / 64}${quantity % 64 ? "" : quantity == 64 ? " stack" : " stacks"} for ${price} ${price == 1 ? "diamond" : "diamonds"}`;
}

function SaleEntry({s}: {s: SaleDataT}) {
    return (
        <div className="w-full text-2xl flex flex-row h-16 bg-neutral-800/75 backdrop-blur-xl backdrop-saturate-150 items-center justify-between">
            <div className="h-full flex flex-row items-center w-1/3">
                <div className="aspect-square h-12 border mx-2"></div> { /* this will be image of sold item */ }
                <div>{s.mcItemId}</div> { /* TODO: MAKE FIRST LETTERS OF WORDS UPPERCASE */ }
            </div>
            <div className="h-full w-1/3 flex flex-row items-center justify-center">
                {nicePriceString(s.price, s.quantity)}
            </div>
            <div className="h-full w-1/3 flex flex-row items-center justify-end pr-2">
                {`${s.shop.seller} at ${s.shop.location.x} ${s.shop.location.y} ${s.shop.location.z}`}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <></>
    );
}
