// GratitudePage.js - 3 choses pour lesquelles être reconnaissant

import { days } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default function GratitudePage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  const dayId = location.pathname.split('/')[2];

  page.innerHTML = `
    <div class="gratitude-container" style="max-width:560px; margin:0 auto;">
      <!-- En-tête -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; animation:slideUp 0.3s ease;">
        <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px;">← Retour</button>
        <h1 style="margin:0; font-size:1.5rem; display:flex; align-items:center; gap:8px;">🙏 Gratitude</h1>
      </div>

      <!-- Carte principale -->
      <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards; padding:20px;">
        <p style="color:var(--text-muted); text-align:center; margin-bottom:24px;">
          Prends un moment. Quelles sont les 3 choses pour lesquelles tu es reconnaissant aujourd'hui ?
        </p>

        <div class="input-group" style="margin-bottom:16px;">
          <label>🌟 1ère raison</label>
          <input type="text" id="g1" placeholder="Ex: Ma santé" maxlength="120" autocomplete="off" />
          <span class="char-counter" data-for="g1" style="font-size:0.7rem; color:var(--text-muted); display:block; text-align:right;"></span>
        </div>

        <div class="input-group" style="margin-bottom:16px;">
          <label>🌟 2ème raison</label>
          <input type="text" id="g2" placeholder="Ex: Ma famille" maxlength="120" autocomplete="off" />
          <span class="char-counter" data-for="g2"></span>
        </div>

        <div class="input-group" style="margin-bottom:24px;">
          <label>🌟 3ème raison</label>
          <input type="text" id="g3" placeholder="Ex: Le soleil" maxlength="120" autocomplete="off" />
          <span class="char-counter" data-for="g3"></span>
        </div>

        <button class="btn btn-primary" id="btn-save" style="font-size:1rem; padding:14px;">
          💾 Enregistrer ma gratitude
        </button>
      </div>
    </div>
  `;

  container.appendChild(page);

  // Compteurs de caractères
  const inputs = ['g1', 'g2', 'g3'];
  inputs.forEach(id => {
    const input = page.querySelector(`#${id}`);
    const counter = page.querySelector(`.char-counter[data-for="${id}"]`);
    if (input && counter) {
      const update = () => {
        const len = input.value.length;
        counter.textContent = len > 0 ? `${len}/120` : '';
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
    const items = [
      page.querySelector('#g1').value.trim(),
      page.querySelector('#g2').value.trim(),
      page.querySelector('#g3').value.trim(),
    ];

    // Vérifier qu'au moins 2 caractères par champ rempli
    if (items.some(item => item.length > 0 && item.length < 2)) {
      showToast('Chaque gratitude doit faire au moins 2 caractères', 'warning');
      return;
    }

    // Optionnel : exiger les 3 champs remplis ? L'API semble accepter des vides, mais pour l'esprit de l'exercice, on peut demander 3.
    if (items.some(item => item.length === 0)) {
      showToast('Les 3 gratitudes sont requises pour un état d\'esprit positif ✨', 'warning');
      return;
    }

    saveBtn.disabled = true;
    const originalHtml = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Enregistrement...';

    try {
      await days.gratitude(dayId, { items });
      showToast('Merci pour ta gratitude ! 🙏', 'success');
      navigate(`/day/${dayId}`);
    } catch (err) {
      showToast('Erreur lors de l\'enregistrement', 'error');
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHtml;
    }
  };
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function GratitudePage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   const dayId = location.pathname.split('/')[2];

//   page.innerHTML = `
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:20px;">Gratitude 🙏</h1>
//     </div>
//     <div class="card" style="text-align:center;animation:slideUp 0.4s ease 0.05s backwards;">
//       <p style="color:var(--text-muted);font-size:14px;margin-bottom:20px;">Quelles sont les 3 choses pour lesquelles tu es reconnaissant aujourd'hui ?</p>
//       <input type="text" class="gratitude-input" id="g1" placeholder="1. Ma santé" />
//       <input type="text" class="gratitude-input" id="g2" placeholder="2. Ma famille" />
//       <input type="text" class="gratitude-input" id="g3" placeholder="3. Le soleil" />
//       <button class="btn btn-primary" id="btn-save">Enregistrer</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

//   page.querySelector('#btn-save').onclick = async () => {
//     const items = [
//       page.querySelector('#g1').value.trim(),
//       page.querySelector('#g2').value.trim(),
//       page.querySelector('#g3').value.trim(),
//     ];

//     if (items.some(i => i.length < 2)) {
//       showToast('Chaque item doit faire au moins 2 caractères', 'warning');
//       return;
//     }

//     const btn = page.querySelector('#btn-save');
//     btn.disabled = true;
//     btn.textContent = 'Enregistrement...';

//     try {
//       await days.gratitude(dayId, { items });
//       showToast('Gratitude enregistrée !', 'success');
//       navigate(`/day/${dayId}`);
//     } catch {
//       showToast('Erreur lors de l\'enregistrement', 'error');
//       btn.disabled = false;
//       btn.textContent = 'Enregistrer';
//     }
//   };
// }
