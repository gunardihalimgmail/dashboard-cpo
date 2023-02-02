import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Gap } from '../../components'
import { actionCreators, State } from '../../state'
import BlogItem from '../BlogItem'
import './DetailBlog.scss'

const DetailBlog = () => {
  


  return (
    <div className='detail-blog-wrapper'>

      <div style = {{width:'70%',marginTop:'10px'}}>
        <div style = {{marginRight:'0',marginLeft:'auto', width:'100px'}}>
          <Button title="Details" />
          {/* <Button /> */}
        </div>
      </div>

      <div className="detail-blog-grid">
        <div className='detail-blog-size'><BlogItem /></div>
        {/* <Gap width={20} /> */}
        <div className='detail-blog-size'><BlogItem /></div>
        {/* <Gap width={20} /> */}
        <div className='detail-blog-size'><BlogItem /></div>
        <div className='detail-blog-size'><BlogItem /></div>
      </div>

    </div>
  )
}

export default DetailBlog