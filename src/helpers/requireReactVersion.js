import React from 'react'

export default()=>{
  if(parseInt(React.version.split('.')[0]) < 17) { throw('depay/widgets require at least React v17') }
}
