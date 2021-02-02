export default function(){
  return `

    .MainAction {
      font-size: 1.35rem;
      letter-spacing: 0px;
      padding: 0.6rem 1.4rem;
      line-height: 2.0rem;
    }

    .MainAction.circular {
      padding: 0;
      width: 3.4rem;
      height: 3.4rem;
      line-height: 3.2rem;
    }

    .Table .MainAction {
      white-space: nowrap;
      width: 100%;
      display: block;
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    }

    .MainAction.disabled {
      background: rgb(210,210,210);
    }
  `;
}
