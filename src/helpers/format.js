export default (input)=>{

  let float = parseFloat(input)
  if (float < 1) { return float }
  return(new Intl.NumberFormat().format(float))
}
