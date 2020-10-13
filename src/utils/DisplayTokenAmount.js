const DisplayTokenAmount = function(amount, decimals, symbol){
  const float = DePay.ethers.utils.formatUnits(amount, decimals);
  const subZeroMatch = float.toString().match(/(?!0)\d/)
  let displayedValue = float.toString();
  if(float.toString().match(/\./) && subZeroMatch) {
    if(float.toString().match(/\./).index > 1) {
      displayedValue = parseFloat(float.toString()).toFixed(2).replace('.00', '')
    } else {
      displayedValue = displayedValue.substring(0, subZeroMatch.index+3).replace(/\.$/, '')
    }
  }
  return `${displayedValue} ${symbol}`
}

export default DisplayTokenAmount;
