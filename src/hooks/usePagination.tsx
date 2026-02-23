import { useEffect } from "react"
import { type ColorSchemeTypeArr, type UserSchemeDataType } from "../types"
export const usePagination =(contrastColors:ColorSchemeTypeArr | undefined |UserSchemeDataType[] |null, 
    setTotal: (num: number) => void, setCurrentPage: (page: number) => void, itemPerPage = 50)=>{
    useEffect(() => {
            if (!contrastColors) return
            const length = contrastColors.length
            const totalPages = Math.max(1, Math.ceil(contrastColors.length / itemPerPage))
            setTotal(length)
            setCurrentPage(totalPages)
        }, [contrastColors, setTotal, setCurrentPage])
}