export default (input, direction = 'up')=>{

  let float

  let match = parseFloat(input).toString().match(/\d+\.0*(\d{3})/)

  if(match && match.length) {
    match = match[0]
    if(direction == 'up') {
      float = match.replace(/\d{2}$/, parseInt(match[match.length-2], 10)+1)
    } else {
      float = match.replace(/\d{2}$/, parseInt(match[match.length-2], 10))
    }
  } else {
    float = parseFloat(input).toString()
  }

  return(parseFloat(float))
}
