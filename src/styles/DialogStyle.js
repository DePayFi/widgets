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
      display: flex;
      flex-direction: row;
      position: relative;
    }

    .DialogHeaderTitle {
      flex-basis: auto;
      flex-grow: 1;
    }
    
    .DialogHeaderAction {
      height: 3rem;
    }

    .DialogFooter {
      background: rgb(248,248,248);
      border-bottom-left-radius: 0.8rem;
      border-bottom-right-radius: 0.8rem;
      line-height: 1.5rem;
      min-height: 2rem;
      position: relative;
      text-align: center;
    }

  `)
}
