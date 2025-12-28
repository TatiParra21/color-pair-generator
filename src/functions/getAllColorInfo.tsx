import type { ColorInfo } from "../types"
import getColorInfo from "./getColorInfo"
const getAllColorInfo =async(pick :string, count:number,setLoadingProgress:(val:string)=>void): Promise<ColorInfo>=>{
    console.log("pick", "PUC",pick)
    if (!pick)throw new Error("Badges must be used inside a ColorProvider");
    
    const colorInf  =  await getColorInfo(pick,count,setLoadingProgress)
     if(!colorInf)throw new Error("Color name not found");
      return colorInf 

}
export default getAllColorInfo