let timer = 0;
let pause = true;
let last = false;
let timeout = null;
let speed = location.hash === '#demo' ? 1000 : 1;
let noSleep = new NoSleep(); // empêche l'écran du téléphone de s'éteindre automatiquement
let etape = 1;
let skip = false;

function afficher() {
    if (timer < (30 + 20 + 60 + 20) * 60 * 1000) {
        document.querySelector('.overlay').style.height = (timer / 1000) / ((30 + 20 + 60 + 20) * 60) * 100 + '%';
    } else {
        document.querySelector('.overlay').style.height = '100%';
        etape === 4 && (vibrer([350, 350, 350, 350, 350]), etape = 5);
    }
    if (timer <= 30 * 60 * 1000) {
        document.querySelector('.etape1').textContent = temps(30 * 60 - parseInt(timer / 1000));
    } else if (timer <= (30 + 20) * 60 * 1000) {
        etape === 1 && (vibrer(500), etape = 2);
        document.querySelector('.etape2').textContent = temps((30 + 20) * 60 - parseInt(timer / 1000));
    } else if (timer <= (30 + 20 + 60) * 60 * 1000) {
        etape === 2 && (vibrer(500), etape = 3);
        document.querySelector('.etape3').textContent = temps((30 + 20 + 60) * 60 - parseInt(timer / 1000));
    } else {
        etape === 3 && (vibrer(500), etape = 4);
        document.querySelector('.etape4').textContent = temps((30 + 20 + 60 + 20) * 60 - parseInt(timer / 1000));
    }
}

function temps(secondes) {
    if (secondes < 0) { return '-' + temps(-secondes); }
    return parseInt(secondes / 60) + ':' + (secondes % 60).toString().padStart(2, '0')
}

function tick() {
    if (!pause) {
        if (last !== false) {
            timer += (Date.now() - last) * speed;
        }
        last = Date.now();
        afficher();
        timeout = setTimeout(tick, 1000 / speed);
    }
}

function vibrer(t) {
    if (navigator.vibrate) {
        navigator.vibrate(t);
    }
}

document.body.addEventListener('click', function () {
    if (skip) {
        skip = false;
        return;
    }
    vibrer(10);
    if (pause) {
        noSleep.enable();
        pause = false;
        tick();
    } else {
        noSleep.disable();
        tick();
        if (timeout) {
            clearTimeout(timeout);
        }
        last = false;
        pause = true;
    }
});
[['etape1', 0], ['etape2', 30], ['etape3', 30 + 20], ['etape4', 30 + 20 + 60]].forEach(function (etape) {
    [['mousedown', 'mouseup', 'mousemove'], ['touchstart', 'touchend', 'touchmove']].forEach(function (e) {
        document.querySelector('.' + etape[0]).addEventListener(e[0], function () {
            let mouseDownTimer = setTimeout(x => {
                vibrer(10);
                timer = etape[1]*60*1000;
                skip = true;
                afficher();
            }, 1000);
            this.addEventListener(e[1], function () {
                clearTimeout(mouseDownTimer);
            });

            this.addEventListener(e[2], function () {
                clearTimeout(mouseDownTimer);
            });
        });
    });
});