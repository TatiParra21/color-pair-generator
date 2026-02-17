import type { ComponentType } from "../types"
import { useRef, useMemo } from "react"
import { hexSizeAndStyleStore, colorDataStore, authStateStore, selectUpdateUserSchemes } from "../store/projectStore"
import { saveColorSchemeForUser } from "../functions/requestFunctions"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { type UserSchemeDataType, } from "../types"
import { ColorDataInfoComp } from "./SubComponents/DataInfoComps"
export const ComponentBase = ({ variant, colorName, mainStyle, baseColor }: ComponentType) => {
  const copyHex = colorDataStore(state => state.copyHex)
  const setIsDisabled = colorDataStore(state => state.setIsDisabled)
  const updateUserSchemes = authStateStore(selectUpdateUserSchemes)
  const userSchemes = authStateStore(state => state.userSchemes)
  const hexAndNamePairs = useMemo(() => {
    const pairs: [string, string][] = [
      [baseColor.hex, baseColor.name],
      [variant.hex, variant.name]
    ];
    pairs.sort((a, b) => a[0].localeCompare(b[0]))
    return pairs
  }, [baseColor, variant])
  const [[hex1, hex1name], [hex2, hex2name]] = hexAndNamePairs
  const alreadyExists = useMemo(() => {
    return userSchemes?.some(
      (scheme: UserSchemeDataType) =>
        (scheme.hex1 === hex1 && scheme.hex2 === hex2) ||
        (scheme.hex1 === hex2 && scheme.hex2 === hex1) // just in case order matters
    )
  }, [userSchemes, hex1, hex2])
  const navigate = useNavigate()
  const refValue = useRef<HTMLInputElement>(null)
  const onCopy = () => {
    const hexValue = refValue.current?.innerText
    if (hexValue) {
      navigator.clipboard.writeText(hexValue)
      copyHex(hexValue)
      setIsDisabled(false)
    }
  }
  const redirectOrSave = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw new Error(error.message)
      if (!data.session) navigate("/sign-in", { state: { fromFeature: "save" } })
      else if (data.session.user.id) {
        const savedSchemeInfo: UserSchemeDataType = {
          scheme_name: "",
          hex1: hex1,
          hex1name: hex1name,
          hex2: hex2,
          hex2name: hex2name,
          contrast_ratio: Number(variant.contrast_ratio),
          aatext: variant.aatext,
          aaatext: variant.aaatext
        }
        await saveColorSchemeForUser(savedSchemeInfo)
        await updateUserSchemes()
      }
    } catch (err) {
      console.error(err)
    }
  }
  const textType = hexSizeAndStyleStore(state => state.textType)
  const baseColorAsBackgroundStyle = {
    color: `#${variant.clean_hex}`,
    background: `${baseColor.hex}`,
  }
  const { aaatext, aatext, contrast_ratio } = variant
  return (
    <div className="flex flex-col single-badge-style">
      <h3>{colorName} </h3>
      <p className=" border-solid border-black border-1" ref={refValue} style={{ ...mainStyle, }} >
        {` ${variant?.hex}`}
      </p>
      <p className="border-solid border-black border-1" ref={refValue} style={{ ...baseColorAsBackgroundStyle, }} >
        {` ${variant?.hex}`}
      </p>
      <span style={{ cursor: "pointer", userSelect: "none" }} onClick={onCopy}>Copy</span>
      <div className=" flex  flex-col gap-2">
        {textType == "Normal" && <>
          <ColorDataInfoComp contrast_ratio={contrast_ratio} aatext={aatext} aaatext={aaatext} />
        </>}
        {textType == "Large" && <>
          <ColorDataInfoComp contrast_ratio={contrast_ratio} aatext={Number(contrast_ratio) > 3} aaatext={Number(contrast_ratio) > 4.5} />
        </>}
        <button disabled={alreadyExists} onClick={redirectOrSave}>{alreadyExists ? "Color already Saved" :
          "Save ColorScheme"}</button>
      </div>
    </div>
  )
}
