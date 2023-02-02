import React from 'react'
import { Img_Facebook, Img_Instagram, Img_Linkedin, Img_Twitter } from '../../assets'
import './footer.scss'

const Img = ({...rest}) =>{
    return (
        <div className='footer-img-wrapper'>
            <img {...rest} className="footer-img" />
        </div>
    )
}

const Footer = () => {
  return (
        <div>
            <div className='footer-main'>
                <div>Copyright ©</div>
                <div className='footer-img-flex'>
                    <Img src={Img_Facebook}/>
                    <Img src={Img_Instagram}/>
                    <Img src={Img_Linkedin}/>
                    <Img src={Img_Twitter}/>
                </div>
            </div>
        </div>
  )
}

export default Footer