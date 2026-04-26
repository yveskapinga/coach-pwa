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
      <div class="empty-state">
        <div style="font-size:48px;margin-bottom:12px;">🔒</div>
        <p>Lien invalide ou expiré</p>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="navigate('/forgot-password')">Demander un nouveau lien</button>
      </div>
    `;
    container.appendChild(page);
    return;
  }

  page.innerHTML = `
    <div style="text-align:center; padding: 48px 0 32px;">
      <div style="width:80px;height:80px;margin:0 auto 16px;border-radius:20px;background:linear-gradient(135deg,var(--primary),#0ea5e9);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px -5px rgba(56,189,248,0.4);animation:scaleIn 0.5s ease;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h1 style="font-size:24px;margin-bottom:6px;">Nouveau mot de passe</h1>
      <p style="color:var(--text-muted);font-size:14px;">Choisis un nouveau mot de passe sécurisé</p>
    </div>
    <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
      <label>Nouveau mot de passe</label>
      <input type="password" id="password" placeholder="6 caractères minimum" />
      <label>Confirmer le mot de passe</label>
      <input type="password" id="confirm" placeholder="••••••" />
      <button class="btn btn-primary" id="btn-save" style="margin-top:8px;">Enregistrer</button>
      <button class="btn btn-outline" id="btn-back" style="margin-top:10px;">Retour à la connexion</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-save').onclick = async () => {
    const password = page.querySelector('#password').value;
    const confirm = page.querySelector('#confirm').value;

    if (!password || password.length < 6) {
      showToast('Le mot de passe doit faire au moins 6 caractères', 'warning');
      return;
    }
    if (password !== confirm) {
      showToast('Les mots de passe ne correspondent pas', 'warning');
      return;
    }

    const btn = page.querySelector('#btn-save');
    btn.disabled = true;
    btn.textContent = 'Enregistrement...';

    try {
      await auth.resetPassword({ token, new_password: password });
      showToast('Mot de passe mis à jour !', 'success');
      navigate('/', true);
    } catch {
      showToast('Lien invalide ou expiré', 'error');
      btn.disabled = false;
      btn.textContent = 'Enregistrer';
    }
  };

  page.querySelector('#btn-back').onclick = () => navigate('/', true);
}
