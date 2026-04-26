// DayPage.js - Vue détaillée d'une journée avec timeline interactive

import { days } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';
import { showToast } from '../components/Toast.js';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default async function DayPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div id="day-content" style="display:flex; flex-direction:column; gap:16px;">
      <div class="skeleton" style="height:80px; border-radius:20px;"></div>
      <div class="skeleton" style="height:200px; border-radius:20px;"></div>
      <div class="skeleton" style="height:160px; border-radius:20px;"></div>
      <div class="skeleton" style="height:140px; border-radius:20px;"></div>
    </div>
  `;
  container.appendChild(page);

  const dayId = location.pathname.split('/')[2];
  if (!dayId) {
    showToast('Journée invalide', 'error');
    return navigate('/dashboard');
  }

  let dayData;
  try {
    dayData = await days.get(dayId);
  } catch (err) {
    showToast('Journée introuvable', 'error');
    return navigate('/dashboard');
  }

  const { day, entries } = dayData;
  const actions = entries.filter(e => e.type === 'ACTION');
  const focus = entries.find(e => e.type === 'FOCUS');
  const gratitudes = entries.filter(e => e.type === 'GRATITUDE');
  const eveningEntries = entries.filter(e => ['ACCOMPLISHMENT', 'AVOIDANCE', 'FAILURE_REASON', 'LESSON', 'RULE'].includes(e.type));

  const statusMap = {
    CREATED: { label: '📋 Créée', class: 'status-created' },
    STARTED: { label: '⚡ En cours', class: 'status-started' },
    COMPLETED: { label: '✅ Terminée', class: 'status-completed' }
  };
  const currentStatus = statusMap[day.status] || { label: day.status, class: '' };

  // Déterminer les étapes complétées
  const hasMorning = actions.length > 0 || focus;
  const hasExecution = actions.some(a => a.status !== 'PENDING');
  const hasEvening = eveningEntries.length > 0;
  const hasGratitude = gratitudes.length === 3;

  function render() {
    const html = `
      <!-- En-tête avec retour -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; animation:slideUp 0.3s ease;">
        <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 14px; flex-shrink:0;">
          ← Retour
        </button>
        <div style="flex:1; min-width:0;">
          <h1 style="margin:0; font-size:1.5rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${formatDate(day.date)}
          </h1>
          <span class="status-badge ${currentStatus.class}" style="margin-top:4px; display:inline-block;">
            ${currentStatus.label}
          </span>
        </div>
      </div>

      <!-- Carte progression -->
      <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
          <h3 style="margin:0; font-size:1rem;">Progression</h3>
          <span style="font-weight:800; color:var(--primary);">${day.completion_rate || 0}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${day.completion_rate || 0}%;"></div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="timeline" style="animation:slideUp 0.4s ease 0.1s backwards;">
        
        <!-- Morning -->
        <div class="timeline-item ${hasMorning ? 'completed' : (day.status === 'CREATED' ? 'active' : '')}">
          <div class="card" style="margin-bottom:0;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:24px;">☀️</span>
              <h3 style="margin:0; font-size:1.1rem;">Morning routine</h3>
            </div>
            ${focus ? `<p style="background:var(--bg); padding:10px; border-radius:12px; margin:0 0 12px; font-size:0.9rem;"><strong>Focus du jour :</strong> ${escapeHtml(focus.raw_text)}</p>` : ''}
            <div class="actions-list">
              ${actions.length > 0 ? actions.map((a, idx) => `
                <div class="action-item" style="animation-delay:${idx * 0.05}s; display:flex; justify-content:space-between; align-items:center;">
                  <span style="flex:1; font-size:0.95rem;">${escapeHtml(a.raw_text)}</span>
                  <span class="action-check ${a.status === 'DONE' ? 'done' : (a.status === 'NOT_DONE' ? 'not-done' : '')}" style="flex-shrink:0; margin-left:12px;">
                    ${a.status === 'DONE' ? '✓' : (a.status === 'NOT_DONE' ? '✕' : '○')}
                  </span>
                </div>
              `).join('') : '<p style="color:var(--text-muted); margin:0;">Aucune action définie</p>'}
            </div>
            ${!hasMorning && day.status !== 'COMPLETED' ? `
              <button class="btn btn-primary" id="btn-morning" style="margin-top:16px;">🎯 Définir le morning</button>
            ` : ''}
          </div>
        </div>

        <!-- Exécution -->
        <div class="timeline-item ${hasExecution ? 'completed' : (hasMorning ? 'active' : '')}">
          <div class="card">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:24px;">⚡</span>
              <h3 style="margin:0;">Exécution</h3>
            </div>
            ${hasExecution ? `
              <p style="margin-bottom:12px; font-size:0.9rem;">
                ✅ ${actions.filter(a => a.status === 'DONE').length}/${actions.length} actions réalisées
              </p>
            ` : '<p style="color:var(--text-muted);">En attente de la routine matinale</p>'}
            ${hasMorning && day.status !== 'COMPLETED' ? `
              <button class="btn btn-primary" id="btn-execution" style="margin-top:8px;">
                ${hasExecution ? '📝 Modifier l\'exécution' : '🚀 Commencer l\'exécution'}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Evening -->
        <div class="timeline-item ${hasEvening ? 'completed' : (hasExecution ? 'active' : '')}">
          <div class="card">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:24px;">🌙</span>
              <h3 style="margin:0;">Bilan du soir</h3>
            </div>
            ${hasEvening ? eveningEntries.map(e => `
              <div style="margin-bottom:12px; padding:8px 12px; background:var(--bg); border-radius:12px;">
                <strong style="display:block; font-size:0.75rem; color:var(--primary);">${formatEveningType(e.type)}</strong>
                <p style="margin:4px 0 0; font-size:0.9rem;">${escapeHtml(e.raw_text)}</p>
              </div>
            `).join('') : '<p style="color:var(--text-muted);">À compléter après l\'exécution</p>'}
            ${hasExecution && !hasEvening && day.status !== 'COMPLETED' ? `
              <button class="btn btn-primary" id="btn-evening" style="margin-top:8px;">📖 Faire le bilan</button>
            ` : ''}
          </div>
        </div>

        <!-- Gratitude -->
        <div class="timeline-item ${hasGratitude ? 'completed' : (hasEvening ? 'active' : '')}">
          <div class="card">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:24px;">🙏</span>
              <h3 style="margin:0;">Gratitude</h3>
            </div>
            ${hasGratitude ? gratitudes.map(g => `
              <div style="padding:10px 14px; background:var(--bg); border-radius:12px; margin-bottom:8px; font-size:0.9rem;">
                ✨ ${escapeHtml(g.raw_text)}
              </div>
            `).join('') : '<p style="color:var(--text-muted);">3 choses pour lesquelles vous êtes reconnaissant</p>'}
            ${hasEvening && !hasGratitude && day.status !== 'COMPLETED' ? `
              <button class="btn btn-primary" id="btn-gratitude" style="margin-top:8px;">💖 Exprimer ma gratitude</button>
            ` : ''}
          </div>
        </div>

        <!-- Score final -->
        <div class="timeline-item ${day.status === 'COMPLETED' ? 'completed' : ''}">
          <div class="card">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span style="font-size:24px;">🏆</span>
              <h3 style="margin:0;">Score & palmarès</h3>
            </div>
            ${day.status === 'COMPLETED' ? `
              <p style="margin-bottom:12px; font-size:0.9rem;">Cette journée est terminée. Découvrez votre score détaillé.</p>
              <button class="btn btn-primary" id="btn-score">📊 Voir le score</button>
            ` : '<p style="color:var(--text-muted);">Disponible lorsque la journée sera terminée</p>'}
          </div>
        </div>
      </div>
    `;

    const contentDiv = page.querySelector('#day-content');
    contentDiv.innerHTML = html;

    // Attacher événements
    page.querySelector('#btn-back')?.addEventListener('click', () => navigate('/dashboard'));
    page.querySelector('#btn-morning')?.addEventListener('click', () => navigate(`/day/${dayId}/morning`));
    page.querySelector('#btn-execution')?.addEventListener('click', () => navigate(`/day/${dayId}/execution`));
    page.querySelector('#btn-evening')?.addEventListener('click', () => navigate(`/day/${dayId}/evening`));
    page.querySelector('#btn-gratitude')?.addEventListener('click', () => navigate(`/day/${dayId}/gratitude`));
    page.querySelector('#btn-score')?.addEventListener('click', () => navigate(`/day/${dayId}/score`));
  }

  function formatEveningType(type) {
    const map = {
      ACCOMPLISHMENT: '🏅 Réalisations',
      AVOIDANCE: '🚫 Évitements',
      FAILURE_REASON: '🤔 Raison des échecs',
      LESSON: '📚 Leçons apprises',
      RULE: '📌 Règle pour demain'
    };
    return map[type] || type;
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
  container.appendChild(BottomNav());
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import BottomNav from '../components/BottomNav.js';
// import { showToast } from '../components/Toast.js';

// export default async function DayPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `<div id="content" style="display:flex;align-items:center;justify-content:center;min-height:50vh;"><div class="skeleton" style="width:60px;height:60px;border-radius:50%;"></div></div>`;
//   container.appendChild(page);

//   const dayId = location.pathname.split('/')[2];
//   if (!dayId) return navigate('/dashboard');

//   let dayData;
//   try {
//     dayData = await days.get(dayId);
//   } catch {
//     showToast('Journée introuvable', 'error');
//     return navigate('/dashboard');
//   }

//   const { day, entries } = dayData;
//   const actions = entries.filter(e => e.type === 'ACTION');
//   const focus = entries.find(e => e.type === 'FOCUS');
//   const gratitude = entries.filter(e => e.type === 'GRATITUDE');
//   const evening = entries.filter(e => ['ACCOMPLISHMENTS', 'AVOIDANCES', 'FAILURE_REASON', 'LESSONS', 'RULE_FOR_TOMORROW'].includes(e.type));

//   const statusLabels = { CREATED: 'Créée', STARTED: 'En cours', COMPLETED: 'Terminée' };

//   let html = `
//     <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;flex-shrink:0;">
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <div style="min-width:0;">
//         <h1 style="margin:0;font-size:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h1>
//         <span class="status-badge status-${day.status.toLowerCase()}">${statusLabels[day.status] || day.status}</span>
//       </div>
//     </div>

//     <div class="card" style="animation:slideUp 0.4s ease 0.05s backwards;">
//       <h3 style="margin-bottom:14px;font-size:16px;">Progression</h3>
//       <div class="progress-bar">
//         <div class="progress-bar-fill" style="width:${day.completion_rate || 0}%"></div>
//       </div>
//       <div style="display:flex;justify-content:space-between;margin-top:10px;">
//         <span style="font-size:14px;color:var(--text-muted);">Complété</span>
//         <span style="font-size:14px;font-weight:700;color:var(--primary);">${day.completion_rate || 0}%</span>
//       </div>
//     </div>

//     <div class="timeline" style="animation:slideUp 0.4s ease 0.1s backwards;">
//   `;

//   // Morning
//   const hasMorning = actions.length > 0 || focus;
//   html += `
//     <div class="timeline-item ${hasMorning ? 'completed' : (day.status === 'CREATED' ? 'active' : '')}">
//       <div class="card" style="margin-bottom:0;padding:18px 20px;">
//         <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;margin-bottom:12px;">
//           <span style="font-size:22px;">☀️</span> Morning
//         </h3>
//         ${focus ? `<p style="margin:0 0 12px;color:var(--primary);font-weight:600;font-size:15px;">Focus: ${focus.raw_text}</p>` : ''}
//         ${actions.length > 0 ? actions.map((a, i) => `
//           <div class="action-item" style="animation-delay:${i * 0.05}s;padding:14px 16px;">
//             <span style="font-size:15px;word-break:break-word;">${a.raw_text}</span>
//             <span class="action-check ${a.status === 'DONE' ? 'done' : (a.status === 'NOT_DONE' ? 'not-done' : '')}" style="flex-shrink:0;margin-left:12px;">
//               ${a.status === 'DONE' ? '✓' : (a.status === 'NOT_DONE' ? '✕' : '')}
//             </span>
//           </div>
//         `).join('') : '<p style="color:var(--text-muted);font-size:15px;">Pas encore défini</p>'}
//         ${!hasMorning ? `<button class="btn btn-primary" id="btn-morning" style="margin-top:14px;font-size:15px;padding:14px;">Définir le morning</button>` : ''}
//       </div>
//     </div>
//   `;

//   // Execution
//   const hasExecution = actions.some(a => a.status !== 'PENDING');
//   html += `
//     <div class="timeline-item ${hasExecution ? 'completed' : (hasMorning ? 'active' : '')}">
//       <div class="card" style="margin-bottom:0;padding:18px 20px;">
//         <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;margin-bottom:12px;">
//           <span style="font-size:22px;">⚡</span> Exécution
//         </h3>
//         ${hasExecution ? `<p style="color:var(--text-muted);font-size:15px;margin-bottom:14px;">${actions.filter(a => a.status === 'DONE').length}/${actions.length} actions réalisées</p>` : '<p style="color:var(--text-muted);font-size:15px;">En attente du morning</p>'}
//         ${hasMorning && day.status !== 'COMPLETED' ? `<button class="btn btn-primary" id="btn-execution" style="margin-top:10px;font-size:15px;padding:14px;">${hasExecution ? 'Modifier' : 'Faire le point'}</button>` : ''}
//       </div>
//     </div>
//   `;

//   // Evening
//   const hasEvening = evening.length > 0;
//   html += `
//     <div class="timeline-item ${hasEvening ? 'completed' : (hasExecution ? 'active' : '')}">
//       <div class="card" style="margin-bottom:0;padding:18px 20px;">
//         <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;margin-bottom:12px;">
//           <span style="font-size:22px;">🌙</span> Evening
//         </h3>
//         ${hasEvening ? evening.map(e => `<p style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;word-break:break-word;"><strong style="color:var(--text);">${e.type}:</strong> ${e.raw_text}</p>`).join('') : '<p style="color:var(--text-muted);font-size:15px;">En attente de l\'exécution</p>'}
//         ${hasExecution && !hasEvening ? `<button class="btn btn-primary" id="btn-evening" style="margin-top:10px;font-size:15px;padding:14px;">Faire le bilan</button>` : ''}
//       </div>
//     </div>
//   `;

//   // Gratitude
//   const hasGratitude = gratitude.length === 3;
//   html += `
//     <div class="timeline-item ${hasGratitude ? 'completed' : (hasEvening ? 'active' : '')}">
//       <div class="card" style="margin-bottom:0;padding:18px 20px;">
//         <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;margin-bottom:12px;">
//           <span style="font-size:22px;">🙏</span> Gratitude
//         </h3>
//         ${hasGratitude ? gratitude.map(g => `<div style="padding:10px 14px;background:var(--bg);border-radius:10px;margin-bottom:8px;font-size:15px;word-break:break-word;">${g.raw_text}</div>`).join('') : '<p style="color:var(--text-muted);font-size:15px;">En attente du evening</p>'}
//         ${hasEvening && !hasGratitude ? `<button class="btn btn-primary" id="btn-gratitude" style="margin-top:10px;font-size:15px;padding:14px;">Exprimer ma gratitude</button>` : ''}
//       </div>
//     </div>
//   `;

//   // Score
//   html += `
//     <div class="timeline-item ${day.status === 'COMPLETED' ? 'completed' : ''}">
//       <div class="card" style="margin-bottom:0;padding:18px 20px;">
//         <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;margin-bottom:12px;">
//           <span style="font-size:22px;">🏆</span> Score
//         </h3>
//         ${day.status === 'COMPLETED' ? `
//           <p style="color:var(--text-muted);font-size:15px;margin-bottom:12px;">Journée terminée !</p>
//           <button class="btn btn-primary" id="btn-score" style="font-size:15px;padding:14px;">Voir le score</button>
//         ` : '<p style="color:var(--text-muted);font-size:15px;">Disponible à la fin de la journée</p>'}
//       </div>
//     </div>
//   `;

//   html += `</div>`;

//   page.querySelector('#content').innerHTML = html;

//   page.querySelector('#btn-back')?.addEventListener('click', () => navigate('/dashboard'));
//   page.querySelector('#btn-morning')?.addEventListener('click', () => navigate(`/day/${dayId}/morning`));
//   page.querySelector('#btn-execution')?.addEventListener('click', () => navigate(`/day/${dayId}/execution`));
//   page.querySelector('#btn-evening')?.addEventListener('click', () => navigate(`/day/${dayId}/evening`));
//   page.querySelector('#btn-gratitude')?.addEventListener('click', () => navigate(`/day/${dayId}/gratitude`));
//   page.querySelector('#btn-score')?.addEventListener('click', () => navigate(`/day/${dayId}/score`));

//   container.appendChild(BottomNav());
// }
