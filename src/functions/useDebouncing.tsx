import { useCallback, useRef, } from "react"

export const useDebouncing =<T,>(callbackFunc:(...args:T[])=>void,delay:number)=>{
    const timerRef = useRef<NodeJS.Timeout | null>(null)
        
    

        return useCallback((...args:T[])=>{
            if(timerRef && timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(()=>{
            callbackFunc(...args)
    
        },delay)

        },[delay,callbackFunc])

}