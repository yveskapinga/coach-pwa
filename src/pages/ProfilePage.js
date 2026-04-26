import { auth, push } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';

export default async function ProfilePage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div id="content">Chargement...</div>`;
  container.appendChild(page);

  let user;
  try { user = await auth.me(); } catch { return navigate('/'); }

  page.querySelector('#content').innerHTML = `
    <h1>👤 Profil</h1>
    <div class="card" style="text-align:center;">
      <div style="font-size:64px;">👤</div>
      <h2>${user.user.first_name}</h2>
      <p style="color:var(--text-muted);">@${user.user.username}</p>
      <p style="color:var(--text-muted); font-size:13px;">${user.user.email}</p>
    </div>
    <div class="card">
      <button class="btn btn-danger" id="btn-logout">Se déconnecter</button>
    </div>
    <div class="card">
      <h2>🔔 Notifications</h2>
      <p style="color:var(--text-muted); font-size:13px;">Activez les notifications pour recevoir des rappels.</p>
      <button class="btn btn-primary" id="btn-notif">Activer les notifications</button>
      <p id="notif-status" style="margin-top:8px; font-size:12px; color:var(--text-muted);"></p>
    </div>
  `;

  page.querySelector('#btn-logout').onclick = async () => {
    try { await auth.logout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/', true);
  };

  page.querySelector('#btn-notif').onclick = async () => {
    const status = page.querySelector('#notif-status');
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      status.textContent = 'Notifications non supportées';
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      status.textContent = 'Permission refusée';
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BGLD9WdavWjvKy9acHP1pHzryoP5R8aTGlQ1gEwG7P3XautFqAlSblsAJYGn69byH6fx7w5dCimLVadHdiCRKRk'),
      });
      await push.subscribe({
        endpoint: sub.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
          auth: arrayBufferToBase64(sub.getKey('auth')),
        },
      });
      status.textContent = 'Notifications push activées !';
      status.style.color = 'var(--success)';
      // Test notification
      await fetch('/api/push/test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (e) {
      status.textContent = 'Erreur: ' + (e.message || 'inconnue');
      console.error(e);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  container.appendChild(BottomNav());
}
