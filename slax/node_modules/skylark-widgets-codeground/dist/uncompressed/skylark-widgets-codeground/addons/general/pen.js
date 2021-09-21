define([
    'skylark-langx/langx',
    "../../addon",
    '../../util',
    "../../codeground"
], function (langx,Addon,util,CodeGround) {
    'use strict';
    class AddonPen  extends Addon{
        //constructor(coder, options) 

        _init() {
            super._init();

            var coder = this.coder,
                options = this.options;

            let panes = {
                html: {
                    title: 'HTML',
                    classChecker: 'codeg-has-html'
                },
                css: {
                    title: 'CSS',
                    classChecker: 'codeg-has-css'
                },
                js: {
                    title: 'JavaScript',
                    classChecker: 'codeg-has-js'
                },
                console: {
                    title: 'Console',
                    classChecker: 'codeg-plugin-console'
                }
            };
            let $availablePanes = [];
            for (let p in panes) {
                if (coder.$container.classList.contains(panes[p].classChecker)) {
                    $availablePanes.push(coder.$container.querySelector(`.codeg-pane-${ p }`));
                }
            }
            this.resizablePanes = [];
            for (let i = 0; i < $availablePanes.length; i++) {
                let type;
                for (let j = 0; j < $availablePanes[i].classList.length; j++) {
                    if ($availablePanes[i].classList[j].indexOf('codeg-pane-') !== -1) {
                        type = $availablePanes[i].classList[j].replace('codeg-pane-', '');
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
                $paneTitle.classList.add('codeg-pane-title');
                $paneTitle.innerHTML = panes[type].title || type;
                let $paneElement = $availablePanes[i].firstElementChild;
                $paneElement.insertBefore($paneTitle, $paneElement.firstChild);
                if (i > 0) {
                    $pane.expander = document.createElement('div');
                    $pane.expander.classList.add('codeg-plugin-pen-expander');
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

    AddonPen.register(CodeGround);

    return AddonPen;
});