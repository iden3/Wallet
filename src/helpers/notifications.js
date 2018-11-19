import { notification } from 'base_components';

const notifications = {
  notificationTypes: ['success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'],

  /**
   * The content of the notification, with the colour and the message to show.
   *
   * @paran {Object} config - Object to set the notification object
   * @param {string} config.type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
   * @param {string} config.message - Message to show in the notification
   * @returns {{style: {color: string, background: string}, message: (*|string)}}
   */
  getContent(config) {
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
  },

  /**
   * Open a notification box with a message sent in config.
   *
   * @paran {Object} config - Object to set the notification object
   * @param {string} config.type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
   * @param {string} config.message - Message to show in the notification
   * contains the content message to show
   */
  showNotification(config) {
    if (this.notificationTypes.indexOf(config.type) !== -1) {
      const _config = Object.assign({}, config, this.getContent(config));
      _config.placement = 'bottomRight';
      _config.bottom = 20;

      delete _config.type;
      notification[config.type](_config);
    }
  },
};

export default notifications;
