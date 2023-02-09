import React, { useEffect } from 'react'

const useUpdateLogger = (value:any) => {

    useEffect(()=>{
        console.log(value)
    }, [value])
}

export default useUpdateLogger