"use client"

import { SaleDataT } from "@/types";
import { useEffect, useState } from "react";

function nicePriceString(price: number, quantity: number): string {
    return `${quantity % 64 ? quantity : quantity / 64}${quantity % 64 ? "" : quantity == 64 ? " stack" : " stacks"} for ${price} ${price == 1 ? "diamond" : "diamonds"}`;
}

function SaleEntry({s}: {s: SaleDataT}) {
    return (
        <div className="w-full text-md lg:text-lg xl:text-2xl flex flex-row h-16 bg-neutral-800/75 backdrop-blur-xl backdrop-saturate-150 items-center justify-between">
            <div className="h-full lg:w-1/3 flex flex-row items-center">
                <img alt="" className="aspect-square h-12 mx-2" src={`/api/textures/1.20.2?t=${s.mcItemId}`} />
                <div className="hidden md:block">{s.mcItemId}</div> { /* TODO: MAKE FIRST LETTERS OF WORDS UPPERCASE */ }
            </div>
            <div className="h-full w-1/3 flex-grow lg:flex-grow-0 flex flex-row items-center justify-center">
                {nicePriceString(s.price, s.quantity)}
            </div>
            <div className="h-full w-1/3 flex flex-row items-center justify-end pr-2">
                {`${s.shop.seller} at ${s.shop.location.x} ${s.shop.location.y} ${s.shop.location.z}`}
            </div>
        </div>
    );
}

export default function Home() {
    const [sales, setSales] = useState<SaleDataT[]>([]);
    const [itemid, setItemid] = useState<string>("");
    const [seller, setSeller] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(0);

    // TODO: EXECUTE SOME TIME AFTER LAST INPUT EVENT, INSTEAD ON EVERY INPUT CHANGE
    useEffect(() => {
        let url: string = `/api/sales${seller + itemid == "" ? "" : "?"}${seller == "" ? "" : "seller=" + seller}${seller != "" && itemid != "" ? "&" : ""}${itemid == "" ? "" : "mcitem=" + itemid}`;
        fetch(url).then((res) => res.json()).then((data: SaleDataT[]) => {
            // temporary variable is needed here, because accessing value after setSales() is still giving me old value
            let tmp: SaleDataT[] = data.toSorted((a: SaleDataT, b: SaleDataT) => {
                // cheapest stuff first
                let pd: number = (b.quantity/b.price)-(a.quantity/a.price);
                if (pd != 0) { return pd; }
                // if price is the same for both items, return one which has lower quantity
                let gd: number = (a.quantity-b.quantity);
                if (gd != 0) { return gd; }
                // if items are literally the same mine are better hahahah (i mean, not the same because there is no test for location and mc item id but whatever)
                return a.shop.seller == "Arajtav" ? b.shop.seller == "Arajtav" ? 0 : -1 : 1;
            });
            setSales(tmp);
            setMaxPrice(tmp.length == 0 ? 0 : tmp[tmp.length-1].price*64/tmp[tmp.length-1].quantity);
        });
    }, [itemid, seller]);

    let mx: number = sales.length == 0 ? 0 : sales[sales.length-1].price*64/sales[sales.length-1].quantity;
    let mi: number = sales.length == 0 ? 0 : sales[0].price*64/sales[0].quantity;

    return (
        <div className="w-screen h-screen overflow-clip flex flex-row portrait:flex-col">
            <nav className="h-full portrait:h-fit w-72 portrait:w-full bg-neutral-800/70 backdrop-blur-xl backdrop-saturate-150 flex flex-col justify-between drop-shadow-md">
                <div className="w-full flex items-center justify-center flex-col">
                    <input type="text" placeholder="search by item id" className="focus:outline-none p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setItemid(e.currentTarget.value)}} />
                    <input type="text" placeholder="search by seller"  className="focus:outline-none p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setSeller(e.currentTarget.value)}} />
                    <div className="w-full h-24 px-4 flex justify-center items-start text-2xl flex-col text-neutral-400">
                        <div>{`price per stack: ${maxPrice}`}</div>
                        <input id="ipm" type="range" className={`w-full drop-shadow-sm ${mi == mx ? "invisible" : ""}`} step="0.001" value={maxPrice <= mx ? maxPrice >= mi ? maxPrice : mi : mx} min={mi} max={mx} onInput={(e) => {setMaxPrice(Number(e.currentTarget.value))}} />
                    </div>
                </div>
            </nav>
            <main className="h-full flex-grow overflow-scroll p-2 md:p-4 lg:p-8">
                {sales.filter((sale) => {
                    return maxPrice == 0 || 64*sale.price/sale.quantity <= maxPrice;
                }).map((sale, i) => {
                    return <SaleEntry s={sale} key={i} />;
                })}
            </main>
        </div>
    );
}