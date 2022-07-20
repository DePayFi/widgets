export default (style)=>{
  return(`

    .PoweredByWrapper {
      display: block;
      left: 0;
      padding-top: 3px;
      position: fixed;
      right: 0;
      text-align: center;
      top: 0;
    }

    .contained .PoweredByWrapper {
      position: absolute;
    }

    .PoweredByLink {
      color: white;
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
      font-size: 14px;
      font-style: italic;
      font-weight: bold;
      letter-spacing: -0.2px;
      margin-left: 8px;
      opacity: 0.5;
      text-decoration: none;
      text-shadow: black 0 0 2px;
    }

    .PoweredByLink:hover, .PoweredByLink:active {
      opacity: 1.0;
      color: ${style.colors.primary};
    }
  `)
}
