"use strict";

import {delay} from "../common.js";

export default {
    props: ['option'],
    // language=HTML
    data: () => ({
        dashArray: "0 0",
        dashOffset: "0"
    }),
    template: `
        <path cx="0"
              cy="100"
              :d="path"
              fill="none"
              stroke-width="1"
              ref="path"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"
              stroke-linecap="round"
              :stroke="option.color"/>`,
    computed: {
        /**
         * Generates easing function path
         * @returns {string}
         */
        path() {
            const {func} = this.option;
            const points = Array.from({length: 101}, (_, x) => `${x} ${100 - func(x / 100) * 100}`);
            return `M0 100, ${points.join(', ')}`
        }
    },
    async mounted() {
        const path = this.$refs.path;
        const length = path.getTotalLength();
        this.dashOffset = length;
        this.dashArray = [length, length].join(" ");
        // add styles after render
        await delay(0);
        path.style.transition = "stroke-dashoffset 2s linear";
        this.dashOffset = 0;
    }
}