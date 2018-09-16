'use strict';


export default class Turret {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    move(panSpeed, tiltSpeed) {

        return this.fetch('/move', {
            body: JSON.stringify({
                'pan_speed': panSpeed,
                'tilt_speed': tiltSpeed
            }),
            headers: {'content-type': 'application/json'},
            method: 'POST'
        });
    }

    fetch(url, args) {
        return fetch(this.baseUrl + url, args);
    }
}