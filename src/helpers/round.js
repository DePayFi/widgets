export default (input, direction = 'up')=>{
  let inputAsFloat = parseFloat(input)

  let digitsAfterDecimal = inputAsFloat.toString().match(/\d+\.0*(\d{5})/)

  if(digitsAfterDecimal?.length) {
    digitsAfterDecimal = digitsAfterDecimal[0]
    let focus = digitsAfterDecimal.match(/\d{5}$/)[0]
    if(focus.match(/^00/)) { return inputAsFloat }
    let float 
    let focusToFixed
    if(focus.match(/^0/)) {
      if(direction == 'up') {
        float = parseFloat(`${focus[1]}.${focus[2]}${focus[3]}${focus[4]}`)
      } else {
        float = parseFloat(`${focus[1]}.${focus[2]}${focus[3]}${focus[4]}`)
      }
      focusToFixed = parseFloat(float).toFixed(3)
      focusToFixed = `0${focusToFixed}`.replace('.', '')
    } else {
      if(direction == 'up') {
        float = parseFloat(`${focus[0]}.${focus[1]}${focus[2]}${focus[3]}9`)
      } else {
        float = parseFloat(`${focus[0]}.${focus[1]}${focus[2]}${focus[3]}1`)
      }
      focusToFixed = parseFloat(float).toFixed(3).replace('.', '')
    }
    if(focusToFixed == '00099' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      focusToFixed = direction == 'up' ? '10000' : '99000'
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{3}$/, focusToFixed)
        )
      )
    } else if(focusToFixed == '10000' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{6}$/, focusToFixed)
        )
      )
    } else if(focusToFixed.toString()[0] != "0" && focusToFixed.toString().length > 4) {
      return(parseInt(inputAsFloat.toFixed(0)))
    } else {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{5}$/, focusToFixed)
        )
      )
    }
  } else {
    return(parseFloat(inputAsFloat.toFixed(4)))
  }
}
