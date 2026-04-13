<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" @click.prevent="changePage('index')">EasyWords</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="myMenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'index' }" href="#" @click.prevent="changePage('index')">Мій словник</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'about' }" href="#" @click.prevent="changePage('about')">Про додаток</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'profile' }" href="#" @click.prevent="changePage('profile')">Профіль</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'login' }" href="#" @click.prevent="changePage('login')">Вхід</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'register' }" href="#" @click.prevent="changePage('register')">Реєстрація</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <component :is="currentComponent" @navigate="changePage" />

    <footer class="bg-dark text-white text-center py-4 mt-auto">
      <div class="container">
        <p class="mb-1">&copy; 2026 EasyWords. Всі права захищені</p>
        <small class="text-secondary">Лабораторна робота №3. Web-дизайн</small>
      </div>
    </footer>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import Index from './components/Index.vue'; 
import About from './components/About.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';

const currentPage = ref('index');

const componentsMap = {
  index: Index,
  about: About,
  login: Login,
  register: Register,
  profile: Profile
};

const currentComponent = computed(() => componentsMap[currentPage.value]);

const changePage = (pageName) => {
  currentPage.value = pageName;
};
</script>

<style>
body { 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
}

.card { 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
}
</style>