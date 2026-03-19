export default class WordController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindTableActions(this.handleToggleStatus, this.handleDelete);
        this.view.bindAddWord(this.handleAddWord);
        this.view.bindSearch(this.handleSearch);
        this.view.bindPagination(this.handlePageChange);

        this.updateView();
    }

    updateView = () => {
        const data = this.model.getPaginatedData();
        this.view.renderWords(data.words, data.currentPage, data.totalPages);
    }

    handleToggleStatus = (rawId) => {
        const id = parseInt(rawId, 10);
        this.model.toggleWordStatus(id);
        this.updateView();
    }

    handleDelete = (rawId) => {
        const id = parseInt(rawId, 10);
        this.model.deleteWord(id);
        this.updateView();
    }

    handleAddWord = (rawEnglish, rawUkrainian) => {
        const isSuccess = this.model.addWord(rawEnglish, rawUkrainian);
        
        if (isSuccess) {
            this.view.clearForm();
            this.updateView();
        }
    }

    handleSearch = (query) => {
        this.model.setSearchQuery(query);
        this.updateView();
    }

    handlePageChange = (page) => {
        this.model.setPage(page);
        this.updateView();
    }
}