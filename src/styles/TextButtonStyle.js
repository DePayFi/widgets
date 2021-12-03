export default (style)=>{
  return(`

    .TextButton {
      cursor: pointer;
      font-size: 16px;
      color: ${style.colors.primary}
    }

    .TextButton:hover * {
      opacity: 1.0;
    }
  `)
}
