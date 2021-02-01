import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';
import Draggable from 'app/utils/draggable';
import tweenHelpers from 'utils/tweenHelpers';
import section from 'app/core/section';

export default class HomeLatestSection extends section {

    _setupSection(config) {
        super._setupSection(config);

        this._title = this._el.querySelector('.my-latest-section-title');
        this._subtitle = this._el.querySelector('.my-latest-section-subtitle');
        this._navigation = this._el.querySelector('.navigation');
        this._moreButton = this._el.querySelector('.more-button');

        this._slider = new Draggable({
            el: this._el.querySelector('#latest-slider'),
            buttons: {
                next: this._el.querySelector('.btn-next'),
                prev: this._el.querySelector('.btn-prev'),
                step: 200,
            },
        });

        tweenHelpers.hideElements([this._title, this._subtitle, this._slider._parent, this._navigation, this._moreButton]);
    }

    resize(width, height) {
        super.resize(width, height);

        this._width = width;
        this._height = height;
        this._rem = Breakpoints.Current.rem;

        this._animOffset = 60 * this._rem;
    }

    _activate = (delay, direction) => new Promise(resolve => {
        this._show(resolve, direction);
    });

    _deactivate = (delay, direction) => new Promise(resolve => {
        this._hide(resolve, direction);
    });

    _show(resolve, direction) {
        tweenHelpers.clearTweens([this._title, this._subtitle, this._slider._parent, this._navigation, this._moreButton]);

        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: resolve,
        });

        animation
            .fromTo(this._title, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0)
            .fromTo(this._subtitle, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.0666)
            .fromTo(this._slider._parent, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.1333)
            .fromTo(this._navigation, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.2)
            .fromTo(this._moreButton, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.2666);

        return animation;
    }

    _hide(resolve, direction) {
        tweenHelpers.clearTweens([this._title, this._subtitle, this._slider._parent, this._moreButton]);

        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: resolve,
        });
    }
}
