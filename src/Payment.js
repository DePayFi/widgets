import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import PayDialog from './dialogs/PayDialog';

export default function Payment() {
  const [shadowContainer, closeContainer] = ShadowContainer();
  return new Promise(() => {
    ReactDOM.render(
      <PayDialog closeContainer={closeContainer} />,
      shadowContainer,
    );
  });
}
