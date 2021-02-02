import Section from 'core/section';
import gsap from 'gsap';
import Video from 'components/common/video';

export default class ProjectsHeroSection extends Section {
    _setupSection(config) {
        super._setupSection(config);
        this._scrollText = this._el.querySelector('.scroll-text');

        this._marquee = gsap.to(this._scrollText, 6, {
            x: '-25%',
            ease: 'none',
            repeat: -1,
        });
        this._marquee.play(); 

        const videos = [...this._el.querySelectorAll('.video-js')];

        this._videos = videos.map(v => new Video({ el: v }));

        this._videos.forEach(v => v.activate());
    }

    resize(width, height) {
        super.resize(width, height);
        this._videos.forEach(v => v.resize());
     }

    _activate(delay, direction) { 
        this._videos.forEach(v => v.activate());
    }

    _deactivate(delay, direction) {

    }

    _show(direction) {

    }

    _hide(direction) {

    }
}
