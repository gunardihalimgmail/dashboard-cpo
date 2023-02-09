import React, {useState, useEffect} from 'react'

function getSavedValue(key:any, initialValue:any){
    const getVal = localStorage.getItem(key);
    if (getVal != null) return getVal;

    if (initialValue instanceof Function) return initialValue()
    return initialValue
}

const useLocalStorage = (key:any, initialValue?:any) => {

    const [value, setValue] = useState(()=>{
            return getSavedValue(key, initialValue);
    })

    // similar to componentDidMount & componentDidUpdate
    useEffect(()=>{
        localStorage.setItem(key, value);
        // alert(initialValue)
    }, [value])

    return [value, setValue]
}

export default useLocalStorage