import type { ColorSchemeType, ColorType, SameColorNameType } from "../types"
import chroma from "chroma-js"

export const createVariantsArray =(sameColor: Set<string>,hexValue: string, responses :ColorSchemeType[]):SameColorNameType[]=>{
    const variantArr:SameColorNameType[] =[]
    const checkHex = new Set<string>()
    const closestSet = responses[0].closest_named_hex
            for(const variant of sameColor){
                const test = responses.filter(col => col.name ==  variant)
                const schemesArr:ColorSchemeType[] =test.map((col: ColorSchemeType):ColorSchemeType=> {
                    checkHex.add(col.closest_named_hex)
                    if(!col)throw Error
                    return col
                }
            )
            const same: SameColorNameType = {name:variant, closest: closestSet,hex:hexValue, variants:schemesArr}
                    variantArr.push(same)
            }
            return variantArr
}
export const getColorName =async(hexNum:string): Promise<ColorType>=>{
    try{  
    const res = await fetch(`https://www.thecolorapi.com/id?hex=${hexNum.slice(1)}ii`)
    console.log(res)
           if (!res.ok) {
      throw new Error(`Color API HTTP error: ${res.status}`);
    }
                    const data = await res.json()
                       //  API returned malformed data
                if (!data?.hex || !data?.name) {
                    throw new Error("Color API returned invalid structure");
                    }
                    const {hex, name} = data
                    if(!hex && !name)throw new Error("hex or name not found")
                        const {clean:clean_hex, value} = hex
                        const colorName = name.value
                        const closest= name.closest_named_hex
                      if (!clean_hex || !value || !colorName || !closest) {
                        throw new Error("Color API missing required color fields");
    }
                    return {name:colorName, hex:value, clean_hex,closest_named_hex:closest}
    }catch(err){
             console.error("getColorName failed:", err);
            throw err;
        }
}
export const getContrastRatio =(colorNameObj:ColorType, baseColor :string):ColorSchemeType=>{
    const {name, hex, clean_hex, closest_named_hex} = colorNameObj
    const contrast = chroma.contrast(baseColor,clean_hex).toFixed(2)
    const aatext = 4.5 <= Number(contrast)
      const aaatext = 7.1 <= Number(contrast)
    return{clean_hex, hex,closest_named_hex, name, contrast_ratio:contrast, aaatext:aaatext, aatext: aatext}
}