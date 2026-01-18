import { create } from "zustand";
import type { ColorInfo } from "../types";
import { supabase } from "../supabaseClient";
import { getUserSavedSchemesRequest,  } from "../functions/requestFunctions";
import { type UserSchemeDataType } from "../types";
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



import {type Session } from '@supabase/supabase-js'
export type AuthStateType = {
  session: Session | null,
  userSchemes: UserSchemeDataType[] | null,
  fetchUserSchemes: () =>Promise<UserSchemeDataType[] | null>,
  authSubscription: null |{ unsubscribe: () => void },
    email:string,
    authError: string |null,
    setAuthError:  (message:string|null)=>void,
  updateUserSchemes: ()=>Promise<void>,
  initAuth: () => void,
  signOut:()=>Promise<void>

}
export const authStateStore = create<AuthStateType>((set,get)=>{ 
    let sessionInProgress = false;   
    return{
        session:  null,
        userSchemes:null, 
        authError: null,
        setAuthError:  (message:string|null)=>set({authError:message}),
        fetchUserSchemes: async(): Promise<UserSchemeDataType[] | null>=>{    
           const userSchemes: UserSchemeDataType[] | null = await getUserSavedSchemesRequest()       
            return userSchemes  
    },
        email:"",
        updateUserSchemes: async()=>{
            const updatedSchemes:UserSchemeDataType[] | null =await authStateStore.getState().fetchUserSchemes()     
            if(updatedSchemes){
                set({userSchemes:updatedSchemes})
            }
        },
        authSubscription:null,
        initAuth: async() => {
            try{
                   if(sessionInProgress)return
                sessionInProgress = true 
                console.log("new sess")             
                const {data:{session:initialSession}, error} = await supabase.auth.getSession()
                if(initialSession){
                       set({ session: initialSession, email: initialSession.user.email });
                        // Start fetching data early
                        get().updateUserSchemes();
                }    
                const {data:{user}, error:userError} = await supabase.auth.getUser()           
                 if (userError || !user) {
                    set({session:null})
       // const schemes = await get().fetchUserSchemes();
       // set({ set:data.session });
    }


       if(!get().authSubscription){
      const {data:{subscription}}=  supabase.auth.onAuthStateChange(async(event, newSession) => {
            console.log("change", event)
            if(newSession){
               await get().updateUserSchemes();
                 console.log(newSession, "session")
            set({ session: newSession,
                email: newSession?.user?.email,     
            });
            }
              
        });
        set({authSubscription:subscription})
       } 
       
        }catch(err){
            console.warn("Auth lock error ignored", err)
            console.error("there was an error here")
            }    
    }, 
    
    signOut:  async()=>{       
    try{    

        // Try signOut
        const {error} = await supabase.auth.signOut()
        if(error) throw new Error(error.message)
        set({ session: null, email: "", userSchemes:null, authSubscription:null });       
    }catch(err){
        console.error(err)
    }   
}
    }
})

export const selectSession = (state:AuthStateType)=>state.session
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
