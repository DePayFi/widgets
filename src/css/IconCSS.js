const IconCSS = `

  .Icon {
    height: 20px;
    position: relative;
    top: -1px;
    vertical-align: middle;
    width: 20px;
  }

  .Icon.large {
    height: 24px;
    width: 24px;
    top: 0px;
  }

  .Icon.grey * {
    fill: rgb(210,210,210);
    stroke: rgb(210,210,210);
  }

  .Icon.white path {
    fill: white;
    stroke: white;
  }

  .Icon.translucent {
    opacity: 0.6;
  }

  .Icon.translucent:hover {
    opacity: 1.0;
  }

`;

export default IconCSS;
