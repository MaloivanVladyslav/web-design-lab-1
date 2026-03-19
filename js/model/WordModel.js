function getStorageKey() {
    const isLoggedIn = localStorage.getItem('easyWords_isLoggedIn');
    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('easyWords_user'));
        return 'easyWords_data_' + user.email;
    }
    return 'easyWords_data_guest';
}

const DEFAULT_WORDS = [
    { id: 1, english: 'Apple', ukrainian: 'Яблуко', isLearned: false },
    { id: 2, english: 'Cat', ukrainian: 'Кіт', isLearned: true },
    { id: 3, english: 'House', ukrainian: 'Будинок', isLearned: false },
    { id: 4, english: 'Sun', ukrainian: 'Сонце', isLearned: false },
    { id: 5, english: 'Water', ukrainian: 'Вода', isLearned: true },
    { id: 6, english: 'Friend', ukrainian: 'Друг', isLearned: false }
];

export default class WordModel {
    constructor() {
        const currentKey = getStorageKey();

        if (currentKey === 'easyWords_data_guest') {
            this.words = [...DEFAULT_WORDS];
        } else {
            const savedWords = JSON.parse(localStorage.getItem(currentKey));
            if (savedWords && savedWords.length > 0) {
                this.words = savedWords;
            } else {
                this.words = [...DEFAULT_WORDS];
                this._commit();
            }
        }

        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.searchQuery = '';
    }

    _commit() {
        const currentKey = getStorageKey();
        if (currentKey !== 'easyWords_data_guest') {
            localStorage.setItem(currentKey, JSON.stringify(this.words));
        }
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.currentPage = 1;
    }

    setPage(page) {
        this.currentPage = page;
    }

    getPaginatedData() {
        const filtered = this.words.filter(w =>
            w.english.toLowerCase().includes(this.searchQuery) ||
            w.ukrainian.toLowerCase().includes(this.searchQuery)
        );

        const totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const rawWords = filtered.slice(start, start + this.itemsPerPage);

        const wordsToShow = rawWords.map(word => ({
            ...word,
            badgeText: word.isLearned ? 'Вивчено' : 'Нове',
            badgeClass: word.isLearned ? 'bg-success' : 'bg-secondary',
            btnClass: word.isLearned ? 'btn-outline-warning' : 'btn-outline-success',
            btnTitle: word.isLearned ? 'Повторити' : 'Відмітити як вивчене',
            iconClass: word.isLearned ? 'bi-arrow-counterclockwise' : 'bi-check-lg'
        }));

        return {
            words: wordsToShow,
            currentPage: this.currentPage,
            totalPages: totalPages
        };
    }

    addWord(rawEnglish, rawUkrainian) {
        const english = rawEnglish.trim();
        const ukrainian = rawUkrainian.trim();

        if (!english || !ukrainian) {
            return false;
        }

        const newWord = {
            id: Date.now(),
            english: english,
            ukrainian: ukrainian,
            isLearned: false
        };
        this.words.push(newWord);
        this._commit();
        
        return true;
    }

    toggleWordStatus(id) {
        this.words = this.words.map(word =>
            word.id === id ? { ...word, isLearned: !word.isLearned } : word
        );
        this._commit();
    }

    deleteWord(id) {
        this.words = this.words.filter(word => word.id !== id);
        this._commit();
    }
}