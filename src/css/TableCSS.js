export default function(){
  return `

    .Table {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    .TableRow {
      display: table-row;
      width: 100%;
    }

    .TableCell {
      display: table-cell;
      width: 100%;
    }

    .Table .CallToActionName {
      display: none;
    }

    .Table .TableCell:first-child {
      padding-right: 3px;
    }

    .Table .TableCell:last-child {
      padding-left: 3px;
    }
  `;
}
