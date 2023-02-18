import React, { useState, useEffect } from 'react'

export default (props)=>{

  const [ clickCount, setClickCount ] = useState(0)

  useEffect(()=>{

    const handleClick = ()=>{
      setClickCount(clickCount+1)
      if(clickCount == 0) { return }
      props.hide()
    }
    
    window.addEventListener('click', handleClick)

    return ()=>{
      window.removeEventListener('click', handleClick)
    }
  }, [props.open, clickCount])

  return(
    <div className={ `DropDown ${props.open ? 'open' : ''}` }>
      <ul>
      { props.items.map((item, index)=>{
        return(
          <li key={ index }>
            <button className="DropDownItem" onClick={()=>item.action()}>
              { item.label }
            </button>
          </li>
        )
      }) }
      </ul>
    </div>
  )
}
