document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const dob = document.getElementById('dobInput').value;

        const users = JSON.parse(localStorage.getItem('easyWords_users')) || [];

        if (users.some(u => u.email === email)) {
            alert('Користувач з таким email вже існує!');
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password,
            gender: gender,
            dob: dob
        };

        users.push(user);
        localStorage.setItem('easyWords_users', JSON.stringify(users));
        
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        window.location.href = 'login.html';
    });
});