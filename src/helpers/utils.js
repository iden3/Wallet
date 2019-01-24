const utils = {
  /**
   * Check if two arrays are equal recursively: in length and in values,
   * even if they contain other arrays, objects...
   * @param {any[]} arr1 first array to compare
   * @param {any[]} arr2 second array to compare
   * @returns {boolean}
   */
  areEqualArrays(arr1, arr2) {
    // if one of the arrays is a falsy value, return
    if (!arr1 || !arr2) {
      return false;
    }

    // compare lengths - can save a lot of time
    if (arr1.length !== arr2.length) {
      return false;
    }

    const firstArrayLength = arr1.length;

    for (let i = 0; i < firstArrayLength; i++) {
      // first check if are same type
      if (arr1[i].constructor !== arr2[i].constructor) { // Check if are they are of the same type
        return false;
      }

      if (arr1[i] instanceof Array && arr2[i] instanceof Array) { // Check if we have nested arrays
        // recurse into the nested arrays
        if (!this.areEqualArrays(arr1[i], arr2[i])) {
          return false;
        }
      } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) { // Check if both are objects
        // deep comparison between objects
        if (!this.areEqualArrays(arr1[i], arr2[i])) {
          return false;
        }
      } else if (arr1[i] !== arr2[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  },

  /**
   * Check if two function are the same
   * @param {Function} fn1 first function to compare
   * @param {Function} fn2 second function to compare
   * @returns {boolean}
   */
  areEqualFunctions(fn1, fn2) {
    return fn1 === fn2 || fn1.toString() === fn2.toString();
  },

  /**
   * Check if two objects are equal recursively: in length and in values,
   * even if they contain other object, arrays...
   * @param {Object} obj1 first object to compare
   * @param {Object} obj2 second object to compare
   * @returns {boolean}
   */
  areEqualObjects(obj1, obj2) {
    // check if one of them is null or undefined return false
    if (!obj1 || !obj2) {
      return false;
    }

    // check they have same length
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }

    let p;

    for (p in obj1) {
      if (typeof (obj2[p]) === 'undefined') {
        return false;
      }
    }

    for (p in obj1) {
      if (obj1[p]) {
        switch (obj1[p].constructor) {
          case Object:
            if (!this.areEqualObjects(obj1[p], obj2[p])) {
              return false;
            }
            break;
          case Function:
            if (typeof (obj2[p]) === 'undefined'
              || (p !== 'equals' && obj1[p].toString() !== obj2[p].toString())) {
              return false;
            }
            break;
          default:
            if (obj1[p] !== obj2[p]) {
              return false;
            }
        }
      } else if (obj2[p]) {
        return false;
      }
    }

    for (p in obj2) {
      if (typeof (obj1[p]) === 'undefined') {
        return false;
      }
    }

    return true;
  },

  /**
   * Generate a random an unique key in base 36 such as "0.94rz766tytb"
   * @returns {string} with the generated alphanumeric key
   */
  createUniqueAlphanumericId(radix = 36, onlyAlphanumeric = true) {
    return onlyAlphanumeric ? Math.random()
      .toString(radix)
      .slice(2) : Math.random()
      .toString(radix);
  },

  /**
   * Generates a random hash string.
   *
   * @param {number} length - of the hash
   * @returns {string} with the generated hash
   */
  generateHash(length = 15) {
    const letters = '0123456789abcdef';
    let hash = '';

    for (let i = 0; i < length; i++) {
      hash += letters[(Math.floor(Math.random() * 16))];
    }

    return hash;
  },

  /**
   * Performs a deep merge of two objects
   * @param {Object} target object
   * @param {Object} sources the other object
   */
  mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  },

  /**
   * Generate a random date in JS format between two given dates.
   * @param {Date} from="One year ago" - Start date
   * @param {Date} to="Date.now()" - End date. By default, now
   * @returns {Date} Betweem the two given dates
   */
  generateRandomDate(from = new Date(), to = from) {
    // if not "from" date, set it to one year ago
    if (from === to) {
      from.setFullYear(to.getFullYear() - 1);
    }

    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
  },

  /**
   * Sort an array. Uses QuickSort algorithm: average time complexity is O(log n) (worst: O(n^2)) and
   * space complexity (worst) is O(log(n))
   * @param {any[]} target array to sort
   * @param {string} key if we have an array of objects and we want to sort by certain key
   * @returns {*}
   */
  sortArray(target, key = '') {
    // if only we have one element, finish
    if (target.length < 2) return target;

    // Take the pivot to compare in each iteration
    // in order to place the element on the right (bigger)
    // or in the left (lower)
    const pivot = target.pop();

    // check if pivot is an Object and then we have sent a valid key to compare to sort
    if (pivot.constructor === Object) {
      if (!key || !pivot[key]) {
        throw new Error(`==> sortArray(): no key sent or pivot (${pivot}) has not any key ${key}`);
      }
    }

    // sub arrays to sort regarding the pivot
    const left = [];
    const right = [];

    // iterate over all the array
    target.forEach((element) => {
      const _element = element.constructor === Object ? element[key] : element;
      const _pivot = pivot.constructor === Object ? pivot[key] : pivot;
      // check if pivot and current element they are same type
      if (_pivot.constructor !== _element.constructor) {
        throw new Error('==> sortArray(): not all elements are of the same type. Can\'t be sorted');
      }

      // check if current element is an object and it contains the sent key for sorting
      if ((_element.constructor === Object) && !_element[key]) {
        throw new Error(`==> sortArray(): there is an object in the array (${_element}) 
                      that does not contain the key ${key}`);
      }
      // if current element is lower than the pivot,
      // put it in the left array
      if (_element < _pivot) {
        left.push(_element);
      } else if (_element > _pivot) {
        right.push(_element);
      } else {
        // if current element and pivot are the same
        left.push(_element);
      }
    });

    // create a new array, ordering left and right part with a recursive call to
    // this function of sorting. The pivot remains between boths arrays
    return [].concat(this.sortArray(left), pivot, this.sortArray(right));
  },

  /**
   * Pad a digit of one cypher returning a string with a 2 chars. I.e. 1 to "01"
   * @param {number} digit of one cypher
   * @returns {string} with two chars, the first one is a "0"
   */
  pad(digit) {
    return (digit < 10) ? `0${digit.toString()}` : digit.toString();
  },

  /**
   * Convert a string to camelCase format. i.e. from Mykey to myKey
   * @param {string} str string to convert to camel Case
   * @returns {string} string in camelCase format
   */
  toCamelCase(str) {
    if (!str || str.constructor !== String) {
      throw new Error('[util] toCamelCase() expects a string');
    }

    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
  },

  /**
   * Set to upper case the first letter of a string (a word)
   * @param {string} str - string to capitalize
   * @returns {string}
   */
  capitalizeFirstLetter(str) {
    return str
      ? str.charAt(0)
        .toUpperCase() + str.slice(1)
      : str;
  },

  /**
   * Mask with regular expressions a string with the expression/char sent
   * I.e. to mask with asterisk a string
   * @param {string} unmaskedString - String to mask
   * @param {string} expression - Expression to place at any char of the unmasked String
   * @returns {string} A string with the expression sent masking all the characters of the unmasked string
   */
  maskWithExpression(unmaskedString, expression) {
    if (unmaskedString && expression) {
      const regex = /^[a-z0-9._]+$/i; // any character
      return unmaskedString.replace(regex, expression);
    }
    return unmaskedString;
  },

  /**
   * Return time in Unix format.
   *
   * @returns {number} - With the time in Unix format
   */
  getUnixTime() {
    return Math.round(+new Date() / 1000);
  },

  /**
   * Check if data received is a primitive (Boolean, String, Array, Number or Symbol).
   * We don't check Null or Undefined.
   * @param {*} data - Data to compare
   * @returns {boolean}
   */
  isPrimitive(data) {
    const dataType = data.constructor;
    return dataType === Number
      || dataType === String
      || dataType === Boolean
      || dataType === Array
      || dataType === Symbol;
  },

  /**
  * Throttle means to be sure that something is executed only once in the delay time.
  * 
  * @param {number} delay - in miliseconds
  * @param {function} fn - the callback to execute only once in the delay time
  *
  * @returns {function | null} - the callback executed only once in the delay time
  */
  throttle(delay, fn) {
    let lastCall = 0;

    return function (...args) {
      const now = (new Date()).getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    };
  },

  /** 
  * To print an elemnt of the web. Add an iframe with 0 width and height, insert the content
  * that we want to print and call the print method of this object to show the user the rendered
  * content with the options to print (they change regarding the printer)
  *
  * @param {string} elClass - The class of the element to create the iframe
  * @param {string} title - To set it in the iframe for a11y 
  */
  print(elClass, title = 'Iframe to print') {
    const contentToPrint = document.getElementsByClassName(elClass)[0];
    const idIframe = `iframe-${elClass}`
    const iframe = document.createElement('iframe');
    let pri;

    // create iframe
    iframe.style.width = 0;
    iframe.style.heigh = 0;
    iframe.style.position = 'absolute';
    iframe.id = idIframe;
    iframe.title = title;
    document.body.appendChild(iframe);

    // fill the iframe with the content to print
    pri = document.getElementById(idIframe).contentWindow;
    pri.document.open();
    pri.document.write(contentToPrint.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();

    // destroy the iframe
    document.getElementById(idIframe).remove();
  },
};

export default utils;
