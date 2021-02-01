/* eslint-disable class-methods-use-this */
import Section from 'core/section';

export default class AsyncSection extends Section {
    _activate = (delay, direction) => new Promise(resolve => {
        this._show(direction, resolve);
    });

    _deactivate = (delay, direction) => new Promise(resolve => {
        this._hide(direction, resolve);
    });

    _show(direction, resolve) {
        resolve();
    }

    _hide(direction, resolve) {
        resolve();
    }
}
