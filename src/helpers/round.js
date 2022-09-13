export default (input, direction = 'up')=>{
  let inputAsFloat = parseFloat(input)

  let digitsAfterDecimal = inputAsFloat.toString().match(/\d+\.0*(\d{4})/)

  if(digitsAfterDecimal?.length) {
    digitsAfterDecimal = digitsAfterDecimal[0]
    let focus = digitsAfterDecimal.match(/\d{4}$/)[0]
    let float 
    let focusToFixed
    if(focus.match(/^0/)) {
      if(direction == 'up') {
        float = parseFloat(`${focus[1]}.${focus[2]}${focus[3]}`)
      } else {
        float = parseFloat(`${focus[1]}.${focus[2]}${focus[3]}`)
      }
      focusToFixed = parseFloat(float).toFixed(2)
      focusToFixed = `0${focusToFixed}`.replace('.', '')
    } else {
      if(direction == 'up') {
        float = parseFloat(`${focus[0]}.${focus[1]}${focus[2]}9`)
      } else {
        float = parseFloat(`${focus[0]}.${focus[1]}${focus[2]}1`)
      }
      focusToFixed = parseFloat(float).toFixed(2).replace('.', '')
    }
    if(focusToFixed == '0999' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      focusToFixed = direction == 'up' ? '1000' : '0999'
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{4}$/, focusToFixed)
        )
      )
    } else if(focusToFixed == '1000' && parseInt(inputAsFloat.toFixed(0)) == 0) {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{5}$/, focusToFixed)
        )
      )
    } else if(focusToFixed.toString()[0] != "0" && focusToFixed.toString().length > 3) {
      return(parseInt(inputAsFloat.toFixed(0)))
    } else {
      return(
        parseFloat(
          digitsAfterDecimal.replace(/\d{4}$/, focusToFixed)
        )
      )
    }
  } else {
    return(parseFloat(inputAsFloat.toFixed(3)))
  }
}
