import seed from 'seed-random';
import hypertimer from 'hypertimer';
import {TransportManager} from './TransportManager.js';

// map with known configuration properties
const KNOWN_PROPERTIES = {
  transports: true,
  timer: true,
  random: true
};

export class ServiceManager {
  constructor(config) {
    this.transports = new TransportManager();

    this.timer = hypertimer();

    this.random = Math.random;

    this.init(config);
  }

  /**
   * Initialize the service manager with services loaded from a configuration
   * object. All current services are unloaded and removed.
   * @param {Object} config
   */
  init(config) {
    this.transports.clear();

    if (config) {
      if (config.transports) {
        this.transports.load(config.transports);
      }

      if (config.timer) {
        this.timer.config(config.timer);
      }

      if (config.random) {
        if (config.random.deterministic) {
          const key = config.random.seed || 'random seed';
          this.random = seed(key, config.random);
        }
        else {
          this.random = Math.random;
        }
      }

      for (const prop in config) {
        if (config.hasOwnProperty(prop) && !KNOWN_PROPERTIES[prop]) {
          // TODO: should log this warning via a configured logger
          console.log('WARNING: Unknown configuration option "' + prop + '"')
        }
      }
    }
  }

  /**
   * Clear all configured services
   */
  clear() {
    this.transports.clear();
  }
}


