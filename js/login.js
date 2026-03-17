document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const emailInput = document.getElementById('loginEmail').value.trim();
        const passInput = document.getElementById('loginPass').value;

        const users = JSON.parse(localStorage.getItem('easyWords_users')) || [];
        const foundUser = users.find(u => u.email === emailInput && u.password === passInput);

        if (foundUser) {
            localStorage.setItem('easyWords_isLoggedIn', 'true');
            localStorage.setItem('easyWords_user', JSON.stringify(foundUser));
            window.location.href = 'profile.html';
        } else {
            alert('Невірний email або пароль! Перевірте дані або зареєструйтесь.');
        }
    });
});