// ====================================================================
// FIREBASE КОНФИГУРАЦИЯ
// ====================================================================
const firebaseConfig = {
    apiKey: "AIzaSyARQ40yqOZKa7dJE4655oR2EAUcLCUSCik",
    authDomain: "bespredelanet-13204.firebaseapp.com",
    projectId: "bespredelanet-13204",
    storageBucket: "bespredelanet-13204.firebasestorage.app",
    messagingSenderId: "548204853503",
    appId: "1:548204853503:web:35baade27cd3f6aff5b4ca"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ====================================================================
// ДАННЫЕ
// ====================================================================
let currentUser = null;
let tips = [];
let categories = [];
let tickets = [];
let users = [];
let currentPage = 'home';

let userSettings = {
    theme: 'dark',
    accent: 'indigo',
    customColor: null,
    displayName: '',
    avatarColor: '#6366f1',
    avatarColor2: '#8b5cf6',
    useGradient: true,
    animations: true,
    highContrast: false,
    bigButtons: false,
    largeText: false,
    nightMode: false
};

let systemSettings = {
    maintenanceMode: false,
    registrationRequired: false,
    globalBannerEnabled: false,
    globalBannerText: '',
    globalBannerType: 'info',
    globalBannerIcon: '📢',
    allowDeleteAccount: true,
    allowChangePassword: true,
    allowChangeName: true,
    allowCreateTips: true,
    allowCreateTasks: true,
    allowCreateTickets: true,
    allowUserRegistration: true,
    enableChat: true,
    enableMap: true,
    enableComplaints: true,
    enableFavorites: true,
    enableTips: true,
    enableSupport: true,
    showWelcomeMessage: true,
    welcomeMessage: 'Добро пожаловать в Щит!'
};

// ====================================================================
// АВТОРИЗАЦИЯ
// ====================================================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            role: user.email === 'kowtunov.k@yandex.ru' ? 'root' : 'user'
        };
        
        await loadUserSettings();
        await loadSystemSettings();
        
        document.getElementById('authScreen').style.display = 'none';
        initApp();
        showToast('success', 'Добро пожаловать!', currentUser.displayName);
    } else {
        currentUser = null;
        document.getElementById('authScreen').style.display = 'flex';
    }
});

window.switchAuthTab = function(tab, el) {
    document.querySelectorAll('#authScreen .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('authLoginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('authRegisterForm').style.display = tab === 'register' ? 'block' : 'none';
};

window.doLogin = async function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

window.doRegister = async function() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password !== confirm) {
        showToast('danger', 'Ошибка', 'Пароли не совпадают');
        return;
    }
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        showToast('success', 'Регистрация успешна!', email);
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

window.doLogout = async function() {
    await auth.signOut();
    showToast('success', 'Вы вышли', 'До встречи!');
};

window.createAnonymousTicket = function() {
    showToast('info', 'Поддержка', 'Создайте тикет после входа в аккаунт');
};

// ====================================================================
// НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
// ====================================================================
async function loadUserSettings() {
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            userSettings = { ...userSettings, ...doc.data().settings };
        }
    } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
    }
}

async function saveUserSettings() {
    try {
        await db.collection('users').doc(currentUser.uid).set({
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: currentUser.role,
            settings: userSettings,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.error('Ошибка сохранения настроек:', e);
    }
}

// ====================================================================
// СИСТЕМНЫЕ НАСТРОЙКИ
// ====================================================================
async function loadSystemSettings() {
    try {
        const doc = await db.collection('settings').doc('system').get();
        if (doc.exists) {
            systemSettings = { ...systemSettings, ...doc.data() };
        }
    } catch (e) {
        console.error('Ошибка загрузки системных настроек:', e);
    }
}

async function saveSystemSettings() {
    try {
        await db.collection('settings').doc('system').set(systemSettings, { merge: true });
    } catch (e) {
        console.error('Ошибка сохранения системных настроек:', e);
    }
}

window.toggleSysSetting = function(el) {
    const key = el.dataset.key;
    systemSettings[key] = !systemSettings[key];
    saveSystemSettings();
    el.classList.toggle('on');
    showToast('success', 'Настройка изменена', key);
};

window.updateSysSetting = function(key, value) {
    systemSettings[key] = value;
    saveSystemSettings();
    showToast('success', 'Сохранено', key);
};

// ====================================================================
// TOAST УВЕДОМЛЕНИЯ
// ====================================================================
window.showToast = function(type, title, message, duration) {
    duration = duration || 4000;
    const c = document.getElementById('toastContainer');
    const icons = { success: '✅', warning: '⚠️', danger: '🚨', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = `<div class="toast-icon">${icons[type] || 'ℹ️'}</div>
        <div style="flex:1"><div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div></div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), duration);
};

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================================================================
// ПРИМЕНЕНИЕ НАСТРОЕК
// ====================================================================
function applySettings() {
    const classes = ['accent-purple','accent-pink','accent-green','accent-blue','accent-orange','accent-red','accent-cyan','accent-yellow','theme-light','animations-enabled','animations-disabled','big-buttons','high-contrast','large-text','night-mode'];
    classes.forEach(c => document.body.classList.remove(c));
    
    if (userSettings.theme === 'light') {
        document.body.classList.add('theme-light');
    } else if (userSettings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('theme-light');
    }
    
    if (userSettings.animations) {
        document.body.classList.add('animations-enabled');
    } else {
        document.body.classList.add('animations-disabled');
    }
    
    if (userSettings.customColor) {
        document.documentElement.style.setProperty('--primary', userSettings.customColor);
        document.documentElement.style.setProperty('--primary-hover', userSettings.customColor);
        document.documentElement.style.setProperty('--primary-soft', userSettings.customColor + '20');
    } else if (userSettings.accent !== 'indigo') {
        document.body.classList.add('accent-' + userSettings.accent);
    }
    
    if (userSettings.bigButtons) document.body.classList.add('big-buttons');
    if (userSettings.highContrast) document.body.classList.add('high-contrast');
    if (userSettings.largeText) document.body.classList.add('large-text');
    if (userSettings.nightMode) document.body.classList.add('night-mode');
    
    updateUserInfo();
}

function updateUserInfo() {
    if (!currentUser) return;
    
    document.getElementById('userName').textContent = currentUser.displayName;
    document.getElementById('userRole').textContent = currentUser.role === 'root' ? 'Создатель' : 'Пользователь';
    document.getElementById('userId').textContent = 'ID: ' + currentUser.uid.substring(0, 8);
    
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
    
    if (userSettings.useGradient) {
        avatar.style.background = `linear-gradient(135deg, ${userSettings.avatarColor}, ${userSettings.avatarColor2})`;
    } else {
        avatar.style.background = userSettings.avatarColor;
    }
    
    document.getElementById('adminSection').style.display = currentUser.role === 'root' ? 'block' : 'none';
}

// ====================================================================
// НАСТРОЙКИ UI
// ====================================================================
window.setTheme = function(theme) {
    userSettings.theme = theme;
    saveUserSettings();
    applySettings();
    document.querySelectorAll('.theme-option').forEach(t => t.classList.toggle('active', t.dataset.theme === theme));
    showToast('success', 'Тема изменена', theme);
};

window.openSettings = function() {
    loadSettingsToUI();
    document.getElementById('settingsModal').classList.add('active');
};

window.closeSettings = function() {
    document.getElementById('settingsModal').classList.remove('active');
};

window.closeModalOnBg = function(event, modalId) {
    if (event.target.id === modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
};

window.switchSettingsTab = function(tab, el) {
    document.querySelectorAll('.settings-tab').forEach(t => { t.style.display = 'none'; t.classList.remove('active'); });
    document.querySelectorAll('#settingsModal .tab').forEach(t => t.classList.remove('active'));
    const target = document.getElementById('settings-' + tab);
    if (target) { target.style.display = 'block'; target.classList.add('active'); }
    if (el) el.classList.add('active');
};

function loadSettingsToUI() {
    document.querySelectorAll('.theme-option').forEach(t => t.classList.toggle('active', t.dataset.theme === userSettings.theme));
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('active', s.dataset.accent === userSettings.accent));
    document.getElementById('displayName').value = currentUser.displayName || '';
    document.getElementById('avatarColor').value = userSettings.avatarColor;
    document.getElementById('avatarColor2').value = userSettings.avatarColor2;
    document.querySelectorAll('#settings-appearance .toggle').forEach(t => {
        t.classList.toggle('on', !!userSettings[t.dataset.key]);
    });
}

window.toggleSetting = function(el) {
    const key = el.dataset.key;
    userSettings[key] = !userSettings[key];
    saveUserSettings();
    el.classList.toggle('on');
    applySettings();
};

document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        userSettings.accent = this.dataset.accent;
        userSettings.customColor = null;
        saveUserSettings();
        applySettings();
    });
});

window.applyCustomColor = function() {
    const color = document.getElementById('customColor').value;
    userSettings.customColor = color;
    saveUserSettings();
    applySettings();
    showToast('success', 'Цвет применён', color);
};

window.changeAvatarColor = function(color) {
    userSettings.avatarColor = color;
    saveUserSettings();
    applySettings();
    showToast('success', 'Цвет аватара изменён', '');
};

window.changeAvatarGradient = function() {
    userSettings.avatarColor2 = document.getElementById('avatarColor2').value;
    saveUserSettings();
    applySettings();
};

window.uploadAvatar = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        userSettings.avatarImage = e.target.result;
        saveUserSettings();
        applySettings();
        showToast('success', 'Аватар загружен', '');
    };
    reader.readAsDataURL(file);
};

window.saveDisplayName = function() {
    const newName = document.getElementById('displayName').value.trim();
    if (!newName) return showToast('danger', 'Ошибка', 'Введите имя');
    
    currentUser.displayName = newName;
    userSettings.displayName = newName;
    saveUserSettings();
    applySettings();
    showToast('success', 'Имя сохранено', newName);
};

window.changePassword = async function() {
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    
    if (newPass !== confirm) {
        showToast('danger', 'Ошибка', 'Пароли не совпадают');
        return;
    }
    
    if (newPass.length < 6) {
        showToast('danger', 'Ошибка', 'Минимум 6 символов');
        return;
    }
    
    try {
        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, current);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPass);
        
        document.getElementById('currentPass').value = '';
        document.getElementById('newPass').value = '';
        document.getElementById('confirmPass').value = '';
        
        showToast('success', 'Пароль изменён', '');
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

window.deleteAccount = async function() {
    if (!confirm('⚠️ Удалить ваш аккаунт?')) return;
    if (!confirm('Это действие НЕОБРАТИМО!')) return;
    
    try {
        await auth.currentUser.delete();
        showToast('success', 'Аккаунт удалён', 'До свидания!');
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

window.resetUserSettings = function() {
    if (!confirm('Сбросить все настройки?')) return;
    
    userSettings = {
        theme: 'dark',
        accent: 'indigo',
        customColor: null,
        displayName: currentUser.displayName,
        avatarColor: '#6366f1',
        avatarColor2: '#8b5cf6',
        useGradient: true,
        animations: true,
        highContrast: false,
        bigButtons: false,
        largeText: false,
        nightMode: false
    };
    
    saveUserSettings();
    applySettings();
    showToast('success', 'Настройки сброшены', '');
};

// ====================================================================
// НАВИГАЦИЯ
// ====================================================================
window.navigateTo = function(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const item = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (item) item.classList.add('active');
    
    const titles = {
        home: 'Главная', tips: 'Советы', complaints: 'Жалобы', map: 'Карта', support: 'Поддержка',
        profile: 'Профиль', favorites: 'Избранное', history: 'История', settings: 'Мои настройки',
        dashboard: 'Дашборд', users: 'Пользователи', tickets: 'Тикеты', ips: 'IP-баны',
        bans: 'Баны', mutes: 'Муты', kicks: 'Кикнутые', tasks: 'Задачи', cats: 'Категории',
        logs: 'Логи', system: 'Системные', data: 'Данные'
    };
    
    document.getElementById('breadcrumb').innerHTML = '<strong>' + (titles[page] || page) + '</strong>';
    renderPage();
    document.getElementById('sidebar').classList.remove('open');
};

function renderPage() {
    const c = document.getElementById('content');
    
    switch(currentPage) {
        case 'home': renderHome(c); break;
        case 'tips': renderTips(c); break;
        case 'complaints': renderComplaints(c); break;
        case 'map': renderMap(c); break;
        case 'support': renderSupport(c); break;
        case 'profile': renderProfile(c); break;
        case 'favorites': renderFavorites(c); break;
        case 'history': renderHistory(c); break;
        case 'settings': openSettings(); renderHome(c); break;
        case 'dashboard': renderDashboard(c); break;
        case 'users': renderUsers(c); break;
        case 'tickets': renderTickets(c); break;
        case 'ips': renderIPs(c); break;
        case 'bans': renderBans(c); break;
        case 'mutes': renderMutes(c); break;
        case 'kicks': renderKicks(c); break;
        case 'tasks': renderTasks(c); break;
        case 'cats': renderCategories(c); break;
        case 'logs': renderLogs(c); break;
        case 'system': renderSystem(c); break;
        case 'data': renderData(c); break;
    }
}

// ====================================================================
// СТРАНИЦЫ
// ====================================================================
function renderHome(c) {
    c.innerHTML = `
        <div class="page-title">👋 Добро пожаловать, ${escapeHtml(currentUser.displayName)}!</div>
        <div class="page-subtitle">Система правовой самообороны</div>
        
        <div class="bento-grid">
            <div class="stat-card"><div class="stat-label">Советов</div><div class="stat-value">${tips.length}</div></div>
            <div class="stat-card"><div class="stat-label">Категорий</div><div class="stat-value">${categories.length}</div></div>
            <div class="stat-card"><div class="stat-label">Тикетов</div><div class="stat-value">${tickets.length}</div></div>
            <div class="stat-card"><div class="stat-label">Пользователей</div><div class="stat-value">${users.length}</div></div>
        </div>
        
        <div class="card">
            <div style="font-size:1.1em;font-weight:600;margin-bottom:16px;">🎯 Популярные разделы</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
                <div class="card" style="cursor:pointer;margin:0;" onclick="navigateTo('tips')">
                    <div style="font-size:2em;margin-bottom:8px;">📚</div>
                    <div style="font-weight:600;">Советы</div>
                    <div style="color:var(--text-muted);font-size:0.85em;">База знаний</div>
                </div>
                <div class="card" style="cursor:pointer;margin:0;" onclick="navigateTo('support')">
                    <div style="font-size:2em;margin-bottom:8px;">🆘</div>
                    <div style="font-weight:600;">Поддержка</div>
                    <div style="color:var(--text-muted);font-size:0.85em;">Тикеты</div>
                </div>
            </div>
        </div>
    `;
}

function renderTips(c) {
    c.innerHTML = `
        <div class="page-title">📚 Советы</div>
        <div class="page-subtitle">База знаний</div>
        
        ${currentUser.role === 'root' ? `
        <div class="card">
            <div style="font-weight:600;margin-bottom:12px;">➕ Добавить совет</div>
            <div class="form-group"><label class="form-label">Название</label><input type="text" class="form-input" id="newTipTitle" placeholder="Например: Требование документов"></div>
            <div class="form-group"><label class="form-label">Суть</label><textarea class="form-textarea" id="newTipEssence" placeholder="Описание ситуации"></textarea></div>
            <button class="btn btn-primary" onclick="addTip()">💾 Добавить совет</button>
        </div>
        ` : ''}
        
        <div id="tipsList"></div>
    `;
    
    loadTips();
}

async function loadTips() {
    const snapshot = await db.collection('tips').orderBy('createdAt', 'desc').get();
    tips = [];
    snapshot.forEach(doc => tips.push({ id: doc.id, ...doc.data() }));
    
    const list = document.getElementById('tipsList');
    if (tips.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><div>Советов пока нет</div></div>';
    } else {
        list.innerHTML = tips.map(t => `
            <div class="card">
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <div>
                        <div style="font-weight:600;font-size:1.1em;">${escapeHtml(t.title)}</div>
                        <div style="color:var(--text-muted);font-size:0.85em;">Автор: ${escapeHtml(t.author || '—')}</div>
                    </div>
                    ${currentUser.role === 'root' ? `<button class="btn btn-sm btn-danger" onclick="deleteTip('${t.id}')">🗑</button>` : ''}
                </div>
                <div>${escapeHtml(t.essence)}</div>
            </div>
        `).join('');
    }
}

window.addTip = async function() {
    const title = document.getElementById('newTipTitle').value.trim();
    const essence = document.getElementById('newTipEssence').value.trim();
    
    if (!title || !essence) {
        showToast('danger', 'Ошибка', 'Заполните все поля');
        return;
    }
    
    try {
        await db.collection('tips').add({
            title,
            essence,
            author: currentUser.displayName,
            authorId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('newTipTitle').value = '';
        document.getElementById('newTipEssence').value = '';
        
        showToast('success', 'Совет добавлен', title);
        loadTips();
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

window.deleteTip = async function(id) {
    if (!confirm('Удалить совет?')) return;
    
    try {
        await db.collection('tips').doc(id).delete();
        showToast('success', 'Совет удалён', '');
        loadTips();
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
};

function renderComplaints(c) {
    c.innerHTML = '<div class="page-title">📜 Жалобы</div><div class="page-subtitle">Шаблоны жалоб</div><div class="empty-state"><div class="empty-state-icon">📜</div><div>В разработке</div></div>';
}

function renderMap(c) {
    c.innerHTML = '<div class="page-title">🗺️ Карта</div><div class="page-subtitle">Инциденты</div><div class="empty-state"><div class="empty-state-icon">🗺️</div><div>В разработке</div></div>';
}

function renderSupport(c) {
    c.innerHTML = '<div class="page-title">🆘 Поддержка</div><div class="page-subtitle">Тикетная система</div><div class="empty-state"><div class="empty-state-icon">🆘</div><div>В разработке</div></div>';
}

function renderProfile(c) {
    c.innerHTML = `
        <div class="page-title">👤 Профиль</div>
        <div class="page-subtitle">Ваши данные</div>
        <div class="card">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
                <div style="width:80px;height:80px;border-radius:50%;background:${userSettings.useGradient ? `linear-gradient(135deg, ${userSettings.avatarColor}, ${userSettings.avatarColor2})` : userSettings.avatarColor};display:flex;align-items:center;justify-content:center;font-size:2em;font-weight:700;color:white;">${currentUser.displayName.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="font-size:1.5em;font-weight:700;">${escapeHtml(currentUser.displayName)}</div>
                    <div style="color:var(--text-muted);">Email: ${escapeHtml(currentUser.email)}</div>
                    <div style="color:var(--text-muted);font-family:'JetBrains Mono',monospace;">ID: ${currentUser.uid}</div>
                    <div style="color:var(--text-muted);">Роль: ${currentUser.role}</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="openSettings()">⚙️ Настройки</button>
            </div>
        </div>
    `;
}

function renderFavorites(c) {
    c.innerHTML = '<div class="page-title">⭐ Избранное</div><div class="page-subtitle">Сохранённые советы</div><div class="empty-state"><div class="empty-state-icon">⭐</div><div>Пока нет избранных советов</div></div>';
}

function renderHistory(c) {
    c.innerHTML = '<div class="page-title">📜 История</div><div class="page-subtitle">Ваши действия</div><div class="empty-state"><div class="empty-state-icon">📜</div><div>История пуста</div></div>';
}

function renderDashboard(c) { c.innerHTML = '<div class="page-title">📊 Дашборд</div><div class="page-subtitle">В разработке</div>'; }
function renderUsers(c) { c.innerHTML = '<div class="page-title">👥 Пользователи</div><div class="page-subtitle">В разработке</div>'; }
function renderTickets(c) { c.innerHTML = '<div class="page-title">🎫 Тикеты</div><div class="page-subtitle">В разработке</div>'; }
function renderIPs(c) { c.innerHTML = '<div class="page-title">🌐 IP-баны</div><div class="page-subtitle">В разработке</div>'; }
function renderBans(c) { c.innerHTML = '<div class="page-title">🚫 Баны</div><div class="page-subtitle">В разработке</div>'; }
function renderMutes(c) { c.innerHTML = '<div class="page-title">🔇 Муты</div><div class="page-subtitle">В разработке</div>'; }
function renderKicks(c) { c.innerHTML = '<div class="page-title">👢 Кикнутые</div><div class="page-subtitle">В разработке</div>'; }
function renderTasks(c) { c.innerHTML = '<div class="page-title">📋 Задачи</div><div class="page-subtitle">В разработке</div>'; }
function renderCategories(c) { c.innerHTML = '<div class="page-title">📂 Категории</div><div class="page-subtitle">В разработке</div>'; }
function renderLogs(c) { c.innerHTML = '<div class="page-title">📋 Логи</div><div class="page-subtitle">В разработке</div>'; }
function renderData(c) { c.innerHTML = '<div class="page-title">💾 Данные</div><div class="page-subtitle">В разработке</div>'; }

function renderSystem(c) {
    if (currentUser.role !== 'root') {
        c.innerHTML = '<div class="page-title">🔧 Системные настройки</div><div class="page-subtitle">Доступ запрещён</div><div class="empty-state"><div class="empty-state-icon">🔒</div><div>Только ROOT может управлять системными настройками</div></div>';
        return;
    }
    
    c.innerHTML = `
        <div class="page-title">🔧 Системные настройки</div>
        <div class="page-subtitle">Только для ROOT</div>
        
        <div class="card">
            <div class="settings-group-title">🚦 Режимы работы</div>
            <div class="toggle-row">
                <div class="toggle-row-info">
                    <div class="toggle-row-title">🔧 Режим обслуживания</div>
                    <div style="font-size:0.75em;color:var(--text-muted);">Закрыть сайт для всех кроме ROOT</div>
                </div>
                <div class="toggle ${systemSettings.maintenanceMode ? 'on' : ''}" data-key="maintenanceMode" onclick="toggleSysSetting(this)"></div>
            </div>
            <div class="toggle-row">
                <div class="toggle-row-info">
                    <div class="toggle-row-title">🔒 Обязательная регистрация</div>
                    <div style="font-size:0.75em;color:var(--text-muted);">Требовать вход для всех</div>
                </div>
                <div class="toggle ${systemSettings.registrationRequired ? 'on' : ''}" data-key="registrationRequired" onclick="toggleSysSetting(this)"></div>
            </div>
        </div>
        
        <div class="card">
            <div class="settings-group-title">📢 Глобальный баннер</div>
            <div class="toggle-row">
                <div class="toggle-row-info">
                    <div class="toggle-row-title">🎯 Показать баннер</div>
                    <div style="font-size:0.75em;color:var(--text-muted);">Показывать всем пользователям</div>
                </div>
                <div class="toggle ${systemSettings.globalBannerEnabled ? 'on' : ''}" data-key="globalBannerEnabled" onclick="toggleSysSetting(this)"></div>
            </div>
            <div class="form-group" style="margin-top:12px;">
                <label class="form-label">Иконка</label>
                <input type="text" class="form-input" id="bannerIcon" value="${systemSettings.globalBannerIcon}" onchange="updateSysSetting('globalBannerIcon', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Текст баннера</label>
                <input type="text" class="form-input" id="bannerText" value="${systemSettings.globalBannerText}" onchange="updateSysSetting('globalBannerText', this.value)" placeholder="Введите текст...">
            </div>
            <div class="form-group">
                <label class="form-label">Тип</label>
                <select class="form-select" onchange="updateSysSetting('globalBannerType', this.value)">
                    <option value="info" ${systemSettings.globalBannerType === 'info' ? 'selected' : ''}>ℹ️ Инфо</option>
                    <option value="warning" ${systemSettings.globalBannerType === 'warning' ? 'selected' : ''}>⚠️ Предупреждение</option>
                    <option value="danger" ${systemSettings.globalBannerType === 'danger' ? 'selected' : ''}>🚨 Важное</option>
                    <option value="success" ${systemSettings.globalBannerType === 'success' ? 'selected' : ''}>✅ Успех</option>
                </select>
            </div>
        </div>
        
        <div class="card">
            <div class="settings-group-title">🎛 Разрешения пользователей</div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">👤 Удаление аккаунтов</div></div><div class="toggle ${systemSettings.allowDeleteAccount ? 'on' : ''}" data-key="allowDeleteAccount" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">🔑 Смена паролей</div></div><div class="toggle ${systemSettings.allowChangePassword ? 'on' : ''}" data-key="allowChangePassword" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">🏷 Смена имени</div></div><div class="toggle ${systemSettings.allowChangeName ? 'on' : ''}" data-key="allowChangeName" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">📚 Создание советов</div></div><div class="toggle ${systemSettings.allowCreateTips ? 'on' : ''}" data-key="allowCreateTips" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">📋 Создание задач</div></div><div class="toggle ${systemSettings.allowCreateTasks ? 'on' : ''}" data-key="allowCreateTasks" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">🎫 Создание тикетов</div></div><div class="toggle ${systemSettings.allowCreateTickets ? 'on' : ''}" data-key="allowCreateTickets" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">📝 Регистрация пользователей</div></div><div class="toggle ${systemSettings.allowUserRegistration ? 'on' : ''}" data-key="allowUserRegistration" onclick="toggleSysSetting(this)"></div></div>
        </div>
        
        <div class="card">
            <div class="settings-group-title">🌐 Функции сайта</div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">💬 Чаты</div></div><div class="toggle ${systemSettings.enableChat ? 'on' : ''}" data-key="enableChat" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">🗺️ Карта</div></div><div class="toggle ${systemSettings.enableMap ? 'on' : ''}" data-key="enableMap" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">📜 Жалобы</div></div><div class="toggle ${systemSettings.enableComplaints ? 'on' : ''}" data-key="enableComplaints" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">⭐ Избранное</div></div><div class="toggle ${systemSettings.enableFavorites ? 'on' : ''}" data-key="enableFavorites" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">📚 Советы</div></div><div class="toggle ${systemSettings.enableTips ? 'on' : ''}" data-key="enableTips" onclick="toggleSysSetting(this)"></div></div>
            <div class="toggle-row"><div class="toggle-row-info"><div class="toggle-row-title">🆘 Поддержка</div></div><div class="toggle ${systemSettings.enableSupport ? 'on' : ''}" data-key="enableSupport" onclick="toggleSysSetting(this)"></div></div>
        </div>
        
        <div class="card">
            <div class="settings-group-title">💬 Приветствие</div>
            <div class="toggle-row">
                <div class="toggle-row-info">
                    <div class="toggle-row-title">👋 Показывать приветствие</div>
                </div>
                <div class="toggle ${systemSettings.showWelcomeMessage ? 'on' : ''}" data-key="showWelcomeMessage" onclick="toggleSysSetting(this)"></div>
            </div>
            <div class="form-group" style="margin-top:12px;">
                <label class="form-label">Текст приветствия</label>
                <input type="text" class="form-input" value="${systemSettings.welcomeMessage}" onchange="updateSysSetting('welcomeMessage', this.value)">
            </div>
        </div>
    `;
}

// ====================================================================
// ИНИЦИАЛИЗАЦИЯ
// ====================================================================
function initApp() {
    applySettings();
    navigateTo('home');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            if (page === 'settings') {
                openSettings();
            } else {
                navigateTo(page);
            }
        });
    });
    
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// Загружаем данные при старте
db.collection('tips').onSnapshot(snapshot => {
    tips = [];
    snapshot.forEach(doc => tips.push({ id: doc.id, ...doc.data() }));
    if (currentPage === 'tips' || currentPage === 'home') renderPage();
});

db.collection('categories').onSnapshot(snapshot => {
    categories = [];
    snapshot.forEach(doc => categories.push({ id: doc.id, ...doc.data() }));
});

db.collection('tickets').onSnapshot(snapshot => {
    tickets = [];
    snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));
});

db.collection('users').onSnapshot(snapshot => {
    users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
});