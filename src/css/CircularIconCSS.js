const CircularIconCSS = `
  .CircularIcon {
    background: white;
    border-radius: 99rem;
    border: 1px solid transparent;
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
    height: 2rem;
    position: relative;
    vertical-align: middle;
    width: 2rem;
  }

  .CircularIcon.large {
    height: 4rem;
    width: 4rem;
  }

  .CircularIcon.noshadow{
    box-shadow: none;
  }

  .CircularIcon.notfound {
    background: #d7477a;
  }
`;

export default CircularIconCSS;
