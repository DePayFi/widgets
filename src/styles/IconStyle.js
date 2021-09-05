export default (style)=>{
  return(`

    .Icon {
      fill : ${style.colors.icons};
      stroke : ${style.colors.icons};
    }

    .ChevronLeft, .ChevronRight {
      position: relative;
      top: 1px;
    }

    .Checkmark {
      height: 1.4rem;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 1.4rem;
    }

    .ButtonPrimary .Icon {
      fill : ${style.colors.buttonText};
      stroke : ${style.colors.buttonText};
    }
    
  `)
}
