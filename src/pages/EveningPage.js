// EveningPage.js - Bilan de fin de journée, design épuré et mobile-first

import { days } from '../api.js';
import { navigate } from '..//router.js';
import { showToast } from '../components/Toast.js';

export default function EveningPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  const dayId = location.pathname.split('/')[2];

  page.innerHTML = `
    <div class="evening-container" style="max-width:560px; margin:0 auto;">
      <!-- En-tête avec retour -->
      <div class="flex-row" style="align-items:center; gap:12px; margin-bottom:24px; animation:slideUp 0.3s ease;">
        <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px; display:inline-flex; align-items:center; gap:6px;">
          ← Retour
        </button>
        <h1 style="margin:0; font-size:1.5rem; display:flex; align-items:center; gap:8px;">
          🌙 Evening
        </h1>
      </div>

      <!-- Carte principale -->
      <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards; padding:20px;">
        <p style="color:var(--text-muted); margin-bottom:20px; font-size:0.9rem; text-align:center;">
          Prends 5 minutes pour réfléchir à ta journée. L'honnêteté est la clé du progrès.
        </p>

        <!-- Réalisations -->
        <div class="input-group" style="margin-bottom:20px;">
          <label>🏅 Réalisations</label>
          <textarea id="accomplishments" rows="2" placeholder="Ex: J'ai terminé mon projet, fait du sport, lu 20 pages..."></textarea>
          <span class="char-counter" data-for="accomplishments" style="font-size:0.7rem; color:var(--text-muted); display:block; text-align:right;"></span>
        </div>

        <!-- Évitements -->
        <div class="input-group" style="margin-bottom:20px;">
          <label>🚫 Distractions évitées</label>
          <textarea id="avoidances" rows="2" placeholder="Ex: Pas de réseaux sociaux avant midi, pas de sucre..."></textarea>
          <span class="char-counter" data-for="avoidances"></span>
        </div>

        <!-- Raison des échecs -->
        <div class="input-group" style="margin-bottom:20px;">
          <label>🤔 Raisons des difficultés</label>
          <textarea id="failure_reason" rows="2" placeholder="Pourquoi certaines actions n'ont pas abouti ?"></textarea>
          <span class="char-counter" data-for="failure_reason"></span>
        </div>

        <!-- Leçons apprises -->
        <div class="input-group" style="margin-bottom:20px;">
          <label>📚 Leçons apprises</label>
          <textarea id="lessons" rows="2" placeholder="Qu'as-tu appris aujourd'hui ?"></textarea>
          <span class="char-counter" data-for="lessons"></span>
        </div>

        <!-- Règle pour demain -->
        <div class="input-group" style="margin-bottom:24px;">
          <label>📌 Règle pour demain</label>
          <input type="text" id="rule_for_tomorrow" placeholder="Ex: Se lever sans snooze, méditer 5 min" />
          <span class="char-counter" data-for="rule_for_tomorrow"></span>
        </div>

        <button class="btn btn-primary" id="btn-save" style="font-size:1rem; padding:14px;">
          💾 Enregistrer le bilan
        </button>
      </div>
    </div>
  `;

  container.appendChild(page);

  // Gestion des compteurs de caractères (optionnel, pour UX)
  const textareas = page.querySelectorAll('textarea, input');
  textareas.forEach(input => {
    const counterSpan = page.querySelector(`.char-counter[data-for="${input.id}"]`);
    if (counterSpan) {
      const updateCounter = () => {
        const len = input.value.length;
        counterSpan.textContent = len > 0 ? `${len} caractères` : '';
      };
      input.addEventListener('input', updateCounter);
      updateCounter();
    }
  });

  // Bouton retour
  page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

  // Sauvegarde
  const saveBtn = page.querySelector('#btn-save');
  saveBtn.onclick = async () => {
    const fields = {
      accomplishments: page.querySelector('#accomplishments').value.trim(),
      avoidances: page.querySelector('#avoidances').value.trim(),
      failure_reason: page.querySelector('#failure_reason').value.trim(),
      lessons: page.querySelector('#lessons').value.trim(),
      rule_for_tomorrow: page.querySelector('#rule_for_tomorrow').value.trim(),
    };

    const hasContent = Object.values(fields).some(v => v.length > 0);
    if (!hasContent) {
      showToast('Remplis au moins un champ pour progresser', 'warning');
      return;
    }

    // Vérification des champs remplis (minimum 5 caractères pour éviter les contenus vides)
    const invalid = Object.entries(fields).filter(([k, v]) => v.length > 0 && v.length < 5);
    if (invalid.length > 0) {
      showToast('Chaque champ rempli doit faire au moins 5 caractères', 'warning');
      return;
    }

    saveBtn.disabled = true;
    const originalHtml = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Enregistrement...';

    try {
      await days.evening(dayId, fields);
      showToast('Bilan enregistré avec succès ! 🌟', 'success');
      navigate(`/day/${dayId}`);
    } catch (e) {
      const msg = e.status === 400 ? 'Données invalides. Vérifie les champs.' : 'Erreur réseau. Réessaie.';
      showToast(msg, 'error');
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHtml;
    }
  };
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default function EveningPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   const dayId = location.pathname.split('/')[2];

//   page.innerHTML = `
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:20px;">Evening 🌙</h1>
//     </div>
//     <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
//       <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">Réfléchis à ta journée. L'honnêteté est la clé du progrès.</p>
//       <label>Réalisations</label>
//       <textarea id="accomplishments" placeholder="Qu'as-tu accompli aujourd'hui ?"></textarea>
//       <label>Ce que tu as évité</label>
//       <textarea id="avoidances" placeholder="Quelles distractions as-tu évitées ?"></textarea>
//       <label>Raison de l'échec (si applicable)</label>
//       <textarea id="failure_reason" placeholder="Pourquoi certaines choses n'ont pas marché ?"></textarea>
//       <label>Leçons apprises</label>
//       <textarea id="lessons" placeholder="Qu'as-tu appris aujourd'hui ?"></textarea>
//       <label>Règle pour demain</label>
//       <input type="text" id="rule_for_tomorrow" placeholder="Une règle à suivre demain..." />
//       <button class="btn btn-primary" id="btn-save">Enregistrer</button>
//     </div>
//   `;
//   container.appendChild(page);

//   page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

//   page.querySelector('#btn-save').onclick = async () => {
//     const fields = {
//       accomplishments: page.querySelector('#accomplishments').value.trim(),
//       avoidances: page.querySelector('#avoidances').value.trim(),
//       failure_reason: page.querySelector('#failure_reason').value.trim(),
//       lessons: page.querySelector('#lessons').value.trim(),
//       rule_for_tomorrow: page.querySelector('#rule_for_tomorrow').value.trim(),
//     };

//     const hasContent = Object.values(fields).some(v => v.length > 0);
//     if (!hasContent) {
//       showToast('Remplis au moins un champ', 'warning');
//       return;
//     }

//     const invalid = Object.entries(fields).filter(([k, v]) => v.length > 0 && v.length < 10);
//     if (invalid.length > 0) {
//       showToast('Les champs remplis doivent faire au moins 10 caractères', 'warning');
//       return;
//     }

//     const btn = page.querySelector('#btn-save');
//     btn.disabled = true;
//     btn.textContent = 'Enregistrement...';

//     try {
//       await days.evening(dayId, fields);
//       showToast('Bilan enregistré !', 'success');
//       navigate(`/day/${dayId}`);
//     } catch (e) {
//       const msg = e.status === 400 ? 'Vérifiez vos saisies' : 'Erreur lors de l\'enregistrement';
//       showToast(msg, 'error');
//       btn.disabled = false;
//       btn.textContent = 'Enregistrer';
//     }
//   };
// }
