// RegisterPage.js - Moderne, avec validation email & force du mot de passe

import { auth } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default function RegisterPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div class="auth-container" style="max-width:480px; margin:0 auto;">
      <div class="auth-header" style="text-align:center; margin-bottom:28px;">
        <div class="logo-wrapper" style="width:80px; height:80px; margin:0 auto 16px; border-radius:24px; background:linear-gradient(135deg, var(--success), #16a34a); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px -5px rgba(34,197,94,0.4); animation:scaleIn 0.5s ease;">
          <img src="/logo.png" alt="Coach Life" style="width:55px; height:55px; object-fit:contain; border-radius:12px;" />
        </div>
        <h1 style="font-size:1.8rem;">Créer un compte</h1>
        <p style="color:var(--text-muted);">Rejoins la communauté de la discipline</p>
      </div>

      <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
        <div class="input-group">
          <label for="username">Pseudo</label>
          <input type="text" id="username" placeholder="ton_pseudo" autocomplete="username" />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="toi@exemple.com" autocomplete="email" />
        </div>
        <div class="input-group">
          <label for="first_name">Prénom</label>
          <input type="text" id="first_name" placeholder="Jean" autocomplete="given-name" />
        </div>
        <div class="input-group">
          <label for="password">Mot de passe (min. 6 caractères)</label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="password" id="password" placeholder="••••••" style="flex:1;" />
            <button type="button" class="toggle-pwd" aria-label="Afficher le mot de passe" style="background:transparent; border:none; font-size:1.4rem; cursor:pointer; padding:12px; border-radius:12px;">👁️</button>
          </div>
          <div class="password-strength" style="font-size:0.7rem; margin-top:4px; color:var(--text-muted);"></div>
        </div>

        <button class="btn btn-primary" id="btn-register" style="margin-top:8px;">S'inscrire</button>
        <button class="btn btn-outline" id="btn-back" style="margin-top:12px;">Déjà un compte ? Se connecter</button>
      </div>
    </div>
  `;

  container.appendChild(page);

  const pwdInput = page.querySelector('#password');
  const strengthDiv = page.querySelector('.password-strength');

  // Indicateur de force du mot de passe
  pwdInput.addEventListener('input', () => {
    const val = pwdInput.value;
    if (val.length === 0) {
      strengthDiv.textContent = '';
      return;
    }
    if (val.length < 6) {
      strengthDiv.textContent = '⚠️ Trop court (6 min)';
      strengthDiv.style.color = 'var(--warning)';
    } else if (val.length < 8) {
      strengthDiv.textContent = '✅ Correct';
      strengthDiv.style.color = 'var(--success)';
    } else {
      strengthDiv.textContent = '🔒 Fort';
      strengthDiv.style.color = 'var(--success)';
    }
  });

  // Toggle mot de passe
  const toggleBtn = page.querySelector('.toggle-pwd');
  toggleBtn.addEventListener('click', () => {
    const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
    pwdInput.setAttribute('type', type);
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
  });

  const registerBtn = page.querySelector('#btn-register');
  registerBtn.onclick = async () => {
    const username = page.querySelector('#username').value.trim();
    const email = page.querySelector('#email').value.trim();
    const first_name = page.querySelector('#first_name').value.trim();
    const password = pwdInput.value;

    if (!username || !email || !first_name || !password) {
      showToast('Tous les champs sont requis', 'warning');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      showToast('Email invalide', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Le mot de passe doit faire au moins 6 caractères', 'warning');
      return;
    }

    registerBtn.disabled = true;
    const originalHtml = registerBtn.innerHTML;
    registerBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Inscription...';
    
    try {
      await auth.register({ username, email, first_name, password });
      showToast('Compte créé ! Connectez-vous.', 'success');
      navigate('/', true);
    } catch (e) {
      const msg = e.status === 409 ? 'Ce pseudo ou email existe déjà' : 'Erreur lors de l\'inscription. Réessayez.';
      showToast(msg, 'error');
    } finally {
      registerBtn.disabled = false;
      registerBtn.innerHTML = originalHtml;
    }
  };

  page.querySelector('#btn-back').onclick = () => navigate('/', true);
}
// import { auth } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function RegisterPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `
//     <div style="text-align:center; padding: 32px 0 24px;">
//       <div style="width:80px;height:80px;margin:0 auto 16px;border-radius:20px;background:linear-gradient(135deg,var(--success),#16a34a);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px -5px rgba(34,197,94,0.4);animation:scaleIn 0.5s ease;">
//         <img src="/logo.png" alt="Coach Life" style="width:55px;height:55px;object-fit:contain;border-radius:12px;" />
//       </div>
//       <h1 style="font-size:24px;">Créer un compte</h1>
//       <p style="color:var(--text-muted);font-size:14px;">Commencez votre voyage vers la discipline</p>
//     </div>
//     <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
//       <label>Pseudo</label>
//       <input type="text" id="username" placeholder="votre pseudo" autocomplete="username" />
//       <label>Email</label>
//       <input type="email" id="email" placeholder="vous@email.com" autocomplete="email" />
//       <label>Prénom</label>
//       <input type="text" id="first_name" placeholder="Jean" autocomplete="given-name" />
//       <label>Mot de passe</label>
//       <input type="password" id="password" placeholder="6 caractères minimum" autocomplete="new-password" />
//       <button class="btn btn-primary" id="btn-register" style="margin-top:4px;font-size:16px;padding:16px;">S'inscrire</button>
//       <button class="btn btn-outline" id="btn-back" style="margin-top:10px;">Déjà un compte ? Se connecter</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-register').onclick = async () => {
//     const username = page.querySelector('#username').value.trim();
//     const email = page.querySelector('#email').value.trim();
//     const first_name = page.querySelector('#first_name').value.trim();
//     const password = page.querySelector('#password').value;

//     if (!username || !email || !first_name || !password) {
//       showToast('Tous les champs sont requis', 'warning');
//       return;
//     }
//     if (password.length < 6) {
//       showToast('Le mot de passe doit faire au moins 6 caractères', 'warning');
//       return;
//     }

//     const btn = page.querySelector('#btn-register');
//     btn.disabled = true;
//     btn.textContent = 'Inscription...';

//     try {
//       await auth.register({ username, email, first_name, password });
//       showToast('Compte créé ! Connectez-vous.', 'success');
//       navigate('/', true);
//     } catch (e) {
//       const msg = e.status === 409 ? 'Ce pseudo ou email existe déjà' : 'Erreur lors de l\'inscription. Réessayez.';
//       showToast(msg, 'error');
//     } finally {
//       btn.disabled = false;
//       btn.textContent = "S'inscrire";
//     }
//   };

//   page.querySelector('#btn-back').onclick = () => navigate('/', true);
// }
