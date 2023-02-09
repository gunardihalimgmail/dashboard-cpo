import React, {useState, useEffect} from 'react'

const usePrevPage = (page:any) => {

    const [lastPage, setLastPage] = useState(page);
    
    useEffect(()=>{
        setLastPage(page)
    });

    return lastPage;
}

export default usePrevPage