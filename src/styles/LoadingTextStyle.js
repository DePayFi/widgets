export default (style)=>{
  return(`

    .LoadingText {
      color: white;
      display: inline-block;
      text-decoration: none;
      vertical-align: middle;
    }

    @keyframes blink {
      0% { opacity: .2; }
      20% { opacity: 1; }
      100% { opacity: .2; }
    }
    
    .LoadingText .dot {
      animation-name: blink;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
    }
    
    .LoadingText .dot:nth-child(2) {
      animation-delay: .2s;
    }
    
    .LoadingText .dot:nth-child(3) {
      animation-delay: .4s;
    }
  `)
}
