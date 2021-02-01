
const classes = {
    menu: 'show-menu',
    dark: 'dark',
    light: 'light',
};

const treshold = 0;

let headers;
let enabled;

function setEnabled(enable) {
    if (enabled === enable) {
        return;
    }

    enabled = enable;

    if (!headers) {
        headers = document.querySelectorAll('.header');
    }

    if (enabled) {
        headers.forEach(h => {
            h.classList.add(classes.menu);
        });
    } else {
        headers.forEach(h => {
            h.classList.remove(classes.menu);
        });
    }
}

export function setDarkHeader(darkHeader) {
    if (!headers) {
        headers = document.querySelectorAll('.header');
    }

    if (darkHeader) {
        headers.forEach(h => {
            h.classList.add(classes.dark);
        });
    } else {
        headers.forEach(h => {
            h.classList.add(classes.light);
        });
    }
}

function update(currentScroll) {
    setEnabled(currentScroll > treshold);
}

export default {
    update,
    setDarkHeader,
};
