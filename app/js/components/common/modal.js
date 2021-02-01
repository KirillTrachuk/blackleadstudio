// core
import gsap from 'gsap';
import Component from 'core/component';

export default class Modal extends Component {
    _setup(config) {
        /** @type {HTMLElement} */
        this.modal = config.modal;

        this.modalContent = config.modalContent || null;
        this.modalLink = config.modalLink || null;

        this.openButton = config.openButton;
        this.closeButton = config.closeButton;

        this.body = document.querySelector('body');

        /** @type {string} */
        this._modalActiveClass = config.modalActiveClass || 'modal-active';

        this.opened = false;
        this.closed = !this.opened;

        if (this.openButton.length && this.openButton.length > 0) {
            this.openButton.forEach(button => {
                button.addEventListener('click', event => {
                    event.preventDefault();
                    this.show();
                });
            });
        } else {
            this.openButton.addEventListener('click', event => {
                event.preventDefault();
                this.show();
            });
        }

        this.closeButton.addEventListener('click', event => {
            event.preventDefault();
            this.hide();
        });
    }

    openModal() {
        this.body.classList.add(this._modalActiveClass);

        document.ontouchmove = event => {
            event.preventDefault();
        };

        this.opened = true;
        this.closed = !this.opened;
    }

    closeModal() {
        this.body.classList.remove(this._modalActiveClass);

        document.ontouchmove = event => {
            return true;
        };

        this.closed = true;
        this.opened = !this.closed;
    }

    show() {
        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: () => {
                this.openModal();
            },
        });

        animation
            .add(() => this.modal.classList.add(this._modalActiveClass))
            .fromTo(this.modal, 0.75, { autoAlpha: 0 }, { autoAlpha: 1 });
    }

    hide() {
        const animation = gsap.timeline({
            immediateRender: false,
            onComplete: () => {
                this.closeModal();
            },
        });

        animation
            .fromTo(this.modal, 0.375, { autoAlpha: 1 }, { autoAlpha: 0 })
            .add(() => this.modal.classList.remove(this._modalActiveClass));
    }
}
