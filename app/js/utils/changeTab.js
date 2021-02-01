import gsap from 'gsap';
import tweenHelpers from 'utils/tweenHelpers';

export default function changeTabAsync(scrollOffset) {
    return new Promise(resolve => {
        gsap.to(window, {
            duration: 0.66,
            scrollTo: {
                y: scrollOffset,
            },
            overwrite: 'auto',
            ease: tweenHelpers.customEase,
            onComplete: resolve,
        });
    });
}
