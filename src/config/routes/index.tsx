import react from 'react'
import { BrowserRouter } from "react-router-dom"
import { Navigate, Route, Routes } from 'react-router'
import Login from '../../pages/login'
import Register from '../../pages/register'
import Home from '../../pages/Home'
import CreateBlog from '../../pages/CreateBlog'
import DashboardTangki from '../../pages/Dashboard/tangki'
import UseContextSample from '../../pages/Dashboard/tangki/sample_useContext'

const Route_custom = () => (
    // <Route path = "/login" element = {<Login />} />
    
          <Routes>
                {/* <Route index element = {<Home />} /> */}
                <Route path = "/dashboard">
                        <Route index element = {<Navigate to = "tangki" />} />
                        <Route path = "tangki" element = {<DashboardTangki />} />
                        
                        {/* hanya untuk tes  use Context */}
                        {/* <Route path = "tangki" element = {<UseContextSample />} /> */}
                </Route>
                <Route path = "/login" element = {<Login />} />
                <Route path = "/register" element = {<Register />} />

                {/* halaman awal redirect ke dashboard -> tangki */}
                {/* <Route path = "/*" element = {<Home />}/> */}
                <Route path = "/*" element = {<Navigate to = "/dashboard" />}/>
          </Routes>
    // </BrowserRouter>
)
    

export default Route_custom