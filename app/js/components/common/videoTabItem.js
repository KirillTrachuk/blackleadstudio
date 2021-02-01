import gsap from 'gsap';
import tweenHelpers from 'utils/tweenHelpers';
import { TabItem } from './tabsComponent.tab';
import Video from './video';

export default class VideoTabItem extends TabItem {
    constructor(config) {
        super(config);

        this._el = config.el;

        this._videoWrap = this._el.querySelector('.tab-video');
        this._subtitle = this._el.querySelector('.tab-subtitle');
        this._titleLines = this._el.querySelectorAll('.tab-title-line');
        this._video = new Video({ el: this._el.querySelector('.video-js') });

        this._offset = 45;

        gsap.set(this._videoWrap, { transformOrigin: '50% 50%' });

        tweenHelpers.hideElements([this._el, this._videoWrap, this._subtitle]);
    }

    _activate(delay, direction) {
        tweenHelpers.clearTweens([this._el, this._videoWrap, this._subtitle, this._titleLines]);
        return new Promise(resolve => {
            gsap.timeline({
                immediateRender: false,
                onComplete: () => {
                    this._video.activate(0, direction);
                    resolve();
                },
            })
                .set(this._el, { autoAlpha: 1 })
                .fromTo(this._titleLines, 0.3666, {
                    y: this._offset,
                }, {
                    stagger: 0.0666,
                    y: 0,
                    ease: tweenHelpers.customEase,
                }, 0)
                .fromTo(this._subtitle, 0.3666, {
                    autoAlpha: 0,
                    y: this._offset,
                }, {
                    autoAlpha: 1,
                    y: 0,
                    ease: tweenHelpers.customEase,
                }, 0.2)
                .fromTo(this._videoWrap, 0.3666, {
                    autoAlpha: 0,
                    scale: 1.2,
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    ease: tweenHelpers.customEase,
                }, 0.2);
        });
    }

    _deactivate(delay, direction) {
        tweenHelpers.clearTweens([this._el, this._videoWrap, this._subtitle, this._titleLines]);
        return new Promise(resolve => {
            gsap.timeline({
                immediateRender: false,
                onComplete: () => {
                    this._video.deactivate(0, direction);
                    resolve();
                },
            })
                .fromTo(this._titleLines, 0.3666, {
                    y: 0,
                }, {
                    stagger: 0.0666,
                    y: -this._offset,
                    ease: tweenHelpers.customEase,
                }, 0)
                .fromTo(this._subtitle, 0.3666, {
                    autoAlpha: 1,
                    y: 0,
                }, {
                    autoAlpha: 0,
                    y: -this._offset,
                    ease: tweenHelpers.customEase,
                }, 0.2)
                .fromTo(this._videoWrap, 0.3666, {
                    autoAlpha: 1,
                    scale: 1,
                }, {
                    autoAlpha: 0,
                    scale: 0.8,
                    ease: tweenHelpers.customEase,
                }, 0.2)
                .set(this._el, { autoAlpha: 0 });
        });
    }
}
