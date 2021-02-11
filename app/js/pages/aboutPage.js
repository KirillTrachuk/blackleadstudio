import 'styles/base.sass';
import 'styles/aboutPage/index.scss';

import AboutHeroSection from 'sections/about/aboutHeroSection';
import CommonPage from 'pages/commonPage';
import LinkFx from 'pages/linkHover.js';

export default class AboutPage extends CommonPage {
    _setup() {
        [...document.querySelectorAll('a.menu__link')].forEach((el) => {
            const elPosition = [...el.parentNode.children].indexOf(el);
            const fxObj = LinkFx[elPosition];
            fxObj && new fxObj(el);
        });

        this._sectionTypes = [
            AboutHeroSection,
        ];
        super._setup();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}

AboutPage.RunPage(AboutPage);
