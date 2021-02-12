export default function(){
  return `
  
    .NetworkFeeButton {
      background: rgb(250,250,250);
      border-right: 3px solid white;
      cursor: pointer;
      border-radius: 1rem;
      width: 100%;
      height: 100%;
    }

    .TableCell:last-child .NetworkFeeButton {
      border-right: 0;
    }

    .NetworkFeeButton:hover {
      background: rgb(248,243,245);
    }

    .NetworkFeeButton:active {
      background: rgb(241,232,235);
    }

  `;
}
