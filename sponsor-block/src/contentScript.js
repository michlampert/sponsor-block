'use strict';
import * as tf from '@tensorflow/tfjs';

const ARTICLE_NESTING_LEVEL =  window.location.pathname === "/" ? 7 : 6;
const firstArticle = document.querySelector('[role="article"]')
console.log('first', firstArticle)



const MODEL_JSON_URL = chrome.runtime.getURL('model.json');
// Set the minimum confidence for spam comments to be flagged.
// Remember this is a number from 0 to 1, representing a percentage
// So here 0.75 == 75% sure it is spam.
const SPAM_THRESHOLD = 0.75;

// Create a variable to store the loaded model once it is ready so 
// you can use it elsewhere in the program later.
var model = undefined;

/** 
 * Asynchronous function to load the TFJS model and then use it to
 * predict if an input is spam or not spam.
 */
async function loadAndPredict(inputTensor) {
  // Load the model.json and binary files you hosted. Note this is 
  // an asynchronous operation so you use the await keyword
  if (model === undefined) {
    model = await tf.loadLayersModel(MODEL_JSON_URL);
  }
  
  // Once model has loaded you can call model.predict and pass to it
  // an input in the form of a Tensor. You can then store the result.
  var results = await model.predict(inputTensor);
  
  // Print the result to the console for us to inspect.
  console.log("dupa");
  results.print();
}

const prediction = loadAndPredict(tf.tensor([[1,3,12,18,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]));

const shouldHide = (content) => Promise.resolve(
  Math.random() > 0.5
  )

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

