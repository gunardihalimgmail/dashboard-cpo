import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { actionCreators, State } from '../../state';

const CreateBlogChild = () => {
    // BEGIN REDUX
    const dispatch = useDispatch();
  
    const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(actionCreators, dispatch)
    const amount = useSelector((state: State)=> state.bank)
    // ... <END>

    let [searchParams] = useSearchParams();
    let {pathname, search} = useLocation();

    return (
        <div>
            {/* begin redux */}
            <div className='App'>
                <h1>{amount}</h1>
                <button onClick={() => depositMoney(1000)}>Deposit</button>
                <button onClick={() => withdrawMoney(500)}>Withdraw</button>
                <button onClick={() => bankrupt()}>Bankrupt</button>
            </div>
            {/* ... end begin redux */}

            CreateBlogChild
            <div>
                <span style = {{color:'blue'}}>Search Params ID : {searchParams.get("id")}</span>
            </div>
        </div>
        
    )
}

export default CreateBlogChild