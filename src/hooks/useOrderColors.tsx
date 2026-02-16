import type { ColorInfo, } from "../types";
import { useMemo } from "react";
function getBrightness(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000; // standard brightness formula
}
export const useOrderColors = (info: ColorInfo | undefined, sortType: string) => {
    return useMemo(() => {
        if (!info) return [];
        let colors = info.contrastColors;
        if (sortType == "brightness") {
            colors = [...colors].sort((a, b) => getBrightness(b.hex) - getBrightness(a.hex));
        }
        if (sortType == "ratio") {
            colors = [...colors].sort((a, b) => Number(b.contrast_ratio) - Number(a.contrast_ratio));
        }

        return colors;
    }, [info, sortType])
}