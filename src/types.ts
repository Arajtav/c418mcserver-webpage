export type Location = {
    x: number;
    y: number;
    z: number;
};

export type ShopT = {
    seller: string;
    location: Location;
};

export type SaleDataT = {
    rid: number;
    mcItemId: string;
    quantity: number;
    price: number;
    shop: ShopT;
};
