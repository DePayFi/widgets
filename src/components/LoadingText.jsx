import React from 'react'

export default (props)=>{
  return(
    <div className='LoadingText'>
      { props.children }
      <span className='dot'>.</span>
      <span className='dot'>.</span>
      <span className='dot'>.</span>
    </div>
  )
}
