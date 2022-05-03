export default (style)=>{
  return(`

    *, div, div * {
      font-family: ${style.fontFamily};
    }

    .FontSizeS {
      font-size: 16px;
    }

    .FontSizeM {
      font-size: 19px;
    }

    .FontSizeL {
      font-size: 23px;
    }

    .FontSizeXL {
      font-size: 32px;
    }

    .FontWeightBold {
      font-weight: bold;
    }

    .FontItalic {
      font-style: italic;
    }
  `)
}
