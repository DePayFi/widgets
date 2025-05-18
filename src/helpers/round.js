import { Decimal } from 'decimal.js'

export default (input, direction = 'up')=>{
  const decimalInput = new Decimal(input)
  const origDp = decimalInput.decimalPlaces()
  // fixed representation of the input
  const inputStr = decimalInput.toFixed(origDp)

  // split into integer and fractional parts
  const [intStr, frac = ''] = inputStr.split('.')
  // count leading zeros in fractional part when <1
  const zerosCount = decimalInput.gte(1) ? 0 : (frac.match(/^0*/)[0].length)
  // threshold DP: 3 for >=1, zerosCount+3 for <1
  const thresholdDp = decimalInput.gte(1) ? 3 : zerosCount + 3

  // if no rounding needed, return original (pad integers to two decimals)
  if (origDp <= thresholdDp) {
    if (origDp === 0) {
      return decimalInput.toFixed(2)
    }
    return inputStr
  }

  // perform rounding
  const mode = direction === 'down' ? Decimal.ROUND_FLOOR : Decimal.ROUND_CEIL
  const result = decimalInput.toDecimalPlaces(thresholdDp, mode)
  let resStr = result.toFixed(thresholdDp)

  // if rounding yields zero, fall back to original
  if (new Decimal(resStr).eq(0)) {
    return inputStr
  }

  // trim or pad trailing zeros
  if (resStr.includes('.')) {
    let [iPart, fPart] = resStr.split('.')
    if (/^0*$/.test(fPart)) {
      // fractional all zeros => decide padding on magnitude
      if (decimalInput.lt(1)) {
        fPart = '00'
      } else if (decimalInput.lt(10)) {
        fPart = '0'
      } else if (decimalInput.lt(100)) {
        fPart = ''
      } else if (decimalInput.lt(1000)) {
        fPart = '00'
      } else {
        fPart = ''.padEnd(thresholdDp, '0')
      }
    } else {
      // remove only trailing zeros
      fPart = fPart.replace(/0+$/, '')
    }
    resStr = fPart ? `${iPart}.${fPart}` : iPart
  }

  return resStr
}
