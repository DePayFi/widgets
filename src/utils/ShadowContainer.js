import CSS from '../CSS';
import retargetEvents from 'react-shadow-dom-retarget-events';
import RollbarSnippet from '../utils/RollbarSnippet';

export default function ShadowContainer() {
  if (!document.querySelector('#DePayContainerStyle')) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('id', 'DePayContainerStyle');
    style.appendChild(document.createTextNode(`
      #DePayShadowContainer {
        background: rgba(0,0,0,0);
        bottom: 0;
        height: 100%;
        left: 0;
        opacity: 0;
        position: fixed;
        right: 0;
        top: -1rem;
        transition: all 0.4s ease-out;
        width: 100%;
        z-index: 99999;
      }

      #DePayShadowContainer.open {
        background: rgba(0,0,0,0.4);
        opacity: 1;
        top: 0;
      }
    `));
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  let container = document.getElementById('DePayShadowContainer');
  if (container) { container.remove(); }

  container = document.createElement('div');
  container.setAttribute('id', 'DePayShadowContainer');
  document.body.appendChild(container);
  setTimeout(() => {
    container.classList.add('open');
  }, 0);

  const shadow = container.attachShadow({ mode: 'closed' });
  retargetEvents(shadow);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(CSS));
  shadow.appendChild(style);

  const script = document.createElement('script');
  script.appendChild(document.createTextNode(RollbarSnippet));
  shadow.appendChild(script);

  const insideContainer = document.createElement('div');
  insideContainer.classList.add('InsideContainerTable');
  const insideContainerRow = document.createElement('div');
  insideContainerRow.classList.add('InsideContainerRow');
  insideContainer.appendChild(insideContainerRow);
  const insideContainerCell = document.createElement('div');
  insideContainerCell.classList.add('InsideContainerCell');
  insideContainerRow.appendChild(insideContainerCell);
  shadow.appendChild(insideContainer);

  let closable = true;
  function setClosable(value) {
    closable = value;
  }

  function closeContainer() {
    if(!closable) { return };
    container.classList.remove('open');
    setTimeout(() => {
      container.remove();
    }, 300);
  }

  shadow.addEventListener('click', (event) => {
    if (
      event.target === insideContainerRow
      || event.target === insideContainerCell
    ) {
      closeContainer();
    }
  });

  return [insideContainerCell, closeContainer, setClosable];
}
