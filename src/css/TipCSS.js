const TipCSS = `
  .Tip {
    background: #d7477a;
    margin-top: 0.4rem;
    font-size: 0.9rem;
    padding: 0.7rem 2.8rem 0.8rem 1.15rem;
    position: relative;
    border-radius: 1.3rem;
    box-shadow: 0 0 1rem rgba(0,0,0,0.2);
    color: white;
  }

  .Tip::before {
    content: '';
    position: absolute;
    left: 1.2rem;
    top: -0.49rem;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid #d7477a;
  }

  .TipCloseButton {
    top: 0.26rem;
    right: 0.35rem;
    line-height: 0.9rem;
    position: absolute;
    transform: scale(0.8, 0.8);
    transform-origin: center center;
  }

  .TipCloseButton line {
    color: white;
  }
`;

export default TipCSS;
