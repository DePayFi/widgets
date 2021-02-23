export default function(style){
  return `

    .CircularIcon {
      background: white;
      border-radius: 99rem;
      border: 1px solid transparent;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      height: 2rem;
      position: relative;
      vertical-align: middle;
      width: 2rem;
    }

    .CircularIcon.large {
      height: 4rem;
      width: 4rem;
    }

    .CircularIcon.small {
      height: 1.4rem;
      width: 1.4rem;
    }

    .CircularIcon.tiny {
      height: 1rem;
      width: 1rem;
      box-shadow: 0 0px 4px rgba(0,0,0,0.1);
    }

    .CircularIcon.noshadow{
      box-shadow: none;
    }

    .CircularIcon.notfound {
      background: `+style.colors.primary+`;
    }
  `;
}
