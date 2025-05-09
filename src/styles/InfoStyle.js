export default (style)=>{
  return(`

    .Info {
      background: color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%);
      border: 1px solid color-mix(in srgb, ${style.colors.cardBackground} 70%, ${style.colors.mixActive} 30%);
      border-radius: 7px;
      font-weight: 500;
      padding: 8px;
    }
  `)
}
