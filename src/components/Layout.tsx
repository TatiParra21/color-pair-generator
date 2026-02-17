import { Outlet } from "react-router-dom"
import { type JSX } from "react"
import Header from "./Header"
import { NavLink } from "react-router-dom"
import { authStateStore, selectEmail, selectSession } from "../store/projectStore"
import { UserMenu, } from "./UserMenu"
const SignInUpComponents = (): JSX.Element => {
    return (
        <div className="flex flex-row self-end gap-2">
            <NavLink to="sign-in" >Sign In</NavLink>
            <NavLink to="sign-up" >Sign Up</NavLink>
        </div>
    )
}
//  
const UserIsSignedIn = ({ email }: { email: string, }) => {
    return (
        <div className="self-end gap-2 flex flex-row">
            <NavLink to="my-color-schemes" >My ColorSchemes</NavLink>
            <UserMenu email={email} />
        </div>
    )
}
const Layout = () => {
    const session = authStateStore(selectSession)
    const email = authStateStore(selectEmail)
    console.log(session, "SESION hER")
    if (!session) {
        console.log("no sessi on")
    }
    return (
        <>
            <main className="w-full">
                {session ? <UserIsSignedIn email={email} /> : <SignInUpComponents />}
                <Header />
                <Outlet />
            </main>
            <footer className="text-center p-4">This is the Footer</footer>
        </>
    )
}
export default Layout
