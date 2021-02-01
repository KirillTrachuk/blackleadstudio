import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
const customEase = CustomEase.create('customEase', 'M0,0 C0.204,0.372 0.254,0.459 0.295,0.532 0.412,0.738 0.584,1 1,1');

/** @typedef {Object} GradientPreset
 * @property {{x:string,y:string}} size
 * @property {{x:string,y:string}} position
 * @property {string[]} colors
 */

/** * @param {GradientPreset} preset */
/** * @param {HTMLElement} element */

/** @type {GradientPreset[]} */
export const sectionGradients = [
    { size: { x: '50%', y: '50%' }, position: { x: '50%', y: '50%' }, colors: ['#5635AD', '#13094E'] },
    { size: { x: '88.33%', y: '60.62%' }, position: { x: '100.87%', y: '48.33%' }, colors: ['#5635AD', '#13094E'] },
    { size: { x: '88.33%', y: '60.62%' }, position: { x: '-10.33%', y: '58.33%' }, colors: ['#3535AD', '#13094E'] },
    { size: { x: '50%', y: '100%' }, position: { x: '50.33%', y: '100%' }, colors: ['#5635AD', '#13094E'] },
    { size: { x: '50%', y: '50%' }, position: { x: '50%', y: '50%' }, colors: ['#5635AD', '#13094E'] },
    { size: { x: '50%', y: '50%' }, position: { x: '50%', y: '50%' }, colors: ['#3535AD', '#13094E'] },
    { size: { x: '88.33%', y: '60.62%' }, position: { x: '100.87%', y: '48.33%' }, colors: ['#5635AD', '#13094E'] },
    { size: { x: '50%', y: '50%' }, position: { x: '50%', y: '50%' }, colors: ['#5635AD', '#13094E'] },
];

export default function animateBg(preset, element) {
    gsap.to(element, 1, {
        backgroundImage: `radial-gradient(${preset.size.x} ${preset.size.y} at ${preset.position.x} ${preset.position.y}, ${preset.colors[0]} 0%, ${preset.colors[1]} 100%)`,
        ease: customEase,
    });
}
