// ProfilePage.js - Profil utilisateur et déconnexion

import { auth } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';
import { showToast } from '../components/Toast.js';
import { showDialog } from '../components/Dialog.js';

export default async function ProfilePage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="max-width:560px; margin:0 auto;">
      <div class="skeleton" style="height:120px; margin-bottom:20px; border-radius:50px;"></div>
      <div class="skeleton" style="height:180px; margin-bottom:16px; border-radius:20px;"></div>
      <div class="skeleton" style="height:100px; border-radius:20px;"></div>
    </div>
  `;
  container.appendChild(page);

  let user;
  try {
    user = await auth.me();
  } catch {
    return navigate('/', true);
  }

  const u = user.user;
  const joinedDate = new Date(u.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <div style="max-width:560px; margin:0 auto;">
      <!-- Bannière avec avatar -->
      <div style="text-align:center; margin-bottom:24px; animation:slideUp 0.3s ease;">
        <div style="width:100px; height:100px; margin:0 auto 16px; border-radius:50%; background:linear-gradient(135deg, var(--primary), #0ea5e9); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px -5px rgba(56,189,248,0.4);">
          <span style="font-size:44px; font-weight:800; color:#0f172a;">${u.first_name.charAt(0).toUpperCase()}</span>
        </div>
        <h1 style="margin:0; font-size:1.8rem;">${escapeHtml(u.first_name)}</h1>
        <p style="color:var(--text-muted); margin-top:4px;">@${escapeHtml(u.username)}</p>
      </div>

      <!-- Carte informations -->
      <div class="card" style="margin-bottom:16px; animation:slideUp 0.4s ease 0.05s backwards;">
        <h3 style="margin-bottom:16px;">📋 Informations</h3>
        <div style="margin-bottom:14px;">
          <div style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.5px;">Email</div>
          <div style="font-size:1rem; word-break:break-all;">${escapeHtml(u.email)}</div>
        </div>
        <div>
          <div style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.5px;">Membre depuis</div>
          <div style="font-size:1rem;">${joinedDate}</div>
        </div>
      </div>

      <!-- Carte actions -->
      <div class="card" style="animation:slideUp 0.4s ease 0.1s backwards;">
        <h3 style="margin-bottom:16px;">⚙️ Actions</h3>
        <button class="btn btn-danger" id="btn-logout" style="display:flex; align-items:center; justify-content:center; gap:8px;">
          🔓 Se déconnecter
        </button>
      </div>
    </div>
  `;

  page.innerHTML = html;

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  page.querySelector('#btn-logout').onclick = () => {
    showDialog({
      title: 'Se déconnecter',
      message: 'Es-tu sûr de vouloir te déconnecter ?',
      confirmText: 'Déconnexion',
      cancelText: 'Annuler',
      danger: true,
      onConfirm: async () => {
        try { await auth.logout(); } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        showToast('À bientôt ! 👋', 'info');
        navigate('/', true);
      },
    });
  };

  container.appendChild(BottomNav());
}
// import { auth } from '../api.js';
// import { navigate } from '../router.js';
// import BottomNav from '../components/BottomNav.js';
// import { showToast } from '../components/Toast.js';
// import { showDialog } from '../components/Dialog.js';

// export default async function ProfilePage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `<div id="content" style="display:flex;align-items:center;justify-content:center;min-height:50vh;"><div class="skeleton" style="width:60px;height:60px;border-radius:50%;"></div></div>`;
//   container.appendChild(page);

//   let user;
//   try { user = await auth.me(); } catch { return navigate('/', true); }

//   const u = user.user;

//   const html = `
//     <div style="text-align:center;padding:24px 0 16px;animation:slideUp 0.3s ease;">
//       <div style="width:90px;height:90px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,var(--primary),#0ea5e9);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:#0f172a;box-shadow:0 8px25px -5px rgba(56,189,248,0.4);animation:scaleIn 0.5s ease;">
//         ${u.first_name.charAt(0).toUpperCase()}
//       </div>
//       <h1 style="margin:0;font-size:24px;">${u.first_name}</h1>
//       <p style="color:var(--text-muted);font-size:14px;margin-top:4px;">@${u.username}</p>
//     </div>

//     <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
//       <h3 style="margin-bottom:14px;">Informations</h3>
//       <div style="margin-bottom:14px;">
//         <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Email</div>
//         <div style="font-size:15px;font-weight:500;word-break:break-all;">${u.email}</div>
//       </div>
//       <div>
//         <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Membre depuis</div>
//         <div style="font-size:15px;font-weight:500;">${new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
//       </div>
//     </div>

//     <div class="card" style="animation:slideUp 0.4s ease 0.1s backwards;">
//       <h3 style="margin-bottom:14px;">Actions</h3>
//       <button class="btn btn-danger" id="btn-logout" style="display:flex;align-items:center;justify-content:center;gap:10px;font-size:15px;padding:14px;">
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
//         Se déconnecter
//       </button>
//     </div>
//   `;

//   page.querySelector('#content').innerHTML = html;

//   page.querySelector('#btn-logout').onclick = () => {
//     showDialog({
//       title: 'Se déconnecter',
//       message: 'Es-tu sûr de vouloir te déconnecter ?',
//       confirmText: 'Déconnexion',
//       cancelText: 'Annuler',
//       danger: true,
//       onConfirm: async () => {
//         try { await auth.logout(); } catch {}
//         localStorage.removeItem('token');
//         localStorage.removeItem('refresh_token');
//         showToast('À bientôt !', 'info');
//         navigate('/', true);
//       },
//     });
//   };

//   container.appendChild(BottomNav());
// }
