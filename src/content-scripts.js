const ARTICLE_NESTING_LEVEL = 6

const firstArticle = document.querySelector('[role="article"]')

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
