export default (style)=>{
  return(`

    .Link {
      color: ${style.colors.primary};
      cursor: pointer;
      text-decoration: none;
    }

    .Link:hover {
      filter: brightness(0.8);
    }

    .Link:active {
      filter: brightness(1.0);
    }
  `)
}
