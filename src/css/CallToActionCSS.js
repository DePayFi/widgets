const CallToActionCSS = `
  .CallToAction {
    background: #d7477a;
    display: inline-block;
    border-radius: 999rem;
    border: 1px solid transparent;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    color: white;
    text-decoration: none;
    transition: background 0.1s;
  }

  .CallToAction:not(.disabled){
    cursor: pointer;
  }

  .CallToAction:not(.disabled):hover {
    background: #cc2c65;
  }

  .CallToAction:not(.disabled):active {
    background: #c12a5f;
  }
`;

export default CallToActionCSS;
