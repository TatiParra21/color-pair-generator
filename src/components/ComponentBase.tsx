import type { ComponentType } from "../types"
import { useRef, useState, useMemo } from "react"
import { hexSizeAndStyleStore, colorDataStore, authStateStore, selectUpdateUserSchemes } from "../store/projectStore"
import { saveColorSchemeForUser, sendUserDeleteRequest } from "../functions/requestFunctions"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { updateSchemeNameForUser } from "../functions/requestFunctions"
import { type UserSchemeDataType, } from "../types"
import { useReturnColorStoreData } from "../hooks/useReturnColorStoreData"
import { useColorSearch } from "../hooks/useColorSearch"
//import { useReturnColorStoreData } from "../functions/useReturnColorStoreData"
const ColorDataInfoComp = ({ contrast_ratio, aatext, aaatext }: { contrast_ratio: string | number, aatext: boolean, aaatext: boolean }) => {
  return (
    <>
      <p>{`Ratio: ${contrast_ratio ?? "no ratio yet"}`}</p>
      <div className="flex-row">
        <p>{`AA Text: ${aatext ? "✅" : "❌"}`}</p>
        <p>{`AAA Text: ${aaatext ? "✅" : "❌"}`}</p>
      </div>
    </>
  )
}
const UserColorDataInfoComp = ({ aatext, aaatext }: { aatext: boolean, aaatext: boolean }) => {
  return (
    <>
      <p>{`AA Text: ${aatext ? "✅" : "❌"}`}</p>
      <p>{`AAA Text: ${aaatext ? "✅" : "❌"}`}</p>
    </>
  )
}

export const ComponentBase = ({ variant, colorName, mainStyle }: ComponentType) => {
  const copyHex = colorDataStore(state => state.copyHex)
  const setIsDisabled = colorDataStore(state => state.setIsDisabled)
  const { color, debouncedValue } = useReturnColorStoreData()
  const { data: colorInfo } = useColorSearch(color, debouncedValue.count)
  const baseColor = colorInfo?.mainColor
  const updateUserSchemes = authStateStore(selectUpdateUserSchemes)
  const userSchemes = authStateStore(state => state.userSchemes)
  if (!baseColor) throw new Error("Basecolornot in")
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
      <p className="" ref={refValue} style={{ ...mainStyle, }} >
        {` ${variant?.hex}`}
      </p>
      <p className="" ref={refValue} style={{ ...baseColorAsBackgroundStyle, }} >
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

export const UserSchemeComponentBase = ({ userScheme }: { userScheme: UserSchemeDataType }) => {

  const copyHex = colorDataStore(state => state.copyHex)
  const setIsDisabled = colorDataStore(state => state.setIsDisabled)
  const updateUserSchemes = authStateStore(selectUpdateUserSchemes)
  const foreGroundRefValue = useRef<HTMLInputElement>(null)
  const backGroundRefValue = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const onCopy = (ref: string) => {
    const hexValue = ref == "foreground" ? foreGroundRefValue.current?.innerText : backGroundRefValue.current?.innerText
    if (hexValue) {
      navigator.clipboard.writeText(hexValue)
      copyHex(hexValue)
      setIsDisabled(false)
    }
  }
  const textType = hexSizeAndStyleStore(state => state.textType)
  const { aaatext, aatext, contrast_ratio, hex1, hex2, hex1name, hex2name, scheme_name, id } = userScheme
  const foreGroundColor = { hex: hex1, name: hex1name }
  const backGroundColor = { hex: hex2, name: hex2name }
  const [openChangeName, setOpenChangeName] = useState<boolean>(false)

  const removeScheme = async () => {
    if (!id) return
    await sendUserDeleteRequest(id)
    await updateUserSchemes()

  }
  const mainStyle = {
    color: `${foreGroundColor.hex}`,
    background: `${backGroundColor.hex}`,
  }
  const mainStyle2 = {
    color: `${backGroundColor.hex}`,
    background: `${foreGroundColor.hex}`,
  }
  const openChangeNameComp = () => {
    setOpenChangeName(prev => !prev)
  }
  const changeSchemeName = async () => {

    const newScheme = nameRef.current?.value
    if (!newScheme || !id) return
    await updateSchemeNameForUser(id, newScheme)
    await updateUserSchemes()
    openChangeNameComp()
  }
  return (
    <div className=" single-badge-style">
      <h3>{scheme_name || `${foreGroundColor.name} and ${backGroundColor.name}`} </h3>
      <p className="gap-4 items-center flex flex-col" style={{ ...mainStyle, }} >
        {`Ratio: ${contrast_ratio}`}
      </p>
      <p className="gap-4 items-center  flex flex-col" style={{ ...mainStyle2, }} >
        {`Ratio: ${contrast_ratio}`}
      </p>
      <div className="flex flex-row justify-center items-center gap-2">
        <div className="color-div" style={{ cursor: "pointer", userSelect: "none" }}>
          <p >{` ${foreGroundColor.name}`}</p>
          <span ref={foreGroundRefValue}
            style={{ color: foreGroundColor.hex }}
            onClick={() => onCopy("foreground")}>{foreGroundColor.hex}</span>
        </div>
        <div className="color-div" style={{ cursor: "pointer", userSelect: "none" }}>
          <p
            onClick={() => onCopy("background")}>{` ${backGroundColor.name}`}</p>
          <span ref={backGroundRefValue}
            style={{ color: backGroundColor.hex, }} onClick={() => onCopy("background")}>{backGroundColor.hex}</span>
        </div>

      </div>
      <div className="color-desc flex flex-col">
        <div className="flex flex-row">
          {textType == "Normal" && <>
            <UserColorDataInfoComp aatext={aatext} aaatext={aaatext} />
          </>}
          {textType == "Large" && <>
            <UserColorDataInfoComp aatext={Number(contrast_ratio) > 3} aaatext={Number(contrast_ratio) > 4.5} />
          </>}
        </div>
        <button onClick={openChangeNameComp}>Change Name</button>
        {!openChangeName || <>
          <label htmlFor={scheme_name || `${foreGroundColor.name}-${backGroundColor.name}`}>New Name:</label>

          <input ref={nameRef}
            type="text"
            name={scheme_name || `${foreGroundColor.name}-${backGroundColor.name}`}
          ></input>
          <button onClick={changeSchemeName}>Submit</button>
        </>}
        <button onClick={removeScheme}>Remove </button>
      </div>

    </div>
  )
}