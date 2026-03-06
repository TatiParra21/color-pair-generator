import type { UserSchemeDataType } from "../types"
import { useRef, useState } from "react"
import { colorDataStore, authStateStore, hexSizeAndStyleStore } from "../store/projectStore"
import { sendUserDeleteRequest, updateSchemeNameForUser } from "../functions/requestFunctions"
import { selectUpdateUserSchemes } from "../store/projectStore"
import { UserColorDataInfoComp } from "./SubComponents/DataInfoComps"
import { useShowTextCopied } from "../hooks/useShowTextCopied"
import { TextCopiedBlock } from "./SubComponents/TextCopiedBlock"
import { needsContrastHelp } from "../functions/needsContrastHelp"
export const UserSchemeComponentBase = ({ userScheme, currentNameEdited, setCurrentNameEdited }: { userScheme: UserSchemeDataType, currentNameEdited: string, setCurrentNameEdited: (name: string) => void   }) => {

  const copyHex = colorDataStore(state => state.copyHex)
  const setIsDisabled = colorDataStore(state => state.setIsDisabled)
  const updateUserSchemes = authStateStore(selectUpdateUserSchemes)
  const foreGroundRefValue = useRef<HTMLInputElement>(null)
  const backGroundRefValue = useRef<HTMLInputElement>(null)
   const { showCopied:showTextCopied, triggerShowCopied } = useShowTextCopied()
  const nameRef = useRef<HTMLInputElement>(null)
  const onCopy = (ref: string) => {
    const hexValue = ref == "foreground" ? foreGroundRefValue.current?.innerText : backGroundRefValue.current?.innerText
    console.log(hexValue,"HEEE")
    if (hexValue) {
      navigator.clipboard.writeText(hexValue)
      copyHex(hexValue)
      setIsDisabled(false)
      triggerShowCopied()
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
  const openChangeNameComp = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("currentNameEdited before change", currentNameEdited)
    setOpenChangeName(prev => !prev)
    
  }
  const changeSchemeName = async (e: React.MouseEvent<HTMLButtonElement>) => {

    const newScheme = nameRef.current?.value
    if (!newScheme || !id) return
    await updateSchemeNameForUser(id, newScheme)
    await updateUserSchemes()
    openChangeNameComp(e)
  }
  const handleInput = (e: React.MouseEvent<HTMLButtonElement>) => {
  const parent = e.currentTarget.closest(".single-badge-style");
  const parentId = parent?.id;
    if(parentId) {
      setCurrentNameEdited(parentId)}
  
};

const divId = `${foreGroundColor.hex}-${backGroundColor.hex}`
  return (
    
    <div style={{background: divId == currentNameEdited ? "lightblue" : undefined }} id={`${foreGroundColor.hex}-${backGroundColor.hex}`} className=" single-badge-style">
     { openChangeName && divId == currentNameEdited ? <input  className="border-solid border-[#57509D] border-2" ref={nameRef}
            type="text"
            name={scheme_name || `${foreGroundColor.name}-${backGroundColor.name}`}
          ></input> :  <h3 className="badge-title">{scheme_name || `${foreGroundColor.name} and ${backGroundColor.name}`} </h3>}
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
            style={{ color: foreGroundColor.hex, textShadow: needsContrastHelp(foreGroundColor.hex) ? "0 0 2px rgba(0,0,0,0.4)": "none", }}
            onClick={() => onCopy("foreground")}>{foreGroundColor.hex}</span>
        </div>
        <div className="color-div" style={{ cursor: "pointer", userSelect: "none" }}>
          <p
            onClick={() => onCopy("background")}>{` ${backGroundColor.name}`}</p>
          <span ref={backGroundRefValue}
            style={{ color: backGroundColor.hex, textShadow: needsContrastHelp(backGroundColor.hex) ? "0 0 2px rgba(0,0,0,0.4)": "none", }} onClick={() => onCopy("background")}>{backGroundColor.hex}</span>
        </div>

      </div>
      <div className="color-desc flex-1  flex flex-col">
        <div className="flex flex-1 flex-row">
          {textType == "Normal" && <>
            <UserColorDataInfoComp aatext={aatext} aaatext={aaatext} />
          </>}
          {textType == "Large" && <>
            <UserColorDataInfoComp aatext={Number(contrast_ratio) > 3} aaatext={Number(contrast_ratio) > 4.5} />
          </>}
        </div>
       
        <button onClick={(e) =>{ handleInput(e); openChangeNameComp(e)}}>Change Name</button>
        {!openChangeName || <>
          <label htmlFor={scheme_name || `${foreGroundColor.name}-${backGroundColor.name}`}>New Name:</label>

        
          <button onClick={(e)=>changeSchemeName(e)}>Submit</button>
        </>}
      { !openChangeName && divId == currentNameEdited  &&<button onClick={removeScheme}>Remove </button>}  
        
      </div>
 {showTextCopied && <TextCopiedBlock />}
    </div>
  )
}