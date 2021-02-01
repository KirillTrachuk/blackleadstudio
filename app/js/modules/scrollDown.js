import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const customEase = CustomEase.create('customEase', 'M0,0 C0.204,0.372 0.254,0.459 0.295,0.532 0.412,0.738 0.584,1 1,1');

export default function scrollDownAnimation(el) {
    const arrows = el.querySelectorAll('.arrow');
    const pulse = el.querySelectorAll('.pulse');
    const offset = 7;

    gsap.set([arrows, pulse], { transformOrigin: '50% 50%' });
    arrows.forEach((arrow, index) => {
        gsap.set(arrow, { scale: 1.25 - (index / 4) });
    });

    const pulseAnim = gsap.timeline({
        immediateRender: false,
        repeat: 1,
    })
        .fromTo(pulse, 1, { scale: 0 }, { scale: 1, stagger: 0.15, ease: customEase })
        .fromTo(pulse, 0.2, { autoAlpha: 0.05 }, { autoAlpha: 0, ease: customEase }, 0.8);

    const animation = gsap.timeline({
        immediateRender: false,
        repeat: -1,
        repeatDelay: 1.5,
        paused: true,
        onRepeat: () => {
            pulseAnim.play(0);
        },
    });

    animation
        .to(arrows[0], 0.8333, { y: offset, autoAlpha: 0, scale: 1.5 }, 0)
        .to(arrows[1], 0.8333, { y: offset, scale: 1.25 }, 0.0666)
        .to(arrows[2], 0.8333, { y: offset, scale: 1 }, 0.1333)
        .to(arrows[3], 0.8333, { y: offset, autoAlpha: 1, scale: 0.75 }, 0.2);

    return animation;
}
