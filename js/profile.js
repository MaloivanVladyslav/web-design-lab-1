document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('easyWords_isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('easyWords_user'));
    
    function updateProfileUI() {
        if (user) {
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmailBadge').textContent = user.email;
            
            document.getElementById('profileFullName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            
            const genderText = user.gender === 'male' ? 'Чоловіча' : 'Жіноча';
            document.getElementById('profileGender').textContent = genderText;
            
            if (user.dob) {
                const date = new Date(user.dob);
                document.getElementById('profileDob').textContent = date.toLocaleDateString('uk-UA');
            } else {
                document.getElementById('profileDob').textContent = 'Не вказано';
            }
        }
    }

    updateProfileUI(); 

    const userWordsKey = 'easyWords_data_' + user.email;
    const words = JSON.parse(localStorage.getItem(userWordsKey)) || [];
    const learnedWords = words.filter(w => w.isLearned).length;
    document.getElementById('profileStats').textContent = `Вивчено слів: ${learnedWords} з ${words.length}`;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('easyWords_isLoggedIn');
            window.location.href = 'login.html';
        });
    }

    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        document.querySelector('[data-bs-target="#editProfileModal"]').addEventListener('click', () => {
            document.getElementById('editName').value = user.name;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editGender').value = user.gender;
            document.getElementById('editDob').value = user.dob || '';
        });

        editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const oldEmail = user.email;

            user.name = document.getElementById('editName').value.trim();
            user.email = document.getElementById('editEmail').value.trim();
            user.gender = document.getElementById('editGender').value;
            user.dob = document.getElementById('editDob').value;

            localStorage.setItem('easyWords_user', JSON.stringify(user));
            
            let users = JSON.parse(localStorage.getItem('easyWords_users')) || [];
            const userIndex = users.findIndex(u => u.email === oldEmail);
            if(userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('easyWords_users', JSON.stringify(users));
            }

            if (oldEmail !== user.email) {
                const oldData = localStorage.getItem('easyWords_data_' + oldEmail);
                if (oldData) {
                    localStorage.setItem('easyWords_data_' + user.email, oldData);
                    localStorage.removeItem('easyWords_data_' + oldEmail);
                }
            }
            
            updateProfileUI();

            const modalElement = document.getElementById('editProfileModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        });
    }
});