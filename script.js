// ====== СОСТОЯНИЕ ======
let currentUser = null; // текущий пользователь Firebase
let unsubscribePosts = null;

// ====== DOM ЭЛЕМЕНТЫ ======
const postsContainer = document.getElementById('postsContainer');
const emptyMessage = document.getElementById('emptyMessage');
const adminBtn = document.getElementById('adminBtn');
const fab = document.getElementById('fab');
const loginModal = document.getElementById('loginModal');
const postModal = document.getElementById('postModal');
const loginForm = document.getElementById('loginForm');
const postForm = document.getElementById('postForm');
const loginError = document.getElementById('loginError');

// ====== УТИЛИТЫ ======
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====== АУТЕНТИФИКАЦИЯ ======
auth.onAuthStateChanged(user => {
    currentUser = user;
    updateAdminUI();
    if (user) {
        // Подписываемся на посты
        subscribeToPosts();
    } else {
        // Отписываемся, если вышли
        if (unsubscribePosts) {
            unsubscribePosts();
            unsubscribePosts = null;
        }
        // Очищаем контейнер
        renderPosts([]);
    }
});

// ====== ЗАГРУЗКА ПОСТОВ ======
function subscribeToPosts() {
    if (unsubscribePosts) unsubscribePosts();
    unsubscribePosts = db.collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const posts = [];
            snapshot.forEach(doc => {
                posts.push({ id: doc.id, ...doc.data() });
            });
            renderPosts(posts);
        }, error => {
            console.error('Ошибка загрузки постов:', error);
            renderPosts([]);
        });
}

// ====== РЕНДЕР ======
function renderPosts(posts) {
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    emptyMessage.style.display = 'none';
    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            ${post.image ? `<img class="post-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy">` : ''}
            <div class="post-body">
                <h2 class="post-title">${escapeHtml(post.title)}</h2>
                <div class="post-date">
                    <i class="far fa-calendar-alt"></i> ${formatDate(post.createdAt)}
                </div>
                <div class="post-content">${escapeHtml(post.content)}</div>
                ${currentUser ? `
                <div class="post-actions">
                    <button class="btn-sm" onclick="handleDeletePost('${post.id}')">
                        <i class="fas fa-trash-alt"></i> Удалить
                    </button>
                </div>` : ''}
            </div>
        </article>
    `).join('');
}

function updateAdminUI() {
    if (currentUser) {
        adminBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
        fab.style.display = 'flex';
    } else {
        adminBtn.innerHTML = '<i class="fas fa-lock"></i> Админ';
        fab.style.display = 'none';
        closeModal(loginModal);
        closeModal(postModal);
    }
}

// ====== МОДАЛЬНЫЕ ОКНА ======
function openModal(modal) {
    modal.classList.add('active');
}
function closeModal(modal) {
    modal.classList.remove('active');
}

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        closeModal(document.getElementById(modalId));
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ====== ОБРАБОТЧИКИ ======
adminBtn.addEventListener('click', () => {
    if (currentUser) {
        auth.signOut();
    } else {
        loginError.textContent = '';
        openModal(loginModal);
    }
});

fab.addEventListener('click', () => {
    postForm.reset();
    openModal(postModal);
});

// Вход
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    // Фиксированный email администратора — замени на свой!
    const adminEmail = 'admin@mypublicblog.com'; // ← поменяй
    try {
        await auth.signInWithEmailAndPassword(adminEmail, password);
        loginError.textContent = '';
        closeModal(loginModal);
        document.getElementById('password').value = '';
    } catch (err) {
        console.error(err);
        loginError.textContent = 'Неверный пароль или ошибка входа';
    }
});

// Создание поста
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImage').value.trim();

    if (!title || !content) {
        alert('Заголовок и текст обязательны');
        return;
    }

    try {
        await db.collection('posts').add({
            title,
            content,
            image,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        closeModal(postModal);
    } catch (err) {
        console.error('Ошибка публикации:', err);
        alert('Не удалось опубликовать пост');
    }
});

// Удаление поста
window.handleDeletePost = async (id) => {
    if (!confirm('Удалить этот пост?')) return;
    try {
        await db.collection('posts').doc(id).delete();
    } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Не удалось удалить пост');
    }
};
