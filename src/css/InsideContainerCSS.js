export default function(){
  return `
    .InsideContainerTable {
      bottom: 0;
      display: table;
      height: 100%;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      user-select: none;
    }

    .InsideContainerRow {
      display: table-row;
      height: 100%;
      width: 100%;
    }

    .InsideContainerCell {
      display: table-cell;
      height: 100%;
      width: 100%;
      vertical-align: middle;
    }
  `;
}
