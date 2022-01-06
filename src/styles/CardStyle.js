export default (style)=>{
  return(`

    .Card {
      align-items: center;
      background: rgb(255,255,255);
      border-radius: 0.8rem;
      box-shadow: 0 0 8px rgba(0,0,0,0.03);
      cursor: pointer;
      display: flex;
      flex-direction: row;
      margin-bottom: 0.5rem;
      min-height: 4.78rem;
      padding: 1rem 0.6rem;
      width: 100%;
    }

    .Card.Row {
      border-radius: 0;
      margin-bottom: 0;
      box-shadow: none;
      min-height: 4.3rem;
      padding: 0.4rem 1.3rem;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .Card.Row .CardText {
      font-size: 1.2rem;
    }

    .CardTokenSymbol {
      width: 40%;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .CardTokenName {
      text-align: right;
      opacity: 0.5;
      width: 60%;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .Card.Row .CardTokenName .CardText {
      font-size: 1rem;
    }

    .Card.Row .CardImage {
      width: 2.5rem;
    }

    .Card.Row .CardImage img {
      height: 1.9rem;
      width: 1.9rem;
    }

    a.Card, a.Card * {
      color: inherit;
      text-decoration: none;
    }

    .Card.transparent {
      background: none;
      box-shadow: none;
    }

    .Card.small {
      min-height: auto;
      padding: 0.5rem 0.5rem;
      margin: 0;
    }

    .CardImage.small {
      width: 1.7rem;
    }

    .CardImage.small img {
      height: 1.4rem;
      width: 1.4rem;
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
      color: inherit;
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
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: center;
      position: relative;
      width: 3.6rem;
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
      background: white;
      border-radius: 99rem;
      border: 1px solid white;
      background: rgba(0,0,0,0.1);
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      height: 2.8rem;
      position: relative;
      vertical-align: middle;
      width: 2.8rem;
    }

    .CardImage img.transparent {
      border: none;
      background: none;
      box-shadow: none;
    }
    
    .CardImage .BlockchainLogo {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .CardTitle {
      font-size: 0.9rem;
      color: rgb(150,150,150);
    }
    
    .CardText, a .CardText {
      color: ${style.colors.text};
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
