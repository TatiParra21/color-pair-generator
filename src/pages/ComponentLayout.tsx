import type { ColorSchemeType } from "../types"
import { HexInfo } from "../components/HexInfo"
import { sortingStore, paginationStore,type PaginationStoreType } from "../store/projectStore"
import { PaginationComp } from "../components/PaginationComp"
import { useMemo } from "react"
import { ComponentBase } from "../components/ComponentBase"
import { useReturnColorStoreData } from "../hooks/useReturnColorStoreData"
import { useColorSearch } from "../hooks/useColorSearch"
import { useOrderColors } from "../hooks/useOrderColors"
import { useShallow } from "zustand/shallow"
const ComponentLayout = () => {
    const { color, debouncedValue } = useReturnColorStoreData()
    const { data: allInfo } = useColorSearch(color, debouncedValue.count)
    const baseColor = allInfo?.mainColor
    const { loadingProgress, loading, setDebouncedValue, setColor } = useReturnColorStoreData()
   const { currentPage, pageSize, total, setCurrentPage } = paginationStore(useShallow((state: PaginationStoreType) => ({
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    total: state.total,
    setCurrentPage: state.setCurrentPage
  })))
    const sortType = sortingStore(state => state.sortType)
    const contrastColorsOrdered = useOrderColors(allInfo, sortType)
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

            <PaginationComp currentPage={currentPage} pageSize={pageSize} total={total} setCurrentPage={setCurrentPage} />

            <div className={`badges-sec`}>
                {allComponents}
                <PaginationComp currentPage={currentPage} pageSize={pageSize} total={total} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    )
}
export default ComponentLayout
