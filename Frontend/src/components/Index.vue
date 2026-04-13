<template>
  <main class="container my-5">

    <div class="row align-items-center mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold text-dark mb-3 mb-md-0">
          <i class="bi bi-journal-text text-primary"></i> Мій словник
        </h2>
      </div>

      <div class="col-md-6">
        <div class="d-flex gap-2">
          <input class="form-control" type="search" placeholder="Пошук слова..." v-model="searchQuery">
          <button class="btn btn-success text-nowrap" data-bs-toggle="modal" data-bs-target="#addWordModal">
            <i class="bi bi-plus-lg"></i>
            <span class="d-none d-sm-inline">Додати</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-6 col-lg-4" v-for="word in paginatedWords" :key="word.id">
        <div class="card shadow-sm h-100 border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 class="card-title text-primary mb-1">{{ word.english }}</h4>
              <p class="card-text text-muted mb-0">{{ word.ukrainian }}</p>
            </div>
            <span class="badge rounded-pill" :class="word.isLearned ? 'bg-success' : 'bg-warning text-dark'">
              {{ word.isLearned ? 'Вивчено' : 'Вивчаю' }}
            </span>
          </div>
          <div class="card-footer bg-white border-0 text-end">
            <button class="btn btn-sm btn-outline-secondary" title="Озвучити" @click="speakWord(word.english)">
              <i class="bi bi-volume-up"></i>
            </button>
            <button class="btn btn-sm mx-1" :class="word.isLearned ? 'btn-outline-warning' : 'btn-outline-success'" title="Змінити статус" @click="toggleStatus(word)">
              <i class="bi" :class="word.isLearned ? 'bi-x-circle' : 'bi-check-lg'"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" title="Видалити" @click="deleteWord(word.id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav class="mt-5" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="setPage(currentPage - 1)">Попередня</a>
        </li>
        
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="setPage(currentPage + 1)">Наступна</a>
        </li>
      </ul>
    </nav>

    <div class="modal fade" id="addWordModal" tabindex="-1" aria-labelledby="addWordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" id="addWordModalLabel">Додати нове слово</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
          </div>
          <div class="modal-body">
            <form id="addWordForm" @submit.prevent="addWord">
              <div class="mb-3">
                <label for="englishWord" class="form-label text-muted">Слово англійською</label>
                <input type="text" class="form-control" id="englishWord" placeholder="Наприклад: Sunshine" v-model="newWord.english" required>
              </div>
              <div class="mb-4">
                <label for="ukrainianWord" class="form-label text-muted">Переклад</label>
                <input type="text" class="form-control" id="ukrainianWord" placeholder="Наприклад: Сонячне світло" v-model="newWord.ukrainian" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Зберегти слово</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import WordController from '../controller.js';

const emit = defineEmits(['navigate']);

const controller = new WordController();

const words = ref([]);
const currentUser = ref(null);
const searchQuery = ref('');
const newWord = ref({ english: '', ukrainian: '' });

const currentPage = ref(1);
const itemsPerPage = 6; 

onMounted(async () => {
  const isLoggedIn = localStorage.getItem('easyWords_isLoggedIn');
  const storedUser = JSON.parse(localStorage.getItem('easyWords_user'));

  if (isLoggedIn !== 'true' || !storedUser) {
    emit('navigate', 'login');
    return;
  }

  currentUser.value = storedUser;
  words.value = await controller.loadUserWords(currentUser.value.id); 
});

const filteredAllWords = computed(() => {
  if (!searchQuery.value) return words.value;
  const query = searchQuery.value.toLowerCase();
  return words.value.filter(word => 
    word.english.toLowerCase().includes(query) || 
    word.ukrainian.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredAllWords.value.length / itemsPerPage) || 1;
});

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAllWords.value.slice(start, end);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const addWord = async () => {
  const addedWord = await controller.handleAddWord(
    currentUser.value.id, 
    newWord.value.english, 
    newWord.value.ukrainian
  );

  if (addedWord) {
    words.value.unshift(addedWord); 
    newWord.value.english = '';
    newWord.value.ukrainian = '';
    document.getElementById('closeModalBtn').click();
  } else {
    alert('Помилка при додаванні слова');
  }
};

const deleteWord = async (id) => {
  const isDeleted = await controller.handleDelete(id);

  if (isDeleted) {
    words.value = words.value.filter(w => w.id !== id);
    if (paginatedWords.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } else {
    alert('Помилка при видаленні');
  }
};

const toggleStatus = async (word) => {
  const newStatus = await controller.handleToggleStatus(word);

  if (newStatus !== null) {
    word.isLearned = newStatus; 
  } else {
    alert('Помилка при оновленні статусу');
  }
};

const speakWord = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
};
</script>