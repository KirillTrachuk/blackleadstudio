import 'styles/base.sass';
import 'styles/aboutPage/split.css';

import aboutHeroSection from 'sections/about/aboutHeroSection';
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
            aboutHeroSection,
        ];
        super._setup();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}

AboutPage.RunPage(AboutPage);
