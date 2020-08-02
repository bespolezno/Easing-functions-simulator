"use strict";

import {delay} from "../common.js";

const size = 600;

export default {
    props: {
        func: {
            default: x => x
        },
        color: {
            default: "black"
        },
        stroke: {
            default: 4
        },
        delay: {
            default: 0
        }
    },
    // language=HTML
    template: `<canvas class="preview" ref="canvas" width="${size + 30}px" height="${size + 30}px"></canvas>`,
    methods: {
        async draw() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, size + 30, size + 30);
            context.fillStyle = this.color;
            const half = this.stroke / 2;
            for (let x = 0; x < size; x++) {
                const y = Math.round((1 - this.func(x / size)) * size);
                context.beginPath();
                context.arc(15 + x - half, 15 + y - half, this.stroke, 0, Math.PI * 2, true);
                context.fill();
                if (this.delay)
                    await delay(this.delay);
            }
        }
    },
    mounted() {
        this.draw();
    },

}