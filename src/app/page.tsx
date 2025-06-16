"use client";

import { Sidebar } from "@/sidebar";
import { SaleDataT } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { clip, dist3d, formatPriceString, formatShopLocation, pricePerStack } from "./utils";

function SaleEntry({
    sale,
    setItemId,
    setSeller,
}: {
    sale: SaleDataT;
    setItemId: Dispatch<SetStateAction<string>>;
    setSeller: Dispatch<SetStateAction<string>>;
}) {
    return (
        <div className="w-full text-base lg:text-lg xl:text-2xl flex flex-row h-16 glass items-center justify-between">
            <div className="h-full lg:w-1/3 flex flex-row items-center">
                <img
                    alt=""
                    className="cursor-pointer h-12 w-12 mx-2"
                    src={`/api/textures/1.20.2?t=${sale.mcItemId}`}
                    onClick={() => {
                        setItemId(sale.mcItemId);
                    }}
                />
                <div className="hidden md:block capitalize">
                    {sale.mcItemId.replaceAll("_", " ")}
                </div>
            </div>
            <div className="h-full w-1/3 grow lg:grow-0 flex flex-row items-center justify-center">
                {formatPriceString(sale.price, sale.quantity)}
            </div>
            <div className="h-full w-1/3 flex flex-row items-center justify-end pr-2">
                <span
                    className="pr-2 cursor-pointer"
                    onClick={() => {
                        setSeller(sale.shop.seller);
                    }}
                >
                    {sale.shop.seller}
                </span>
                {formatShopLocation(sale.shop.location)}
            </div>
        </div>
    );
}

export default function Home() {
    // Fetched sales.
    const [sales, setSales] = useState<SaleDataT[]>([]);
    // Filtered sales (except for the price).
    const [salesFiltered, setSalesFiltered] = useState<SaleDataT[]>([]);
    // Item id from the input.
    const [itemId, setItemId] = useState<string>("");
    // Seller from the input.
    const [seller, setSeller] = useState<string>("");
    // Max price from the input.
    const [maxPrice, setMaxPrice] = useState<number>(0);
    // Min and max price in the filtered sales.
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
    // Whether the settings tab is open.
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    // The persistent config from the settings tab.
    const [searchDistance, setSearchDistance] = useState<number | null>(null);
    const [limitByDistance, setLimitByDistance] = useState<boolean | null>(null);
    const [sellerBlacklist, setSellerBlacklist] = useState<string | null>(null);

    // Read the settings, fetch the sales.
    useEffect(() => {
        setSearchDistance(Number(localStorage.getItem("search_distance")));
        setLimitByDistance(localStorage.getItem("limit_by_distance") == "true");
        setSellerBlacklist(localStorage.getItem("sellers_blacklist"));
        fetch("/api/sales")
            .then(res => res.json())
            .then((data: SaleDataT[]) => {
                setSales(data);
            });
    }, []);

    // Save the settings on changes.
    useEffect(() => {
        searchDistance !== null
            ? localStorage.setItem("search_distance", searchDistance.toString())
            : null;
    }, [searchDistance]);
    useEffect(() => {
        limitByDistance !== null
            ? localStorage.setItem("limit_by_distance", String(limitByDistance))
            : null;
    }, [limitByDistance]);
    useEffect(() => {
        sellerBlacklist !== null
            ? localStorage.setItem("sellers_blacklist", sellerBlacklist)
            : null;
    }, [sellerBlacklist]);

    // Filter the sales.
    useEffect(() => {
        let filtered: SaleDataT[] = sales
            // TODO: free stuff breaks the code.
            .filter(sale => sale.price >= 0)
            // Block sellers from the blacklist.
            .filter(sale => {
                if (!sellerBlacklist) return true;
                return !sellerBlacklist
                    .split(";")
                    .map(s => s.trim())
                    .includes(sale.shop.seller);
            })
            // Show only searched sellers.
            .filter(sale => {
                const sellers = seller
                    .split(";")
                    .map(s => s.trim())
                    .filter(Boolean);
                if (!sellers.length) return true;

                return sellers.some(s => sale.shop.seller.includes(s));
            })
            // Show only searched items.
            .filter(sale => {
                if (!itemId.trim()) return true;

                return itemId
                    .split(";")
                    .map(s => s.trim())
                    .filter(Boolean)
                    .some(s => {
                        return (
                            sale.mcItemId.includes(s.replaceAll(" ", "_")) ||
                            sale.mcItemId.includes(s)
                        );
                    });
            })
            // Whitespace search.
            .filter(sale => {
                if (itemId.trim()) return true;
                if (!itemId) return true;
                return sale.mcItemId.includes("_");
            })
            // Limit by search distance when enabled and when search distance is greater than 0.
            .filter(
                sale =>
                    !limitByDistance ||
                    !searchDistance ||
                    searchDistance >= dist3d(sale.shop.location, { x: 0, y: 0, z: 0 })
            )
            .toSorted((a: SaleDataT, b: SaleDataT) => {
                // Cheapest stuff first.
                const priceDifference = pricePerStack(a) - pricePerStack(b);
                if (priceDifference) return priceDifference;

                // Lower quantity first.
                const quantityDifference: number = a.quantity - b.quantity;
                if (quantityDifference) return quantityDifference;

                // Older entries first.
                return a.rid - b.rid;
            });
        setSalesFiltered(filtered);
        const min = filtered.length ? pricePerStack(filtered[0]) : 0;
        const max = filtered.length ? pricePerStack(filtered[filtered.length - 1]) : 0;
        setPriceRange({ min, max });

        setMaxPrice(maxPrice || max);
    }, [itemId, seller, sales, searchDistance, limitByDistance, sellerBlacklist]);

    return (
        <div className="w-screen h-screen overflow-clip flex flex-row portrait:flex-col">
            <Sidebar
                links={[
                    { title: "SETTINGS", href: () => setSettingsOpen(!settingsOpen) },
                    { title: "CREDITS", href: "/credits" },
                ]}
            >
                {settingsOpen ? (
                    <Settings
                        limitByDistance={limitByDistance}
                        setLimitByDistance={setLimitByDistance}
                        searchDistance={searchDistance}
                        setSearchDistance={setSearchDistance}
                        sellerBlacklist={sellerBlacklist}
                        setSellerBlacklist={setSellerBlacklist}
                    />
                ) : (
                    <SearchBar
                        itemId={itemId}
                        setItemid={setItemId}
                        seller={seller}
                        setSeller={setSeller}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                    />
                )}
            </Sidebar>
            <main className="h-full grow overflow-scroll portrait:p-2 p-2 md:p-4 lg:p-8">
                {salesFiltered
                    .filter(sale => {
                        let current_max = clip(priceRange.min, priceRange.max, maxPrice);
                        return !current_max || pricePerStack(sale) <= current_max;
                    })
                    .map(sale => (
                        <SaleEntry
                            sale={sale}
                            key={sale.rid}
                            setItemId={setItemId}
                            setSeller={setSeller}
                        />
                    ))}
            </main>
        </div>
    );
}

function SearchBar({
    itemId,
    setItemid,
    seller,
    setSeller,
    priceRange,
    maxPrice,
    setMaxPrice,
}: {
    itemId: string;
    setItemid: Dispatch<SetStateAction<string>>;
    seller: string;
    setSeller: Dispatch<SetStateAction<string>>;
    priceRange: { min: number; max: number };
    maxPrice: number;
    setMaxPrice: Dispatch<SetStateAction<number>>;
}) {
    return (
        <>
            <input
                type="text"
                value={itemId}
                placeholder="search by item id"
                className="search-item focus:outline-hidden p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-xs text-2xl"
                onInput={e => {
                    setItemid(e.currentTarget.value);
                }}
            />
            <input
                type="text"
                value={seller}
                placeholder="search by seller"
                className="search-sell focus:outline-hidden p-4 w-full h-16 hover:placeholder:text-neutral-300 placeholder:text-neutral-400 placeholder:text-2xl bg-transparent drop-shadow-xs text-2xl"
                onInput={e => {
                    setSeller(e.currentTarget.value);
                }}
            />
            <label className="w-full h-24 px-4 flex justify-center items-start text-2xl flex-col text-neutral-400">
                <div>{`max stack price: ${Math.round(clip(priceRange.min, priceRange.max, maxPrice) * 1000) / 1000}`}</div>
                <input
                    type="range"
                    className={`w-full drop-shadow-xs accent-neutral-400 hover:accent-neutral-300 focus:outline-hidden focus:accent-neutral-300 ${priceRange.min == priceRange.max ? "invisible" : ""}`}
                    step="any"
                    value={clip(priceRange.min, priceRange.max, maxPrice)}
                    min={priceRange.min}
                    max={priceRange.max}
                    onInput={e => {
                        setMaxPrice(Number(e.currentTarget.value));
                    }}
                />
            </label>
        </>
    );
}

function Settings({
    limitByDistance,
    setLimitByDistance,
    searchDistance,
    setSearchDistance,
    sellerBlacklist,
    setSellerBlacklist,
}: {
    limitByDistance: boolean | null;
    setLimitByDistance: Dispatch<SetStateAction<boolean | null>>;
    searchDistance: number | null;
    setSearchDistance: Dispatch<SetStateAction<number | null>>;
    sellerBlacklist: string | null;
    setSellerBlacklist: Dispatch<SetStateAction<string | null>>;
}) {
    return (
        <>
            <label className="p-4 w-full h-16 drop-shadow-xs text-2xl text-neutral-400">
                limit search distance:
                <input
                    className="ml-[1ch]"
                    type="checkbox"
                    checked={!!limitByDistance}
                    onChange={e => {
                        setLimitByDistance(e.currentTarget.checked);
                    }}
                />
            </label>
            <label className="p-4 w-full h-16 drop-shadow-xs text-2xl text-neutral-400">
                search distance:
                <input
                    className="w-20 bg-transparent ml-[1ch]"
                    type="number"
                    min="0"
                    value={searchDistance ?? 0}
                    onInput={e => {
                        setSearchDistance(Number(e.currentTarget.value));
                    }}
                />
            </label>
            <label className="p-4 w-full h-24 drop-shadow-xs text-2xl text-neutral-400">
                sellers blacklist:
                <input
                    className="hover:placeholder:text-neutral-300 placeholder:text-neutral-400 text-neutral-200 bg-transparent w-full focus:outline-hidden"
                    placeholder="Player1;Player2"
                    value={sellerBlacklist || ""}
                    onInput={e => {
                        setSellerBlacklist(e.currentTarget.value);
                    }}
                />
            </label>
        </>
    );
}
