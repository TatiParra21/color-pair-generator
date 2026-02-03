import { useQuery } from "@tanstack/react-query";
import getAllColorInfo from "../functions/getAllColorInfo";
import { useReturnColorStoreData } from "../hooks/useReturnColorStoreData";
import type { ColorInfo } from "../types";
import type { UseQueryResult } from "@tanstack/react-query";

export const useColorSearch = (color: string | null, count: number): UseQueryResult<ColorInfo, unknown> => {
    const { setLoadingProgress } = useReturnColorStoreData()
    return useQuery({
        queryKey: ["color-info", color, count],
        enabled: !!color,
        staleTime: Infinity, // Keep data fresh forever (until reload)
        queryFn: (): Promise<ColorInfo> => {
            if (!color) throw new Error("Color is null")
            return getAllColorInfo(color, count, setLoadingProgress)
        },
    })
}  