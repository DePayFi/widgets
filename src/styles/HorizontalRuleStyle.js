export default (style)=>{
  return(`

    hr {
      all: unset;
      display: block;
      width: 100%;
      height: 1px;
      background-color: ${style.colors.text};
      opacity: 20%;
      border: none;
    }
  `)
}
