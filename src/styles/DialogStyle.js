export default (style)=>{
  return(`

    .ReactDialogBackground {
      backdrop-filter: blur(5px);
      background: rgba(0,0,0,0.7);
    }

    .Dialog {
      margin: 0 auto;
      position: relative;
      width: 420px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      border-radius: 0.8rem;
      background: rgb(248,248,248);
    }

    @media screen and (max-width: 450px) {
      .Dialog, .ReactDialogAnimation {
        width: 100%;
      }
    }

    @media (orientation: portrait) and (max-width: 900px) {

      .ReactDialog {
        height: 100%;
        min-height: 100%;
      }

      .ReactDialogStack {
        align-items: flex-end;
      }

      .Dialog {
        align-content: stretch;
        display: flex;
        flex-direction: column;
      }

      .DialogBody {
        flex: 1;
        align-items: flex-end;
      }

      .DialogFooter {
        padding-bottom: 20px;
      }

      .ReactDialogAnimation {
        margin-bottom: -100px !important;
        top: inherit !important;
        position: relative;
        transition: opacity 0.4s ease, margin-bottom 0.4s ease;
      }

      .ReactDialog.ReactDialogOpen .ReactDialogAnimation {
        margin-bottom: 0px !important;
      }

      .DialogHeader {
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
      }

      .DialogFooter {
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      .ReactShadowDOMInsideContainer > .ReactDialog {
        align-items: flex-end;
      }
    }

    .DialogBody {
      background: rgb(248,248,248);
      overflow-x: hidden;
      overflow-y: auto;
    }

    .DialogBody.ScrollHeight {
      height: 30vh !important;
      max-height: 30vh !important;
    }

    .DialogHeader {
      background: rgb(248,248,248);
      border-top-left-radius: 0.8rem;
      border-top-right-radius: 0.8rem;
      min-height: 3.4rem;
      position: relative;
      width: 100%;
    }

    .DialogHeaderActionRight {
      position: absolute;
      top: 0;
      right: 0;
      height: 3rem;
    }

    .DialogHeaderActionLeft {
      position: absolute;
      top: 0;
      left: 0;
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
