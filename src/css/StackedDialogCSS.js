const StackedDialogCSS = `
  .StackedDialog {
    bottom: 0;
    display: table;
    height: 100%;
    position: absolute;
    top: 0;
    transition: left 0.1s ease, opacity 0.2s ease;
    width: 100%;
  }

  .StackedDialogRow {
    display: table-row;
  }

  .StackedDialogCell {
    display: table-cell;
    vertical-align: middle;
  }

  .StackedDialog {
    left: 0;
    opacity: 1;
  }

  .StackedDialog.inactive {
    display: none;
  }

  .StackedDialog.animating.stale {
    display: none;
  }

  .StackedDialog.animating.previous.forward {
    opacity: 0;
    left: -5rem;
  }

  .StackedDialog.animating.previous.backward {
    opacity: 0;
    left: 5rem;
  }

  .StackedDialog.animating.next.forward {
    opacity: 0;
    left: 5rem;
  }

  .StackedDialog.animating.next.backward {
    opacity: 0;
    left: -5rem;
  }
`;

export default StackedDialogCSS;
