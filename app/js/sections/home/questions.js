import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';
// import { CustomEase } from 'gsap/CustomEase';
import Draggable from 'app/utils/draggable';
import tweenHelpers from 'utils/tweenHelpers';
import section from 'app/core/section';
import TabsComponent from 'components/common/tabsComponent';

// gsap.registerPlugin(CustomEase);

// const customEase = CustomEase.create('customEase', 'M0,0 C0.204,0.372 0.254,0.459 0.295,0.532 0.412,0.738 0.584,1 1,1');

export default class QuestionsSection extends section {

    _setupSection(config) {
        super._setupSection(config);

        this._textBlock = this._el.querySelector('.text-block');
        this._title = this._el.querySelector('.questions-section-title');
        this._navigation = this._el.querySelector('.navigation');

        this._sliderWrap = this._el.querySelector('#questions-slider');
        this._linksWrap = this._el.querySelector('.links');
        this.tabItems = this._el.querySelectorAll('.tab');
        this._tabsLinks = this._el.querySelectorAll('.tab-link');

        tweenHelpers.hideElements([this._textBlock, this._navigation, this._linksWrap, this._sliderWrap]);

        this._marquee = gsap.to(this._title, 12, {
            x: '-50%',
            ease: 'none',
            repeat: -1,
            onStart: () => {
                if (!this._active) {
                    this._marquee.pause();
                }
            },
        });

        this.createDraggable();

        this.tabs = new TabsComponent({
            // @ts-ignore
            tabs: this.tabItems,
            // @ts-ignore
            links: this._tabsLinks,
            syncActivate: true,
            onChanging: (prev, next, direction) => {
                this._slider.reset();
                this.createDraggable();
            },
        });
        this.tabs.setActiveIndex(0);
    }

    createDraggable() {
        this._slider = new Draggable({
            el: this._el.querySelector('#questions-slider'),
            buttons: {
                next: this._el.querySelector('.btn-next'),
                prev: this._el.querySelector('.btn-prev'),
                step: 200,
            },
        });
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
        this._marquee.play();
    });

    _deactivate = (delay, direction) => new Promise(resolve => {
        this._hide(resolve, direction);
        this._marquee.pause();
    });

    _show(resolve, direction) {
        tweenHelpers.clearTweens([this._textBlock, this._navigation, this._linksWrap, this._sliderWrap]);

        const animation = gsap.timeline({
            immediateRender: false,
            onStart: () => { this._animOffset = -direction * (60 * this._rem); },
            onComplete: resolve,
        });

        animation
            .fromTo(this._textBlock, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0)
            .fromTo(this._linksWrap, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.0666)
            .fromTo(this._sliderWrap, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.1333)
            .fromTo(this._navigation, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase }, 0.2);

        return animation;
    }

    _hide(resolve, direction) {
        tweenHelpers.clearTweens([this._textBlock, this._navigation, this._linksWrap, this._sliderWrap]);

        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: resolve,
        });
    }
}
