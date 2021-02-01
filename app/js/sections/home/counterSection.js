import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';
import tweenHelpers from 'utils/tweenHelpers';
import section from 'app/core/section';
import Video from 'components/common/video';

export default class CounterSection extends section {

    _setupSection(config) {
        super._setupSection(config);

        this._animOffset = 60;

        this._title = this._el.querySelector('.section-counter-title');
        this._subtitle = this._el.querySelector('.section-counter-subtitle');
        this._counterWrap = this._el.querySelector('.counter-wrap');

        this._video = new Video({ el: this._el.querySelector('.video-js') });

        tweenHelpers.hideElements([this._title, this._subtitle, this._counterWrap]);
    }

    resize(width, height) {
        super.resize(width, height);

        this._width = width;
        this._height = height;
        this._rem = Breakpoints.Current.rem;

        this._animOffset = 60 * this._rem;
        this._video.resize();
    }

    _activate = (delay, direction) => new Promise(resolve => {
        this._show(resolve, direction);
        this._video.activate();
    });

    _deactivate = (delay, direction) => new Promise(resolve => {
        this._hide(resolve, direction);
        this._video.deactivate();
    });

    _show(resolve, direction) {
        console.log('[CounterSection _show]');
        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: () => { console.log('[CounterSection] show resolve'); resolve(); },
        });

        tweenHelpers.clearTweens([this._title, this._subtitle, this._counterWrap]);

        animation
            .fromTo(this._title, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.0666)
            .fromTo(this._subtitle, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.1333)
            .fromTo(this._counterWrap, 0.666,
                { y: this._animOffset, autoAlpha: 0 },
                { y: 0, ease: tweenHelpers.customEase, autoAlpha: 1 }, 0.2);

        return animation;
    }

    _hide(resolve, direction) {
        console.log('[CounterSection _hide]');
        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: resolve,
        });

        tweenHelpers.clearTweens([this._title, this._subtitle]);

        animation
            .fromTo(this._title, 0.5,
                { y: 0, autoAlpha: 1 },
                { y: this._animOffset, ease: tweenHelpers.customEase, autoAlpha: 0 }, 0)
            .fromTo(this._subtitle, 0.5,
                { y: 0, autoAlpha: 1 },
                { y: this._animOffset, ease: tweenHelpers.customEase, autoAlpha: 0 }, 0.0666);
    }
}
