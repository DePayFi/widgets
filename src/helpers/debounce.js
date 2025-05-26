export default (fn, wait, immediate = false) => {
  let timerId;

  return function(...args) {
    const context = this;

    const later = () => {
      timerId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    };

    const callNow = immediate && !timerId;
    clearTimeout(timerId);
    timerId = setTimeout(later, wait);

    if (callNow) {
      fn.apply(context, args);
    }
  };
}
