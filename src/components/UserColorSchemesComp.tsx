
import { HexInfo } from "../components/HexInfo"
import { useNavigate } from "react-router-dom"
import { authStateStore, selectSession, selectUserSchemes } from "../store/projectStore"
import { UserSchemeComponentBase } from "./UserSchemeComponentBase"
import { LoadingRoller } from "./LoadingRoller"
import { useState, useEffect } from "react"
import type { UserSchemeDataType } from "../types"

const UserColorSchemesComp = () => {
    const [loading, setLoading] = useState<boolean>(true)
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
    }, [session])

    if (loading || !userSchemes) return <div>{loading ? <LoadingRoller /> : "no ColorSchemes yet"}</div>

    const allComponents = userSchemes.map((scheme: UserSchemeDataType) => {
        return (<UserSchemeComponentBase key={`${scheme.hex1}-${scheme.hex2}-scheme`} userScheme={scheme} />)
    }
    )
    return (
        <div className="gap-2 items-center flex flex-col" >
            <HexInfo />
            <div className="badges-sec">
                {allComponents}
            </div>

        </div>
    )
}
export default UserColorSchemesComp