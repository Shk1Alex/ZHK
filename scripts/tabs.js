document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', function() {
        // Скрываем все вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });
        // Снимаем активное состояние с кнопок
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        // Активируем выбранную вкладку
        const tabId = this.dataset.tab;
        document.getElementById(tabId).style.display = 'block';
        document.getElementById(tabId).classList.add('active');
        this.classList.add('active');
    });
});