/* eslint-disable no-bitwise */
import logger from 'logger';
import Component from 'core/component';
import Hammer from 'hammerjs';

// eslint-disable-next-line import/no-webpack-loader-syntax
const Lethargy = require('exports-loader?this.Lethargy!./scroll.lethargy');

/** @typedef {Object} ScrollOptions
 * @property {number} threshold how many scrolls in a row should fire
 * @property {number} maxTimeGap max time between scrolls
 * @property {number} minTimeGap min time between scrolls events
 * @property {number} stability
 * @property {number} sensitivity
 * @property {number} tolerance
 * @property {number} delay
 * @property {boolean} drag
 */

/** @type {ScrollOptions} */
const DefaultConfig = {
    threshold: 5,
    maxTimeGap: 0,
    minTimeGap: 0,
    stability: 8,
    sensitivity: 99,
    tolerance: 0.1,
    delay: 150,
    drag: true,
};

export default class ScrollController extends Component {
    /** @param {ScrollOptions} config */
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);
    }

    _setup(config) {
        /** @type {Function} */
        this._eventCallback = config.callback;

        /** @type {ScrollOptions} */
        this._config = Object.assign({}, DefaultConfig, config);
        this._counter = 0;

        this._lethargy = new Lethargy(this._config.stability, this._config.stability, this._config.tolerance, this._config.delay);

        if (this._config.drag) {
            this._hummer = new Hammer.Manager(this._el);
            this._swipe = new Hammer.Swipe();
            this._hummer.add(this._swipe);
        }

        this._wheelHandler = this._wheelHandler.bind(this);
        this._swipeHandler = this._swipeHandler.bind(this);
    }

    _activate() {
        this._el.addEventListener('wheel', this._wheelHandler, { passive: true });

        if (this._hummer) {
            this._hummer.on('swipe', this._swipeHandler);
        }
    }

    _deactivate() {
        this._el.removeEventListener('wheel', this._wheelHandler);
    }

    _swipeHandler(e) {
        // HUMMER API DIRECTION VALUES
        // DIRECTION_UP	8
        // DIRECTION_DOWN 16
        // DIRECTION_RIGHT 4
        // DIRECTION_LEFT 2

        if ((e.direction & (2 + 8)) === e.direction && e.distance > 100) {
            this._eventCallback(-1);
        } else if ((e.direction & (4 + 16)) === e.direction && e.distance > 100) {
            this._eventCallback(1);
        }
    }

    _wheelHandler(e) {
        const now = performance.now();

        if (this._config.maxTimeGap > 0) {
            if (now - (this._lastTime || 0) >= this._config.maxTimeGap) {
                this._counter = 0;
            }
            this._lastTime = now;
        }

        const relativeDelta = this._lethargy.check(e);

        // logger.log('WHEEL', relativeDelta);

        if (relativeDelta === false) {
            return;
        }

        this._counter += -relativeDelta;

        if (Math.abs(this._counter) >= this._config.threshold) {
            let allow = true;
            if (this._config.minTimeGap > 0) {
                if (now - (this._lastEventTime || 0) < this._config.minTimeGap) {
                    allow = false;
                } else {
                    this._lastEventTime = now;
                }
            }

            if (allow) {
                this._eventCallback(this._counter > 0 ? -1 : 1);
            }
            this._counter = 0;
        }
    }
}
