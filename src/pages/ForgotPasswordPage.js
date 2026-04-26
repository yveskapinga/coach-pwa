// ResetPasswordPage.js - avec gestion du token, validation temps réel

import { auth } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default function ResetPasswordPage(container) {
  const page = document.createElement('div');
  page.className = 'page';

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  if (!token) {
    page.innerHTML = `
      <div class="empty-state" style="text-align:center; padding:2rem;">
        <div style="font-size:3rem; margin-bottom:1rem;">🔒</div>
        <p>Lien invalide ou expiré</p>
        <button class="btn btn-primary" id="back-to-forgot" style="margin-top:1rem;">Demander un nouveau lien</button>
      </div>
    `;
    container.appendChild(page);
    page.querySelector('#back-to-forgot').onclick = () => navigate('/forgot-password');
    return;
  }

  page.innerHTML = `
    <div class="auth-container" style="max-width:480px; margin:0 auto;">
      <div class="auth-header" style="text-align:center; margin-bottom:32px;">
        <div class="icon-circle" style="width:80px; height:80px; margin:0 auto 16px; border-radius:24px; background:linear-gradient(135deg, var(--primary), #0ea5e9); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px -5px rgba(56,189,248,0.4); animation:scaleIn 0.5s ease;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 style="font-size:1.8rem;">Nouveau mot de passe</h1>
        <p style="color:var(--text-muted);">Choisis un mot de passe sécurisé</p>
      </div>

      <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
        <div class="input-group">
          <label for="password">Nouveau mot de passe</label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="password" id="password" placeholder="6 caractères minimum" style="flex:1;" />
            <button type="button" class="toggle-pwd1" aria-label="Afficher" style="background:transparent; border:none; font-size:1.4rem; cursor:pointer;">👁️</button>
          </div>
        </div>
        <div class="input-group">
          <label for="confirm">Confirmer le mot de passe</label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="password" id="confirm" placeholder="retapez le mot de passe" style="flex:1;" />
            <button type="button" class="toggle-pwd2" aria-label="Afficher" style="background:transparent; border:none; font-size:1.4rem; cursor:pointer;">👁️</button>
          </div>
          <div class="match-feedback" style="font-size:0.75rem; margin-top:4px;"></div>
        </div>

        <button class="btn btn-primary" id="btn-save" style="margin-top:8px;">Enregistrer</button>
        <button class="btn btn-outline" id="btn-back" style="margin-top:12px;">Retour à la connexion</button>
      </div>
    </div>
  `;

  container.appendChild(page);

  const pwdInput = page.querySelector('#password');
  const confirmInput = page.querySelector('#confirm');
  const matchDiv = page.querySelector('.match-feedback');

  // Vérification en temps réel de la correspondance
  const checkMatch = () => {
    if (confirmInput.value === '') {
      matchDiv.textContent = '';
      return;
    }
    if (pwdInput.value === confirmInput.value) {
      matchDiv.textContent = '✅ Les mots de passe correspondent';
      matchDiv.style.color = 'var(--success)';
    } else {
      matchDiv.textContent = '❌ Les mots de passe ne correspondent pas';
      matchDiv.style.color = 'var(--danger)';
    }
  };
  pwdInput.addEventListener('input', checkMatch);
  confirmInput.addEventListener('input', checkMatch);

  // Toggles pour les deux champs
  const toggle1 = page.querySelector('.toggle-pwd1');
  const toggle2 = page.querySelector('.toggle-pwd2');
  toggle1.addEventListener('click', () => {
    const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
    pwdInput.setAttribute('type', type);
    toggle1.textContent = type === 'password' ? '👁️' : '🙈';
  });
  toggle2.addEventListener('click', () => {
    const type = confirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmInput.setAttribute('type', type);
    toggle2.textContent = type === 'password' ? '👁️' : '🙈';
  });

  const saveBtn = page.querySelector('#btn-save');
  saveBtn.onclick = async () => {
    const password = pwdInput.value;
    const confirm = confirmInput.value;

    if (!password || password.length < 6) {
      showToast('Le mot de passe doit faire au moins 6 caractères', 'warning');
      return;
    }
    if (password !== confirm) {
      showToast('Les mots de passe ne correspondent pas', 'warning');
      return;
    }

    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Enregistrement...';

    try {
      await auth.resetPassword({ token, new_password: password });
      showToast('Mot de passe mis à jour !', 'success');
      navigate('/', true);
    } catch {
      showToast('Lien invalide ou expiré', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  };

  page.querySelector('#btn-back').onclick = () => navigate('/', true);
}
// import { auth } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function ForgotPasswordPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `
//     <div style="text-align:center; padding: 48px 0 32px;">
//       <div style="width:80px;height:80px;margin:0 auto 16px;border-radius:20px;background:linear-gradient(135deg,var(--warning),#d97706);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px -5px rgba(245,158,11,0.4);animation:scaleIn 0.5s ease;">
//         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
//       </div>
//       <h1 style="font-size:26px;margin-bottom:6px;">Mot de passe oublié</h1>
//       <p style="color:var(--text-muted);font-size:14px;">Entre ton email pour réinitialiser ton mot de passe</p>
//     </div>
//     <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
//       <label>Email</label>
//       <input type="email" id="email" placeholder="alice@mail.com" autocomplete="email" />
//       <button class="btn btn-primary" id="btn-send" style="margin-top:8px;">Envoyer le lien</button>
//       <button class="btn btn-outline" id="btn-back" style="margin-top:10px;">Retour à la connexion</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-send').onclick = async () => {
//     const email = page.querySelector('#email').value.trim();
//     if (!email) {
//       showToast('Veuillez entrer votre email', 'warning');
//       return;
//     }
//     const btn = page.querySelector('#btn-send');
//     btn.disabled = true;
//     btn.textContent = 'Envoi...';
//     try {
//       const res = await auth.resetRequest({ email });
//       showToast(res.message || 'Si cet email existe, un lien a été envoyé.', 'success');
//       if (res.debug_token) {
//         console.log('Debug token:', res.debug_token);
//       }
//       setTimeout(() => navigate('/'), 2000);
//     } catch {
//       showToast('Erreur lors de l\'envoi. Réessayez.', 'error');
//       btn.disabled = false;
//       btn.textContent = 'Envoyer le lien';
//     }
//   };

//   page.querySelector('#btn-back').onclick = () => navigate('/', true);
// }
