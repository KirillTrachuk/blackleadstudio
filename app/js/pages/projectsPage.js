import 'styles/base.sass';
import 'styles/homePage/index.sass';
import gsap from 'gsap';
import ProjectsHeroSection from 'sections/projects/projectsHeroSection';
import CommonPage from 'pages/commonPage';
import LinkFx from 'pages/linkHover.js';

export default class ProjectsPage extends CommonPage {

    _setup() {
        [...document.querySelectorAll('a.menu__link')].forEach((el) => {
            const elPosition = [...el.parentNode.children].indexOf(el);
            const fxObj = LinkFx[elPosition];
            fxObj && new fxObj(el);
        });

        this._sectionTypes = [
            ProjectsHeroSection,
        ];
        super._setup();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}

ProjectsPage.RunPage(ProjectsPage);
