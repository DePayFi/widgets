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

      .Dialog {
        align-content: stretch;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .DialogBody {
        flex: 1;
        align-items: flex-end;
      }

      .DialogFooter {
        padding-bottom: 20px;
      }

      .ReactDialogStackCell {
        vertical-align: bottom;
      }

      .ReactDialogAnimation {
        bottom: -100px !important;
        top: inherit !important;
        transition: opacity 0.4s ease, bottom 0.4s ease;
      }

      .ReactDialog.ReactDialogOpen .ReactDialogAnimation {
        bottom: 0px !important;
      }

      .DialogFooter {
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
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

    .ReactShadowDOMInsideContainer > .ReactDialog {
      display: table;
    }

  `)
}
