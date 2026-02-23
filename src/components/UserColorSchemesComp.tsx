
import { HexInfo } from "../components/HexInfo"
import { useNavigate } from "react-router-dom"
import { authStateStore, selectSession, selectUserSchemes } from "../store/projectStore"
import { UserSchemeComponentBase } from "./UserSchemeComponentBase"
import { LoadingRoller } from "./LoadingRoller"
import { useState, useEffect, useMemo } from "react"
import type { UserSchemeDataType } from "../types"
import { usePagination } from "../hooks/usePagination"
import { PaginationComp } from "./PaginationComp"

const UserColorSchemesComp = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [totalSchemes, setTotalSchemes] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const userSchemes: UserSchemeDataType[] | null = authStateStore(selectUserSchemes)
    const session = authStateStore(selectSession)
    const navigate = useNavigate()
    useEffect(() => {
        if (!session) navigate("/")
        const loadColorSchemes = async () => {
            if (!loading) return
            setLoading(false)
        }
        loadColorSchemes()
    }, [session, loading,setLoading,navigate])
    usePagination(userSchemes,setTotalSchemes,setCurrentPage, 20)
      const allComponents = useMemo(()=>{
        if (!userSchemes) return <div> "No colorSchemes yet"</div>
        return userSchemes.map((scheme: UserSchemeDataType) => {
        return (<UserSchemeComponentBase key={`${scheme.hex1}-${scheme.hex2}-scheme`} userScheme={scheme} />)
        }
    ).slice((currentPage -1) * 20, currentPage *20)

    },[currentPage,userSchemes]) 
    if (loading || !userSchemes) return <div>{loading ? <LoadingRoller /> : "no ColorSchemes yet"}</div>
   
  
    
    return (
        <div className="gap-2 items-center flex flex-col" >
            <HexInfo />
            <div className="badges-sec">
                <PaginationComp currentPage={currentPage} pageSize={20} total={totalSchemes} setCurrentPage={setCurrentPage} />
                {allComponents}
                <PaginationComp currentPage={currentPage} pageSize={20} total={totalSchemes} setCurrentPage={setCurrentPage} />
            </div>

        </div>
    )
}
export default UserColorSchemesComp