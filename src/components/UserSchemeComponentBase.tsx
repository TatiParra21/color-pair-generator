import type { UserSchemeDataType } from "../types"
import { useRef, useState } from "react"
import { colorDataStore, authStateStore, hexSizeAndStyleStore } from "../store/projectStore"
import { sendUserDeleteRequest, updateSchemeNameForUser } from "../functions/requestFunctions"
import { selectUpdateUserSchemes } from "../store/projectStore"
import { UserColorDataInfoComp } from "./SubComponents/DataInfoComps"
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
      <p className="gap-4 items-center  border-solid border-black border-1 flex flex-col" style={{ ...mainStyle, }} >
        {`Ratio: ${contrast_ratio}`}
      </p>
      <p className="gap-4 items-center   border-solid border-black border-1 flex flex-col" style={{ ...mainStyle2, }} >
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