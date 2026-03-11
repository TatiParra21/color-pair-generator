import { supabase } from "../supabaseClient"
import { authStateStore } from "../store/projectStore"
export const LoginButton =()=>{
  const  setAuthError = authStateStore(state=>state.setAuthError)
    
        const signInWithGoogle =async()=>{          
             const {error} = await supabase.auth.signInWithOAuth({
            provider:"google",
              options: { redirectTo: window.location.origin,queryParams: {
          prompt: "select_account",
            },  
            }           
        })
        if(error){
            setAuthError(`Google sign in error: ${error.message}`, )
        }else{ 
            setAuthError("redirecting . google login")
        }  
        
    }
    return(
        <>
        <button onClick={(e)=>{ e.preventDefault(); signInWithGoogle(); }}>Sign in With Google</button>     
        </>
    )
}

