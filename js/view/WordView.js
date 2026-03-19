export default class WordView {
    constructor() {
        this.wordList = document.querySelector('.row.g-3');
        this.cardTemplate = document.getElementById('word-card-template');
        this.form = document.getElementById('addWordForm');
        this.englishInput = document.getElementById('englishWord');
        this.ukrainianInput = document.getElementById('ukrainianWord');
        this.searchInput = document.querySelector('input[type="search"]');
        this.paginationList = document.querySelector('.pagination');
    }

    renderWords(wordsToShow, currentPage, totalPages) {
        this.wordList.innerHTML = ''; 

        if (wordsToShow.length === 0) {
            this.wordList.textContent = 'Слів не знайдено';
            this.renderPagination(0, 0);
            return;
        }

        wordsToShow.forEach(word => {
            const clone = this.cardTemplate.content.cloneNode(true); 
            
            clone.querySelector('.js-english').textContent = word.english;
            clone.querySelector('.js-ukrainian').textContent = word.ukrainian;
            
            const badge = clone.querySelector('.js-badge');
            badge.textContent = word.badgeText;
            badge.classList.add(word.badgeClass);

            const toggleBtn = clone.querySelector('.btn-toggle');
            toggleBtn.classList.add(word.btnClass);
            toggleBtn.title = word.btnTitle;
            
            clone.querySelector('.js-icon-toggle').classList.add(word.iconClass);

            clone.querySelector('.btn-speak').dataset.word = word.english;
            toggleBtn.dataset.id = word.id;
            clone.querySelector('.btn-delete').dataset.id = word.id;

            this.wordList.appendChild(clone);
        });

        this.renderPagination(currentPage, totalPages);
    }

    renderPagination(currentPage, totalPages) {
        if (!this.paginationList) return;
        const navElement = this.paginationList.closest('nav'); 
        
        if (totalPages <= 1) {
            navElement.style.display = 'none'; 
            return;
        }
        navElement.style.display = 'block'; 
        this.paginationList.innerHTML = ''; 

        const createLi = (text, page, isDisabled, isActive) => {
            const li = document.createElement('li');
            li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${text}</a>`;
            return li;
        };

        this.paginationList.appendChild(createLi('Попередня', currentPage - 1, currentPage === 1, false));
        for (let i = 1; i <= totalPages; i++) {
            this.paginationList.appendChild(createLi(i, i, false, i === currentPage));
        }
        this.paginationList.appendChild(createLi('Наступна', currentPage + 1, currentPage === totalPages, false));
    }

    bindTableActions(handleToggleStatus, handleDelete) {
        this.wordList.addEventListener('click', event => {
            const toggleBtn = event.target.closest('.btn-toggle');
            const deleteBtn = event.target.closest('.btn-delete');
            const speakBtn = event.target.closest('.btn-speak');

            if (toggleBtn) handleToggleStatus(toggleBtn.dataset.id);
            if (deleteBtn) handleDelete(deleteBtn.dataset.id);
            
            if (speakBtn) {
                const utterance = new SpeechSynthesisUtterance(speakBtn.dataset.word);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            }
        });
    }

    bindAddWord(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            handler(this.englishInput.value, this.ukrainianInput.value);
        });
    }

    clearForm() {
        this.form.reset();
        bootstrap.Modal.getInstance(document.getElementById('addWordModal')).hide();
    }

    bindSearch(handler) {
        this.searchInput.addEventListener('input', e => handler(e.target.value));
    }

    bindPagination(handler) {
        if (this.paginationList) {
            this.paginationList.addEventListener('click', e => {
                e.preventDefault();
                const target = e.target.closest('.page-link');
                if (target && !target.parentElement.classList.contains('disabled')) {
                    handler(parseInt(target.dataset.page, 10));
                }
            });
        }
    }
}