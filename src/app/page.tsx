"use client"

import { Sidebar } from "@/sidebar";
import { SaleDataT } from "@/types";
import { SetStateAction, useEffect, useState } from "react";
import { dist3d } from "./utils";

function nicePriceString(price: number, quantity: number): string {
    return `${quantity % 64 ? quantity : quantity / 64}${quantity % 64 ? "" : quantity == 64 ? " stack" : " stacks"} for ${price} ${price == 1 ? "diamond" : "diamonds"}`;
}

function SaleEntry({s, setItemid, setSeller}: {s: SaleDataT, setItemid: React.Dispatch<SetStateAction<string>>, setSeller: React.Dispatch<SetStateAction<string>>}) {
    function clickSeller() { setSeller(s.shop.seller); }
    function clickItem() { setItemid(s.mcItemId); }

    return (
        <div className="w-full text-base lg:text-lg xl:text-2xl flex flex-row h-16 bg-neutral-800/75 backdrop-blur-xl backdrop-saturate-150 items-center justify-between">
            <div className="h-full lg:w-1/3 flex flex-row items-center">
                <img alt="" className="cursor-pointer aspect-square h-12 mx-2" src={`/api/textures/1.20.2?t=${s.mcItemId}`} onClick={clickItem} />
                <div className="hidden md:block capitalize">{s.mcItemId.replaceAll("_", " ")}</div>
            </div>
            <div className="h-full w-1/3 flex-grow lg:flex-grow-0 flex flex-row items-center justify-center">
                {nicePriceString(s.price, s.quantity)}
            </div>
            <div className="h-full w-1/3 flex flex-row items-center justify-end pr-2">
                <span className="pr-2 cursor-pointer" onClick={clickSeller}>{s.shop.seller}</span>
                {`at ${s.shop.location.x} ${s.shop.location.y} ${s.shop.location.z}`}
            </div>
        </div>
    );
}

export default function Home() {
    const [sales, setSales] = useState<SaleDataT[]>([]);                                            // sales returned by fetch, because there is no reason to fetch on every change
    const [salesFiltered, setSalesFiltered] = useState<SaleDataT[]>([]);                            // sales filtred by seller, item id, and distance
    const [itemid, setItemid] = useState<string>("");                                               // mc item id from input
    const [seller, setSeller] = useState<string>("");                                               // seller from input
    const [maxPrice, setMaxPrice] = useState<number>(0);                                            // max price from input
    const [priceRange, setPricecRange] = useState<{min: number, max: number}>({min: 0, max: 0});    // min and max price in filtered sales
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);                               // for settings tab

    // all of this stuff is needed for config
    const [conf_sd, conf_setSd] = useState<number | null>(null);
    const [conf_lsd, conf_setLsd] = useState<boolean | null>(null);

    useEffect(() => {
        conf_setSd(Number(localStorage.getItem("sd")));
        conf_setLsd(localStorage.getItem("lsd") == "true");
        fetch("/api/sales").then((res) => res.json()).then((data: SaleDataT[]) => {
            setSales(data);
        })
    }, []);

    useEffect(() => { conf_sd !== null ? localStorage.setItem("sd", conf_sd.toString()) : null; }, [conf_sd]);
    useEffect(() => { conf_lsd !== null ? localStorage.setItem("lsd", String(conf_lsd)) : null; }, [conf_lsd]);

    useEffect(() => {
        let tmp: SaleDataT[] = sales.filter((sale) => {
            return  sale.shop.seller.includes(seller.trim()) &&                                                         // seller
                    (sale.mcItemId.includes(itemid.trim().replaceAll(" ", "_")) || sale.mcItemId.includes(itemid)) &&   // real or displayed item name
                    (itemid.trim().length == 0 && itemid.length != 0 ? sale.mcItemId.includes("_") : true) &&           // spaces, because without that typing single space would still display every item
                    (!conf_lsd || (conf_sd === null ? 0 : conf_sd) >= dist3d(sale.shop.location, {x: 0, y: 0, z: 0}));  // last check because expensive calc. conf_sd check should never happen because !null on conf_lsd is true, but who knows
                }).toSorted((a: SaleDataT, b: SaleDataT) => {
                // cheapest stuff first
                let pd: number = (b.quantity/b.price)-(a.quantity/a.price);
                if (pd != 0) { return pd; }
                // if price is the same for both items, return one which has lower quantity
                let gd: number = (a.quantity-b.quantity);
                if (gd != 0) { return gd; }
                // if items are literally the same mine are better hahahah (i mean, not the same because there is no test for location and mc item id but whatever)
                return a.shop.seller == "Arajtav" ? b.shop.seller == "Arajtav" ? 0 : -1 : 1;
        });
        setSalesFiltered(tmp);
        let lmx: number = tmp.length == 0 ? 0 : tmp[tmp.length-1].price*64/tmp[tmp.length-1].quantity;
        setPricecRange({
            min: tmp.length == 0 ? 0 : tmp[0].price*64/tmp[0].quantity,
            max: lmx,
        });

        setMaxPrice(maxPrice == 0 ? lmx : maxPrice);
    }, [itemid, seller, sales, conf_sd, conf_lsd]);

    return (
        <div className="w-screen h-screen overflow-clip flex flex-row portrait:flex-col">
            <Sidebar links={[{title: "SETTINGS", href: () => setSettingsOpen(!settingsOpen)}, {title: "CREDITS", href: "/credits"}]}>
                {settingsOpen ?
                    <>
                        <label className="p-4 w-full h-16 drop-shadow-sm text-2xl text-neutral-400">
                            limit search distance: <input type="checkbox" checked={conf_lsd !== null ? conf_lsd : false} onChange={(e) => {conf_setLsd(e.currentTarget.checked)}} />
                        </label>
                        <label className="p-4 w-full h-16 drop-shadow-sm text-2xl text-neutral-400">
                            search distance: <input className="w-20 bg-transparent" type="number" min="0" value={conf_sd !== null ? conf_sd : 0} onInput={(e) => {conf_setSd(Number(e.currentTarget.value))}} />
                        </label>
                    </>
                    :
                    <>
                        <input type="text" value={itemid} placeholder="search by item id" className="search-item focus:outline-none p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setItemid(e.currentTarget.value)}} />
                        <input type="text" value={seller} placeholder="search by seller"  className="search-sell focus:outline-none p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-sm text-2xl" onInput={(e) => {setSeller(e.currentTarget.value)}} />
                        <div className="w-full h-24 px-4 flex justify-center items-start text-2xl flex-col text-neutral-400">
                            <div>{`max stack price: ${maxPrice <= priceRange.max ? maxPrice >= priceRange.min ? maxPrice : priceRange.min : priceRange.max}`}</div>
                            <input id="ipm" type="range" className={`w-full drop-shadow-sm accent-neutral-400 hover:accent-neutral-300 focus:outline-none focus:accent-neutral-300 ${priceRange.min == priceRange.max ? "invisible" : ""}`} step="0.001" value={maxPrice <= priceRange.max ? maxPrice >= priceRange.min ? maxPrice : priceRange.min : priceRange.max} min={priceRange.min} max={priceRange.max} onInput={(e) => {setMaxPrice(Number(e.currentTarget.value))}} />
                        </div>
                    </>
                }
            </Sidebar>
            <main className="h-full flex-grow overflow-scroll portrait:p-2 p-2 md:p-4 lg:p-8">
                {salesFiltered.filter((sale) => {
                    let tmp = maxPrice <= priceRange.max ? maxPrice >= priceRange.min ? maxPrice : priceRange.min : priceRange.max;
                    return (tmp == 0 || 64*sale.price/sale.quantity <= tmp);
                }).map((sale, i) => {
                    return <SaleEntry s={sale} key={i} setItemid={setItemid} setSeller={setSeller}/>;
                })}
            </main>
        </div>
    );
}