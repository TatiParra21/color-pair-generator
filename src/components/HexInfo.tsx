import type { JSX} from "react"
import { useShallow } from "zustand/shallow"
import { hexSizeAndStyleStore} from "../store/projectStore"
import { sortingStore } from "../store/projectStore"
export const HexInfo =():JSX.Element=>{
    const {textType, setTextType} = hexSizeAndStyleStore(useShallow((state)=>({
        textType:state.textType,
        setTextType:state.setTextType,
    })))
      const setSortType = sortingStore(state => state.setSortType)
        // const filterRatio = sortingStore(state => state.filterRatio)
    const oppositeTextType = textType == "Normal" ? "Large" : "Normal"
    return(
        <>
        <div className="flex">
            <div className="border-solid border-2 border-black self-start ">
                <div className="flex flex-row justify-center items-center gap-2 k">             
                    <h3>{` Currently Measuring ${textType} text size.`}</h3>     
                        
                </div> 
                {
                        textType == "Normal" ? <>
                        <p> AA Level for Normal Text: Ratio ≥ 4.5 </p>
                        <p> AAA Level for Normal Text: Ratio ≥ 7.1 </p>
                        </> 
                        : <>
                        <p> AA Level for Large Text: Ratio ≥ 3.1 </p>
                        <p> AAA Level for Large Text: Ratio ≥ 4.5 </p>
                        </> 
                    }
                    <button  onClick={()=>{setTextType(oppositeTextType)}}>{`Switch to ${oppositeTextType} Text?`}</button>  
                </div>
                <div> 
                        <p>SortBy:</p>
                        <div className="sorting-btns">   
                        <button onClick={()=>setSortType("brightness")}>Brightness</button>
                        <button onClick={()=>setSortType("ratio")}>Ratio</button>
                        </div>
                </div>
            </div>
            
          
        </>  
    )
}