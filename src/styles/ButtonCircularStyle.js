export default (style)=>{
  return(`

    .ButtonCircular {
      border-radius: 9999px;
      border: 1px solid transparent;
      cursor: pointer;
      height: 34px;
      opacity: 0.5;
      padding: 5px 4px 4px 4px;
      width: 34px;
    }

    .ButtonCircular:focus {
      border: 1px solid ${style.colors.primary};
    }

    .ButtonCircular:hover {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%);
      opacity: 1;
    }

    .ButtonCircular:active {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 85%, ${style.colors.mixActive} 15%);
      opacity: 1;
    }
  `)
}
