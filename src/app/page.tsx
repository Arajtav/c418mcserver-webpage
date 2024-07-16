"use client"

import { SaleDataT } from "@/types";
import { useEffect, useState } from "react";

function nicePriceString(price: number, quantity: number): string {
    return `${quantity % 64 ? quantity : quantity / 64}${quantity % 64 ? "" : quantity == 64 ? " stack" : " stacks"} for ${price} ${price == 1 ? "diamond" : "diamonds"}`;
}

function SaleEntry({s}: {s: SaleDataT}) {
    const [imgurl, setImgurl] = useState<string>("/missing.png");

    // TODO: OPTIMIZE THAT, WHY AM I EVEN USING API
    useEffect(() => {
        fetch(`/api/textures?t=${s.mcItemId}`).then((res) => res.text()).then((data) => {
            setImgurl(data);
        });
    }, []);

    return (
        <div className="w-full text-2xl flex flex-row h-16 bg-neutral-800/75 backdrop-blur-xl backdrop-saturate-150 items-center justify-between">
            <div className="h-full flex flex-row items-center w-1/3">
                <img alt="" className="aspect-square h-12 mx-2" src={imgurl} />
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
    const [sales, setSales] = useState<SaleDataT[]>([]);
    const [itemid, setItemid] = useState<string>("");
    const [seller, setSeller] = useState<string>("");

    // TODO: EXECUTE SOME TIME AFTER LAST INPUT EVENT, INSTEAD ON EVERY INPUT CHANGE
    useEffect(() => {
        let url: string = `/api/sales${seller + itemid == "" ? "" : "?"}${seller == "" ? "" : "seller=" + seller}${seller != "" && itemid != "" ? "&" : ""}${itemid == "" ? "" : "mcitem=" + itemid}`;
        fetch(url).then((res) => res.json()).then((data: SaleDataT[]) => {
            setSales(data.toSorted((a: SaleDataT, b: SaleDataT) => {
                // cheapest stuff first
                let pd: number = (b.quantity/b.price)-(a.quantity/a.price);
                if (pd != 0) { return pd; }
                // if price is the same for both items, return one which has lower quantity
                let gd: number = (a.quantity-b.quantity);
                if (gd != 0) { return gd; }
                // if items are literally the same mine are better hahahah (i mean, not the same because there is no test for location and mc item id but whatever)
                return a.shop.seller == "Arajtav" ? b.shop.seller == "Arajtav" ? 0 : -1 : 1;
            }));
        });
    }, [itemid, seller]);

    return (
        <div className="w-screen h-screen overflow-clip flex flex-row">
            <nav className="h-full w-72 bg-neutral-800/70 backdrop-blur-xl backdrop-saturate-150 flex flex-col justify-between drop-shadow-md">
                <div className="w-full flex items-center justify-center flex-col">
                    { /* TODO: FOCUS CSS ON THOSE */ }
                    <input type="text" placeholder="search by item id" className="p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setItemid(e.currentTarget.value)}} />
                    <input type="text" placeholder="search by seller"  className="p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setSeller(e.currentTarget.value)}} />
                </div>
            </nav>
            <main className="h-full flex-grow overflow-scroll p-8">
                {sales.map((sale, i) => {
                    return <SaleEntry s={sale} key={i} />;
                })}
            </main>
        </div>
    );
}