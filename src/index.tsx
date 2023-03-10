import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStoreHook } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import { legacy_createStore as createStore }  from 'redux'
import { Provider } from 'react-redux'
import { store } from './state/index'
import 'bootstrap/dist/css/bootstrap.css'

import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css"
import "react-clock/dist/Clock.css"

// import 'react-notifications/lib/notifications.css';
// import { ToastProvider } from 'rc-toastr';

// toastr
// import "rc-toastr/dist/index.css" // import the css file
import 'react-toastify/dist/ReactToastify.css';


// Redux (penyimpanan data global)
// const createStores = createStore;

// const globalState = {
//   totalOrder: 0
// }

// const rootReducer = (state = globalState, action:any) => {
//     return state
// }
// const storeRedux = createStores(rootReducer)
// ... <end>

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// HIDE CONSOLE WHEN BUILD
if (process.env.NODE_ENV == 'production'){
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

root.render(
  // react.strictmode => make running twice when first load
  
  // <React.StrictMode>  
      <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
