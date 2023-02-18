export default (href)=>{
  if (href.endsWith('/')) {
    href = href.slice(0, -1)
  }
  return href
}
