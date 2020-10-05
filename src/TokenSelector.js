import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import TokenSelectorDialog from './dialogs/TokenSelectorDialog';

export default function TokenSelector(callback){
  const [shadowContainer, closeContainer] = ShadowContainer();
  ReactDOM.render(
    <TokenSelectorDialog
      closeContainer={closeContainer} 
      callback={callback}
    />,
    shadowContainer
  )
};
