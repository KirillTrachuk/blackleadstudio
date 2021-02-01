import 'styles/base.sass';
import 'styles/homePage/index.sass';
import gsap from 'gsap';
import HomeHeroSection from 'sections/home/homeHeroSection';
import CommonPage from 'pages/commonPage';
import LinkFx from 'pages/linkHover.js';

[...document.querySelectorAll('a.menu__link')].forEach((el) => {
    const elPosition = [...el.parentNode.children].indexOf(el);
    const fxObj = LinkFx[elPosition];
    fxObj && new fxObj(el);
});

export default class HomePage extends CommonPage {
    _setup() {
        this._sectionTypes = [
            HomeHeroSection,
        ];
        super._setup();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}

HomePage.RunPage(HomePage);
