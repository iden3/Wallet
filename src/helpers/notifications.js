import { notification } from 'base_components';

/**
 * Helper to show notifications in the application. Should be on of the types defined in
 * the nofiticationTypes constant.
 *
 * @type {{ showNotification }}
 */
const notifications = (function () {
  const notificationTypes = ['success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'];

  /**
     * The content of the notification, with the colour and the message to show.
     *
     * @param {Object} config - Object to set the notification object
     * @param {string} config.type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
     * @param {string} config.message - Message to show in the notification
     *
     * @returns {{style: {color: string, background: string}, message: (*|string)}}
     */
  function _getContent(config) {
    const style = { color: 'white', background: '' };
    let message = '';

    switch (config.type) {
      case 'success':
        style.background = 'green';
        message = config.message || 'Success!';
        break;
      case 'error':
        style.background = '#f95555';
        message = config.message || 'Error';
        break;
      case 'info':
        message = config.message || 'Info';
        style.background = 'blue';
        break;
      case 'warning':
        message = config.message || 'Warning!';
        style.background = 'orange';
        break;
      default:
        message = config.message || 'Info';
        style.background = 'blue';
    }

    return { style, message };
  }

  /**
   * Open a notification box with a message sent in config.
   *
   * @paran {Object} config - Object to set the notification object
   * @param {string} config.type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
   * @param {string} config.message - Message to show in the notification
   * contains the content message to show
   */
  function showNotification(config) {
    if (notificationTypes.indexOf(config.type) !== -1) {
      const _config = Object.assign({}, config, _getContent(config));
      _config.placement = _config.placement || 'bottomRight';
      _config.bottom = 20;

      delete _config.type;
      notification[config.type](_config);
    }
  }

  return {
    showNotification,
  };
}());

export default notifications;
