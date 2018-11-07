import { notification } from 'base_components';

const notifications = {
  notificationTypes: ['success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'],
  /**
   * Open a notification box with a message sent in config
   * @param {string} type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
   * @param {object} config - Should contain at least fields 'message' (string) that is the title and 'description' that
   * contains the content message to show
   */
  showNotification(type, config) {
    if (this.notificationTypes.indexOf(type) !== -1) {
      const _config = Object.assign({}, config);
      _config.placement = 'bottomRight';
      _config.bottom = 20;

      notification[type](_config);
    }
  },
};

export default notifications;
