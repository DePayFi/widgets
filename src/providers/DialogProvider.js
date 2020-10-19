import React from 'react';
import DialogContext from './contexts/DialogContext';

class DialogProvider extends React.Component {
  state = {
    closable: true
  }

  setClosable(value) {
    this.setState({ closable: value });
    this.props.setClosable(value);
  }

  render() {
    <DialogContext.Provider value={{
      closeContainer: this.props.closeContainer,
      setClosable: this.setClosable.bind(this),
      closable: this.state.closable
    }}>
      { this.props.children }
    </DialogContext.Provider>
  }
}

export default DialogProvider;
