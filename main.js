'use strict';

import './style.css';

import axios from 'axios';
import yaml from 'js-yaml';

const app = document.getElementById('app');

const dataPath = './data/diet/';
const imagePath = dataPath + 'img/';

const yamlUrl = dataPath + 'data.yaml';

let questionGenerator = null;

let score = 0;

const showResult = () => {
  app.innerText = score;
};

const showNextQuestion = () => {
  const result = questionGenerator.next();
  console.log(result);

  if (result.done) {
    showResult();
    return;
  }

  const fragment = result.value;
  console.log(fragment);

  app.replaceChildren(fragment);
};

const questionGeneratorFn = function* (questions) {
  let questionNum = 0;
  for (const questionData of questions) {
    questionNum++;
    const questionId = 'question-' + questionNum;

    const fragment = document.createDocumentFragment();

    const questionText = document.createElement('h2');
    questionText.innerText = '#' + questionNum + ' ' + questionData.question;
    fragment.appendChild(questionText);

    const questionImage = document.createElement('img');
    questionImage.setAttribute('src', imagePath + questionData.image);
    questionImage.setAttribute('class', 'question-image');
    fragment.appendChild(questionImage);

    let choiceNum = 0;
    for (const choiceData of questionData.choices) {
      choiceNum++;
      const choiceId = questionId + '-choice-' + choiceNum;

      const itemWrapper = document.createElement('div');

      const choiceItem = document.createElement('input');
      choiceItem.setAttribute('type', 'radio');
      choiceItem.setAttribute('id', choiceId);
      choiceItem.setAttribute('name', questionId);
      choiceItem.setAttribute('value', choiceData.score);
      itemWrapper.appendChild(choiceItem);

      const choiceLabel = document.createElement('label');
      choiceLabel.setAttribute('for', choiceId);
      choiceLabel.innerText = choiceData.answer;
      itemWrapper.appendChild(choiceLabel);

      itemWrapper.addEventListener('click', () => {
        score += choiceData.score;
        showNextQuestion();
      });

      fragment.appendChild(itemWrapper);
    }

    yield fragment;
  }
};

axios.get(yamlUrl)
  .then((response) => {
    const data = yaml.load(response.data);
    console.log(data);

    questionGenerator = questionGeneratorFn(data.questions);

    showNextQuestion();
  })
  .catch((error) => {
    console.log(error);
  })
  .then(() => {
    // noop
  });
