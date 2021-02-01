import logger from 'logger';
import CommonPage from './commonPage';

export default class OnePageScroll extends CommonPage {

    start() {
        super.start();

        this._sections.forEach((s, i) => {
            if (i === 0) {
                s._activate();
            } else {
                s._deactivate();
            }
        });
    }

    // Redefinition
    scroll() {
        // DO NOTHING
    }

    _updateSections() {
        // DO NOTHING
    }

    _updateSectionActivation(show, section) {
        // DO NOTHING
    }
}
