export default (style)=>{
  return(`

    .Alert {
      background: color-mix(in srgb, ${style.colors.warning} 20%, ${style.colors.background} 80%);
      border: 1px solid ${style.colors.warning};
      border-radius: 7px;
      font-weight: 500;
      padding: 8px;
    }

    .Alert, .Alert * {
      color: ${style.colors.text};
    }
  `)
}
