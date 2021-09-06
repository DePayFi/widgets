export default (style)=>{
  return(`

    .Dialog {
      margin: 0 auto;
      position: relative;
      width: 420px;
    }

    .Dialog .Text {
      color: ${style.colors.text};
    }

    @media screen and (max-width: 450px) {
      
      .Dialog, .ReactDialogAnimation {
        width: 100%;
      }

    }

    @media (orientation: portrait) and (max-width: 700px) {

      .Dialog {
        align-content: stretch;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .DialogBody {
        flex: 1;
        align-items: flex-end;
        max-height: 40vh !important;
      }

      .FooterLink {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        width: 100%;
      }

      .DialogFooter {
        padding-bottom: 50px;
      }

      .ReactDialogStackCell {
        vertical-align: bottom;
      }

      .ReactDialogAnimation {
        bottom: -100px !important;
        max-height: 66vh !important;
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
