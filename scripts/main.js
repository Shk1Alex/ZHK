// Работа с localStorage для показаний и тарифов
function getReadings() {
    return JSON.parse(localStorage.getItem('zkh_readings') || '[]');
}
function saveReadings(readings) {
    localStorage.setItem('zkh_readings', JSON.stringify(readings));
}
function getTariffs() {
    return JSON.parse(localStorage.getItem('zkh_tariffs')) || {
        coldWater: 49.63,
        hotWater: 49.63,
        electricity: 7.33,
        service: 4800,
        internet: 750,
        heating: 0,
        hotWaterEnergy: 133,   
        drainage: 35.65        
    };
}
function saveTariffs(tariffs) {
    localStorage.setItem('zkh_tariffs', JSON.stringify(tariffs));
}

// Обновление отображения последних показаний
function updateLastReadings() {
    const readings = getReadings();
    const list = document.getElementById('readings-list');
    list.innerHTML = '';
    if (readings.length > 0) {
        const last = readings[readings.length - 1];
        const li = document.createElement('li');
        li.textContent = `ГВС: ${last.hotWater}, ХВС: ${last.coldWater}, Эл: ${last.electricity} (${last.date})`;
        list.appendChild(li);
    } else {
        list.innerHTML = '<li>Нет данных</li>';
    }
}

// Обновление истории показаний
function updateHistory() {
    const readings = getReadings();
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    if(readings.length === 0){
        historyList.innerHTML = '<li>Нет данных</li>';
    } else {
        readings.forEach((r, idx) => {
            const li = document.createElement('li');
            li.textContent = `ГВС: ${r.hotWater}, ХВС: ${r.coldWater}, Эл: ${r.electricity} (${r.date})`;
            historyList.appendChild(li);
        });
    }
    document.getElementById('delete-last').disabled = readings.length === 0;
}

// Калькуляция суммы к оплате по последним двум измерениям
function calculateAmount() {
    const readings = getReadings();
    const tariffs = getTariffs();
    let amount = 0;
    if (readings.length > 1) {
        const prev = readings[readings.length - 2];
        const last = readings[readings.length - 1];
        const hotDiff = last.hotWater - prev.hotWater;
        const coldDiff = last.coldWater - prev.coldWater;
        const elecDiff = last.electricity - prev.electricity;
        
        // Горячая вода: (энергия) = ГВС (подача) * тариф
        const hotEnergy = hotDiff * tariffs.hotWaterEnergy;
        // Подача:
        const hotSupply = hotDiff * tariffs.hotWater;
        const coldSupply = coldDiff * tariffs.coldWater;
        // Водоотведение
        const drainage = (hotDiff + coldDiff) * tariffs.drainage;
        // Электричество:
        const elec = elecDiff * tariffs.electricity;
        
        amount = hotEnergy + hotSupply + coldSupply + drainage + elec + tariffs.service + tariffs.internet + tariffs.heating;
    }
    document.getElementById('amount').textContent = amount.toFixed(2);
}

// Обработка формы ввода показаний
document.getElementById('input-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const hotWater = parseFloat(document.getElementById('hot-water').value);
    const coldWater = parseFloat(document.getElementById('cold-water').value);
    const electricity = parseFloat(document.getElementById('electricity').value);
    const date = new Date().toLocaleString('ru-RU');
    const readings = getReadings();
    readings.push({ hotWater, coldWater, electricity, date });
    saveReadings(readings);
    updateLastReadings();
    updateHistory();
    calculateAmount();
    this.reset();
});

// Обработка удаления последнего показания
document.getElementById('delete-last').addEventListener('click', function() {
    const readings = getReadings();
    if (readings.length > 0) {
        readings.pop();
        saveReadings(readings);
        updateLastReadings();
        updateHistory();
        calculateAmount();
    }
});

// Обработка формы тарифов
document.getElementById('tariff-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const tariffs = {
    coldWater: parseFloat(document.getElementById('cold-water-rate').value),
    hotWater: parseFloat(document.getElementById('hot-water-rate').value),
    electricity: parseFloat(document.getElementById('electricity-rate').value),
    service: parseFloat(document.getElementById('service-charge').value),
    internet: 750,
    heating: 0,
    hotWaterEnergy: parseFloat(document.getElementById('hot-water-energy').value),
    drainage: parseFloat(document.getElementById('drainage-rate').value)
};
    saveTariffs(tariffs);
    calculateAmount();
    alert('Тарифы сохранены!');
});

// Инициализация приложения после загрузки DOM
window.addEventListener('DOMContentLoaded', () => {
    // Подставляем тарифы в поля формы
    const tariffs = getTariffs();
    document.getElementById('cold-water-rate').value = tariffs.coldWater;
    document.getElementById('hot-water-rate').value = tariffs.hotWater;
    document.getElementById('electricity-rate').value = tariffs.electricity;
    document.getElementById('service-charge').value = tariffs.service;

    updateLastReadings();
    updateHistory();
    calculateAmount();
});