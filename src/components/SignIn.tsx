import { LoginButton } from "./LoginButton";
import { supabase } from "../supabaseClient"
import { authStateStore } from "../store/projectStore"
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
const InputComponent = ({ type, category }: { type: string, category: string }) => {
  return (
    <div className="items-center g-4 justify-between flex flex-row">
      <label htmlFor={category}>{capitalizeFirstLetter(category)}:</label>
      <input
        id={category}
        type={category}
        name={category}
        defaultValue=""
        autoComplete={
          category === "email"
            ? "email"
            : type === "sign-in"
              ? "current-password"
              : "new-password"
        }
      ></input>
    </div>
  )
}
export const FormComponent = ({ type }: { type: string }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const authError = authStateStore(state => state.authError)
  const setAuthError = authStateStore(state => state.setAuthError)
  const location = useLocation()
  const fromFeature = location.state?.fromFeature ? location.state.fromFeature : ""
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const { data, error } = type == "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
      if (error) {
        setAuthError(error.message);
        return
      }
      if (type == "sign-up" && !data.session) {
        alert("Check your email for the confirmation link!");
        navigate("/login");
        return
      }
      if (data.session) {

        setAuthError(null)

        navigate("/")

      }
    }
    catch (err) {
      if (err instanceof Error)
        setAuthError("An unexpected error occurred.");
    } finally {
      setLoading(false)
    }

  }
  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}
        aria-label="Sign in form"
        aria-describedby="form-description"
        className="flex flex-col">
        {fromFeature && fromFeature == "save" && <p>You must be logged in to save</p>}
        <InputComponent category="email" type={type} />
        <InputComponent category="password" type={type} />
        {authError && <p>{authError}</p>}
        <button disabled={loading} type="submit">{type == "sign-in" ? "Sign In" : "Sign Up"}</button>
      </form>
      <LoginButton />
      {
        type == "sign-in" ? <div>
          <p>Don't have an account? </p>
          <NavLink to="/sign-up">Create one</NavLink>
        </div> :
          <div>
            <p>Already have an account? </p>
            <NavLink to="/sign-in">Sign in</NavLink>
          </div>
      }
    </div>
  )
}



