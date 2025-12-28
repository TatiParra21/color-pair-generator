import { NavLink } from "react-router-dom"
import { checkFunction } from "../functions/requestFunctions"
const Header: React.FC =()=>{
    type SelectedStyles ={
        color: string,
        fontWeight:"bold",
        textDecoration: "underline"
    }
    const defaultSelectedStyle: SelectedStyles = {
        color: "#161616",
        fontWeight: "bold",
        textDecoration: "underline",
}
    const selectedStyle ={
        ...defaultSelectedStyle,
        color:"red"
    }

    return(
        <div className="header">
            <h1>My Component Library</h1>
                <div className="top-tab">
                   
                    <nav >
                        <NavLink style={({isActive})=>isActive ? selectedStyle : undefined} to="/">Dashboard</NavLink>
                        <NavLink style={({isActive})=>isActive ? selectedStyle : undefined} to="badges">Badges</NavLink>                   
                        <NavLink style={({isActive})=>isActive ? selectedStyle : undefined} to="cards">Cards</NavLink>
                      <button onClick={checkFunction}>chce</button>
                    </nav>
                </div>
        </div>
    )
}
export default Header