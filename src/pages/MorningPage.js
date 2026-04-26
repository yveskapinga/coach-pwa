// MorningPage.js - Définition des actions et du focus du jour

import { days } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default function MorningPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  const dayId = location.pathname.split('/')[2];

  page.innerHTML = `
    <div class="morning-container" style="max-width:560px; margin:0 auto;">
      <!-- En-tête -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; animation:slideUp 0.3s ease;">
        <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px;">← Retour</button>
        <h1 style="margin:0; font-size:1.5rem; display:flex; align-items:center; gap:8px;">☀️ Morning</h1>
      </div>

      <!-- Carte principale -->
      <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards; padding:20px;">
        <p style="color:var(--text-muted); margin-bottom:20px; text-align:center;">
          Définis tes 3 actions prioritaires et ton focus du jour.
        </p>

        <div class="input-group" style="margin-bottom:16px;">
          <label>🎯 Action 1</label>
          <input type="text" id="a1" placeholder="Ex: Faire du sport" maxlength="100" autocomplete="off" />
          <span class="char-counter" data-for="a1" style="font-size:0.7rem; color:var(--text-muted); display:block; text-align:right;"></span>
        </div>

        <div class="input-group" style="margin-bottom:16px;">
          <label>🎯 Action 2</label>
          <input type="text" id="a2" placeholder="Ex: Coder 2 heures" maxlength="100" autocomplete="off" />
          <span class="char-counter" data-for="a2"></span>
        </div>

        <div class="input-group" style="margin-bottom:16px;">
          <label>🎯 Action 3</label>
          <input type="text" id="a3" placeholder="Ex: Lire 20 pages" maxlength="100" autocomplete="off" />
          <span class="char-counter" data-for="a3"></span>
        </div>

        <div class="input-group" style="margin-bottom:24px;">
          <label>🎯 Focus du jour</label>
          <input type="text" id="focus" placeholder="Ex: Discipline absolue" maxlength="120" autocomplete="off" />
          <span class="char-counter" data-for="focus"></span>
        </div>

        <button class="btn btn-primary" id="btn-save" style="font-size:1rem; padding:14px;">
          🚀 Lancer ma journée
        </button>
      </div>
    </div>
  `;

  container.appendChild(page);

  // Compteurs de caractères
  const fields = ['a1', 'a2', 'a3', 'focus'];
  fields.forEach(id => {
    const input = page.querySelector(`#${id}`);
    const counter = page.querySelector(`.char-counter[data-for="${id}"]`);
    if (input && counter) {
      const update = () => {
        const len = input.value.length;
        counter.textContent = len > 0 ? `${len}/100` : '';
        if (id === 'focus') counter.textContent = len > 0 ? `${len}/120` : '';
      };
      input.addEventListener('input', update);
      update();
    }
  });

  // Retour
  page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

  // Sauvegarde
  const saveBtn = page.querySelector('#btn-save');
  saveBtn.onclick = async () => {
    const actions = [
      page.querySelector('#a1').value.trim(),
      page.querySelector('#a2').value.trim(),
      page.querySelector('#a3').value.trim(),
    ].filter(Boolean);
    const focus = page.querySelector('#focus').value.trim();

    if (actions.length === 0) {
      showToast('Ajoute au moins une action pour avancer', 'warning');
      return;
    }
    if (!focus) {
      showToast('Indique ton focus du jour', 'warning');
      return;
    }

    // Vérifier la longueur minimale de chaque action remplie
    for (const action of actions) {
      if (action.length < 3) {
        showToast('Chaque action doit faire au moins 3 caractères', 'warning');
        return;
      }
    }
    if (focus.length < 3) {
      showToast('Le focus doit faire au moins 3 caractères', 'warning');
      return;
    }

    saveBtn.disabled = true;
    const originalHtml = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Enregistrement...';

    try {
      await days.morning(dayId, { actions, focus });
      showToast('Morning enregistré ! Bonne journée 💪', 'success');
      navigate(`/day/${dayId}`);
    } catch (err) {
      const msg = err.status === 400 ? 'Vérifie les champs (minimum 2 caractères)' : 'Erreur réseau. Réessaye.';
      showToast(msg, 'error');
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHtml;
    }
  };
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function MorningPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   const dayId = location.pathname.split('/')[2];

//   page.innerHTML = `
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:20px;">Morning ☀️</h1>
//     </div>
//     <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
//       <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">Définis tes 3 actions principales et ton focus du jour.</p>
//       <label>Action 1</label>
//       <input type="text" id="a1" placeholder="Ex: Faire du sport" />
//       <label>Action 2</label>
//       <input type="text" id="a2" placeholder="Ex: Coder 2 heures" />
//       <label>Action 3</label>
//       <input type="text" id="a3" placeholder="Ex: Lire 20 pages" />
//       <label>Focus du jour</label>
//       <input type="text" id="focus" placeholder="Ex: Discipline totale" />
//       <button class="btn btn-primary" id="btn-save">Enregistrer</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

//   page.querySelector('#btn-save').onclick = async () => {
//     const actions = [
//       page.querySelector('#a1').value.trim(),
//       page.querySelector('#a2').value.trim(),
//       page.querySelector('#a3').value.trim(),
//     ].filter(Boolean);
//     const focus = page.querySelector('#focus').value.trim();

//     if (actions.length === 0 || !focus) {
//       showToast('Au moins une action et un focus sont requis', 'warning');
//       return;
//     }

//     const btn = page.querySelector('#btn-save');
//     btn.disabled = true;
//     btn.textContent = 'Enregistrement...';

//     try {
//       await days.morning(dayId, { actions, focus });
//       showToast('Morning enregistré !', 'success');
//       navigate(`/day/${dayId}`);
//     } catch (e) {
//       const msg = e.status === 400 ? 'Vérifiez vos saisies (min. 2 caractères)' : 'Erreur lors de l\'enregistrement';
//       showToast(msg, 'error');
//       btn.disabled = false;
//       btn.textContent = 'Enregistrer';
//     }
//   };
// }
