import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import CommonPage from 'pages/commonPage';
import OnePageScroll from 'utils/onePageScroll';
import ScrollController from 'modules/scrollController';

gsap.registerPlugin(ScrollToPlugin);

export default class OnePageScrollPage extends CommonPage {
    _setup() {
        super._setup();

        this._scroll = new ScrollController({
            el: document.body,
            callback: this._onScrollChangeSection.bind(this),
            threshold: 5,
            sensitivity: 70,
            drag: false,
        });
        this._scroll.activate();

        this._scrollButton = this._root.querySelector('.scroll-down');
        this._scrollButton?.addEventListener('click', () => this._onScrollChangeSection(-1));

        this.onePageScroll = new OnePageScroll(
            this._sections,
            (prev, next) => { },
        );
    }

    _onScrollChangeSection(direction) {
        this._wheelDirection = direction;

        if (direction === -1) {
            this.onePageScroll.next();
        } else {
            this.onePageScroll.prev();
        }
    }
}
