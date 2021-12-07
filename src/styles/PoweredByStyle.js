export default (style)=>{
  return(`

    .PoweredByWrapper {
      display: block;
      left: 0;
      padding-top: 0.2rem;
      position: fixed;
      right: 0;
      text-align: center;
      top: 0;
    }

    .PoweredByLink {
      color: white;
      opacity: 0.4;
      display: inline-block;
      font-size: 0.78rem;
      font-style: italic;
      font-weight: bold;
      letter-spacing: -0.2px;
      margin-left: 0.5rem;
      text-decoration: none;
    }

    .PoweredByLink:hover, .PoweredByLink:active {
      opacity: 1.0;
      color: ${style.colors.primary};
    }
  `)
}
