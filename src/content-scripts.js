const ARTICLE_NESTING_LEVEL =  window.location.pathname === "/" ? 7 : 6;
const firstArticle = document.querySelector('[role="article"]')
console.log('first', firstArticle)


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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
}

const shouldHide = (content) => Promise.resolve(Math.random() > 0.5)

const articlesList = new Array(ARTICLE_NESTING_LEVEL)
    .fill(null)
    .reduce((node) => node.parentElement, firstArticle)

const articlesListObserver = new MutationObserver((mutations => {
    mutations.forEach((mutation) => {
        if (mutation.type !== 'childList') {
            return;
        }
        mutation.addedNodes.forEach((node) => {
            const text = node.querySelector('[data-ad-comet-preview="message"]')?.textContent
            if (text) {
                shouldHide(text)
                    .then((hide) => {
                        if (hide) {
                            addOne()
                            console.log('hiding ', text)
                            const redDiv = document.createElement("div")
                            redDiv.style.height = '50px'
                            redDiv.style.width = '50px'
                            redDiv.style.backgroundColor = 'red'
                            node.replaceChildren(redDiv)
                        }
                    })
                console.log(text)
            }
        })
    })
}))

articlesListObserver.observe(articlesList, { childList: true })
