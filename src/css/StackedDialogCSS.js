const StackedDialogCSS = `
  .StackedDialog {
    bottom: 0;
    display: table;
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.3s ease-out;
    width: 100%;
  }

  .StackedDialogRow {
    display: table-row;
  }

  .StackedDialogCell {
    display: table-cell;
    vertical-align: middle;
  }

  .StackedDialog.active {
    left: 0;
  }

  .StackedDialog.movedOutLeft {
    opacity: 0;
    left: -5rem;
  }
`;

export default StackedDialogCSS;
