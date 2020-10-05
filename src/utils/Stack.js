import CloseContainerContext from '../contexts/CloseContainerContext';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';

class Stack extends React.Component {
  state = {
    stacked: false,
  };

  navigate(route) {
    console.log('route', route);
  }

  unstack() {
    console.log('unstack');
  }

  onClickBackground(event, closeContainer) {
    if(
      event.target instanceof HTMLElement &&
      event.target.className.match('StackedDialogCell')
    ) {
      if(this.state.stacked) {
        this.unstack();
      } else {
        closeContainer();
      }
    }
  }

  render() {
    return (
      <CloseContainerContext.Consumer>
      {closeContainer => (
        <div>
          <div className={['StackedDialog', 'active', this.state.stacked ? 'movedOutLeft' : ''].join(' ')}>
            <div className='StackedDialogRow'>
              <div className='StackedDialogCell' onClick={(event)=> onClickBackground(event, closeContainer)}>
                <NavigateStackContext.Provider value={this.navigate.bind(this)}>
                  { this.props.dialogs[this.props.start] }
                </NavigateStackContext.Provider>
              </div>
            </div>
          </div>
        </div>
      )}
      </CloseContainerContext.Consumer>
    );
  }
}

export default Stack;
