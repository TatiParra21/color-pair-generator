import type { ColorSchemeTypeArr, ColorType } from "../types"
import { getColorName } from "./fetchColorSchemes"
import { supabase } from "../supabaseClient"
import {type ColorSchemeType } from "../types"
import type { FrontEndColorType,UserSchemeDataType} from "../types"
import pLimit from "p-limit"
const supabaseLimiter =pLimit(3)

import { PostgrestError } from "@supabase/supabase-js"

export const checkIfContrastIn = async(hex: string):Promise<ColorSchemeType[] | null>=>{
   // console.log("it ran update", hex)
    try{
     const { data, error }:{data:ColorSchemeType[] | null, error: PostgrestError | null}= await supabase.rpc(
  "get_color_contrasts",
  { input_hex: hex }
    )
  //  console.log("HELLO?", data)
    if (error){    
        throw error
    } 
if(Array.isArray(data) && data.length < 1) return null
    return data

    }catch(err){
         if (err instanceof Error) { // General check for a standard Error object
          console.error("An unexpected error occurred:", err.message);
      } else {
          console.error("An unknown error occurred:", err);
      }
      return null
    }
}
const saveNamedColor = async(newColors:FrontEndColorType[])=>{
    console.log("savedNamedColor")
    const {error} = await supabase
    .from("named_colors").upsert(newColors,{onConflict:"name", ignoreDuplicates:true})
    if(error){
        console.log(error)
    }
}
const saveHexVariant = async(newVariants:FrontEndHexBodyType[])=>{
    const {error} = await supabase
    .from("hex_variants").upsert(newVariants, {onConflict:"hex,closest_named_hex,clean_hex", ignoreDuplicates:true})
    if(error){
        console.log(error)
    }
}
const saveColorContrast =async(contrasts: FrontEndColorContrastType[])=>{
    try{
        const {error} = await supabase.from("color_contrasts").upsert(contrasts, {onConflict:" hex1,hex2", ignoreDuplicates: true } )
    if(error){
    console.log(error, "error")
    throw error
    }

    }catch(err){
        if( err instanceof Error){
            console.log(err)

        }
    }
}

export const checkFunction=()=>{
    console.log("cheg")
    console.log("ain ")
}
export const checkIfVariantInDB = async(hex: string):Promise<ColorType[] | null>=>{
 console.log("🔥🔥🔥 THIS EXACT FILE RAN 🔥🔥🔥", hex)
 console.log("what??")
 //
 //console.log("WHHYY??", hex)
 const { data, error }:{data:ColorType[] | null, error: PostgrestError | null}= await supabase.rpc(
  "get_hex_variants",
  { input_hex: hex }
    )
   
    if (error){
        console.log((error))
        throw error

    } 
if(Array.isArray(data) && data.length < 1) return null
 console.log("wht is returned",data)
    return data
}
export const handleSingleColor =async(hexVal:string):Promise<ColorType>=>{
      const hexing:ColorType[] | null = await supabaseLimiter(()=>checkIfVariantInDB(hexVal))
      console.log(hexing, "hexing")
       const hexVariantArr:FrontEndHexBodyType[] = []
        const colorNameArr: FrontEndColorType[] =[]
        if(!hexing || hexing.length < 1) {
            console.log("connfusioon")
                const test:ColorType =  await getColorName(hexVal)
                const {hex, closest_named_hex, clean_hex, name} = test
                 hexVariantArr.push({hex,closest_named_hex, clean_hex})
                  colorNameArr.push({name, closest_named_hex})
                    // await sendRequestWithBody("POST",colorNameArr, "named_colors")
                    console.log("we are HERE")
                    await supabaseLimiter(()=>{
                        saveNamedColor(colorNameArr)
                        saveHexVariant(hexVariantArr)

                    }) 
            
                  return test
        }else{
            return hexing[0]
        }
        //if it isn't not only do we get it from the api but we also add it to the database
}
type FrontEndHexBodyType ={
    hex:string, closest_named_hex:string, clean_hex: string
}
export function delay(ms: number) {
            return new Promise((resolve) => {setTimeout(resolve, ms)});
}

type FrontEndColorContrastType ={
    hex1:string, hex2:string,contrast_ratio: number, aatext:boolean, aaatext: boolean
}
export const addColorContrastsArr = async(mainColor:string, otherColors: ColorSchemeTypeArr)=>{
    const hexVariantArr:FrontEndHexBodyType[] = []
    const colorContrastArr: FrontEndColorContrastType[] =[]
for(const col of otherColors){
    const {hex,closest_named_hex, clean_hex, contrast_ratio,aatext, aaatext
    } = col
    const [hex1,hex2] = [mainColor,hex].sort()
    hexVariantArr.push({hex,closest_named_hex, clean_hex})
    colorContrastArr.push({hex1,hex2,contrast_ratio:Number(contrast_ratio),aatext,aaatext})
    }
   await supabaseLimiter(()=>saveColorContrast(colorContrastArr)) 
    await supabaseLimiter(()=>saveHexVariant(hexVariantArr))  
}
export const addHexVariantsArr = async(otherColors: ColorSchemeTypeArr)=>{
     const hexVariantArr:FrontEndHexBodyType[] = []
    const colorNameArr: FrontEndColorType[] =[]
    for(const col of otherColors){
    const {hex, clean_hex, closest_named_hex, name} = col
    hexVariantArr.push({hex,closest_named_hex, clean_hex})
    colorNameArr.push({name, closest_named_hex})
    }
     await supabaseLimiter(()=>saveNamedColor(colorNameArr))  
    await supabaseLimiter(()=>saveHexVariant(hexVariantArr))  
}




///LOGGED IIN USER REQUESTS
export const getUserSavedSchemesRequest=  async(): Promise<UserSchemeDataType[] |null>=>{
    console.log("SUPABASE QUERY START");
const { data, error } = await supabase
  .from("saved_user_color_schemes")
  .select("aaatext,aatext,contrast_ratio,hex1,hex1name, hex2, hex2name,id,scheme_name")
  .order('created_at', { ascending: false }).overrideTypes<UserSchemeDataType[]>()
   if (error){
        console.log((error))
        throw error
    } 
console.log(data, "data here")
console.log("SUPABASE QUERY END", { data, error });
    return data 
}
export type DeleteUserColorSchemeType={
   id:string,
    hex1:string,
    hex2:string,
}
export const sendUserDeleteRequest =async(id:number)=>{
    try{
          const { data, error } = await supabase
        .from("saved_user_color_schemes")
        .delete()
        .eq("id",id)
       
  
if(error)throw error
return data
    }catch(err){
        throw new Error(`in user Delete Request in requestFunctions ${err}`)
    }
}

export const saveColorSchemeForUser =async(pickedScheme: UserSchemeDataType)=>{
    const {scheme_name, hex1,hex1name, hex2,hex2name,contrast_ratio, aatext, aaatext} = pickedScheme
    const { error } = await supabase.from("saved_user_color_schemes").
    upsert({
        scheme_name:scheme_name,
        hex1:hex1,
        hex1name:hex1name,
        hex2:hex2,
        hex2name:hex2name,
        contrast_ratio:contrast_ratio, 
        aatext:aatext,
        aaatext:aaatext
        })
        console.log("stuff")
        if(error){
            console.log(error)
        }
}



export const updateSchemeNameForUser =async(id:number, scheme_name:string)=>{
    try{
         const {error} = await supabase.from("saved_user_color_schemes").upsert({scheme_name:scheme_name}).eq("id", id)
   if(error)throw error

    }catch(err){
              if(err instanceof Error){

            console.log(err.message)
        }
        throw new Error(`in user updateSchemeNameForUser in requestFunctions ${err}`)
  
    }
}

