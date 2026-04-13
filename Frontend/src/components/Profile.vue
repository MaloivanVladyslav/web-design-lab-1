<template>
  <main class="container d-flex justify-content-center align-items-center py-5" style="min-height: 75vh;">
    <div class="card shadow w-100" style="max-width: 850px; width: 100%;">
      
      <div class="card-header bg-primary text-white">
        <h3 class="mb-0"><i class="bi bi-person-badge"></i> Мій кабінет</h3>
      </div>

      <div class="card-body p-4"> 
        <div class="row align-items-center">

          <div class="col-md-4 text-center mb-4 mb-md-0"> 
            <div class="mb-2">
              <i class="bi bi-person-circle text-secondary" style="font-size: 150px; line-height: 1;"></i> 
            </div>
            <h5 class="fw-bold mb-1">{{ currentUser.name }}</h5>
            <p class="text-muted mb-2">{{ currentUser.email }}</p>
            <span class="badge bg-success mb-3 px-3 py-2" style="font-size: 0.9rem;">
              Вивчено слів: {{ stats.learned }} з {{ stats.total }}
            </span>
          </div>
          
          <div class="col-md-8 ps-md-4">
            <h4 class="mb-4 text-primary">Особисті дані</h4>

            <table class="table table-hover">
              <tbody>
                <tr>
                  <th scope="row" class="text-secondary" style="width: 40%;">Повне ім'я</th>
                  <td class="fw-bold">{{ currentUser.name }}</td>
                </tr>
                <tr>
                  <th scope="row" class="text-secondary" style="width: 40%;">Email</th>
                  <td>{{ currentUser.email }}</td>
                </tr>
                <tr>
                  <th scope="row" class="text-secondary" style="width: 40%;">Стать</th>
                  <td>{{ genderText }}</td>
                </tr>
                <tr>
                  <th scope="row" class="text-secondary" style="width: 40%;">Дата народження</th>
                  <td>{{ formattedDob }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mt-4 text-end">
              <button class="btn btn-outline-danger me-2" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Вийти
              </button>
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                <i class="bi bi-pencil-square"></i> Редагувати профіль
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Редагувати профіль</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeProfileModalBtn"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleEditProfile">
              <div class="mb-3">
                <label class="form-label text-muted">Ім'я та прізвище</label>
                <input type="text" class="form-control" v-model="editForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Email</label>
                <input type="email" class="form-control" v-model="editForm.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Стать</label>
                <select class="form-select" v-model="editForm.gender">
                  <option value="male">Чоловіча</option>
                  <option value="female">Жіноча</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="form-label text-muted">Дата народження</label>
                <input type="date" class="form-control" v-model="editForm.dob">
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Зберегти зміни</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  </main> 
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['navigate']);

const currentUser = ref({ id: null, name: '', email: '', gender: '', dob: '' });
const editForm = ref({ name: '', email: '', gender: '', dob: '' });
const stats = ref({ total: 0, learned: 0 });

const formattedDob = computed(() => {
  if (!currentUser.value.dob) return 'Не вказано';
  return new Date(currentUser.value.dob).toLocaleDateString('uk-UA');
});

const genderText = computed(() => {
  return currentUser.value.gender === 'male' ? 'Чоловіча' : 'Жіноча';
});

onMounted(async () => {
  const isLoggedIn = localStorage.getItem('easyWords_isLoggedIn');
  const storedUser = JSON.parse(localStorage.getItem('easyWords_user'));

  if (isLoggedIn !== 'true' || !storedUser) {
    emit('navigate', 'login');
    return;
  }

  currentUser.value = storedUser;
  editForm.value = { ...storedUser };

  try {
    const response = await fetch(`http://localhost:3000/api/words?userId=${storedUser.id}`);
    if (response.ok) {
      const words = await response.json();
      stats.value.total = words.length;
      stats.value.learned = words.filter(w => w.isLearned).length;
    }
  } catch (error) {
    console.error('Помилка завантаження статистики:', error);
  }
});

const handleLogout = () => {
  localStorage.removeItem('easyWords_isLoggedIn');
  localStorage.removeItem('easyWords_user');
  emit('navigate', 'login');
};

const handleEditProfile = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${currentUser.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm.value)
    });

    const data = await response.json();

    if (response.ok) {
      currentUser.value = { ...currentUser.value, ...editForm.value };
      localStorage.setItem('easyWords_user', JSON.stringify(currentUser.value));
      
      document.querySelector('#editProfileModal .btn-close').click();
    } else {
      alert(data.error || 'Помилка оновлення профілю');
    }
  } catch (error) {
    console.error('Помилка з\'єднання:', error);
    alert('Не вдалося зберегти зміни на сервері.');
  }
};
</script>