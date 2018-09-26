'use strict';

import Turret from './turret.js';

class Joystick {
    constructor(element) {
        this.ctx = element.getContext('2d');
        this.onjoystickmove = null;
        this.wasEnabled = false;
        element.onmousedown = element.onmousemove = element.onmouseup = element.onmouseout = this.handleMouse.bind(this);
        element.ontouchstart = element.ontouchmove = element.ontouchend = element.ontouchcancel = this.handleTouch.bind(this);

        window.requestAnimationFrame(this.draw.bind(this, false, 0, 0));
    }

    handleMouse(e) {
        const enabled = e.buttons & 0x1 && e.type !== 'mouseout';
        this.update(e.offsetX, e.offsetY, enabled);
    }

    handleTouch(e) {
        let x = 0, y = 0;
        let enabled = false;

        if (e.touches.length > 0) {
            enabled = true;
            const touch = e.touches[0];
            const canvasRect = e.target.getBoundingClientRect();
            x = touch.pageX - canvasRect.left;
            y = touch.pageY - canvasRect.top;
        }
        this.update(x, y, enabled);
        e.preventDefault()
    }

    update(xPos, yPos, enabled) {

        let x, y;
        if (enabled) {
            const width = this.ctx.canvas.width;
            const height = this.ctx.canvas.height;

            const centerX = width / 2;
            const centerY = height / 2;
            const borderWidth = 2;
            const backgroundRadius = Math.min(centerX, centerY) - borderWidth / 2;
            const handleRadius = width / 8;

            x = xPos - centerX;
            y = yPos - centerY;

            let mag = Math.hypot(x, y);
            const maxMag = backgroundRadius - handleRadius;
            if (mag > maxMag) {
                x = x / mag * maxMag;
                y = y / mag * maxMag;
                mag = maxMag;
            }

            if (this.onjoystickmove) {
                this.onjoystickmove(x / maxMag, y / maxMag);
            }

        } else {
            x = y = 0;
            if (this.wasEnabled && this.onjoystickmove) {
                this.onjoystickmove(0, 0);
            }
        }
        this.wasEnabled = enabled;

        window.requestAnimationFrame(this.draw.bind(this, enabled, x, y));
    }

    draw(enabled, x, y, timestamp) {
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;

        const centerX = width / 2;
        const centerY = height / 2;
        const borderWidth = 2;
        const backgroundRadius = Math.min(centerX, centerY) - borderWidth / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, backgroundRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#c7c7c7';
        this.ctx.fill();
        this.ctx.lineWidth = borderWidth;
        this.ctx.strokeStyle = '#2c2c2c';
        this.ctx.stroke();

        const handleRadius = width / 8;

        this.ctx.beginPath();
        this.ctx.arc(x + centerX, y + centerY, handleRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = enabled ? '#a0a0a0' : '#afafaf';
        this.ctx.fill();
        this.ctx.lineWidth = borderWidth;
        this.ctx.strokeStyle = '#2c2c2c';
        this.ctx.stroke();
    }
}

window.onload = () => {
    // Stream player
    videojs('#player');

    const turret = new Turret();
    const joystick = new Joystick(document.getElementById('joystick'));

    joystick.onjoystickmove = (x, y) => {
        x = Math.round(x * 7);
        y = Math.round(y * 7);
        turret.move(x, y);
    }
};