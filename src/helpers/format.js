export default (input)=>{

  let float = parseFloat(input)
  return(new Intl.NumberFormat().format(float))
}
