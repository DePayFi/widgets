export default (input, direction = 'up')=>{
  let inputAsFloat = parseFloat(input)

  let digitsAfterDecimal = inputAsFloat.toString().match(/\d+\.0*(\d{3})/)

  if(digitsAfterDecimal?.length) {
    digitsAfterDecimal = digitsAfterDecimal[0]
    let focus = digitsAfterDecimal.match(/\d{3}$/)[0]
    if(focus.match(/^00/)) { return inputAsFloat }
    let float 
    let focusToFixed
    if(focus.match(/^0/)) {
      if(direction == 'up') {
        float = parseFloat(`${focus[1]}.${focus[2]}`)
      } else {
        float = parseFloat(`${focus[1]}.${focus[2]}`)
      }
      focusToFixed = parseFloat(float).toFixed(1)
      focusToFixed = `0${focusToFixed}`.replace('.', '')
    } else {
      if(direction == 'up') {
        float = parseFloat(`${focus[0]}.${focus[1]}9`)
      } else {
        float = parseFloat(`${focus[0]}.${focus[1]}1`)
      }
      focusToFixed = parseFloat(float).toFixed(1).replace('.', '')
    }
    if(focusToFixed == '099' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      focusToFixed = direction == 'up' ? '100' : '990'
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{3}$/, focusToFixed)
        )
      )
    } else if(focusToFixed == '100' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{4}$/, focusToFixed)
        )
      )
    } else if(focusToFixed.toString()[0] != "0" && focusToFixed.toString().length > 2) {
      return(parseInt(inputAsFloat.toFixed(0)))
    } else {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{3}$/, focusToFixed)
        )
      )
    }
  } else {
    return(parseFloat(inputAsFloat.toFixed(2)))
  }
}
