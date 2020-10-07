const DialogCSS = `
  .Dialog {
    margin: 0 auto;
    position: relative;
    width: 26rem;
  }

  .DialogBody {
    background: white;
    height: 40vh;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 1px solid rgb(238,238,238);
    border-bottom: 1px solid rgb(238,238,238);
  }

  .DialogBody.HeightAuto {
    height: auto;
  }

  .DialogHeader {
    padding: 1.1rem 1.8rem 1.2rem 1.8rem;
    background: rgb(248,248,248);
    position: relative;
    min-height: 4rem;
    border-top-left-radius: 1.6rem;
    border-top-right-radius: 1.6rem;
  }

  .DialogFooter {
    background: rgb(248,248,248);
    border-bottom-left-radius: 1.6rem;
    border-bottom-right-radius: 1.6rem;
    border-top: 1px solid rgb(255,255,255);
    padding: 0.6rem 1.8rem 0.8rem 1.8rem;
    position: relative;
    text-align: center;
  }

  .DialogCloseButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

export default DialogCSS;
