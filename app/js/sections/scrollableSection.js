import Section from 'core/section';
import Logger from 'app/logger';

export default class ScrollableSection extends Section {

    _setupSection(config) {
        /** @type {HTMLDivElement} */
        this._scrollContainer = this._el.querySelector('.scroll-container');

        if (!this._scrollContainer) {
            Logger.warn('[ScrollableSection] No .scroll-container found.');
        }

        const styles = window.getComputedStyle(this._el);
        const pt = styles.getPropertyValue('padding-top');
        const pb = styles.getPropertyValue('padding-bottom');
        this._innerHeight = this._el.clientHeight - parseFloat(pt) - parseFloat(pb);

        this.gap = 0;

        super._setupSection(config);
    }

    isLocked = () => {
        if (!this._scrollContainer) {
            return;
        }

        const isBottom = this._innerHeight + this._el.scrollTop + this.gap >= this._scrollContainer.clientHeight;
        const isTop = this._el.scrollTop === 0;

        if (this._el.scrollTop !== this._startScrollPosition) {
            this._alreadyScrolled = true;
        }

        const unlock = !!this._alreadyScrolled && (isTop || isBottom);

        if (unlock) {
            this._el.dataset.locked = 'false';
            return;
        }

        if (this._el.dataset.locked === 'true') {
            window.requestAnimationFrame(this.isLocked);
        }
    }

    resetScrolled = () => {
        this._scrolled = 0;
    }

    _activate(delay, direction) {
        this._startScrollPosition = this._el.scrollTop;
        this._el.dataset.locked = 'true';
        this.isLocked();
    }

    _deactivate(delay, direction) {
        this._alreadyScrolled = false;
        this.resetScrolled();
    }
}
