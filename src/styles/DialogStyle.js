export default ()=>{
  return(`

    .Dialog {
      margin: 0 auto;
      max-width: 26rem;
      min-width: 26rem;
      position: relative;
      width: 100%;
    }

    .DialogBody {
      background: rgb(248,248,248);
      padding: 0.8rem 1.2rem 0.2rem;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .DialogBody.HeightAuto {
      height: auto;
    }

    .DialogHeader {
      background: rgb(248,248,248);
      border-top-left-radius: 0.8rem;
      border-top-right-radius: 0.8rem;
      padding: 0.8rem 1.2rem 0 1.2rem;
      position: relative;
    }

    .DialogHeaderInner {
      position: relative;
    }

    .DialogFooter {
      background: rgb(248,248,248);
      border-bottom-left-radius: 0.8rem;
      border-bottom-right-radius: 0.8rem;
      padding: 0.15rem 1.8rem 0.15rem 1.8rem;
      position: relative;
      text-align: center;
    }

    .DialogCloseButton {
      position: absolute;
      top: 1px;
      right: -6px;
    }
    
    .DialogGoBackButton {
      position: absolute;
      top: 1rem;
      left: 0.9rem;
    }
  `)
}
