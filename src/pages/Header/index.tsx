import React from 'react'
import { useNavigate } from 'react-router'
import './header.scss'
import useHistory from 'react-router-dom'

const Header = () => {
    
    const navigate = useNavigate();
    
    const handle_Logout = () =>{
        navigate("login");
    }

    return (
        <div className='header-main'>
            <div>Agro</div>
            <div onClick={handle_Logout} className="header-logout">Logout</div>
        </div>
    )
}

export default Header