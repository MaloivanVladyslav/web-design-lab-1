export default class WordModel {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    async getWords(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/words?userId=${userId}`);
            if (!response.ok) throw new Error('Помилка завантаження слів');
            return await response.json();
        } catch (error) {
            console.error('Помилка Model:', error);
            return [];
        }
    }

    async addWord(userId, english, ukrainian) {
        if (!english.trim() || !ukrainian.trim()) return null;

        try {
            const response = await fetch(`${this.baseUrl}/words`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, english, ukrainian })
            });
            if (!response.ok) throw new Error('Помилка збереження');
            return await response.json();
        } catch (error) {
            console.error('Помилка Model:', error);
            return null;
        }
    }

    async toggleWordStatus(id, currentStatus) {
        const newStatus = currentStatus ? 0 : 1;
        
        try {
            const response = await fetch(`${this.baseUrl}/words/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isLearned: newStatus })
            });
            if (!response.ok) throw new Error('Помилка оновлення статусу');
            return newStatus;
        } catch (error) {
            console.error('Помилка Model:', error);
            return null;
        }
    }

    async deleteWord(id) {
        try {
            const response = await fetch(`${this.baseUrl}/words/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Помилка видалення');
            return true;
        } catch (error) {
            console.error('Помилка Model:', error);
            return false;
        }
    }
}