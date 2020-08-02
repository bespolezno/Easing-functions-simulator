"use strict";

import Vue from "./vue.esm.browser.js";
import Preview from "./components/preview.js";
import EasingPath from "./components/easingPath.js";

const colors = [
    "#f44336",
    "#3f51b5",
    "#f9a825",
    "#4caf50",
    "#673ab7",
    "#03a9f4",
];

const animTime = 3000;

window.app = new Vue({
    el: "#app",
    components: {
        Preview,
        EasingPath
    },
    data: {
        options: [],
        currentTime: 0,
        aboutVisible: false,
        state: "paused",
        startTime: null
    },
    methods: {
        /**
         * Load functions from file 'assets/easing-functions.json'
         * @returns {Promise<void>}
         */
        async loadFunctions() {
            const res = await fetch('assets/easing-functions.json');
            const json = await res.json();
            this.options = Object
                .values(json.easingFunctions)
                .map((el, i) => ({
                    ...el,
                    func: new Function("t", `return ${el.equation}`),
                    checked: false,
                    color: colors[i % colors.length],
                    equation: this.equationToText(el.equation)
                }));
        },
        equationToText(equation) {
            equation = equation.replace(/[*+]/g, ' * ');
            equation = equation.replace(/([0-9()])-([0-9()])/g, '$1 - $2');
            if (equation.match(/\?/)) {
                const [cond, other] = equation.split('?');
                const [t, f] = other.split(':');
                return `<span><b>&fnof;(t) = </b><br>If <b>${cond}</b><br> Then: <b>${t}</b><br>Else: <b>${f}</b></span>`;
            }
            return `<b>&fnof;(t) = ${equation}</b>`;
        },
        /**
         * Start playing
         */
        play() {
            if (this.state === 'playing') return;
            this.startTime = performance.now() - (this.currentTime) * animTime / 100;
            this.state = 'playing';
            this.loop();
        },
        /**
         * Compute current time
         */
        loop() {
            const dx = performance.now() - this.startTime;
            this.currentTime = Math.min(dx / animTime * 100, 100);
            if (dx < animTime)
                requestAnimationFrame(this.loop.bind(this));
            else
                this.state = 'paused';
        },
        /**
         * Toggle about window
         */
        toggleAbout() {
            this.aboutVisible = !this.aboutVisible;
        },
        /**
         * Scroll to top
         */
        scrollUp() {
            document.getElementById('app').scrollIntoView({behavior: "smooth",})
        },
    },
    computed: {
        selected() {
            return this.options.filter(el => el.checked);
        }
    },
    async mounted() {
        await this.loadFunctions();
        this.options[0].checked = true;
    }
});