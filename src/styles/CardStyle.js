export default (style)=>{
  return(`

    .Card {
      background: rgb(255,255,255);
      border-radius: 0.8rem;
      box-shadow: 0 0 8px rgba(0,0,0,0.03);
      cursor: pointer;
      display: flex;
      flex-direction: row;
      margin-bottom: 0.5rem;
      min-height: 4.78rem;
      padding: 1rem 0.6rem;
    }

    a.Card, a.Card * {
      color: inherit;
      text-decoration: none;
    }

    .Card.small {
      min-height: auto;
      padding: 0.6rem 0.6rem;
    }

    .Card.disabled {
      cursor: default;
    }

    .Card:hover:not(.disabled) {
      background: rgb(240,240,240);
      box-shadow: 0 0 0 rgba(0,0,0,0); 
    }

    .Card:active:not(.disabled) {
      background: rgb(235,235,235);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.02); 
    }

    .Card:hover:not(.disabled) .CardAction {
      opacity: 0.4;
    }

    .CardImage, .CardBody, .CardAction, .CardInfo {
      align-items: center;
      display: flex;
      min-width: 0;
      padding: 0 0.4rem;
    }

    .CardImage {
      flex-basis: auto;
      flex-shrink: 0;
      flex-grow: 0;
    }

    .CardBody {
      flex-basis: auto;
      flex-grow: 1;
      flex-shrink: 1;
      line-height: 1.4rem;
      padding-left: 0.6rem;
      text-align: left;
    }

    .CardBodyWrapper {
      min-width: 0;
    }

    .CardAction {
      flex-basis: auto;
      flex-shrink: 0;
      flex-grow: 0;
      padding-right: 0;
      margin-left: auto;
    }

    .Card.disabled .CardAction {
      opacity: 0;  
    }

    .CardInfo {
      display: flex;
      flex-basis: auto;
      flex-direction: column;
      flex-grow: 0;
      flex-shrink: 1;
      justify-content: center;
      margin-left: auto; 
      padding-right: 0;
    }

    .CardImage img {
      background: rgb(240,240,240);
      border-radius: 99rem;
      border: 1px solid white;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      height: 2.8rem;
      position: relative;
      vertical-align: middle;
      width: 2.8rem;
    }

    .CardTitle {
      font-size: 0.9rem;
      color: rgb(150,150,150);
    }
    
    .CardText {
      flex: 1;
      font-size: 1.3rem;
    }

    .CardText strong {
      font-weight: 500;
    }

    .CardText small {
      font-size: 1.1rem;
      color: rgb(150,150,150);
    }

    .CardAction {
      opacity: 0.2;
    }

    .Card.More {
      display: inline-block;
      text-align: center;
    }
  `)
}
