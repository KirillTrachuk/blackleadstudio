import { observable } from 'mobx';
import Breakpoints from 'app/core/breakpoints';

/** @typedef {(import ('app/core/breakpoints').Breakpoint)} BreakpointBase */

/** @typedef {BreakpointBase} AppBreakpoint */

const AppBreakpoints = {
    TouchDesktop: {
        id: 1,
        name: 'TouchDesktop',
        width: 1024,
        height: 810,
        mediaQuery: '(min-width: 1024px) and (any-hover: hover) and (any-pointer: coarse)',
    },
    Desktop: {
        id: 2,
        name: 'Desktop',
        width: 1440,
        height: 810,
        mediaQuery: '(min-width: 1025px) and (any-hover: hover)',
    },
    WindowedDesktop: {
        id: 3,
        name: 'WindowedDesktop',
        width: 1024,
        height: 810,
        mediaQuery: '(max-width: 1024px) and (any-hover: hover)',
    },
    Tablet: {
        id: 4,
        name: 'Tablet',
        width: 1024,
        height: 768,
        mediaQuery: '(any-pointer: coarse) and (min-width: 768px) and (hover: none) and (max-width: 1367px)',
    },
    MobilePortrait: {
        id: 5,
        name: 'MobilePortrait',
        width: 480,
        height: 897,
        mediaQuery: '(max-width: 480px) and (hover: none) and (any-pointer: coarse)',
    },
};

Breakpoints.registerBreakpoint(AppBreakpoints.TouchDesktop);
Breakpoints.registerBreakpoint(AppBreakpoints.Desktop);
Breakpoints.registerBreakpoint(AppBreakpoints.WindowedDesktop);
Breakpoints.registerBreakpoint(AppBreakpoints.Tablet);
Breakpoints.registerBreakpoint(AppBreakpoints.MobilePortrait);

const _internal = observable.object({
    width: 0,
    height: 0,
});

export default observable.object({
    get All() { return AppBreakpoints; },

    Current: {
        /** @returns {AppBreakpoint} */
        get breakpoint() { return Breakpoints.Current.breakpoint; },

        get rem() { return Breakpoints.Current.rem; },
    },

    get width() { return _internal.width; },

    get height() { return _internal.height; },

    resize(width, height) {
        _internal.width = width;
        _internal.height = height;

        Breakpoints.resize(width, height);
    },

    isActive(...breakpointsIds) {
        return breakpointsIds.indexOf(this.Current.breakpoint.id) >= 0;
    },
});
