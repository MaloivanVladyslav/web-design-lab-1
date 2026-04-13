import WordModel from './model.js';

export default class WordController {
    constructor() {
        this.model = new WordModel();
    }

    async loadUserWords(userId) {
        const words = await this.model.getWords(userId);
        return words;
    }

    async handleAddWord(userId, english, ukrainian) {
        const addedWord = await this.model.addWord(userId, english, ukrainian);
        return addedWord;
    }

    async handleToggleStatus(word) {
        const newStatus = await this.model.toggleWordStatus(word.id, word.isLearned);
        return newStatus;
    }

    async handleDelete(id) {
        const isDeleted = await this.model.deleteWord(id);
        return isDeleted;
    }
}