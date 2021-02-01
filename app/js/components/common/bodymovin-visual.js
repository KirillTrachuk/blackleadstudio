
// libs
import gsap from 'gsap';

import Breakpoints from  'app/appBreakpoints';
import BodymovinIcon from 'components/common/bodymovin-icon';
import CustomEase from 'gsap/CustomEase';

const customEase = CustomEase.create('customEase', 'M0,0 C0.204,0.372 0.254,0.459 0.295,0.532 0.412,0.738 0.584,1 1,1');

export default class BodymovinVisual extends BodymovinIcon {

    // SETUP -------------------------------------------------------------------

    _setup(config) {

        super._setup(config);

        this._bodymovinParams = {
            container: this._el,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: this._el.dataset.bodymovinPath,
        };
        gsap.set(this._el, { opacity: 0 });
    }

    _stopBodymovin() {
        if (this._animBodymovin) {
            this._animBodymovin.goToAndStop(0);
            this._isComplete = false;
        }
    }

    // STATE -------------------------------------------------------------------

    _activate(delay, direction, alpha = 0) {
        gsap.fromTo(this._el, 0.5, { y: direction, opacity: alpha }, {
            y: 0,
            opacity: 1,
            delay: delay || 0.0,
            ease: customEase,
            onComplete: () => this._playBodymovin(),
        });
    }

    _deactivate(delay, direction, alpha = 0) {
        gsap.to(this._el, 0.4, {
            opacity: alpha,
            delay: delay || 0,
            ease: customEase,
            onComplete: () => this._stopBodymovin(),
        });
    }
}
