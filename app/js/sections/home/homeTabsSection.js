import Section from 'core/section';
import gsap from 'gsap';
import Breakpoints from 'app/appBreakpoints';

import VideoTabItem from 'components/common/videoTabItem';
import TabsComponent from 'components/common/tabsComponent';

import tweenHelpers from 'utils/tweenHelpers';

function findDivider(prev, next, direction) {
    if (direction > 0) {
        return next?.element?.previousElementSibling?.querySelector('.tab-link-divider-path');
    }
    return prev?.element?.previousElementSibling?.querySelector('.tab-link-divider-path');
}

export default class HomeTabsSection extends Section {

    _setupSection(config) {
        super._setupSection(config);

        this._animOffset = 60;

        this._dividers = this._el.querySelectorAll('.tab-link-divider-path');
        this._linkProgresses = this._el.querySelectorAll('.tab-link-progress');
        this._tabsWrap = this._el.querySelector('.tabs-wrap');
        this._container = this._el.querySelector('.container-fluid');

        this._circleLength = (this._el.querySelector('.tab-link-image').getBoundingClientRect().width * Math.PI).toFixed(2);

        // AUTOPLAY INTERVAL
        this._tabsAutoplayInterval = 13000;

        this.tabItems = this._el.querySelectorAll('.tab');
        this._tabsLinks = this._el.querySelectorAll('.tab-link');

        gsap.set(this._linkProgresses, { strokeDasharray: this._circleLength, strokeDashoffset: this._circleLength });
        gsap.set(this._dividers, { strokeDasharray: 120, strokeDashoffset: 120 });

        // tweenHelpers.hideElements([this._tabsWrap]);
    }

    _startAutoPlay() {
        if (this.interval) {
            this._stopAutoPlay();
        }

        this._animateIntervalProgress();

        this.interval = setInterval(() => {
            this.tabs.next();
        }, this._tabsAutoplayInterval);
    }

    _animateIntervalProgress() {
        gsap.killTweensOf(this._linkProgresses);

        gsap.fromTo(this._linkProgresses, this._tabsAutoplayInterval / 1000, {
            strokeDashoffset: this._circleLength,
        }, {
            strokeDashoffset: 0,
            ease: tweenHelpers.customEase,
            onComplete: () => {
                gsap.set(this._linkProgresses, {
                    strokeDashoffset: this._circleLength,
                });
            },
        });
    }

    _stopAutoPlay() {
        clearInterval(this.interval);
    }

    _setupTabs() {
        if (!this.tabs) {
            let index  = 0;
            this.tabs = new TabsComponent({
                tabItems: this._initTabItems(),
                // @ts-ignore
                links: this._tabsLinks,
                syncActivate: true,
                onChanging: (prev, next, direction) => {
                    let divider = findDivider(prev, next, direction);

                    if ((index === this._tabsLinks.length - 1 && this.tabs.currentIndex === 0)
                    || (index === 0 && this.tabs.currentIndex === this._tabsLinks.length - 1)) {
                        divider = this._dividers;
                    }

                    if (divider) {
                        // eslint-disable-next-line max-len
                        gsap.fromTo(divider, 0.8, { strokeDashoffset: 120 * direction }, { strokeDashoffset: -120 * direction, stagger: 0.3 * direction, ease: tweenHelpers.customEase });
                    }
                    index = this.tabs.currentIndex;
                    this._startAutoPlay();
                },
            });
            this.tabs.setActiveIndex(0);
        }
    }

    _initTabItems() {
        const tabs = [];
        this.tabItems.forEach(tab => {
            const tabObj = new VideoTabItem({
                el: tab,
            });

            tabs.push(tabObj);
        });
        return tabs;
    }

    resize(width, height) {
        super.resize(width, height);

        this._width = width;
        this._height = height;
        this._rem = Breakpoints.Current.rem;

        this._animOffset = 60 * this._rem;

        this._setupTabs();
        // eslint-disable-next-line no-unused-expressions
        this.tabs?._tabs?.forEach(element => {
            element._video.resize();
        });
    }

    _activate(delay, direction) {
        this._show(direction);
        this._startAutoPlay();
    }

    _deactivate(delay, direction) {
        this._hide(direction);
        this._stopAutoPlay();
    }

    _show(direction) {
        // tweenHelpers.clearTweens([this._tabsWrap]);

        // const animation = gsap.timeline({
        //     immediateRender: false,
        //     onStart: () => { this._animOffset = -direction * (60 * this._rem); },
        // });

        // animation
        //     .fromTo(this._tabsWrap, 0.666, { autoAlpha: 0, y: this._animOffset }, { autoAlpha: 1, y: 0, ease: tweenHelpers.customEase });

        // return animation;
    }

    _hide(direction) {
        // tweenHelpers.clearTweens([this._tabsWrap]);
        // this._show(-direction).reverse(0, false);
    }
}
