export default (fn, wait) => {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    const context = this;

    if (remaining <= 0) {
      lastTime = now;
      fn.apply(context, args);
    }
    // else: ignore call
  };
}
