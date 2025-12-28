import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { authStateStore } from "../store/projectStore"
export const LoginButton =()=>{
  const  setAuthError = authStateStore(state=>state.setAuthError)
        const navigate = useNavigate()
        const signInWithGoogle =async()=>{          
             const {error} = await supabase.auth.signInWithOAuth({
            provider:"google",
              options: { redirectTo: window.location.origin  }           
        })
        if(error){
            setAuthError(`Google sign in error: ${error.message}`, )
        }else{ 
            setAuthError("redirecting . google login")
        }  
       navigate("/")       
    }
    return(
        <>
        <button onClick={(e)=>{ e.preventDefault(); signInWithGoogle(); }}>Sign in With Google</button>     
        </>
    )
}

