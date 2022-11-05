'use strict';
import * as tf from '@tensorflow/tfjs';
import * as DICTIONARY from './dictionary.js';

const ARTICLE_NESTING_LEVEL = window.location.pathname === "/" ? 7 : 6;
const firstArticle = document.querySelector('[role="article"]')

const ENCODING_LENGTH = 20;
const MODEL_JSON_URL = "https://raw.githubusercontent.com/michlampert/sponsor-block/feature/ts-model/sponsor-block/public/model.json";
const SPAM_THRESHOLD = 0.75;
var model = undefined;

function tokenize(wordArray) {
  let returnArray = [DICTIONARY.START];
  let addedTokensCount = 0;
  for (var i = 0; i < wordArray.length; i++) {
    let encoding = DICTIONARY.LOOKUP[wordArray[i]];
    if(i < ENCODING_LENGTH - 1 && encoding !== undefined){
      addedTokensCount++;
      returnArray.push(encoding);
    }
  }
  while (addedTokensCount < ENCODING_LENGTH - 1) {
    returnArray.push(DICTIONARY.PAD);
    addedTokensCount++;
  }
  return tf.tensor([returnArray]);
}

async function loadAndPredict(inputTensor) {
  if (model === undefined) {
    model = await tf.loadLayersModel(MODEL_JSON_URL);
  }
  var results = await model.predict(inputTensor);
  const data = results.dataSync();
  return data[0] > SPAM_THRESHOLD;
}

function getLowercaseContentArray(content){
  return content.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ');
}

const shouldHide = async (content) => {
  const lowercaseContentArray = getLowercaseContentArray(content);
  return await loadAndPredict(tokenize(lowercaseContentArray));
};

const articlesList = new Array(ARTICLE_NESTING_LEVEL)
    .fill(null)
    .reduce((node) => node.parentElement, firstArticle)

const hideIfContentIsSponsored = (node, text) => {
  if (!text) {
    return;
  }
  shouldHide(text)
    .then((hide) => {
      if (hide) {
        console.log('hide', text)
        const redDiv = document.createElement("div")
        redDiv.innerHTML = '<div style="height: 50px; margin: 10px; width: 50px; background-color: blue"></div>'
        node.replaceChildren(redDiv)
      } else {
        console.log('keep', text)
      }
    })
}

const getLoadMoreButton = (node) => {
  return Array.prototype.slice.call(node.querySelectorAll('[role="button"]'))
    .filter((node) => node.innerText === "Zobacz więcej")[0]
}

const processNode = (node) => {
  const loadMoreButton = getLoadMoreButton(node)
  if (loadMoreButton) {
    const postContentContainer = new Array(3).fill(null)
      .reduce((node) => node.parentElement, loadMoreButton)
    if (!postContentContainer) {
      return;
    }
    const containerCopy = postContentContainer.cloneNode(true)
    const containerParent = postContentContainer.parentNode;
    const loadedMoreObserver = new MutationObserver(() => {
      const text = postContentContainer.textContent
      hideIfContentIsSponsored(node, text)
      loadedMoreObserver.disconnect()
      containerParent.replaceChild(containerCopy, postContentContainer)
      const newLoadMoreButton = getLoadMoreButton(containerCopy)
      newLoadMoreButton?.addEventListener("click", () => {
        containerParent.replaceChild(postContentContainer, containerCopy)
      })
    })
    loadedMoreObserver.observe(postContentContainer, { childList: true })
    loadMoreButton.click()
  } else {
    const text = node.querySelector('[data-ad-comet-preview="message"]')?.textContent
    hideIfContentIsSponsored(node, text)
  }
}

const articlesListObserver = new MutationObserver((mutations => {
  mutations.forEach((mutation) => {
    if (mutation.type !== 'childList') {
      return;
    }
    mutation.addedNodes.forEach(processNode)
  })
}))
articlesListObserver.observe(articlesList, {childList: true})
const dupa = new Array(ARTICLE_NESTING_LEVEL)
  .fill(null)
  .reduce((node) => node.parentElement, Array.prototype.slice.call(document.querySelectorAll('[role="article"]'))[1])
articlesListObserver.observe(dupa, {childList: true})
document.querySelectorAll('[role="article"]').forEach(processNode)
