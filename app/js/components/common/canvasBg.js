import logger from 'logger';
import LazyLoadComponent from 'components/lazy/lazyLoadComponent';
import gsap from 'gsap';

/** @typedef {Object} CanvasBaseSettings
 * @property {HTMLCanvasElement} canvas
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 */


/** @typedef {Object[]} GradientColors[]
 * @property {string} color
 * @property {number} offset
 */

/** @typedef {Object} GradientProps
 * @property {number} x0
 * @property {number} y0
 * @property {number} r0
 * @property {number} x1
 * @property {number} y1
 * @property {number} r1
 */

/** @type {GradientColors} */
const gradientColors = [
    { color: '#5635AD', offset: 0.0 },
    { color: '#13094E', offset: 1.0 },
];

/** @type {GradientProps} */
const gradientProps = {
    x0: 200.0,
    y0: 100.0,
    r0: 0.0,
    x1: 300.0,
    y1: 300.0,
    r1: 600.0,
};

export default class CanvasBg extends LazyLoadComponent {
    /** @param {CanvasBaseSettings} settings */
    constructor(settings) {
        super({
            register: true,
            el: settings.canvas,
        });

        this.settings = settings;
        this.canvas = this.settings.canvas;

        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas?.getContext('2d');

        // force enable antialiasing
        this.context.mozImageSmoothingEnabled = true;
        this.context.webkitImageSmoothingEnabled = true;
        this.context.msImageSmoothingEnabled = true;
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';

        this.context.globalCompositeOperation = 'lighten';

        this.isPlaying = false;
        this.animationWorker = this.animationWorker.bind(this);
        this.startTime = null;
        this.drawTimer = null;
        this.renderingAllowed = false;

        /** @type {GradientColors} */
        this.gradientColors = gradientColors;

        /** @type {GradientProps} */
        this.gradientProps = gradientProps;
    }

    _doLoading() {
        this.renderingAllowed = true;
        gsap.fromTo(this.canvas, 0.5, { autoAlpha: 0 }, { autoAlpha: 1 });
        this.renderOnce();
        return Promise.resolve();
    }

    play(delay) {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        this.startTime = performance.now();
        this.enqueueAnimation();
    }

    pause() {
        this.isPlaying = false;
    }

    setup() {
        if (!this.canvas)
            return;

        this.setCanvasSize();
    }

    renderOnce() {
        if (this.isPlaying || !this.renderingAllowed)
            return;

        window.requestAnimationFrame(this.drawCanvas.bind(this));
    }

    setCanvasSize() {
        if (!this.canvas) {
            return;
        }

        this.canvas.width = this.canvas.parentNode.offsetWidth;
        this.canvas.height = this.canvas.parentNode.offsetHeight;
        this.settings.canvasWidth = this.canvas.width;
        this.settings.canvasHeight = this.canvas.height;
    }

    onResize(rem) {
        this.setCanvasSize();
        this._rem = rem;
    }

    animationWorker(timeStamp) {
        this.drawCanvas(timeStamp);
        this.enqueueAnimation();
    }

    enqueueAnimation() {
        if (this.isPlaying)
            window.requestAnimationFrame(this.animationWorker);
    }

    /** @param {GradientColors} gradColors */
    /** @param {GradientProps} gradProps */
    createGradient(gradColors, gradProps) {
        const { x0, y0, r0, x1, y1, r1 } = gradProps;

        // Create gradient
        const grd = this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);

        // Add colors
        gradColors.forEach(color => {
            grd.addColorStop(color.offset, color.color);
        });

        // Fill with gradient
        this.context.fillStyle = grd;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCanvas(timeStamp) {
        if (!this.renderingAllowed)
            return;

        // this.context.setTransform(1, 0, 0, 1, 0, 0);
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // const deltaTime = timeStamp - this.startTime;
        // this.startTime = timeStamp;

        this.createGradient(this.gradientColors, this.gradientProps);
    }

}
