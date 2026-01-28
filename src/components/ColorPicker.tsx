import { useEffect, useRef } from "react"
import { useReturnColorStoreData } from "../hooks/useReturnColorStoreData"
import { useCallback } from "react"
import type {ReactNode} from "react"
import getAllColorInfo from "../functions/getAllColorInfo"
import type {ColorInfo} from "../types"
import { handleError } from "../functions/handleError"
import type{ DebouncedValues } from "../store/projectStore"
import { paginationStore } from "../store/projectStore"

const ColorPicker =({children }:{children?:ReactNode})=>{
   const colorRef = useRef<string>("") //Reference to store latest color input, 
   const timerRef = useRef<NodeJS.Timeout | null>(null)
   const lastRequestRef = useRef<string>("")
   /*
   the const velues returned below are from Zustand store, they come from a custom hook that 
   returns them from useShallow.
   */
    const {
        allInfo, loading, color, isDisabled,
        debouncedValue, setColor, setAllInfo,
        setIsDisabled, setDebouncedValue,
        setLoadingProgress, setLoading, setErrorMessage
        } = useReturnColorStoreData()
   const  setTotal =paginationStore(state=>state.setTotal)
    const setCurrentPage =paginationStore(state=>state.setCurrentPage)
    // allInfo is the value containing the results from searching for contrasting colors from a picked one. 
    
   /*The useEffect listens for when allInfo value changes. As such when the user looks for another 
   color, or clicks on the "get more button" which will cause allInfo value to update */    
    useEffect(()=>{
        if(!allInfo)return
        const length = allInfo.contrastColors.length
        const totalPages = Math.max(1, Math.ceil(allInfo.contrastColors.length / 50))
        setTotal(length)
        setCurrentPage(totalPages)
     },[allInfo, setTotal, setCurrentPage])
     //fetches color from API or supabase whenever the selected color changes or the count changes.
    useEffect(()=>{
        if (!color)return
        setLoading(true)
        let cancelled = false
        console.log("useEffect ran")
        //this is to make sure the function does not run again, if the count and color is the same
        const requestKey = `${color}-${debouncedValue.count}`
        if(lastRequestRef.current == requestKey) return
        lastRequestRef.current = requestKey
        const fetchAll =async() =>{
            try{  
                const colorInfo : ColorInfo = await getAllColorInfo(color, debouncedValue.count,setLoadingProgress)  
                if(!colorInfo) throw new Error( "Color picker could not get colorInfo")
                    if(!cancelled){
                         setAllInfo(colorInfo)
                    }        
            }catch(err){
                 if (!cancelled) {
                    setErrorMessage(handleError(err, "ColorPicker"));
                }      
         }finally{       
            if (!cancelled) {
                setLoading(false);
      }
        } 
    };  fetchAll() 
     return () => {
    cancelled = true;
  };
    },[color,debouncedValue.count,setAllInfo,setErrorMessage,setLoading,setLoadingProgress])
    //Function that runs when user clicks on Search Constrasting Colors
    const choseFromColorInput =useCallback((input: keyof DebouncedValues)=>{  
        //based on the color chosen on the color input by the user, the state of the color is set.
        const mainVal = debouncedValue[input]   
        console.log(mainVal, "MAIN")
        if(typeof mainVal == "string" ){
            if( input == "textInput"){
            setColor(mainVal)
              setIsDisabled(true) 
            setDebouncedValue(prev=>({...prev, count:50}))     
            }
        }
        if(!color){ 
            setColor(debouncedValue.textInput)
              setIsDisabled(true) 
        }     
    },[debouncedValue, color, setColor, setIsDisabled, setDebouncedValue]) 
    /// A function meant to debounce the color input. 
    const updateDebouncedValue =useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{      
             if(timerRef && timerRef.current)clearTimeout(timerRef.current)
                //due to closure we saved the current value here 
                 colorRef.current = e.target.value               
            timerRef.current = setTimeout(()=>{         
                    //and we use it here
             setDebouncedValue(prev=>({ ...prev, textInput:colorRef.current}))
             setIsDisabled(false)
            },300)    
    },[setDebouncedValue,setIsDisabled])
   
    return(
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row text-4 items-center justify-center">
                    <div className="flex flex-col" >
                        <input type="color"  className="w-full" id="picker" value={debouncedValue.textInput ?? "#000000"} onChange={(e)=>updateDebouncedValue(e)}/>
                        <input type="text" id="write" value={debouncedValue.textInput ?? ""} onChange={(e)=>updateDebouncedValue(e)}/>
                    </div>        
            </div> 
            <div>
                <button className="my-4" disabled={loading ? true :isDisabled} onClick={()=>choseFromColorInput("textInput")}>{loading ? "...loading" : "Search contrasting colors"}</button> 
                <button disabled={loading ? true :isDisabled}
                    onClick={async () => {
                        try {
                            const text = await navigator.clipboard.readText(); // get clipboard text
                                if (!text) return;
                                // update store state directly
                                setDebouncedValue(prev=>({ ...prev, textInput: text }));
                                //setColor(text); 
                                setIsDisabled(false); 
                                }catch(err) {
                                    console.error("Failed to read clipboard", err);
                                    setErrorMessage("Could not paste from clipboard");
                                  }
                                }}
                                >
                                Paste from clipboard
                            </button>
                </div>  
            </div>
            <>
                {children}
            </>   
        </>
    )
}
export default ColorPicker
