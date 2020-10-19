const LoadingDotsCSS = `

  @keyframes blink {
    0% { opacity: .2; }
    20% { opacity: 1; }
    100% { opacity: .2; }
  }

  .loading .dot {
    animation-name: blink;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }

  .loading .dot:nth-child(2) {
    animation-delay: .2s;
  }

  .loading .dot:nth-child(3) {
    animation-delay: .4s;
  }

`;

export default LoadingDotsCSS;
