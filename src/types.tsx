export type ColorSchemeType ={
    clean_hex: string
    name:string
    hex: string
    contrast_ratio:string | number
     aatext:boolean
    aaatext: boolean
    closest_named_hex: string
}
export type ColorAndSchemeType ={
    pickedColor: ColorInfo
    colorScheme: ColorSchemeTypeArr
}
export type SavedUserColorSchemeType={
  user_id:string,
  scheme_name:string,
  hex1:string,
  hex1name:string,
  hex2:string,
  hex2name:string,
  contrast_ratio: number, 
  aatext:boolean, 
  aaatext:boolean
}
export type ColorSchemeTypeArr = ColorSchemeType[]

//Same color name type are all colors who have the same name but different hex numbers
export type SameColorNameType ={
    name: string,
    closest: string,
    hex: string
    variants: ColorSchemeType[]
}
export type ColorType ={
    name: string, 
    hex: string, 
    clean_hex: string,
    closest_named_hex: string
}
//Color info is the chosen color with it's contrasting colors
export type ColorInfo ={
   mainColor: ColorType
    contrastColors: ColorSchemeTypeArr
}

export type ColorNameType = Omit<ColorInfo,"hex">
export type checkIfVariantInDBResult ={
    results?: ColorType[]
    message: string
    found: boolean
}
export type FrontEndColorType ={
name:string, closest_named_hex: string
}
export type VariantResType ={
    name:string,
    hex:string,
    clean_hex:string,
    contrast_ratio: number, 
    aatext:boolean, 
    aaatext:boolean,
    closest_named_hex: string
}

export type ComponentStyleType ={
  color: string
  background:string
  padding?: string
  aspectRatio?:string
  height?: string
  width?:string
  
}
export type UpdateUserColorSchemeNameType={
  user_id:string,
  scheme_name:string,
    hex1:string,
    hex2:string,
}
export type ComponentType ={
   
    variant:ColorSchemeType,
    colorName: string,
    mainStyle: ComponentStyleType,
    
}

export type ComponentBaseType ={
    baseColor: string,
    variant:ColorSchemeType,
    colorName: string,
    type: string
}
export type VariantType ={
    contrastColor: ColorSchemeType,
    baseColor: string,
   
}
export type Variant ={
    variant: ColorSchemeType,
    baseColor: string,
}
export type Variants = Omit<VariantType, "firstVariant">
