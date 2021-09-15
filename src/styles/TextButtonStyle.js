export default (style)=>{
  return(`

    .TextButton {
      cursor: pointer;
      font-size: 16px;
      color: ${style.colors.primary}
    }

    .TextButton.TextGrey {
      color: grey;
    }
    
    .TextButton.TextGrey:hover {
      color: ${style.colors.primary}
    }
  `)
}
