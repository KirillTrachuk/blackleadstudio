import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const customEase = CustomEase.create('customEase', 'M0,0 C0.204,0.372 0.254,0.459 0.295,0.532 0.412,0.738 0.584,1 1,1');

function hideElements(elements) {
    gsap.set(elements, { autoAlpha: 0 });
}

function clearTweens(elements) {
    gsap.killTweensOf(elements);
}

export default {
    customEase,
    hideElements,
    clearTweens,
};
