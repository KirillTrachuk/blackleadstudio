// eslint-disable-next-line max-classes-per-file
import { TimelineMax, TweenLite, Power3 } from 'gsap';

export class Slide {
    constructor(el) {
        this.DOM = { el: el };
        this.DOM.slideContent = this.DOM.el.querySelector('.slide-image');
    }

    move(direction, val) {
        return new Promise((resolve, reject) => {
            const tx = direction === 'left' ? '+=' + val * -1 : '+=' + val;
            const duration = 0.75;

            new TimelineMax({ onComplete: resolve })
                .to(this.DOM.el, duration, {
                    x: tx,
                    opacity: 0,
                    ease: Power3.easeInOut,
                }, 0);
        });
    }

    setActive(direction) {
        this.isActive = true;
        this.DOM.el.classList.add('active-slide');
        TweenLite.fromTo(this.DOM.el, 0.5, { opacity: 0, x: 50 * (direction === 'right' ? 1 : -1) }, { opacity: 1, x: 0 });
    }

    setRight() {
        this.isActive = false;
        this.isRight = true;
        this.DOM.el.classList.add('right-slide');
        TweenLite.set(this.DOM.el, { opacity: 0 });

    }

    setLeft() {
        this.isActive = false;
        this.isLeft = true;
        this.DOM.el.classList.add('left-slide');
        TweenLite.set(this.DOM.el, { opacity: 0 });
    }

    reset() {
        TweenLite.set([this.DOM.el, this.DOM.slideContent], { transform: 'none' });
        TweenLite.set(this.DOM.el, { opacity: 0 });
        this.DOM.el.classList = 'slide';
    }
}

export class Slideshow {
    constructor(el, slides, counter) {
        this.DOM = { el: el };
        this.counter = counter;

        // slide move distance
        this.gap = 50;

        // The slides instances
        this.slides = [];
        slides.forEach(slide => this.slides.push(new Slide(slide)));
        // Total number of slides
        this.slidesTotal = this.slides.length;

        // active slide's position
        this.active = 0;

        if (this.counter) {
            // setup counter
            this.currentSlideCount = this.DOM.el.querySelector('.slider-counter-text--current');
            this.slidesCount = this.DOM.el.querySelector('.slider-counter-text--length');
            this.currentSlideCount.textContent = `0${this.active + 1}`;
            this.slidesCount.textContent = `0${this.slidesTotal}`;
        }

        // Areas (left, right) where to attach the navigation events.
        this.DOM.interaction = {
            left: this.DOM.el.querySelector('.slider-prev'),
            right: this.DOM.el.querySelector('.slider-next'),
        };

        this.setActiveSlide();
        this.initEvents();
    }

    setActiveSlide(direction) {
        this.activeSlide = this.slides[this.active];
        this.rightSlide = this.slides[this.active + 1 <= this.slidesTotal - 1 ? this.active + 1 : 0];
        this.leftSlide = this.slides[this.active - 1 >= 0 ? this.active - 1 : this.slidesTotal - 1];
        this.activeSlide.setActive(direction);
        this.rightSlide.setRight();
        this.leftSlide.setLeft();

        if (this.counter) {
            this.currentSlideCount.textContent = `0${this.active + 1}`;
        }
    }

    // Initialize events
    initEvents() {
        this.clickRightFn = () => this.navigate('right');
        this.DOM.interaction.right.addEventListener('click', this.clickRightFn);
        this.DOM.interaction.right.addEventListener('touchstart', this.clickRightFn, { passive: true });

        this.clickLeftFn = () => this.navigate('left');
        this.DOM.interaction.left.addEventListener('click', this.clickLeftFn);
        this.DOM.interaction.left.addEventListener('touchstart', this.clickLeftFn, { passive: true });

        this.slides.forEach(slide => {
            // eslint-disable-next-line no-use-before-define
            swipedetect(this.DOM.el, (swipedir) => {
                if (swipedir === 'none' || swipedir === 'up' || swipedir ===  'down') {
                    return;
                }
                if (swipedir === 'right') this.clickLeftFn();
                if (swipedir === 'left') this.clickRightFn();
                // console.log(swipedir);
                // this.navigate(swipedir);
            });
        });
    }

    // eslint-disable-next-line consistent-return
    navigate(direction) {
        if (this.isAnimating) {
            return false;
        }
        this.isAnimating = true;

        // Update current.
        // eslint-disable-next-line no-nested-ternary
        this.active = direction === 'right'
            ? this.active < this.slidesTotal - 1 ? this.active + 1 : 0
            : this.active > 0 ? this.active - 1 : this.slidesTotal - 1;

        const movingSlides = [this.activeSlide, this.rightSlide, this.leftSlide];
        const promises = [];
        movingSlides.forEach(slide => promises.push(slide.move(direction === 'right' ? 'left' : 'right', this.gap)));
        Promise.all(promises).then(() => {
            // After all is moved, update the classes of the 3 visible slides and reset styles
            movingSlides.forEach(slide => slide.reset());
            // Set it again
            this.setActiveSlide(direction);
            this.isAnimating = false;
        });
    }
}

export function swipedetect(el, callback) {
    const touchsurface = el;
    let swipedir = 'none';

    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let elapsedTime = 0;
    let startTime = 0;
    const threshold = 70; // required min distance traveled to be considered swipe
    const restraint = 44; // maximum distance allowed at the same time in perpendicular direction
    const allowedTime = 375; // maximum time allowed to travel that distance

    const handleswipe = callback || swipedir;

    touchsurface.addEventListener('touchstart', e => {
        const touchobj = e.changedTouches[0];
        swipedir = 'none';
        distX = 0;
        distY = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        // e.preventDefault();
    }, { passive: true }, false);

    touchsurface.addEventListener('touchmove', e => {
        // e.preventDefault(); // prevent scrolling when inside DIV
    }, { passive: true }, false);

    touchsurface.addEventListener('touchend', e => {
        const touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
        // e.preventDefault();
    }, { passive: true }, false);

}
