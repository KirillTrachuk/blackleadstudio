// import logger from 'logger';

// import lottie from 'lottie-web';
import gsap from 'gsap';

import LazyLoadComponent from 'components/lazy/lazyLoadComponent';

export default class BodymovinIcon extends LazyLoadComponent {

    // SETUP -------------------------------------------------------------------

    _setup(config) {
        this._el = config.el;

        this._bodymovinParams = {
            container: this._el,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: this._el.dataset.bodymovinPath,
        };

        this._isComplete = true;
        this._isLoaded = false;
        this._playPending = false;

        // this._playBodymovin(false);
        this._playBodymovin = this._playBodymovin.bind(this);

        // this._checkAnimationLoaded();
        // TweenLite.set(this._el, { alpha: 0.0, force3D: true });

        if (config.register == null) {
            config.register = true;
        }

        super._setup(config);
    }

    get priority() {
        return this._priority || 3;
    }

    async _doLoading() {
        const lottie = await import('lottie-web');
        this._animBodymovin = lottie.loadAnimation(this._bodymovinParams);

        this._animBodymovin.addEventListener('complete', () => {
            // this._animBodymovin.goToAndStop(0);
            this._isComplete = true;
        });

        if (this._animBodymovin.isLoaded) {
            this._isLoaded = true;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this._animBodymovin.addEventListener('DOMLoaded', () => {
                // logger.log('[BodymovinIcon] DOMLoaded', this);

                this._isLoaded = true;
                if (this._playPending) {

                    this._playPending = false;
                    setTimeout(() => {
                        // logger.log('[BodymovinIcon] Play Pending', this);
                        this._animBodymovin.play();
                    }, 500);
                }

                resolve();
            });
        });
    }

    _playBodymovin() {
        if (this._isLoaded) {
            if (this._isComplete) {
                this._animBodymovin.goToAndStop(0);
                this._isComplete = false;
            }

            this._animBodymovin.play();
        } else {
            this._playPending = true;
        }
    }

    // STATE -------------------------------------------------------------------

    _activate(delay, direction) {
        gsap.killTweensOf(this._el);

        // TODO tweak me
        gsap.fromTo(this._el, 0.75, { alpha: 0.0 }, { alpha: 1.0, ease: 'Sine.easeInOut', delay: delay });
        gsap.fromTo(this._el, 2.56, { scale: 0.84 }, { scale: 1.0, force3D: true, ease: 'Sine.easeOut', delay: delay });

        setTimeout(this._playBodymovin, 500);

        this._el.addEventListener('mouseenter', this._playBodymovin);
    }

    _deactivate(delay, direction) {
        gsap.killTweensOf(this._el);

        // TODO tweak me
        gsap.to(this._el, 0.62, { alpha: 0.0, ease: 'Sine.easeInOut', delay: delay });
        gsap.to(this._el, 0.56, { scale: 0.76, force3D: true, ease: 'Cubic.easeIn', delay: delay });

        this._el.removeEventListener('mouseenter', this._playBodymovin);
    }
}
