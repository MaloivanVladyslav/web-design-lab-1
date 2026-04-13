<template>
  <main class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">

        <div class="card shadow">

          <div class="card-header bg-primary text-white text-center">
            <h3 class="mb-0"><i class="bi bi-person-plus-fill"></i> Реєстрація</h3>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="handleRegister">

              <div class="mb-3">
                <label for="nameInput" class="form-label fw-bold">Ім'я та прізвище</label>
                <input type="text" class="form-control" id="nameInput" placeholder="Введіть ваше ім'я та прізвище" v-model="registerForm.name" required>
              </div>
              
              <div class="mb-3">
                <label for="emailInput" class="form-label fw-bold">Email</label>
                <input type="email" class="form-control" id="emailInput" placeholder="name@example.com" v-model="registerForm.email" required>
                <div class="form-text">Ми не передаємо ваші дані третім особам.</div>
              </div>

              <div class="mb-3">
                <label for="passwordInput" class="form-label fw-bold">Пароль</label>
                <input type="password" class="form-control" id="passwordInput" placeholder="Придумайте пароль" v-model="registerForm.password" required>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold d-block">Стать</label>

                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="registerForm.gender">
                  <label class="form-check-label" for="male">Чоловіча</label>
                </div>

                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="registerForm.gender">
                  <label class="form-check-label" for="female">Жіноча</label>
                </div>
              </div>

              <div class="mb-4">
                <label for="dobInput" class="form-label fw-bold">Дата народження</label>
                <input type="date" class="form-control" id="dobInput" v-model="registerForm.dob">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Зареєструватися</button>
              </div>

            </form>
          </div>

          <div class="card-footer text-center bg-white py-3"> 
            Вже є акаунт? <a href="#" @click.prevent="$emit('navigate', 'login')" class="fw-bold">Увійти</a>
          </div>

        </div>

      </div>
    </div>
  </main> 
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['navigate']);

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  gender: 'male',
  dob: ''
});

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerForm.value) 
    });

    const data = await response.json();

    if (response.ok) {
      alert('Реєстрація успішна! Тепер ви можете увійти.');
      emit('navigate', 'login');
    } else {
      alert(data.error || 'Помилка реєстрації');
    }
  } catch (error) {
    console.error('Помилка з\'єднання:', error);
    alert('Не вдалося з\'єднатися з сервером. Перевірте, чи запущено бекенд.');
  }
};
</script>