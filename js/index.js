import WordModel from './model/WordModel.js';
import WordView from './view/WordView.js';
import WordController from './controller/WordController.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new WordController(new WordModel(), new WordView());
});