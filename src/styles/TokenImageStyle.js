export default (style)=>{
  return(`

    .TokenImage img {
      background: white;
      border-radius: 99rem;
      border: 1px solid white;
      background: rgba(0,0,0,0.1);
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      height: 2.8rem;
      position: relative;
      vertical-align: middle;
      width: 2.8rem;
    }

    .TokenImage.medium img {
      height: 5.8rem;
      width: 5.8rem;
    }
  `)
}
