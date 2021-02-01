import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';
import tweenHelpers from 'utils/tweenHelpers';
import ScrollableSection from '../scrollableSection';

export default class ExpSection extends ScrollableSection {

    _setupSection(config) {
        super._setupSection(config);

        this._animOffset = 60;

        this.scrollCoeffs = {
            down: {
                show: 0.3,
                hide: 0.3,
            },
            up: {
                show: 0.3,
                hide: 0.3,
            },
        };

        this._title = this._el.querySelector('.experience-section .title-h2');
        this._subtitle = this._el.querySelector('.experience-section .desc-2');
        this._expItems = this._el.querySelectorAll('.experience-item');

        tweenHelpers.hideElements([this._title, this._subtitle]);
    }

    resize(width, height) {
        super.resize(width, height);

        this._width = width;
        this._height = height;
        this._rem = Breakpoints.Current.rem;

        this._animOffset = 60 * this._rem;
    }

    scroll(scrollPosition, scrollDirection) {
        super.scroll(scrollPosition, scrollDirection);

        const offsetY = ((this.scrollCoef - 0.75) * this._animOffset * 2) * this._rem;

        gsap.to(this._expItems, 0.6666, { y: offsetY, ease: tweenHelpers.customEase, stagger: 0.0666 * scrollDirection, overwrite: 'auto' });
    }

    _activate(delay, direction) {
        super._activate();
        return new Promise(resolve => {
            this._show(direction, resolve);
        });
    }

    _deactivate(delay, direction) {
        super._deactivate();
        return new Promise(resolve => {
            this._hide(direction, resolve);
        });
    }

    _show(direction, resolve) {
        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: () => {
                this._el.dataset.locked = 'true';

                resolve();
                this.isLocked();
            },
        });

        tweenHelpers.clearTweens([this._title, this._subtitle]);

        animation
            .fromTo(this._title, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.0666)
            .fromTo(this._subtitle, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.1333);
    }

    _hide(direction, resolve) {
        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: resolve,
        });

        tweenHelpers.clearTweens([this._title, this._subtitle]);

        animation
            .fromTo(this._title, 0.666,
                { y: 0, autoAlpha: 1 },
                { y: this._animOffset, autoAlpha: 0, ease: tweenHelpers.customEase }, 0.0666)
            .fromTo(this._subtitle, 0.666,
                { y: 0, autoAlpha: 1 },
                { y: this._animOffset, autoAlpha: 0, ease: tweenHelpers.customEase }, 0.1333);
    }
}
