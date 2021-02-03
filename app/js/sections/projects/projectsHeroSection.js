import Section from 'core/section';
import gsap from 'gsap';
import Video from 'components/common/video';
import App from 'components/gallery/gallery';

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

        this.initGallery();
    }

    initGallery() {
        let doc = document.querySelector('html')
        doc.classList.add('htmlCalc')

        const images = document.querySelectorAll('img:not([src*="https://tympanus.net/codrops/wp-content/banners/"])')
        let imagesIndex = 0
        Array.from(images).forEach(element => {
            const image = new Image()

            // @ts-ignore
            image.src = element.src

            image.onload = _ => {
                imagesIndex += 1

                if (imagesIndex === images.length) {
                    document.documentElement.classList.remove('loading')
                    document.documentElement.classList.add('loaded')
                }

            }
        });

        new App();
        
        doc.classList.remove('htmlCalc')
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
