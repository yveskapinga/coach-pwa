import { auth } from '../api.js';
import { navigate } from '../router.js';

export default function RegisterPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="text-align:center; padding: 30px 0;"><h1>Coach Life</h1></div>
    <div class="card">
      <label>Pseudo</label>
      <input type="text" id="username" placeholder="john" />
      <label>Email</label>
      <input type="email" id="email" placeholder="john@mail.com" />
      <label>Prénom</label>
      <input type="text" id="first_name" placeholder="John" />
      <label>Mot de passe</label>
      <input type="password" id="password" placeholder="6 caractères min" />
      <button class="btn btn-primary" id="btn-register">S'inscrire</button>
      <button class="btn btn-outline" id="btn-back" style="margin-top:8px;">Déjà un compte ?</button>
    </div>
  `;
  container.appendChild(page);

  page.querySelector('#btn-register').onclick = async () => {
    const body = {
      username: page.querySelector('#username').value.trim(),
      email: page.querySelector('#email').value.trim(),
      first_name: page.querySelector('#first_name').value.trim(),
      password: page.querySelector('#password').value,
    };
    try {
      await auth.register(body);
      alert('Compte créé ! Connectez-vous.');
      navigate('/');
    } catch (e) {
      alert(e.message || 'Erreur inscription');
    }
  };
  page.querySelector('#btn-back').onclick = () => navigate('/');
}
