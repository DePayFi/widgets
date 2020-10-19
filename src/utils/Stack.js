import DialogContext from '../contexts/DialogContext';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';

class Stack extends React.Component {
  state = {
    stack: [],
    animating: false,
    animation: null,
    direction: 'forward',
  };

  animationSpeed = 200;

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      stack: [props.start]
    });
  }

  navigate(route) {
    if(this.state.stack.indexOf(route) > -1) { return }
    if(route === 'back') { return this.unstack() }

    this.setState({
      stack: this.state.stack.concat(route),
      animating: true,
      direction: 'forward',
      animation: setTimeout(function(){
        this.setState({
          animating: false
        });
      }.bind(this), this.animationSpeed)
    });

  }

  unstack() {
    if(this.state.stack.length <= 1) { return }

    var newStack = [...this.state.stack];
    newStack.pop();
    
    this.setState({
      animating: true,
      direction: 'backward',
      animation: setTimeout(function(){
        this.setState({
          stack: newStack,
          animating: false
        });
      }.bind(this), this.animationSpeed)
    });
  }

  onClickBackground(event, closeContainer) {
    if(
      event.target instanceof HTMLElement &&
      event.target.className.match('StackedDialogCell')
    ) {
      if(this.state.stack.length > 1) {
        this.unstack();
      } else {
        closeContainer();
      }
    }
  }

  classForDialogState(index){
    if(this.state.animating) { return }
    if(this.state.stack.length === 1) {
      return 'active';
    } else {
      if(this.state.stack.length === index+1) {
        return 'active';
      } else {
        return 'inactive';
      }
    }
  }

  classForDialogPosition(index) {
    if(this.state.stack.length > 1) {
      if(this.state.stack.length === index+1) {
        if(this.state.direction === 'forward') {
          return 'next';
        } else {
          return 'previous';
        }
      } else if (this.state.stack.length-1 === index+1) {
        if(this.state.direction === 'forward') {
          return 'previous';
        } else {
          return 'next';
        }
      } else {
        return 'stale';
      }
    }
  }

  classForAnimating() {
    if(this.state.animating) {
      return 'animating';
    }
  }

  classForDirection() {
    return this.state.direction;
  }

  renderStackedDialogs(closeContainer) {
    return this.state.stack.map(function(route, index){
      let stackState = [];
      stackState.push(this.classForDialogState(index));
      stackState.push(this.classForDialogPosition(index));
      stackState.push(this.classForAnimating());
      stackState.push(this.classForDirection());
      return(
        <div key={index} className={['StackedDialog'].concat(stackState).join(' ')}>
          <div className='StackedDialogRow'>
            <div className='StackedDialogCell' onClick={(event)=> this.onClickBackground(event, closeContainer)}>
              <NavigateStackContext.Provider value={this.navigate.bind(this)}>
                { this.props.dialogs[route] }
              </NavigateStackContext.Provider>
            </div>
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <DialogContext.Consumer>
      {dialogContext => (
        <div>
          { this.renderStackedDialogs(dialogContext.closeContainer) }
        </div>
      )}
      </DialogContext.Consumer>
    );
  }
}

export default Stack;
