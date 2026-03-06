import { useState, useEffect, useCallback } from "react"
export const useShowTextCopied = (duration: number = 1500) => {
    const [showCopied, setShowCopied] = useState(false)

    const triggerShowCopied = useCallback(()=>{
        setShowCopied(true)
    },[])
    useEffect(()=>{
         if(!showCopied)return
            const timer = setTimeout(()=>{
                setShowCopied(false)
              }, duration)
                return () => clearTimeout(timer)

    },[showCopied, duration])
    return { showCopied, triggerShowCopied }
}