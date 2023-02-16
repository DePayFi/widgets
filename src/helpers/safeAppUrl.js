export default (href)=>{
  if (!href.includes('://')) {
    href = href.replaceAll('/', '').replaceAll(':', '')
    href = `${href}://`
  }
  return href
}
