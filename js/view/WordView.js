export default class WordView {
    constructor() {
        this.wordList = document.querySelector('.row.g-3');
        this.form = document.getElementById('addWordForm');
        this.englishInput = document.getElementById('englishWord');
        this.ukrainianInput = document.getElementById('ukrainianWord');
        this.searchInput = document.querySelector('input[type="search"]');
        
        this.currentPage = 1;
        this.itemsPerPage = 9; 
        this.currentWords = []; 
        this.paginationList = document.querySelector('.pagination');
        
        if (this.paginationList) {
            this.paginationList.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.closest('.page-link');
                if (!target) return;
                
                if (target.parentElement.classList.contains('disabled')) return;
                
                const newPage = parseInt(target.getAttribute('data-page'));
                if (!isNaN(newPage) && newPage !== this.currentPage) {
                    this.currentPage = newPage;
                    this.renderWords(this.currentWords); 
                }
            });
        }
    }

    renderWords(words) {
        this.currentWords = words; 
        this.wordList.innerHTML = '';

        if (words.length === 0) {
            this.wordList.innerHTML = '<div class="col-12 text-center text-muted mt-4">Слів не знайдено</div>';
            this.renderPagination(0);
            return;
        }

        const totalPages = Math.ceil(words.length / this.itemsPerPage);
        
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const wordsToShow = words.slice(startIndex, endIndex);

        wordsToShow.forEach(word => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            
            const badgeClass = word.isLearned ? 'bg-success' : 'bg-secondary';
            const badgeText = word.isLearned ? 'Вивчено' : 'Нове';

            col.innerHTML = `
                <div class="card shadow-sm h-100 border-0">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="card-title text-primary mb-1">${word.english}</h4>
                            <p class="card-text text-muted mb-0">${word.ukrainian}</p>
                        </div>
                        <span class="badge ${badgeClass} rounded-pill">${badgeText}</span>
                    </div>
                    <div class="card-footer bg-white border-0 text-end">
                        <button class="btn btn-sm btn-outline-secondary btn-speak" data-word="${word.english}" title="Озвучити">
                            <i class="bi bi-volume-up"></i>
                        </button>
                        <button class="btn btn-sm ${word.isLearned ? 'btn-outline-warning' : 'btn-outline-success'} btn-toggle" data-id="${word.id}" title="${word.isLearned ? 'Повторити' : 'Відмітити як вивчене'}">
                            <i class="bi ${word.isLearned ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${word.id}" title="Видалити">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            this.wordList.appendChild(col);
        });

        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        if (!this.paginationList) return;
        
        const navElement = this.paginationList.closest('nav'); 

        if (totalPages <= 1) {
            if (navElement) navElement.style.display = 'none'; 
            return;
        } else {
            if (navElement) navElement.style.display = 'block'; 
        }

        this.paginationList.innerHTML = ''; 

        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        this.paginationList.innerHTML += `
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Попередня</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            this.paginationList.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
        this.paginationList.innerHTML += `
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Наступна</a>
            </li>
        `;
    }

    bindTableActions(handleToggleStatus, handleDelete) {
        this.wordList.addEventListener('click', event => {
            const toggleBtn = event.target.closest('.btn-toggle');
            const deleteBtn = event.target.closest('.btn-delete');
            const speakBtn = event.target.closest('.btn-speak');

            if (toggleBtn) {
                const id = parseInt(toggleBtn.getAttribute('data-id'), 10);
                handleToggleStatus(id);
            }

            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id'), 10);
                handleDelete(id);
            }

            if (speakBtn) {
                const textToSpeak = speakBtn.getAttribute('data-word');
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            }
        });
    }

    bindAddWord(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            const englishText = this.englishInput.value.trim();
            const ukrainianText = this.ukrainianInput.value.trim();

            if (englishText && ukrainianText) {
                handler(englishText, ukrainianText);

                this.englishInput.value = '';
                this.ukrainianInput.value = '';

                const modalElement = document.getElementById('addWordModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }
        });
    }

    bindSearch(handler) {
        this.searchInput.addEventListener('input', event => {
            this.currentPage = 1; 
            handler(event.target.value);
        });
    }
}