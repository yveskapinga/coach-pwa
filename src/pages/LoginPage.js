// LoginPage.js - Optimisée, responsive, PWA-ready

import { auth } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default function LoginPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div class="auth-container" style="max-width:480px; margin:0 auto;">
      <div class="auth-header" style="text-align:center; margin-bottom:32px;">
        <div class="logo-wrapper" style="width:96px; height:96px; margin:0 auto 20px; border-radius:28px; background:linear-gradient(135deg, var(--primary), #0ea5e9); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px -8px rgba(56,189,248,0.4); animation:scaleIn 0.5s ease;">
          <img src="/logo.png" alt="Coach Life" style="width:70px; height:70px; object-fit:contain; border-radius:16px;" />
        </div>
        <h1 style="font-size:2rem; margin-bottom:0.25rem; letter-spacing:-0.5px;">Coach Life</h1>
        <p style="color:var(--text-muted); font-size:0.9rem;">Discipline. Focus. Résultats.</p>
      </div>

      <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
        <div class="input-group" style="margin-bottom:16px;">
          <label for="username">Identifiant</label>
          <input type="text" id="username" placeholder="ex: coach_alpha" autocomplete="username" aria-required="true" />
        </div>

        <div class="input-group" style="margin-bottom:24px;">
          <label for="password">Mot de passe</label>
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="password" id="password" placeholder="••••••" autocomplete="current-password" style="flex:1;" />
            <button type="button" class="toggle-pwd" aria-label="Afficher le mot de passe" style="background:transparent; border:none; font-size:1.4rem; cursor:pointer; padding:12px; border-radius:12px; transition:0.2s;">👁️</button>
          </div>
        </div>

        <button class="btn btn-primary" id="btn-login" style="font-size:1rem; padding:14px;">Se connecter</button>
        
        <div style="text-align:center; margin-top:16px;">
          <a href="#" id="link-forgot" style="color:var(--text-muted); font-size:0.8rem; text-decoration:none;">Mot de passe oublié ?</a>
        </div>
      </div>

      <div class="auth-footer" style="text-align:center; margin-top:24px; animation:fadeIn 0.6s ease 0.2s backwards;">
        <p style="color:var(--text-muted); margin-bottom:12px;">Pas encore de compte ?</p>
        <button class="btn btn-outline" id="btn-register" style="max-width:280px; margin:0 auto;">Créer un compte gratuitement</button>
      </div>
    </div>
  `;

  container.appendChild(page);

  // Gestion du toggle du mot de passe
  const toggleBtn = page.querySelector('.toggle-pwd');
  const pwdInput = page.querySelector('#password');
  toggleBtn.addEventListener('click', () => {
    const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
    pwdInput.setAttribute('type', type);
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // Connexion
  const loginBtn = page.querySelector('#btn-login');
  loginBtn.onclick = async () => {
    const username = page.querySelector('#username').value.trim();
    const password = page.querySelector('#password').value;

    if (!username || !password) {
      showToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    loginBtn.disabled = true;
    const originalText = loginBtn.textContent;
    loginBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Connexion...';
    loginBtn.style.opacity = '0.8';

    try {
      const data = await auth.login({ username, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      showToast('Bienvenue !', 'success');
      navigate('/dashboard', true);
    } catch (e) {
      const msg = e.status === 401 ? 'Identifiants incorrects' : 'Erreur réseau. Réessayez.';
      showToast(msg, 'error');
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = originalText;
      loginBtn.style.opacity = '1';
    }
  };

  page.querySelector('#link-forgot').onclick = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  page.querySelector('#btn-register').onclick = () => navigate('/register');
}
// import { auth } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function LoginPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `
//     <div style="text-align:center; padding: 48px 0 32px;">
//       <div style="width:100px;height:100px;margin:0 auto 20px;border-radius:24px;background:linear-gradient(135deg,var(--primary),#0ea5e9);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 35px -8px rgba(56,189,248,0.45);animation:scaleIn 0.6s ease;">
//         <img src="/logo.png" alt="Coach Life" style="width:70px;height:70px;object-fit:contain;border-radius:14px;" />
//       </div>
//       <h1 style="font-size:32px;margin-bottom:8px;">Coach Life</h1>
//       <p style="color:var(--text-muted);font-size:15px;">Discipline. Focus. Résultats.</p>
//     </div>
//     <div class="card" style="animation:slideUp 0.5s ease 0.1s backwards;">
//       <label>Identifiant</label>
//       <input type="text" id="username" placeholder="votre pseudo" autocomplete="username" />
//       <label>Mot de passe</label>
//       <input type="password" id="password" placeholder="••••••" autocomplete="current-password" />
//       <button class="btn btn-primary" id="btn-login" style="margin-top:8px;font-size:16px;padding:16px;">Se connecter</button>
//       <div style="text-align:center;margin-top:14px;">
//         <a href="#" id="link-forgot" style="color:var(--text-muted);font-size:13px;text-decoration:none;">Mot de passe oublié ?</a>
//       </div>
//     </div>
//     <div style="text-align:center;margin-top:20px;animation:fadeIn 0.6s ease 0.2s backwards;">
//       <p style="color:var(--text-muted);font-size:14px;margin-bottom:10px;">Pas encore de compte ?</p>
//       <button class="btn btn-outline" id="btn-register" style="max-width:280px;margin:0 auto;">Créer un compte gratuitement</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-login').onclick = async () => {
//     const username = page.querySelector('#username').value.trim();
//     const password = page.querySelector('#password').value;
//     if (!username || !password) {
//       showToast('Veuillez remplir tous les champs', 'warning');
//       return;
//     }
//     const btn = page.querySelector('#btn-login');
//     btn.disabled = true;
//     btn.textContent = 'Connexion...';
//     try {
//       const data = await auth.login({ username, password });
//       localStorage.setItem('token', data.access_token);
//       localStorage.setItem('refresh_token', data.refresh_token);
//       showToast('Bienvenue !', 'success');
//       navigate('/dashboard', true);
//     } catch (e) {
//       const msg = e.status === 401 ? 'Identifiants incorrects' : 'Erreur de connexion. Réessayez.';
//       showToast(msg, 'error');
//     } finally {
//       btn.disabled = false;
//       btn.textContent = 'Se connecter';
//     }
//   };

//   page.querySelector('#link-forgot').onclick = (e) => {
//     e.preventDefault();
//     navigate('/forgot-password');
//   };

//   page.querySelector('#btn-register').onclick = () => navigate('/register');
// }
