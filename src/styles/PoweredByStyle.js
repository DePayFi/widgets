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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
      color: white;
      opacity: 0.4;
      display: inline-block;
      font-size: 14px;
      font-style: italic;
      font-weight: bold;
      letter-spacing: -0.2px;
      margin-left: 8px;
      text-decoration: none;
    }

    .PoweredByLink:hover, .PoweredByLink:active {
      opacity: 1.0;
      color: ${style.colors.primary};
    }
  `)
}
