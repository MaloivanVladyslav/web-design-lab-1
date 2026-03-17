function getStorageKey() {
    const isLoggedIn = localStorage.getItem('easyWords_isLoggedIn');
    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('easyWords_user'));
        return 'easyWords_data_' + user.email;
    }
    return 'easyWords_data_guest';
}

export default class WordModel {
    constructor() {
        const currentKey = getStorageKey();

        if (currentKey === 'easyWords_data_guest') {
            this.words = this.extractWordsFromDOM();
        } else {
            const savedWords = JSON.parse(localStorage.getItem(currentKey));
            
            if (savedWords && savedWords.length > 0) {
                this.words = savedWords;
            } else {
                this.words = this.extractWordsFromDOM();
                this._commit();
            }
        }
    }

    extractWordsFromDOM() {
        const extractedWords = [];
        const cards = document.querySelectorAll('.row.g-3 > div');
        
        cards.forEach((col, index) => {
            const english = col.querySelector('.card-title').textContent.trim();
            const ukrainian = col.querySelector('.card-text').textContent.trim();
            const badgeText = col.querySelector('.badge').textContent.trim();
            const isLearned = badgeText === 'Вивчено';

            extractedWords.push({
                id: Date.now() + index,
                english: english,
                ukrainian: ukrainian,
                isLearned: isLearned
            });
        });

        return extractedWords;
    }

    _commit() {
        const currentKey = getStorageKey();
        
        if (currentKey !== 'easyWords_data_guest') {
            localStorage.setItem(currentKey, JSON.stringify(this.words));
        }
    }

    getWords() {
        return this.words;
    }

    addWord(english, ukrainian) {
        const newWord = {
            id: Date.now(),
            english: english,
            ukrainian: ukrainian,
            isLearned: false
        };
        
        this.words.push(newWord);
        this._commit();
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