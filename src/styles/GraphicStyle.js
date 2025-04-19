export default (style)=>{
  return(`

    .GraphicWrapper {
      display: block;
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%);
      padding: 10px 0;
    }

    .Graphic {
      width: 50%;
      position: relative;
    }
  `)
}
