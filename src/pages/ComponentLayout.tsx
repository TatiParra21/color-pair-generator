import type { ColorSchemeType } from "../types"
import { HexInfo } from "../components/HexInfo"
import { sortingStore, paginationStore } from "../store/projectStore"
import { PaginationComp } from "../components/PaginationComp"
import { useMemo } from "react"
import { ComponentBase } from "../components/ComponentBase"
import { useReturnColorStoreData } from "../hooks/useReturnColorStoreData"
import { useColorSearch } from "../hooks/useColorSearch"
import { useOrderColors } from "../hooks/useOrderColors"

const ComponentLayout = () => {

    const { color, debouncedValue } = useReturnColorStoreData()
    const { data: allInfo } = useColorSearch(color, debouncedValue.count)
    const baseColor = allInfo?.mainColor
    const { loadingProgress, loading, setDebouncedValue, setColor } = useReturnColorStoreData()
    const total = paginationStore(state => state.total)
    const currentPage = paginationStore(state => state.currentPage)
    const sortType = sortingStore(state => state.sortType)
    const contrastColorsOrdered = useOrderColors(allInfo, sortType)
    console.log(baseColor, "BASE")
    const allComponents = useMemo(() => {
        if (!baseColor) return <div>No Color Chosen</div>
        return contrastColorsOrdered.map((schemecolor: ColorSchemeType) => {
            const { name, hex } = schemecolor
            const mainStyle = {
                color: `${allInfo?.mainColor?.hex ?? ""}`,
                background: `#${schemecolor.clean_hex}`,
            }
            return (<ComponentBase mainStyle={mainStyle} key={hex} baseColor={baseColor} variant={schemecolor} colorName={name} />)
        }
        ).slice(((currentPage - 1) * 50), (currentPage * 50))
    }, [contrastColorsOrdered, allInfo, currentPage])
    if (loading || !allInfo) return <div>{loading ? `...Loading pairs currently ${loadingProgress} out of 50` : `No color Chosen`}</div>
    const { mainColor: { hex: mainHex, name: mainName } } = allInfo
    const loadMore = () => {
        setDebouncedValue(prev => ({ ...prev, count: prev.count + 50 }))
        console.log("the cooo", color)
        setColor(color!)
    }
    return (
        <div className="gap-4 items-center  flex flex-col" >
            <HexInfo />
            <div className="flex items-center gap-2+ ">

                <h3 >ForeGround:<span style={{ color: mainHex }}> {`${color} ${mainName}`}</span> </h3>
                <div className="flex ">
                    <p className="self-center ">{`Total Colors Found: ${total} `}</p>
                    <button onClick={loadMore}>Load More?</button>
                </div>
            </div>

            <PaginationComp />

            <div className={`badges-sec`}>
                {allComponents}
                <PaginationComp />
            </div>
        </div>
    )
}
export default ComponentLayout
