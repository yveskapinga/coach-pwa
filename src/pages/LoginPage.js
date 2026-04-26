import { auth } from '../api.js';
import { navigate } from '../router.js';

export default function LoginPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="text-align:center; padding: 40px 0;">
      <div style="font-size:64px;">💪</div>
      <h1>Coach Life</h1>
      <p style="color:var(--text-muted);">Discipline. Focus. Résultats.</p>
    </div>
    <div class="card">
      <label>Identifiant</label>
      <input type="text" id="username" placeholder="votre pseudo" value="alice" />
      <label>Mot de passe</label>
      <input type="password" id="password" placeholder="••••••" value="password123" />
      <button class="btn btn-primary" id="btn-login">Se connecter</button>
      <button class="btn btn-outline" id="btn-register" style="margin-top:8px;">Créer un compte</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-login').onclick = async () => {
    const username = page.querySelector('#username').value.trim();
    const password = page.querySelector('#password').value;
    try {
      const data = await auth.login({ username, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      navigate('/dashboard', true);
    } catch (e) {
      alert(e.message || 'Erreur de connexion');
    }
  };

  page.querySelector('#btn-register').onclick = () => navigate('/register');
}
