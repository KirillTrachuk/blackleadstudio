import gsap from 'gsap';
import tweenHelpers from 'utils/tweenHelpers';
import { TabItem } from './tabsComponent.tab';

export default class TeammateTabItem extends TabItem {
    constructor(config) {
        super(config);

        this._el = config.el;

        this._animItem = this._el.querySelectorAll('.anim-item');

        this._offset = 30;

        tweenHelpers.hideElements([this._el, this._animItem]);
    }

    _activate(delay, direction) {
        tweenHelpers.clearTweens([this._el, this._animItem]);

        return new Promise(resolve => {
            gsap.timeline({
                immediateRender: false,
                onComplete: () => {
                    resolve();
                },
            })
                .set(this._el, { autoAlpha: 1 })
                .fromTo(this._animItem, 0.4666, {
                    autoAlpha: 0,
                    y: this._offset,
                }, {
                    y: 0,
                    stagger: 0.0666,
                    autoAlpha: 1,
                    ease: tweenHelpers.customEase,
                }, 0);
        });
    }

    _deactivate(delay, direction) {
        tweenHelpers.clearTweens([this._el, this._animItem]);

        return new Promise(resolve => {
            gsap.timeline({
                immediateRender: false,
                onComplete: () => {
                    resolve();
                },
            })
                .fromTo(this._animItem, 0.4666, {
                    autoAlpha: 1,
                    y: 0,
                }, {
                    y: this._offset,
                    stagger: 0.0666,
                    autoAlpha: 0,
                    ease: tweenHelpers.customEase,
                }, 0)
                .set(this._el, { autoAlpha: 0 });
        });
    }
}
