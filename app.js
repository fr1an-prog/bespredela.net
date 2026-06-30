// ====================================================================
// FIREBASE
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
// КОНСТАНТЫ
// ====================================================================
const ROOT_UID = 'xSdPRiSvsbdPI9eTOUh4egITh5Y2';
const ROOT_EMAIL = 'kowtunov.k@yandex.ru';

const RESERVED_NAMES = ['root','admin','administrator','moderator','mod','owner','создатель','админ','администратор','модератор','мод','владелец','superadmin','главный','boss','chief','director','support','помощь','помощник','helper','system','система'];

// ====================================================================
// 130+ ПРАВ ДОСТУПА
// ====================================================================
const PERMISSIONS_LIST = [
    {key:'canViewUsers',label:'👥 Просмотр пользователей',cat:'users'},
    {key:'canCreateUsers',label:'➕ Создание пользователей',cat:'users'},
    {key:'canEditUsers',label:'✏️ Редактирование пользователей',cat:'users'},
    {key:'canDeleteUsers',label:'🗑 Удаление пользователей',cat:'users'},
    {key:'canBanUsers',label:'🚫 Бан пользователей',cat:'users'},
    {key:'canMuteUsers',label:'🔇 Мут пользователей',cat:'users'},
    {key:'canKickUsers',label:'👢 Кик пользователей',cat:'users'},
    {key:'canChangeRoles',label:'🎭 Изменение ролей',cat:'users'},
    {key:'canChangeEmail',label:'📧 Смена email',cat:'users'},
    {key:'canChangePassword',label:'🔑 Смена пароля',cat:'users'},
    {key:'canChangeUsername',label:'🏷 Смена username',cat:'users'},
    {key:'canChangeDisplayName',label:'👤 Смена никнейма',cat:'users'},
    {key:'canChangeId',label:'🆔 Смена ID',cat:'users'},
    {key:'canViewUserDetails',label:'🔍 Просмотр деталей',cat:'users'},
    {key:'canExportUsers',label:'📤 Экспорт пользователей',cat:'users'},
    {key:'canViewTips',label:'📚 Просмотр советов',cat:'tips'},
    {key:'canCreateTips',label:'➕ Создание советов',cat:'tips'},
    {key:'canEditTips',label:'✏️ Редактирование советов',cat:'tips'},
    {key:'canDeleteTips',label:'🗑 Удаление советов',cat:'tips'},
    {key:'canPublishTips',label:'📢 Публикация советов',cat:'tips'},
    {key:'canFeatureTips',label:'⭐ Избранные советы',cat:'tips'},
    {key:'canCategorizeTips',label:'📂 Категоризация советов',cat:'tips'},
    {key:'canRateTips',label:'⭐ Оценка советов',cat:'tips'},
    {key:'canCommentTips',label:'💬 Комментарии к советам',cat:'tips'},
    {key:'canShareTips',label:'🔗 Поделиться советом',cat:'tips'},
    {key:'canViewCategories',label:'📂 Просмотр категорий',cat:'categories'},
    {key:'canCreateCategories',label:'➕ Создание категорий',cat:'categories'},
    {key:'canEditCategories',label:'✏️ Редактирование категорий',cat:'categories'},
    {key:'canDeleteCategories',label:'🗑 Удаление категорий',cat:'categories'},
    {key:'canReorderCategories',label:'🔄 Изменение порядка',cat:'categories'},
    {key:'canViewComplaints',label:'📜 Просмотр жалоб',cat:'complaints'},
    {key:'canCreateComplaints',label:'➕ Создание жалоб',cat:'complaints'},
    {key:'canEditComplaints',label:'✏️ Редактирование жалоб',cat:'complaints'},
    {key:'canDeleteComplaints',label:'🗑 Удаление жалоб',cat:'complaints'},
    {key:'canProcessComplaints',label:'✅ Обработка жалоб',cat:'complaints'},
    {key:'canArchiveComplaints',label:'📦 Архивация жалоб',cat:'complaints'},
    {key:'canViewTickets',label:'🎫 Просмотр тикетов',cat:'tickets'},
    {key:'canCreateTickets',label:'➕ Создание тикетов',cat:'tickets'},
    {key:'canRespondTickets',label:'💬 Ответы на тикеты',cat:'tickets'},
    {key:'canCloseTickets',label:'🔒 Закрытие тикетов',cat:'tickets'},
    {key:'canDeleteTickets',label:'🗑 Удаление тикетов',cat:'tickets'},
    {key:'canAssignTickets',label:'📌 Назначение тикетов',cat:'tickets'},
    {key:'canPrioritizeTickets',label:'⚡ Приоритизация',cat:'tickets'},
    {key:'canTagTickets',label:'🏷 Теги тикетов',cat:'tickets'},
    {key:'canViewTicketHistory',label:'📜 История тикетов',cat:'tickets'},
    {key:'canExportTickets',label:'📤 Экспорт тикетов',cat:'tickets'},
    {key:'canViewChats',label:'💬 Просмотр чатов',cat:'chats'},
    {key:'canCreateChats',label:'➕ Создание чатов',cat:'chats'},
    {key:'canSendMessage',label:'📨 Отправка сообщений',cat:'chats'},
    {key:'canDeleteMessages',label:'🗑 Удаление сообщений',cat:'chats'},
    {key:'canEditMessages',label:'✏️ Редактирование сообщений',cat:'chats'},
    {key:'canManageChatRooms',label:'🏠 Управление комнатами',cat:'chats'},
    {key:'canViewAnonymousChats',label:'🕵️ Просмотр анонимных',cat:'chats'},
    {key:'canPinMessages',label:'📌 Закрепление сообщений',cat:'chats'},
    {key:'canReactToMessages',label:'👍 Реакции',cat:'chats'},
    {key:'canMentionUsers',label:'@ Упоминания',cat:'chats'},
    {key:'canViewMap',label:'🗺️ Просмотр карты',cat:'map'},
    {key:'canCreateIncidents',label:'📍 Создание инцидентов',cat:'map'},
    {key:'canEditIncidents',label:'✏️ Редактирование инцидентов',cat:'map'},
    {key:'canDeleteIncidents',label:'🗑 Удаление инцидентов',cat:'map'},
    {key:'canVerifyIncidents',label:'✅ Проверка инцидентов',cat:'map'},
    {key:'canCategorizeIncidents',label:'📂 Категоризация',cat:'map'},
    {key:'canViewMapHistory',label:'📜 История карты',cat:'map'},
    {key:'canExportMap',label:'📤 Экспорт карты',cat:'map'},
    {key:'canViewTasks',label:'📋 Просмотр задач',cat:'tasks'},
    {key:'canCreateTasks',label:'➕ Создание задач',cat:'tasks'},
    {key:'canEditTasks',label:'✏️ Редактирование задач',cat:'tasks'},
    {key:'canDeleteTasks',label:'🗑 Удаление задач',cat:'tasks'},
    {key:'canAssignTasks',label:'📌 Назначение задач',cat:'tasks'},
    {key:'canPrioritizeTasks',label:'⚡ Приоритизация задач',cat:'tasks'},
    {key:'canCompleteTasks',label:'✅ Завершение задач',cat:'tasks'},
    {key:'canViewTaskHistory',label:'📜 История задач',cat:'tasks'},
    {key:'canViewIPBans',label:'🌐 Просмотр IP-банов',cat:'security'},
    {key:'canCreateIPBans',label:'➕ Создание IP-банов',cat:'security'},
    {key:'canDeleteIPBans',label:'🗑 Удаление IP-банов',cat:'security'},
    {key:'canViewLogs',label:'📋 Просмотр логов',cat:'security'},
    {key:'canClearLogs',label:'🧹 Очистка логов',cat:'security'},
    {key:'canExportLogs',label:'📤 Экспорт логов',cat:'security'},
    {key:'canViewSecurityAlerts',label:'🚨 Алерты безопасности',cat:'security'},
    {key:'canManageFirewall',label:'🔥 Настройка firewall',cat:'security'},
    {key:'canViewLoginHistory',label:'🔐 История входов',cat:'security'},
    {key:'canManageSessions',label:'👥 Управление сессиями',cat:'security'},
    {key:'canViewSystemSettings',label:'🔧 Просмотр настроек',cat:'system'},
    {key:'canEditSystemSettings',label:'✏️ Редактирование настроек',cat:'system'},
    {key:'canManageMaintenance',label:'🔧 Режим обслуживания',cat:'system'},
    {key:'canManageBanners',label:'📢 Управление баннерами',cat:'system'},
    {key:'canManagePermissions',label:'🔐 Управление правами',cat:'system'},
    {key:'canManageRegistration',label:'📝 Управление регистрацией',cat:'system'},
    {key:'canManageThemes',label:'🎨 Управление темами',cat:'system'},
    {key:'canManageLanguages',label:'🌍 Управление языками',cat:'system'},
    {key:'canManageTimezones',label:'🕐 Управление часовыми поясами',cat:'system'},
    {key:'canManageCurrencies',label:'💱 Управление валютами',cat:'system'},
    {key:'canManageIntegrations',label:'🔗 Управление интеграциями',cat:'system'},
    {key:'canManageAPI',label:'🔌 Управление API',cat:'system'},
    {key:'canExportData',label:'💾 Экспорт данных',cat:'data'},
    {key:'canImportData',label:'📥 Импорт данных',cat:'data'},
    {key:'canResetData',label:'💣 Сброс данных',cat:'data'},
    {key:'canManageBackups',label:'📦 Управление бэкапами',cat:'data'},
    {key:'canViewDatabase',label:'🗄️ Просмотр базы данных',cat:'data'},
    {key:'canViewAnalytics',label:'📊 Просмотр аналитики',cat:'analytics'},
    {key:'canViewDashboard',label:'📈 Просмотр дашборда',cat:'analytics'},
    {key:'canViewStatistics',label:'📉 Просмотр статистики',cat:'analytics'},
    {key:'canExportReports',label:'📄 Экспорт отчётов',cat:'analytics'},
    {key:'canViewUserStats',label:'👤 Статистика пользователей',cat:'analytics'},
    {key:'canViewContentStats',label:'📚 Статистика контента',cat:'analytics'},
    {key:'canViewTrafficStats',label:'🌐 Статистика трафика',cat:'analytics'},
    {key:'canViewRevenueStats',label:'💰 Статистика доходов',cat:'analytics'},
    {key:'canViewFavorites',label:'⭐ Просмотр избранного',cat:'personal'},
    {key:'canViewHistory',label:'📜 Просмотр истории',cat:'personal'},
    {key:'canEditProfile',label:'👤 Редактирование профиля',cat:'personal'},
    {key:'canChangeAvatar',label:'🖼️ Смена аватара',cat:'personal'},
    {key:'canDeleteAccount',label:'🗑 Удаление аккаунта',cat:'personal'},
    {key:'canViewMedia',label:'🎥 Просмотр медиа',cat:'media'},
    {key:'canUploadMedia',label:'📤 Загрузка медиа',cat:'media'},
    {key:'canEditMedia',label:'✏️ Редактирование медиа',cat:'media'},
    {key:'canDeleteMedia',label:'🗑 Удаление медиа',cat:'media'},
    {key:'canManageGallery',label:'🖼️ Управление галереей',cat:'media'},
    {key:'canViewIntegrations',label:'🔗 Просмотр интеграций',cat:'integrations'},
    {key:'canManageTelegram',label:'📱 Telegram бот',cat:'integrations'},
    {key:'canManageEmail',label:'📧 Email интеграция',cat:'integrations'},
    {key:'canManageSMS',label:'💬 SMS интеграция',cat:'integrations'},
    {key:'canManageWebhooks',label:'🪝 Webhooks',cat:'integrations'},
    {key:'canViewFinance',label:'💰 Просмотр финансов',cat:'finance'},
    {key:'canManagePayments',label:'💳 Управление платежами',cat:'finance'},
    {key:'canManageSubscriptions',label:'📋 Управление подписками',cat:'finance'},
    {key:'canViewInvoices',label:'📄 Просмотр счетов',cat:'finance'},
    {key:'canManageRefunds',label:'↩️ Управление возвратами',cat:'finance'},
    {key:'canViewNotifications',label:'🔔 Просмотр уведомлений',cat:'notifications'},
    {key:'canSendNotifications',label:'📤 Отправка уведомлений',cat:'notifications'},
    {key:'canManagePush',label:'📱 Push уведомления',cat:'notifications'},
    {key:'canManageEmailNotif',label:'📧 Email уведомления',cat:'notifications'},
    {key:'canManageSMSNotif',label:'💬 SMS уведомления',cat:'notifications'}
];

const PERMISSION_CATEGORIES = {
    users:'👥 Пользователи',tips:'📚 Советы',categories:'📂 Категории',complaints:'📜 Жалобы',
    tickets:'🎫 Тикеты',chats:'💬 Чаты',map:'🗺️ Карта',tasks:'📋 Задачи',
    security:'🌐 Безопасность',system:'🔧 Системные',data:'💾 Данные',
    analytics:'📊 Аналитика',personal:'⭐ Личное',media:'🎥 Медиа',
    integrations:'🔗 Интеграции',finance:'💰 Финансы',notifications:'🔔 Уведомления'
};

// ====================================================================
// ДАННЫЕ
// ====================================================================
let currentUser = null;
let allUsers = [];
let tips = [];
let tickets = [];
let currentPage = 'home';
let anonymousChatId = null;

let userSettings = {
    theme:'dark',accent:'indigo',customColor:null,
    avatarColor:'#6366f1',avatarColor2:'#8b5cf6',useGradient:true,
    animations:true,highContrast:false,bigButtons:false,largeText:false,nightMode:false
};

let systemSettings = {
    maintenanceMode:false,registrationRequired:false,
    globalBannerEnabled:false,globalBannerText:'',globalBannerType:'info',globalBannerIcon:'📢',
    allowDeleteAccount:true,allowChangePassword:true,allowChangeName:true,
    allowCreateTips:true,allowCreateTasks:true,allowCreateTickets:true,
    allowUserRegistration:true,
    enableChat:true,enableMap:true,enableComplaints:true,enableFavorites:true,
    enableTips:true,enableSupport:true,
    showWelcomeMessage:true,welcomeMessage:'Добро пожаловать в Щит!'
};

function getDefaultPermissions() {
    const p = {};
    PERMISSIONS_LIST.forEach(perm => p[perm.key] = false);
    return p;
}

function getModeratorPermissions() {
    const p = getDefaultPermissions();
    ['canViewUsers','canViewTips','canCreateTips','canViewTickets','canRespondTickets','canViewChats','canSendMessage','canViewMap','canViewTasks','canCreateTasks','canViewIPBans','canViewLogs','canViewAnalytics','canViewDashboard','canViewFavorites','canViewHistory','canViewNotifications'].forEach(k => p[k] = true);
    return p;
}

function getAdminPermissions() {
    const p = getDefaultPermissions();
    PERMISSIONS_LIST.forEach(perm => {
        if (!perm.key.includes('System') && !perm.key.includes('Reset') && !perm.key.includes('Permissions')) {
            p[perm.key] = true;
        }
    });
    return p;
}

// ====================================================================
// АВТОРИЗАЦИЯ
// ====================================================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        
        currentUser = {
            uid: user.uid,
            uuid: userData.uuid || generateUUID(),
            id: userData.id !== undefined ? userData.id : await generateNewId(),
            username: userData.username || user.email.split('@')[0],
            displayName: userData.displayName || user.displayName || user.email.split('@')[0],
            email: user.email,
            role: user.uid === ROOT_UID ? 'root' : (userData.role || 'user'),
            permissions: userData.permissions || getDefaultPermissions(),
            banned: userData.banned || false,
            muted: userData.muted || false,
            kicked: userData.kicked || false
        };
        
        if (!userDoc.exists) await saveUserData();
        
        await loadUserSettings();
        await loadSystemSettings();
        
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('supportChatBtn').style.display = 'none';
        initApp();
        showToast('success','Добро пожаловать!',currentUser.displayName);
    } else {
        currentUser = null;
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('supportChatBtn').style.display = 'flex';
    }
});

function generateUUID() {
    return 'uuid_' + Date.now() + '_' + Math.random().toString(36).substr(2,16);
}

async function generateNewId() {
    const snapshot = await db.collection('users').get();
    let maxId = 0;
    snapshot.forEach(doc => {
        const id = doc.data().id;
        if (typeof id === 'number' && id > maxId) maxId = id;
    });
    return maxId + 1;
}

async function saveUserData() {
    try {
        await db.collection('users').doc(currentUser.uid).set({
            uid:currentUser.uid,uuid:currentUser.uuid,id:currentUser.id,
            username:currentUser.username,displayName:currentUser.displayName,
            email:currentUser.email,role:currentUser.role,
            permissions:currentUser.permissions,
            banned:currentUser.banned,muted:currentUser.muted,kicked:currentUser.kicked,
            settings:userSettings,
            updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
    } catch(e) { console.error(e); }
}

// ====================================================================
// ВХОД ПО ЛЮБОМУ ID
// ====================================================================
window.doLogin = async function() {
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!identifier || !password) {
        showToast('danger','Ошибка','Заполните все поля');
        return;
    }
    
    let email = null;
    
    try {
        if (identifier.includes('@')) {
            email = identifier;
        } else if (identifier === '0' || identifier.toLowerCase() === 'root') {
            const rootDoc = await db.collection('users').doc(ROOT_UID).get();
            email = rootDoc.exists ? rootDoc.data().email : ROOT_EMAIL;
        } else if (identifier.startsWith('uuid_') || identifier.length > 20) {
            const snapshot = await db.collection('users').where('uuid','==',identifier).get();
            if (!snapshot.empty) email = snapshot.docs[0].data().email;
            else {
                const byUid = await db.collection('users').doc(identifier).get();
                if (byUid.exists) email = byUid.data().email;
            }
        } else if (!isNaN(identifier)) {
            const snapshot = await db.collection('users').where('id','==',parseInt(identifier)).get();
            if (!snapshot.empty) email = snapshot.docs[0].data().email;
        } else {
            const snapshot = await db.collection('users').where('username','==',identifier.toLowerCase()).get();
            if (!snapshot.empty) email = snapshot.docs[0].data().email;
        }
        
        if (!email) {
            showToast('danger','Ошибка','Пользователь не найден');
            return;
        }
        
        await auth.signInWithEmailAndPassword(email,password);
    } catch(e) {
        showToast('danger','Ошибка входа',e.message);
    }
};

// ====================================================================
// РЕГИСТРАЦИЯ
// ====================================================================
window.doRegister = async function() {
    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const displayName = document.getElementById('regDisplayName').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (!email || !username || !displayName || !password || !confirm) {
        showToast('danger','Ошибка','Заполните все поля');
        return;
    }
    
    if (RESERVED_NAMES.includes(username)) {
        alert(`❌ Username "${username}" запрещён!\n\nВыберите другое имя.`);
        return;
    }
    
    if (RESERVED_NAMES.includes(displayName.toLowerCase())) {
        alert(`❌ Никнейм "${displayName}" запрещён!\n\nВыберите другое имя.`);
        return;
    }
    
    if (password !== confirm) {
        showToast('danger','Ошибка','Пароли не совпадают');
        return;
    }
    
    if (password.length < 6) {
        showToast('danger','Ошибка','Минимум 6 символов');
        return;
    }
    
    const usernameCheck = await db.collection('users').where('username','==',username).get();
    if (!usernameCheck.empty) {
        alert(`❌ Username "${username}" уже занят!`);
        return;
    }
    
    try {
        const cred = await auth.createUserWithEmailAndPassword(email,password);
        const newId = await generateNewId();
        const newUuid = generateUUID();
        
        await db.collection('users').doc(cred.user.uid).set({
            uid:cred.user.uid,uuid:newUuid,id:newId,
            username:username,displayName:displayName,email:email,
            role:'user',permissions:getDefaultPermissions(),
            banned:false,muted:false,kicked:false,
            settings:userSettings,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('success','Регистрация успешна!',`ID: ${newId}`);
    } catch(e) {
// ====================================================================
// НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
// ====================================================================
async function loadUserSettings() {
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists && doc.data().settings) {
            userSettings = { ...userSettings, ...doc.data().settings };
        }
    } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
    }
}

async function saveUserSettings() {
    try {
        await db.collection('users').doc(currentUser.uid).set({
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
        console.error('Ошибка сохранения:', e);
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
    const classes = ['accent-purple', 'accent-pink', 'accent-green', 'accent-blue', 'accent-orange', 'accent-red', 'accent-cyan', 'accent-yellow', 'theme-light', 'animations-enabled', 'animations-disabled', 'big-buttons', 'high-contrast', 'large-text', 'night-mode'];
    classes.forEach(c => document.body.classList.remove(c));
    
    if (userSettings.theme === 'light') document.body.classList.add('theme-light');
    else if (userSettings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches) document.body.classList.add('theme-light');
    
    if (userSettings.animations) document.body.classList.add('animations-enabled');
    else document.body.classList.add('animations-disabled');
    
    if (userSettings.customColor) {
        document.documentElement.style.setProperty('--primary', userSettings.customColor);
        document.documentElement.style.setProperty('--primary-hover', userSettings.customColor);
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
    document.getElementById('userRole').textContent = currentUser.role === 'root' ? 'Создатель' : currentUser.role;
    document.getElementById('userId').textContent = `ID: ${currentUser.id}`;
    document.getElementById('userUid').textContent = `UID: ${currentUser.uid.substring(0, 12)}...`;
    
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
    
    if (userSettings.useGradient) {
        avatar.style.background = `linear-gradient(135deg, ${userSettings.avatarColor}, ${userSettings.avatarColor2})`;
    } else {
        avatar.style.background = userSettings.avatarColor;
    }
    
    const isAdmin = currentUser.role === 'root' || currentUser.permissions.canViewUsers || currentUser.permissions.canManageUsers;
    document.getElementById('adminSection').style.display = isAdmin ? 'block' : 'none';
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
    userSettings.customColor = document.getElementById('customColor').value;
    saveUserSettings();
    applySettings();
    showToast('success', 'Цвет применён', userSettings.customColor);
};

window.changeAvatarColor = function(color) {
    userSettings.avatarColor = color;
    saveUserSettings();
    applySettings();
};

window.changeAvatarGradient = function() {
    userSettings.avatarColor2 = document.getElementById('avatarColor2').value;
    saveUserSettings();
    applySettings();
};

window.saveDisplayName = function() {
    const newName = document.getElementById('displayName').value.trim();
    if (!newName) return showToast('danger', 'Ошибка', 'Введите никнейм');
    
    if (RESERVED_NAMES.includes(newName.toLowerCase())) {
        alert(`❌ Никнейм "${newName}" запрещён!`);
        return;
    }
    
    currentUser.displayName = newName;
    saveUserData();
    applySettings();
    showToast('success', 'Никнейм сохранён', newName);
};

window.changePassword = async function() {
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    
    if (newPass !== confirm) return showToast('danger', 'Ошибка', 'Пароли не совпадают');
    if (newPass.length < 6) return showToast('danger', 'Ошибка', 'Минимум 6 символов');
    
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
    if (currentUser.uid === ROOT_UID) {
        alert('❌ Нельзя удалить ROOT аккаунт!');
        return;
    }
    if (!confirm('Удалить ваш аккаунт?')) return;
    if (!confirm('Это НЕОБРАТИМО!')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).delete();
        await auth.currentUser.delete();
        showToast('success', 'Аккаунт удалён', '');
    } catch (e) {
        showToast('danger', 'Ошибка', e.message);
    }
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
        profile: 'Профиль', favorites: 'Избранное', history: 'История',
        dashboard: 'Дашборд', users: 'Пользователи', tickets: 'Тикеты',
        ips: 'IP-баны', bans: 'Баны', mutes: 'Муты', kicks: 'Кикнутые',
        tasks: 'Задачи', cats: 'Категории', logs: 'Логи', system: 'Системные', data: 'Данные'
    };
    
    document.getElementById('breadcrumb').innerHTML = '<strong>' + (titles[page] || page) + '</strong>';
    renderPage();
    document.getElementById('sidebar').classList.remove('open');
};

function renderPage() {
    const c = document.getElementById('content');
    
    if (systemSettings.maintenanceMode && currentUser.role !== 'root') {
        c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔧</div><div style="font-size:1.5em;margin-bottom:12px;">Режим обслуживания</div><div>Сайт временно недоступен</div></div>';
        return;
    }
    
    switch (currentPage) {
        case 'home': renderHome(c); break;
        case 'tips': renderTips(c); break;
        case 'profile': renderProfile(c); break;
        case 'users': renderUsers(c); break;
        case 'system': renderSystem(c); break;
        case 'tickets': renderTickets(c); break;
        case 'bans': renderBans(c); break;
        case 'mutes': renderMutes(c); break;
        case 'kicks': renderKicks(c); break;
        case 'ips': renderIPs(c); break;
        case 'logs': renderLogs(c); break;
        case 'cats': renderCategories(c); break;
        case 'tasks': renderTasks(c); break;
        case 'dashboard': renderDashboard(c); break;
        default: c.innerHTML = `<div class="page-title">${currentPage}</div><div class="empty-state"><div class="empty-state-icon">🚧</div><div>В разработке</div></div>`;
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
            <div class="stat-card"><div class="stat-label">Пользователей</div><div class="stat-value">${allUsers.length}</div></div>
            <div class="stat-card"><div class="stat-label">Советов</div><div class="stat-value">${tips.length}</div></div>
            <div class="stat-card"><div class="stat-label">Тикетов</div><div class="stat-value">${tickets.length}</div></div>
            <div class="stat-card"><div class="stat-label">Ваш ID</div><div class="stat-value">${currentUser.id}</div></div>
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
                <div class="card" style="cursor:pointer;margin:0;" onclick="navigateTo('users')">
                    <div style="font-size:2em;margin-bottom:8px;">👥</div>
                    <div style="font-weight:600;">Пользователи</div>
                    <div style="color:var(--text-muted);font-size:0.85em;">Управление</div>
                </div>
                <div class="card" style="cursor:pointer;margin:0;" onclick="navigateTo('system')">
                    <div style="font-size:2em;margin-bottom:8px;">🔧</div>
                    <div style="font-weight:600;">Системные</div>
                    <div style="color:var(--text-muted);font-size:0.85em;">Настройки</div>
                </div>
            </div>
        </div>
    `;
}

function renderTips(c) {
    c.innerHTML = `
        <div class="page-title">📚 Советы</div>
        <div class="page-subtitle">База знаний</div>
        
        ${currentUser.role === 'root' || currentUser.permissions.canCreateTips ? `
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
                    ${currentUser.role === 'root' || currentUser.permissions.canDeleteTips ? `<button class="btn btn-sm btn-danger" onclick="deleteTip('${t.id}')">🗑</button>` : ''}
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
            title, essence,
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

function renderProfile(c) {
    const enabledPerms = PERMISSIONS_LIST.filter(p => currentUser.permissions && currentUser.permissions[p.key]).length;
    
    c.innerHTML = `
        <div class="page-title">👤 Профиль</div>
        <div class="page-subtitle">Ваши данные</div>
        <div class="card">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
                <div style="width:80px;height:80px;border-radius:50%;background:${userSettings.useGradient ? `linear-gradient(135deg, ${userSettings.avatarColor}, ${userSettings.avatarColor2})` : userSettings.avatarColor};display:flex;align-items:center;justify-content:center;font-size:2em;font-weight:700;color:white;">${currentUser.displayName.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="font-size:1.5em;font-weight:700;">${escapeHtml(currentUser.displayName)}</div>
                    <div style="color:var(--text-muted);">@${escapeHtml(currentUser.username)}</div>
                    <div style="color:var(--text-muted);">${escapeHtml(currentUser.email)}</div>
                    <div style="color:var(--text-muted);">Роль
        