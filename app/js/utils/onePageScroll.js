import changeTab from 'utils/changeTab';
import section from 'core/section';
import { createLogger } from 'app/logger';

const Logger = createLogger('[OnePageScroll]');

export default class OnePageScroll {
    activeIndex = 0;

    inProgress = false;

    _prevIndex = 0;

    constructor(sections, beforeChange, paginationItems) {
        /** @type {section[]} */
        this._sections = sections;
        this._beforeChange = beforeChange;

        if (paginationItems) {
            /** @type {HTMLElement[]} */
            this._pagination = [...paginationItems];
            this._pagination.forEach((p, i) => p.addEventListener('click', () => {
                this.activeIndex = i;
                this.changeTab();
            }));
        }
    }

    next = async () => {
        if (!this.canChange()) {
            return;
        }

        if (this.activeIndex < this._sections.length - 1) {
            this._prevIndex = this.activeIndex;
            this.activeIndex++;
            await this.changeTab();
        }
    }

    prev = async () => {
        if (!this.canChange()) {
            return;
        }

        if (this.activeIndex > 0) {
            this._prevIndex = this.activeIndex;
            this.activeIndex--;
            await this.changeTab();
        }
    }

    paginationAfter() {
        if (!this._pagination) {
            return;
        }

        this._pagination.forEach((p, i) => {
            if (i === this.activeIndex) {
                p.classList.add('active');
            }
        });
    }

    paginationBefore() {
        if (!this._pagination) {
            return;
        }

        this._pagination.forEach(p => {
            p.classList.remove('active');
        });
    }

    canChange() {
        const activeSection = this._sections[this.activeIndex];

        if (activeSection.element.dataset.locked === 'true') {
            Logger.log('Section is locked. Skipping section change.');
            return false;
        }

        return !this.inProgress;
    }

    changeTab = async () => {
        this.inProgress = true;
        const prevSection = this._sections[this._prevIndex];
        const nextSection = this._sections[this.activeIndex];

        this._beforeChange(prevSection, nextSection);
        this.paginationBefore();
        await changeTab(nextSection.element.offsetTop);
        this.inProgress = false;
        this.paginationAfter();
    }
}
