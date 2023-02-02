import React from 'react'
import { Link, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import CreateBlog from '../CreateBlog'
import CreateBlogChild from '../CreateBlogChild'
import DetailBlog from '../DetailBlog'
import Footer from '../Footer'
import Header from '../Header'
import Login from '../login'
import './HomeApp.scss'

const Home = () => {
  return (
    <div className='home-wrapper'> 
        <div>
          <Header />
        </div>

        <div className='home-body'>
          <Routes>
              <Route index element = {<Navigate to = "/detail-blog" />} />
              
              <Route path = "create-blog" element = {<CreateBlog />}>
                  <Route path = ":id" />
                  <Route path = "child" element = {<CreateBlogChild />}/>
              </Route>

              <Route path = "detail-blog" element = {<DetailBlog />} />
              <Route path = "*" element = {<p>Path not resolved</p>} />
          </Routes>
        </div>
        
        <div>
          <Footer />
        </div>
    </div>
  )
}

export default Home