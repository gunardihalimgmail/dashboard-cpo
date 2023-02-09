import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { bindActionCreators } from 'redux';
import logo from '../assets/images/logo.svg';
import { Route_custom } from '../config';
import { actionCreators, State } from '../state';
import './App.css';
import Login from './login';
import useUpdateLogger from './customHook/useUpdateLogger';
import useLocalStorage from './customHook/useLocalStorage';
import usePrevPage from './customHook/usePrevPage';

function App() {
  
    // useEffect(
    //   () => {
    //     const t = setTimeout(
    //       () => {
    //         console.log('HELLO USE UPDATE LOGGER => useEffect ');
    //       },
    //       0
    //     );

    //     return () => {
    //       clearTimeout(t);
    //     }
    //   },
    //   [],
    // );


  // CONTOH REDUX
  // const dispatch = useDispatch();

  // const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(actionCreators, dispatch)
  // const amount = useSelector((state: State)=> state.bank)
  // ... <end redux>

  // === CUSTOM HOOK ===
  // const [val, setVal] = useLocalStorage("kunci",'');

  return (
      
      // <div className='App'>
      //     <h1>{amount}</h1>
      //     <button onClick={() => depositMoney(1000)}>Deposit</button>
      //     <button onClick={() => withdrawMoney(500)}>Withdraw</button>
      //     <button onClick={() => bankrupt()}>Bankrupt</button>
      // </div>

      <Route_custom />

      // === CUSTOM HOOK ===
      // <div>
      //   {val} <br />

      //   <input 
      //     type = "text"
      //     value={val}
      //     onChange={e=>{
      //         setVal(e.target.value)
      //     }}
      //     />
      // </div>


        

      // begin === contoh home react 

      // <BrowserRouter>
      //     <Routes>
      //         <Route path = "/" element = {<Login />} />
      //     </Routes>
      // </BrowserRouter>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
        
    //     <p>
    //       Edit Hello <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
