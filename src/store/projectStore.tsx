import { create } from "zustand";
import type { ColorInfo } from "../types";
import { supabase } from "../supabaseClient";
import { getUserSavedSchemesRequest, type UserSchemeRowType } from "../functions/requestFunctions";

export type HexSizeAndStyleStoreType ={
    textType: "Normal" | "Large",
    setTextType: (value:"Normal" | "Large")=>void,
     mainColorAsBackground: boolean,
     switchMainColorAsBackground: ()=>void
}
export type DebouncedValues ={
    count:number
    textInput:string
}

export type ColorDataStoreType ={
    isDisabled:boolean,
    setIsDisabled: (val:boolean)=>void,
    color:string | null
    setColor:(color:string)=>void
    loadingProgress: string,
    setLoadingProgress:(message:string)=>void
    loading: boolean
    setLoading: (value: boolean)=>void
    allInfo: ColorInfo |null
    setAllInfo: (allInfo:ColorInfo)=>void
    debouncedValue: DebouncedValues,
    setDebouncedValue: (updater: (prev: DebouncedValues) => DebouncedValues) => void,
    errorMessage: string |null,
    setErrorMessage:  (message:string)=>void
     copyHex: (val:string)=>void,
   
}
export const hexSizeAndStyleStore = create<HexSizeAndStyleStoreType>((set)=>({
    textType:"Normal",
    setTextType:(value: "Normal" | "Large") => set({textType:value}),
     mainColorAsBackground:false,
     switchMainColorAsBackground: ()=>set({mainColorAsBackground: !hexSizeAndStyleStore.getState().mainColorAsBackground

     })
}))


export const colorDataStore = create<ColorDataStoreType>((set)=>({
    isDisabled:false,
    setIsDisabled: (val:boolean)=> set({isDisabled:val}),
     color:"",
     setColor:(color:string)=>set({color}),
     loadingProgress: "0",
    setLoadingProgress:(message:string)=>set({loadingProgress:message}),
    loading: false,
    setLoading: (value:boolean)=>set({loading:value}),
    allInfo: null,
    setAllInfo:(allInfo:ColorInfo)=>set({allInfo}),
    debouncedValue: {textInput:"#000000", count:50},
    setDebouncedValue: (updater:
        (prev:DebouncedValues)=>DebouncedValues)=>
            set(state=>({debouncedValue:updater(state.debouncedValue)})),
     errorMessage: null,
    setErrorMessage:  (message:string)=>set({errorMessage:message}),
     copyHex: (val:string)=>set((state)=>({
        debouncedValue:{...state.debouncedValue, textInput:val}
    })),
   

}))
export const selectLoading = (state: ColorDataStoreType) => state.loading;
export const selectAllInfo = (state: ColorDataStoreType) => state.allInfo;
export const selectColor = (state: ColorDataStoreType) => state.color;
export const selectDebouncedValue = (state: ColorDataStoreType) => state.debouncedValue;
export const selectLoadingProgress = (state: ColorDataStoreType) => state.loadingProgress;

export const selectSetColor = (state: ColorDataStoreType) => state.setColor;
export const selectSetDebouncedValue = (state: ColorDataStoreType) => state.setDebouncedValue;
export const selectSetLoadingProgress = (state: ColorDataStoreType) => state.setLoadingProgress;

export type PaginationStoreType ={
    currentPage: number,
    pageSize: number,
    total: number,
    setTotal:(num:number)=>void,
    setCurrentPage: (page:number)=>void

}

export const paginationStore = create<PaginationStoreType>(set=>({
    currentPage:1,
    pageSize:50,
    total:0,
    setTotal:(num:number)=>set({total:num}),
    setCurrentPage:(page:number)=>set({currentPage:page})
}))


export type UserSchemesData={
  scheme_name:string,
  hex1:string,
  hex1name:string,
  hex2:string,
  hex2name:string,
  contrast_ratio: number, 
  aatext:boolean, 
  aaatext:boolean
}
export type AuthStateType = {
  session: any | null,
  userId:string |null,
  userSchemes: UserSchemesData[] |null,
  fetchUserSchemes: () =>Promise<UserSchemeRowType[] | null>,
    email:string,
    authError: string |null,
    setAuthError:  (message:string|null)=>void,
  updateUserSchemes: ()=>Promise<void>,
  initAuth: () => void,
  signOut:()=>Promise<void>

}
export const authStateStore = create<AuthStateType>((set)=>{
    let sessionInProgress = false;   
    let authListener: { unsubscribe: () => void } | null = null;
    return{
        session:  null,
        userId: null,
        userSchemes:null, 
        authError: null,
        setAuthError:  (message:string|null)=>set({authError:message}),
        fetchUserSchemes: async(): Promise<UserSchemeRowType[] | null>=>{    
           const userSchemes: UserSchemeRowType[] | null = await getUserSavedSchemesRequest()       
        return userSchemes
    
    },
        email:"",
        updateUserSchemes: async()=>{
            const updatedSchemes =await authStateStore.getState().fetchUserSchemes()
        
            if(updatedSchemes){
                set({userSchemes:updatedSchemes})
            }
        },
        initAuth: async() => {
            try{
                if(sessionInProgress)return
                sessionInProgress = true
                const {data, error} = await supabase.auth.getSession()
                if(!data)throw new Error("error was here")
                if(error)throw error
                set({session:data.session,
                    })
            }catch(err){
            console.warn("Auth lock error ignored", err)
            console.error("there was an error here")
            }finally {
                sessionInProgress = false;
            }    
       const {data}= supabase.auth.onAuthStateChange(async(_event, newSession) => {
            console.log(newSession?.user, "SOmehting changed?")
       if(newSession){
         console.log(newSession, "session")
         console.log("sommethng",newSession?.user?.id)
         const userData= await authStateStore.getState().fetchUserSchemes();
        set({ session: newSession,
                userId:newSession?.user?.id,
                email: newSession?.user?.email,
                userSchemes:userData
          });
       }else{
        set({ session: null,
                userId:null,
                email: "",
                userSchemes:null 
          });
       }       
        });
        authListener = data.subscription
    },    
    signOut:  async()=>{       
    try{    
        await supabase.auth.refreshSession();
        const { data: { session } } = await supabase.auth.getSession();
          console.log("Session before signOut:", session);
        if (!session) {
            // No session, just clear local state
            set({ session: null, userId:null, email: "", userSchemes:null });
            return;
        }
        // Try signOut without scope
        const {error} = await supabase.auth.signOut()
        if(error) throw new Error(error.message)
        set({ session: null, userId:null, email: "", userSchemes:null });       
    }catch(err){
        console.error(err)
    }   
}
    }
})

export const selectSession = (state:AuthStateType)=>state.session
export const selectUserId = (state:AuthStateType)=>state.userId
export const selectEmail = (state:AuthStateType)=>state.email
export const selectUserSchemes = (state:AuthStateType)=>state.userSchemes
export const selectUpdateUserSchemes = (state:AuthStateType)=>state.updateUserSchemes
export const selectSignOut = (state:AuthStateType)=>state.signOut

export const sortingStore = create<{
  sortType: string;
  setSortType: (sort: string) => void;
  filterRatio: number;
  setFilterRatio: (ratio: number) => void;
}>((set) => ({
  sortType: "ratio", // "brightness", "contrast", etc.
  setSortType: (sort) => set({ sortType: sort }),
  filterRatio: 0, // default (no filter)
  setFilterRatio: (ratio) => set({ filterRatio: ratio }),
}));
