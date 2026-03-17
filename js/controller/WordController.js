export default class WordController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindTableActions(this.handleToggleStatus, this.handleDelete);
        this.view.bindAddWord(this.handleAddWord);
        this.view.bindSearch(this.handleSearch);

        this.onWordListChanged(this.model.getWords());
    }

    onWordListChanged = (words) => {
        this.view.renderWords(words);
    }

    handleToggleStatus = (id) => {
        this.model.toggleWordStatus(id);
        this.onWordListChanged(this.model.getWords());
    }

    handleDelete = (id) => {
        this.model.deleteWord(id);
        this.onWordListChanged(this.model.getWords());
    }

    handleAddWord = (english, ukrainian) => {
        this.model.addWord(english, ukrainian);
        this.onWordListChanged(this.model.getWords());
    }

    handleSearch = (query) => {
        const words = this.model.getWords();
        const filteredWords = words.filter(word => 
            word.english.toLowerCase().includes(query.toLowerCase()) || 
            word.ukrainian.toLowerCase().includes(query.toLowerCase())
        );
        this.view.renderWords(filteredWords);
    }
}