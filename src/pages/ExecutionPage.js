// ExecutionPage.js - Validation des actions de la journée, interactive et responsive

import { days } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default async function ExecutionPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  const dayId = location.pathname.split('/')[2];

  // État de chargement
  page.innerHTML = `
    <div class="execution-container" style="max-width:560px; margin:0 auto;">
      <div class="flex-row" style="align-items:center; gap:12px; margin-bottom:20px;">
        <div class="skeleton" style="width:80px; height:40px; border-radius:12px;"></div>
        <div class="skeleton" style="width:120px; height:32px; border-radius:12px;"></div>
      </div>
      <div class="skeleton" style="height:300px; border-radius:20px;"></div>
    </div>
  `;
  container.appendChild(page);

  let dayData;
  try {
    dayData = await days.get(dayId);
  } catch {
    showToast('Journée introuvable', 'error');
    return navigate('/dashboard');
  }

  const actions = dayData.entries.filter(e => e.type === 'ACTION');
  if (actions.length === 0) {
    showToast('Aucune action à exécuter pour cette journée', 'warning');
    return navigate(`/day/${dayId}`);
  }

  // Calcul du nombre d'actions complétées pour l'affichage
  let statusMap = {};
  actions.forEach(a => {
    statusMap[a.id] = a.status; // 'PENDING', 'DONE', 'NOT_DONE'
  });

  function computeStats() {
    const total = actions.length;
    const done = Object.values(statusMap).filter(s => s === 'DONE').length;
    const notDone = Object.values(statusMap).filter(s => s === 'NOT_DONE').length;
    return { total, done, notDone, remaining: total - done - notDone };
  }

  function render() {
    const stats = computeStats();
    const progressPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    let html = `
      <div class="execution-container" style="max-width:560px; margin:0 auto;">
        <!-- En-tête -->
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; animation:slideUp 0.3s ease;">
          <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px;">← Retour</button>
          <h1 style="margin:0; font-size:1.5rem;">⚡ Exécution</h1>
        </div>

        <!-- Carte progression -->
        <div class="card" style="margin-bottom:20px; animation:slideUp 0.4s ease 0.05s backwards;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>Progression</span>
            <span style="font-weight:700; color:var(--primary);">${progressPercent}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${progressPercent}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:12px; font-size:0.8rem;">
            <span>✅ ${stats.done} faites</span>
            <span>❌ ${stats.notDone} ratées</span>
            <span>⏳ ${stats.remaining} restantes</span>
          </div>
        </div>

        <!-- Liste des actions -->
        <div class="card" style="animation:slideUp 0.4s ease 0.1s backwards; padding:0; overflow:hidden;">
          <div style="padding:16px; border-bottom:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0; color:var(--text-muted);">Clique sur chaque action pour changer son statut</p>
          </div>
          <div id="actions-list" style="display:flex; flex-direction:column;">
    `;

    actions.forEach((a, idx) => {
      const currentStatus = statusMap[a.id];
      let statusClass = '';
      let statusIcon = '';
      if (currentStatus === 'DONE') {
        statusClass = 'done';
        statusIcon = '✓';
      } else if (currentStatus === 'NOT_DONE') {
        statusClass = 'not-done';
        statusIcon = '✕';
      } else {
        statusClass = '';
        statusIcon = '○';
      }

      html += `
        <div class="action-item" data-id="${a.id}" data-status="${currentStatus}" style="cursor:pointer; border-radius:0; margin:0; border-bottom:1px solid rgba(255,255,255,0.03); animation:slideUp 0.3s ease ${idx * 0.05}s backwards;">
          <span style="flex:1; font-size:1rem; word-break:break-word;">${escapeHtml(a.raw_text)}</span>
          <span class="action-check ${statusClass}" style="flex-shrink:0; margin-left:12px;">${statusIcon}</span>
        </div>
      `;
    });

    html += `
          </div>
          <div style="padding:16px;">
            <button class="btn btn-primary" id="btn-save">💾 Enregistrer ma progression</button>
          </div>
        </div>
      </div>
    `;

    page.querySelector('.execution-container')?.remove();
    const wrapper = document.createElement('div');
    wrapper.className = 'execution-container';
    wrapper.style.maxWidth = '560px';
    wrapper.style.margin = '0 auto';
    wrapper.innerHTML = html;
    page.innerHTML = '';
    page.appendChild(wrapper);

    // Événements
    page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

    // Toggle des actions
    page.querySelectorAll('.action-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        const current = statusMap[id];
        let next;
        if (current === 'PENDING') next = 'DONE';
        else if (current === 'DONE') next = 'NOT_DONE';
        else next = 'PENDING';
        statusMap[id] = next;

        // Mise à jour visuelle
        const checkSpan = el.querySelector('.action-check');
        if (next === 'DONE') {
          checkSpan.className = 'action-check done';
          checkSpan.textContent = '✓';
        } else if (next === 'NOT_DONE') {
          checkSpan.className = 'action-check not-done';
          checkSpan.textContent = '✕';
        } else {
          checkSpan.className = 'action-check';
          checkSpan.textContent = '○';
        }
        el.dataset.status = next;

        // Mettre à jour la barre de progression (re-rendu simple mais efficace)
        const newStats = computeStats();
        const newPercent = newStats.total > 0 ? Math.round((newStats.done / newStats.total) * 100) : 0;
        const progressFill = page.querySelector('.progress-bar-fill');
        if (progressFill) progressFill.style.width = `${newPercent}%`;
        const percentSpan = page.querySelector('.card .progress-bar + div span:last-child');
        if (percentSpan) percentSpan.textContent = `${newPercent}%`;
        const doneSpan = page.querySelector('.card .progress-bar ~ div span:first-child');
        if (doneSpan) doneSpan.innerHTML = `✅ ${newStats.done} faites`;
        const notDoneSpan = page.querySelector('.card .progress-bar ~ div span:nth-child(2)');
        if (notDoneSpan) notDoneSpan.innerHTML = `❌ ${newStats.notDone} ratées`;
        const remainingSpan = page.querySelector('.card .progress-bar ~ div span:last-child');
        if (remainingSpan) remainingSpan.innerHTML = `⏳ ${newStats.remaining} restantes`;
      });
    });

    // Sauvegarde
    const saveBtn = page.querySelector('#btn-save');
    saveBtn.onclick = async () => {
      const payload = Object.entries(statusMap).map(([id, status]) => ({ id, status }));
      saveBtn.disabled = true;
      const originalHtml = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:18px; height:18px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; vertical-align:middle; margin-right:8px;"></span> Enregistrement...';
      try {
        await days.execution(dayId, { actions: payload });
        showToast('Progression enregistrée ! 🎯', 'success');
        navigate(`/day/${dayId}`);
      } catch {
        showToast('Erreur lors de l\'enregistrement', 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalHtml;
      }
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  render();
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default async function ExecutionPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   const dayId = location.pathname.split('/')[2];

//   page.innerHTML = `<div id="content" style="display:flex;align-items:center;justify-content:center;min-height:50vh;"><div class="skeleton" style="width:60px;height:60px;border-radius:50%;"></div></div>`;
//   container.appendChild(page);

//   let dayData;
//   try {
//     dayData = await days.get(dayId);
//   } catch {
//     showToast('Journée introuvable', 'error');
//     return navigate('/dashboard');
//   }

//   const actions = dayData.entries.filter(e => e.type === 'ACTION');
//   if (actions.length === 0) {
//     showToast('Aucune action à exécuter', 'warning');
//     return navigate(`/day/${dayId}`);
//   }

//   let html = `
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:20px;">Exécution ⚡</h1>
//     </div>
//     <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
//       <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px;">Fais le point sur tes actions. Sois honnête avec toi-même.</p>
//   `;

//   actions.forEach((a, i) => {
//     html += `
//       <div class="action-item" style="animation:slideUp 0.3s ease ${i * 0.05}s backwards;cursor:pointer;" data-id="${a.id}" data-status="${a.status}">
//         <span style="font-weight:500;">${a.raw_text}</span>
//         <span class="action-check ${a.status === 'DONE' ? 'done' : (a.status === 'NOT_DONE' ? 'not-done' : '')}" id="check-${a.id}">
//           ${a.status === 'DONE' ? '✓' : (a.status === 'NOT_DONE' ? '✕' : '')}
//         </span>
//       </div>
//     `;
//   });

//   html += `
//       <button class="btn btn-primary" id="btn-save" style="margin-top:12px;">Enregistrer</button>
//     </div>
//   `;

//   page.querySelector('#content').innerHTML = html;

//   const statusMap = {};
//   actions.forEach(a => statusMap[a.id] = a.status);

//   page.querySelectorAll('.action-item').forEach(el => {
//     el.addEventListener('click', () => {
//       const id = el.dataset.id;
//       const current = statusMap[id];
//       const next = current === 'PENDING' ? 'DONE' : (current === 'DONE' ? 'NOT_DONE' : 'PENDING');
//       statusMap[id] = next;

//       const check = el.querySelector('.action-check');
//       check.className = `action-check ${next === 'DONE' ? 'done' : (next === 'NOT_DONE' ? 'not-done' : '')}`;
//       check.textContent = next === 'DONE' ? '✓' : (next === 'NOT_DONE' ? '✕' : '');
//     });
//   });

//   page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);

//   page.querySelector('#btn-save').onclick = async () => {
//     const payload = Object.entries(statusMap).map(([id, status]) => ({ id, status }));
//     const btn = page.querySelector('#btn-save');
//     btn.disabled = true;
//     btn.textContent = 'Enregistrement...';

//     try {
//       await days.execution(dayId, { actions: payload });
//       showToast('Exécution enregistrée !', 'success');
//       navigate(`/day/${dayId}`);
//     } catch {
//       showToast('Erreur lors de l\'enregistrement', 'error');
//       btn.disabled = false;
//       btn.textContent = 'Enregistrer';
//     }
//   };
// }
