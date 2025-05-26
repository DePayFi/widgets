export default (style)=>{
  return(`

    .Radio {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 0.5em;
    }

    .Radio span {
      font-size: 19px;
      position: relative;
      top: -1px;
      padding-left: 2px;
    }

    .Radio input[type="radio"] {
      appearance: none;
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid ${style.colors.primary};
      border-radius: 50%;
      position: relative;
      cursor: pointer;
      outline: none;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .Radio input[type="radio"]::before {
      content: '';
      width: 10px;
      height: 10px;
      background-color: ${style.colors.primary};
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.2s ease-in-out;
    }

    .Radio input[type="radio"]:checked::before {
      transform: scale(1);
    }
  `)
}
