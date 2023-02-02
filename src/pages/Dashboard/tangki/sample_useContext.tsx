import React from 'react'
import { useGlobalContext } from '../../../services/globalContext';

// tes membuat function global dengan createContext & useContext
const UseContextSample = () => {
    const { formatDate } = useGlobalContext();
    // alert(formatDate(new Date(),'HH:mm'));
    
    return (
        <div>use Context</div>
    )
}

export default UseContextSample