import { useEffect } from "react"
import { type ColorSchemeTypeArr, type UserSchemeDataType } from "../types"
type PageMode = "reset" | "jumpToEnd"
export const usePagination =(contrastColors:ColorSchemeTypeArr | undefined |UserSchemeDataType[] |null, 
    setTotal: (num: number) => void, setCurrentPage: (page: number) => void,PageMode:PageMode = "reset", itemPerPage = 50)=>{
    useEffect(() => {
            if (!contrastColors) return
            const length = contrastColors.length
            const totalPages = Math.max(1, Math.ceil(contrastColors.length / itemPerPage))
            setTotal(length)
            console.log(length, "Length of contrast colors in usePagination")
            if(PageMode === "jumpToEnd"){
                setCurrentPage(totalPages)
            }else{
                setCurrentPage(1)
            }        
        }, [contrastColors, setTotal, setCurrentPage, itemPerPage,PageMode])
}