// @ts-nocheck
import logger from 'logger';
import stickyHeader from 'modules/stickyHeader';
import Breakpoints from './breakpoints';

/** @typedef {import('core/section').default}  Section */

export default class Page {
    constructor(id) {
        this._id = id;
        /** @type {HTMLElement} */
        this._root = null;
        this._activeSectionIndex = -1;

        this._width = 0.0;
        this._height = 0.0;
        this._centerY = 0.0;

        this._scrollPosition = 0.0;
        this._scrollDirection = -1.0;

        /** @type {Section[]} */
        this._sections = [];

        this._width = 0;
        this._height = 0;

        this._defineSectionHelpersMethods();
        this.pageBg = undefined;
        this.scrollOffset = 0;

    }

    updateBreakpoint() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._centerY = this._height * 0.5;
        Breakpoints.resize(this._width, this._height);
    }

    async setupAsync() {
        this._root = document.getElementById('main');
        document.addEventListener('wheel', (e) => this._wheel(e));
        window.onresize = this.resize.bind(this);
        window.onscroll = this.scroll.bind(this);

        this.updateBreakpoint();

        this._setup();
    }

    get width() { return this._width; }

    get height() { return this._height; }

    _setup() {
        this._setupSections(this._root.querySelectorAll('section'));
    }

    /** @abstract
     * @return {Class[]}
    */
    get sectionTypes() {
        throw new Error('abstract');
    }

    _getSectionOptions(index, type, el) { return {}; }

    _setupSections(sections) {
        this._sections = [];
        const types = this.sectionTypes;

        sections.forEach((section, i) => {
            const Type = types[i];
            if (!Type) {
                return;
            }

            const instance = new Type({ el: section, page: this, ...this._getSectionOptions(i, Type, section) });
            this._sections.push(instance);
        });

        // this._activeSectionIndex = 0;
        // this._activeSection = this._sections[0];

        // @ts-ignore
        logger.log(`Sections (${this._sections.length}):`, this._sections);
    }

    _wheel(event) {
        this._deltaY = event.deltaY ? event.deltaY : (event.originalEvent && event.originalEvent.detail);
        this._wheelDirection = this._deltaY > 0 ? 'down' : 'up';

        this.wheel(this._deltaY, this._wheelDirection);
    }

    start() {
        this.resize();
    }

    stop() {
    }

    _scrollUpdate() {
        const scrollPosition = window.pageYOffset;

        if (this._scrollPosition === scrollPosition) {
            this._scrollDirection = 0.0;
        } else {
            this._scrollDirection = scrollPosition > this._scrollPosition
                ? -1.0
                : 1.0;
        }
        this._scrollPosition = scrollPosition;
    }

    scroll() {
        this._scrollUpdate();
        this._updateSections();
        stickyHeader.update(this._scrollPosition);
    }

    /**
     * @param {number} deltaY
     * @param {string} wheelDirection
     */
    wheel(deltaY, wheelDirection) {
        this._deltaY = deltaY;
        this._wheelDirection = wheelDirection;
    }

    resize() {
        this.updateBreakpoint();
        this.scroll();

        for (let i = 0; i < this._sections.length; ++i) {
            this._sections[i].resize(this._width, this._height);
        }
    }


    _defineSectionHelpersMethods() {
        this._getIsShowDown = (top, bottom, showTreshold) => top <= this._height - showTreshold;
        this._getIsHideDown = (top, bottom, hideTreshold) => bottom <= hideTreshold;
        this._getIsShowUp = (top, bottom, showTreshold) => bottom >= showTreshold;
        this._getIsHideUp = (top, bottom, hideTreshold) => top > this._height - hideTreshold;
    }

    _updateSections() {
        let coeffsDirection;
        let getIsShow;
        let getIsHide;

        if (this._scrollDirection <= 0) {
            coeffsDirection = 'down';
            getIsShow = this._getIsShowDown;
            getIsHide = this._getIsHideDown;
        } else {
            coeffsDirection = 'up';
            getIsShow = this._getIsShowUp;
            getIsHide = this._getIsHideUp;
        }

        const sectionsNum = this._sections.length;
        for (let i = 0; i < sectionsNum; i++) {
            /** @type {Section} */
            const section = this._sections[i];
            const { rect } = section;

            const { top, bottom, height } = rect;

            const coeffs = section.scrollCoeffs[coeffsDirection];

            let show = null;

            let showTreshold = this._height * coeffs.show;
            if (height < showTreshold)
                showTreshold = height * 0.5;

            // show if top of next element is in range
            if (getIsShow(top, bottom, showTreshold)) {
                show = true;
            }

            let hideTreshold = this._height * coeffs.hide;
            if (height < hideTreshold) {
                hideTreshold = height * 0.5;
            }

            if (getIsHide(top, bottom, hideTreshold)) {
                show = false;
            }

            this._updateSectionActivation(show, section);
        }
    }

    /**
     * @param {boolean=} show
     * @param {Section} section
     */
    _updateSectionActivation(show, section) {
        if (show != null) {
            if (show) {
                section.activate(0.0, this._scrollDirection);
                section.scroll(this._scrollPosition, this._scrollDirection);
            } else if (section._active) {
                section.deactivate(0.0, this._scrollDirection);
            }
        }
    }

    static RunPage(PageClass) {
        const p = new PageClass();
        p.setupAsync().then(() => p.start());
    }
}
