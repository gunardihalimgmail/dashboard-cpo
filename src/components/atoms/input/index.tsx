import React, { ReactNode } from 'react'
import './input.scss'

interface Props{
    children?:ReactNode
}

const Input = ({label, ...rest}:any) => {
  return (
    <div className='input-group'>
        <p className='label'>{ label }</p>
        <input className='input' placeholder="form input" {...rest} />
    </div>

  )
}

export default Input