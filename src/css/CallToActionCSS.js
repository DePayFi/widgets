const CallToActionCSS = `
  .CallToAction {
    background: #d7477a;
    display: inline-block;
    border-radius: 999rem;
    border: 1px solid transparent;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    color: white;
    font-size: 1.35rem;
    letter-spacing: 0px;
    line-height: 2.0rem;
    padding: 0.6rem 1.4rem;
    text-decoration: none;
    transition: background 0.1s;
  }

  .CallToAction.circular {
    padding: 0;
    width: 3.4rem;
    height: 3.4rem;
    line-height: 3.2rem;
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

  .Table .CallToAction {
    white-space: nowrap;
    width: 100%;
    display: block;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  .Table .CallToActionName {
    display: none;
  }

  .Table .TableCell:first-child {
    padding-right: 3px;
  }

  .Table .TableCell:last-child {
    padding-left: 3px;
  }

  .CallToAction.disabled {
    background: rgb(210,210,210);
  }
`;

export default CallToActionCSS;
