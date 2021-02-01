import Page from 'app/core/page';
import Lazy from 'components/lazy';
import gsap from 'gsap';
// import 'modules/mobile-menu';
import logger from 'logger';
// import Cursor from 'modules/cursor';

function activateMenuItem() {
    const menuItems = document.querySelectorAll('header .menu-item');
    const { pageId } = document.querySelector('main').dataset;
    if (!menuItems || !pageId) {
        return;
    }
    menuItems.forEach(item => {
        if (!item.dataset || !item.dataset.id) {
            return;
        }
        if (item.dataset.id === pageId) {
            item.classList.add('active');
        }
    });
}
// let vh = window.innerHeight * 0.01;
// document.documentElement.style.setProperty('--vh', vh + 'px');
// console.log(vh);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
    console.log(vh);
})
export default class CommonPage extends Page {

    _setup() {
        super._setup();

        window.onbeforeunload = () => window.scrollTo(0, 0);

        Lazy.SetMainElememt(this._root);
        Lazy.RegisterAllImages();

        activateMenuItem();

        // this.cursor = new Cursor({
        //     el: document,
        //     followDuration: 0.2333,
        //     blendModed: false,
        // });
        // this.cursor.activate();

        // this._setupEvents();
    }

    start() {
        super.start();

        window.appReady(() => {
            // add some logic on page loaded here

            Lazy.BeginLoading();

            this._playActiveSectionAnimation();
        });
    }

    _playActiveSectionAnimation() {
        const firstSection = this._sections.find(section => section.firstSection === true);
        if (firstSection) {
            firstSection.isFirstActivate = false;
            firstSection.ready = true;
            firstSection._activate();
        }
    }

    _setupEvents() {

    }

    resize() {
        super.resize();
    }
}
