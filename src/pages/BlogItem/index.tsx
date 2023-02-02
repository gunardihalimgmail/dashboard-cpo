import React from 'react'
import { LukePorter } from '../../assets'
import './BlogItem.scss'

const BlogItem = () => {
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

  return (
    <div className='blog-wrapper'>
        <img src = {LukePorter} className='blog-img-top' />
        <div className='blog-wrapper-detail'>
            <div className='blog-title'>
                <span>Title dari Blog</span>
                <div className='blog-title-date'>{new Date().getDate().toString() + " " + monthNames[new Date().getMonth()] + " " + new Date().getFullYear().toString()}</div>
            </div>
            <p className='blog-detail'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio optio quam, molestiae, laudantium ad tenetur ducimus necessitatibus fugiat cupiditate asperiores voluptatem minima consequatur unde veritatis porro est non praesentium quasi.</p>
        </div>
    </div>
  )
}

export default BlogItem