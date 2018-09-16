'use strict';

import Turret from './turret.js';

window.onload = () => {
    // Stream player
    videojs('#player');

    window.turret = new Turret();
};