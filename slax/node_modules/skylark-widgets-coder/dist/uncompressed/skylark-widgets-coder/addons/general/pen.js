define([
    'skylark-langx/langx',
    "../../Addon",
    '../../util',
    "../../Coder"
], function (langx,Addon,util,Coder) {
    'use strict';
    class AddonPen  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            let panes = {
                html: {
                    title: 'HTML',
                    classChecker: 'coder-has-html'
                },
                css: {
                    title: 'CSS',
                    classChecker: 'coder-has-css'
                },
                js: {
                    title: 'JavaScript',
                    classChecker: 'coder-has-js'
                },
                console: {
                    title: 'Console',
                    classChecker: 'coder-plugin-console'
                }
            };
            let $availablePanes = [];
            for (let p in panes) {
                if (coder.$container.classList.contains(panes[p].classChecker)) {
                    $availablePanes.push(coder.$container.querySelector(`.coder-pane-${ p }`));
                }
            }
            this.resizablePanes = [];
            for (let i = 0; i < $availablePanes.length; i++) {
                let type;
                for (let j = 0; j < $availablePanes[i].classList.length; j++) {
                    if ($availablePanes[i].classList[j].indexOf('coder-pane-') !== -1) {
                        type = $availablePanes[i].classList[j].replace('coder-pane-', '');
                        break;
                    }
                }
                if (!type) {
                    continue;
                }
                let $pane = {
                    container: $availablePanes[i],
                    expander: undefined
                };
                this.resizablePanes.push($pane);
                let $paneTitle = document.createElement('div');
                $paneTitle.classList.add('coder-pane-title');
                $paneTitle.innerHTML = panes[type].title || type;
                let $paneElement = $availablePanes[i].firstElementChild;
                $paneElement.insertBefore($paneTitle, $paneElement.firstChild);
                if (i > 0) {
                    $pane.expander = document.createElement('div');
                    $pane.expander.classList.add('coder-plugin-pen-expander');
                    $pane.expander.addEventListener('mousedown', this.startExpand.bind(this, coder));
                    $paneElement.insertBefore($pane.expander, $paneTitle);
                }
            }
        }
        startExpand(coder, event) {
            let $pane = this.resizablePanes.filter(pane => {
                return pane.expander === event.target;
            }).shift();
            let $previousPane = this.resizablePanes[this.resizablePanes.indexOf($pane) - 1];
            let $relativePixel = 100 / parseInt(window.getComputedStyle($pane.container.parentNode)['width'], 10);
            $pane.container.parentNode.style.display = 'none';
            $pane.startX = event.clientX;
            $pane.startWidth = parseFloat(window.getComputedStyle($pane.container)['width'], 10);
            $previousPane.startWidth = parseFloat(window.getComputedStyle($previousPane.container)['width'], 10);
            $pane.container.parentNode.style.display = '';
            $pane.mousemove = this.doDrag.bind(this, $pane, $previousPane, $relativePixel);
            $pane.mouseup = this.stopDrag.bind(this, $pane);
            document.addEventListener('mousemove', $pane.mousemove, false);
            document.addEventListener('mouseup', $pane.mouseup, false);
        }
        doDrag(pane, previousPane, relativePixel, event) {
            let ppNewWidth = previousPane.startWidth + (event.clientX - pane.startX) * relativePixel;
            let cpNewWidth = pane.startWidth - (event.clientX - pane.startX) * relativePixel;
            const PANE_MIN_SIZE = 10;
            if (ppNewWidth >= PANE_MIN_SIZE && cpNewWidth >= PANE_MIN_SIZE) {
                pane.container.style.maxWidth = 'none';
                previousPane.container.style.maxWidth = 'none';
                previousPane.container.style.width = `${ ppNewWidth }%`;
                pane.container.style.width = `${ cpNewWidth }%`;
            }
        }
        stopDrag(pane, event) {
            document.removeEventListener('mousemove', pane.mousemove, false);
            document.removeEventListener('mouseup', pane.mouseup, false);
        }

        static get categoryName() {
            return "general";
        }

        static get addonName(){
            return "pen";
        }

    };

    AddonPen.register(Coder);

    return AddonPen;
});