import { Generated } from "kysely";

export interface SalesTable {
    rid: Generated<number>;
    mcItemId: string;
    quantity: number;
    price: number;
    shop_seller: string;
    shop_location_x: number;
    shop_location_y: number;
    shop_location_z: number;
}

export interface Database { sales: SalesTable; }
