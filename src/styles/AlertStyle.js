export default (style)=>{
  return(`

    .Alert {
      background: color-mix(in srgb, ${style.colors.warning} 60%, ${style.colors.background} 40%);
      border: 1px solid ${style.colors.warning};
      border-radius: 7px;
      font-weight: 500;
      padding: 8px;
    }
  `)
}
