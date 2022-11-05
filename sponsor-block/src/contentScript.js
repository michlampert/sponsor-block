'use strict';
import * as tf from '@tensorflow/tfjs';
import * as DICTIONARY from './dictionary.js';

const ARTICLE_NESTING_LEVEL =  window.location.pathname === "/" ? 7 : 6;
const firstArticle = document.querySelector('[role="article"]')

const ENCODING_LENGTH = 20;

function tokenize(wordArray) {
  let returnArray = [DICTIONARY.START];
  
  for (var i = 0; i < wordArray.length; i++) {
    let encoding = DICTIONARY.LOOKUP[wordArray[i]];
    if(i < ENCODING_LENGTH - 1){
      returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
    }
  }
  while (i < ENCODING_LENGTH - 1) {
    returnArray.push(DICTIONARY.PAD);
    i++;
  }
  console.log([returnArray]);
  return tf.tensor([returnArray]);
}

const MODEL_JSON_URL = "https://raw.githubusercontent.com/michlampert/sponsor-block/feature/ts-model/sponsor-block/public/model.json";

const SPAM_THRESHOLD = 0.75;

var model = undefined;

async function loadAndPredict(inputTensor) {
  if (model === undefined) {
    model = await tf.loadLayersModel(MODEL_JSON_URL);
  }
  var results = await model.predict(inputTensor);
  const data = results.dataSync();
  return data[0] > SPAM_THRESHOLD;
}

const shouldHide = async (content) => {
  const lowercaseContentArray = content.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ');
  return await loadAndPredict(tokenize(lowercaseContentArray));
};

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

