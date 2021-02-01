import Section from 'core/section';
import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';
import tweenHelpers from 'utils/tweenHelpers';
import Video from 'components/common/video';

export default class SignUpSection extends Section {

    _setupSection(config) {
        super._setupSection(config);

        this._animOffset = 60;

        this._title = this._el.querySelector('.section-signup-title');
        this._subtitle = this._el.querySelector('.section-signup-subtitle');
        this._btnsWrap = this._el.querySelector('.buttons-wrap');

        this._video = new Video({ el: this._el.querySelector('.video-js') });

        tweenHelpers.hideElements([this._title, this._subtitle, this._btnsWrap]);

        /** @type {HTMLDivElement} */
        this._scrollContainer = this._el.querySelector('.scroll-container');

        this._scrolled = 0;
    }

    resize(width, height) {
        super.resize(width, height);

        this._width = width;
        this._height = height;
        this._rem = Breakpoints.Current.rem;

        this._animOffset = 60 * this._rem;
        this._video.resize();
    }

    isLocked = () => {
        // const isTop = this._el.scrollTop === 0;
        // const alreadyScrolled = this._scrolled !== this._el.scrollTop;

        // const unlock = alreadyScrolled && isTop;

        // if (unlock) {
        //     this._el.dataset.locked = 'false';
        // }

        // this._scrolled = this._el.scrollTop;

        // if (this._el.dataset.locked === 'true') {
        //     window.requestAnimationFrame(this.isLocked);
        // }
    }

    _activate(delay, direction) {
        this._show(direction);
        this._video.activate();
    }

    _deactivate(delay, direction) {
        this._hide(direction);
        this._video.deactivate();
    }

    _show(direction) {
        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: () => {
                // this._el.dataset.locked = 'true';
                // this.isLocked();
            },
        });

        tweenHelpers.clearTweens([this._title, this._subtitle, this._btnsWrap]);

        animation
            .fromTo(this._title, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.0666)
            .fromTo(this._subtitle, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.1333)
            .fromTo(this._btnsWrap, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.2);

        return animation;
    }

    _hide(direction) {
        tweenHelpers.clearTweens([this._title, this._subtitle, this._btnsWrap]);
        this._show(-direction).reverse(0, false);
    }
}
