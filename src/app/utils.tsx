import { Location } from "@/types";

export function dist3d(a: Location, b: Location): number {
    return Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2)+Math.pow(a.z-b.z, 2));
}

export function clip(min: number, max: number, val: number): number {
    return Math.min(max, Math.max(val, min));
}