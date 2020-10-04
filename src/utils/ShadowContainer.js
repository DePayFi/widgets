import retargetEvents from 'react-shadow-dom-retarget-events';

import CSS from '../CSS';

export default function ShadowContainer() {
  if (!document.querySelector('#DePayContainerStyle')) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('id', 'DePayContainerStyle');
    style.appendChild(document.createTextNode(`
      #DePayContainer {
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

      #DePayContainer.DepayContainerOpen {
        background: rgba(0,0,0,0.4);
        opacity: 1;
        top: 0;
      }
    `));
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  let container = document.getElementById('DePayContainer');
  if (container) { container.remove(); }

  container = document.createElement('div');
  container.setAttribute('id', 'DePayContainer');
  document.body.appendChild(container);
  setTimeout(() => {
    container.classList.add('DepayContainerOpen');
  }, 0);

  const shadow = container.attachShadow({ mode: 'closed' });
  retargetEvents(shadow);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(CSS));
  shadow.appendChild(style);

  const shadowContainer = document.createElement('div');
  shadowContainer.classList.add('depay-container');
  const shadowContainerRow = document.createElement('div');
  shadowContainerRow.classList.add('depay-container-row');
  shadowContainer.appendChild(shadowContainerRow);
  const shadowContainerCell = document.createElement('div');
  shadowContainerCell.classList.add('depay-container-cell');
  shadowContainerRow.appendChild(shadowContainerCell);
  shadow.appendChild(shadowContainer);

  function closeContainer() {
    container.classList.remove('DepayContainerOpen');
    setTimeout(() => {
      container.remove();
    }, 300);
  }

  shadow.addEventListener('click', (event) => {
    if (
      event.target === shadowContainerRow
      || event.target === shadowContainerCell
    ) {
      closeContainer();
    }
  });

  return [shadowContainerCell, closeContainer];
}
