function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function addOne() {
    const strValue = getCookie('counter');
    if (strValue == null) {
        setCookie('counter', '0', 1000)
    }
    else {
        let value = parseInt(strValue)
        value += 1
        setCookie('counter', value.toString(), 1000)
    }
    document.getElementById('blocked_counter').innerText = getCookie('counter');
}

function setCounter() {
    document.getElementById('blocked_counter').innerText = getCookie('counter') || "0";
}

setCounter();

document.getElementById('do-count').onclick = addOne;
