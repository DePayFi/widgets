export default (document)=>{
  if(typeof document === 'undefined') {
    return window.document
  } else {
    return document
  }
}
