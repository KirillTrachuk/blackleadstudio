import gsap from 'gsap';
import DraggableGsap from 'gsap/Draggable';
import { createLogger } from 'logger';

const logger = createLogger('[Draggable]');

gsap.registerPlugin(DraggableGsap);

/**
 * @typedef Settings
 * @property {HTMLElement} el
 * @property {{ prev: HTMLElement, next: HTMLElement, step: number }=} buttons
 */

export default class Draggable {
    /** @type {HTMLElement} */
    _parent;

    /**
     * @param {Settings} settings
     */
    constructor(settings) {
        this._parent = settings.el;

        if (!this._parent) {
            logger.warn('Error during draggable creation: missed parent element. Settings:', JSON.stringify(settings));
            return;
        }

        this._init(settings);
    }

    /**
     * @param {Settings} settings
     */
    _init = (settings) => {
        if (settings?.buttons) {
            const { next, prev, step } = settings?.buttons;

            next.addEventListener('click', () => this.scrollTo(-step));
            prev.addEventListener('click', () => this.scrollTo(step));
        }

        const [d] = DraggableGsap.create(this._parent, {
            type: 'x',
            onDrag: function(e) {
                /** @type {HTMLElement} */
                const t = this.target;
                const rect = t.getBoundingClientRect();
                const rightLimit = Math.abs(rect.left) > rect.width && e.movementX < 0;
                const leftLimit = (rect.left > rect.width - 200) && e.movementX > 0;


                if (leftLimit || rightLimit) {
                    this.endDrag(e);
                }
            },
        });

        this.dragg = d;
    }

    scrollTo = (to) => {
        gsap.killTweensOf(this.dragg?.target);
        gsap.to(this.dragg?.target, { x: `+=${to}` });
    }

    reset = () => {
        gsap.killTweensOf(this.dragg?.target);
        gsap.to(this.dragg?.target, { x: 0 });
    }
}
