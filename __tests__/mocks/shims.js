// issue: https://github.com/facebook/jest/issues/4545
// because tests are triggering a warning with this message:
// Warning: React depends on requestAnimationFrame. Make sure that you load a polyfill in older browsers. http://fb.me/react-polyfills
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};