export default (style)=>{
  return(`

    .TokenImage img {
      border-radius: 9999px;
      border: 1px solid white;
      background: white;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      height: 45px;
      position: relative;
      vertical-align: middle;
      width: 45px;
    }

    .TokenImage.medium img {
      height: 93px;
      width: 93px;
    }
  `)
}
