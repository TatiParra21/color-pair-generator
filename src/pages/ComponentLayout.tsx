import type { ColorSchemeType } from "../types"
import { HexInfo } from "../components/HexInfo"
import { colorDataStore,sortingStore, selectLoadingProgress, selectSetColor, selectSetDebouncedValue, paginationStore, selectLoading, selectAllInfo, selectColor, } from "../store/projectStore"
import { PaginationComp } from "../components/PaginationComp"
import { useMemo } from "react"
import { ComponentBase } from "../components/ComponentBase"
function getBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000; // standard brightness formula
}
export const ComponentLayout =({type}:{type:string})=>{
    const loading = colorDataStore(selectLoading)
    const allInfo = colorDataStore(selectAllInfo)
    const color = colorDataStore(selectColor)
    const loadingProgress = colorDataStore(selectLoadingProgress)
    const setDebouncedValue = colorDataStore(selectSetDebouncedValue)
    const setColor = colorDataStore(selectSetColor)
    const total =paginationStore(state=>state.total)
    const currentPage =paginationStore(state=>state.currentPage)
    const sortType = sortingStore(state => state.sortType)
   
    const contrastColorsOrdered = useMemo(()=>{
        if (!allInfo) return [];
         let colors = allInfo.contrastColors;
         if(sortType == "brightness"){
             colors = [...colors].sort((a, b) => getBrightness(b.hex) - getBrightness(a.hex));
         }
         if(sortType == "ratio"){
            colors = [...colors].sort((a, b) => Number(b.contrast_ratio) - Number(a.contrast_ratio));
         }

         return colors;
   },[allInfo, sortType]) 
   const allComponents = useMemo(()=>{
    return contrastColorsOrdered.map((schemecolor:ColorSchemeType)=>{
     const {name, hex} = schemecolor
     const mainStyle ={
                color:`${allInfo?.mainColor?.hex ?? ""}`,
                background: `#${schemecolor.clean_hex}` ,          
  }
        return(<ComponentBase  mainStyle={mainStyle} key={hex} variant={schemecolor} colorName={name}/>)
         }
        ).slice(((currentPage -1)*50),(currentPage *50))
   },[contrastColorsOrdered, allInfo,currentPage]) 
   if(loading || !allInfo)return <div>{loading ? `...Loading ${type}s currently ${loadingProgress} out of 50`:`No ${type}s Found` }</div>
   const {mainColor:{hex:mainHex, name:mainName}} = allInfo
        const loadMore =()=>{
            setDebouncedValue(prev=>({...prev,count:prev.count + 50}))
            console.log("the cooo", color)
            setColor(color!) 
        }
 return(
    <div className="gap-4 items-center  flex flex-col" >   
    <HexInfo/>                                    
        <div className="flex items-center gap-2+ ">   
            
            <h3 >ForeGround:<span style={{color:mainHex}}> {`${color} ${mainName}`}</span> </h3>
            <div className="flex ">
                <p className= "self-center ">{`Total Colors Found: ${total} `}</p>
                <button onClick={loadMore}>Load More?</button>
            </div>
        </div> 
                        
        <PaginationComp />
                                          
            <div className={`badges-sec`}>          
                {allComponents} 
            </div>       
    </div>
 )
}