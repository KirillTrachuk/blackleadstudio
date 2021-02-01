import gsap, { Power4 } from 'gsap';
import logger from 'app/logger';

const body = document.querySelector('body');

class MobileMenu {
    constructor(menu, btn) {
        this.menu = menu;
        this.btn = btn;
        gsap.set(menu, { autoAlpha: 0 });

        this.links = this.menu.querySelectorAll('.mobile-menu-item-link');
        this.items = this.menu.querySelectorAll('.menu-item-anim');
        this._menuListWrap = this.menu.querySelector('.mobile-menu-list');
        this.isOpen = false;
        this.isPlaying = false;

        this.setupBurger();
    }

    setupBurger() {
        this.btn.forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                if (!this.isPlaying) {
                    this.toggleState();
                }
            });
        });
    }

    toggleState() {
        if (this.isOpen) {
            body.classList.remove('mobile-menu-open');
            this.close();

        } else {
            this.open();
            body.classList.add('mobile-menu-open');
        }
    }

    open() {
        if (this.isOpen) {
            return;
        }

        body.ontouchmove = event => {
            event.preventDefault();
        };

        this.isPlaying = true;

        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: () => {
                this.isPlaying = false;
                this.isOpen = true;
            },
        });

        gsap.killTweensOf(animation);

        animation
            .fromTo(this.menu, 0.3, { autoAlpha: 0 }, { autoAlpha: 1 })
            .add(() => this._toggleAnimatedMenuItems(true, Power4.easeOut))
            .add(() => this._menuListWrap.classList.add('active'), '+=0.1')
            .add(() => this._menuListWrap.classList.add('opened'), '+=1');
    }

    close() {
        if (!this.isOpen) {
            return;
        }

        this._menuListWrap.classList.remove('active');

        body.ontouchmove = event => {
            return true;
        };

        this.isPlaying = true;

        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: () => {
                this.isPlaying = false;
                this.isOpen = false;
            },
        });

        gsap.killTweensOf(animation);

        animation
            .add(() => this._toggleAnimatedMenuItems(false, Power4.easeIn))
            .add(() => this._menuListWrap.classList.remove('active'))
            .fromTo(this.menu, 0.3, { autoAlpha: 1 }, { autoAlpha: 0 }, '+=1.2');

    }

    _toggleAnimatedMenuItems(show, ease) {
        for (let i = 0; i < this.items.length; i++) {
            gsap.fromTo(this.items[i], 0.8, {
                y: show ? 20 : 0,
                autoAlpha: show ? 0 : 1,
            }, {
                y: show ? 0 : 20,
                autoAlpha: show ? 1 : 0,
                ease: ease,
                delay: 0.1 * i,
            });
        }
    }
}
const btn = document.querySelectorAll('.hamburger');
const menu = document.getElementById('mobile-menu');

export default new MobileMenu(menu, btn);
