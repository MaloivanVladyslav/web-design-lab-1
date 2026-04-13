<template>
  <main class="container d-flex justify-content-center align-items-center py-5" style="min-height: 75vh;">
    <div class="card shadow w-100" style="max-width: 450px;">

      <div class="card-header bg-primary text-white text-center">
        <h3 class="mb-0"><i class="bi bi-box-arrow-in-right"></i> Вхід</h3>
      </div>

      <div class="card-body p-4">
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="loginEmail" class="form-label fw-bold">Email</label>
            <input type="email" class="form-control" id="loginEmail" v-model="loginForm.email" placeholder="name@example.com" required>
          </div>

          <div class="mb-3">
            <label for="loginPass" class="form-label fw-bold">Пароль</label>
            <input type="password" class="form-control" id="loginPass" v-model="loginForm.password" placeholder="********" required>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg">Увійти</button>
          </div>
        </form>
      </div>

      <div class="card-footer text-center bg-white py-3"> 
        Немає акаунту? <a href="#" @click.prevent="$emit('navigate', 'register')" class="fw-bold">Зареєструватися</a>
      </div>

    </div>
  </main> 
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['navigate']);

const loginForm = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('easyWords_isLoggedIn', 'true');
      localStorage.setItem('easyWords_user', JSON.stringify(data));
      
      loginForm.value.email = '';
      loginForm.value.password = '';
      
      emit('navigate', 'profile');
    } else {
      alert(data.error || 'Помилка авторизації');
    }
  } catch (error) {
    console.error('Помилка з\'єднання з сервером:', error);
    alert('Не вдалося з\'єднатися з сервером. Перевірте, чи запущено бекенд.');
  }
};
</script>