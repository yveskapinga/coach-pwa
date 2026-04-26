// ScorePage.js - Détail du score d'une journée

import { days } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/Toast.js';

export default async function ScorePage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  const dayId = location.pathname.split('/')[2];

  page.innerHTML = `
    <div style="max-width:560px; margin:0 auto;">
      <div class="skeleton" style="height:40px; width:50%; margin-bottom:20px;"></div>
      <div class="skeleton" style="height:200px; border-radius:50%; margin-bottom:20px;"></div>
      <div class="skeleton" style="height:80px; margin-bottom:12px;"></div>
      <div class="skeleton" style="height:80px; margin-bottom:12px;"></div>
    </div>
  `;
  container.appendChild(page);

  let scoreData;
  try {
    scoreData = await days.score(dayId);
  } catch (err) {
    showToast('Score non disponible pour cette journée', 'warning');
    return navigate(`/day/${dayId}`);
  }

  const s = scoreData.score;
  const total = s.score || 0;

  const breakdown = [
    { label: '📊 Complétion', value: s.completion_rate || 0, max: 100, color: 'var(--primary)' },
    { label: '✅ Actions réalisées', value: s.actions_done || 0, max: s.actions_total || 3, color: 'var(--success)' },
    { label: '🌙 Bilan soir', value: s.evening_bonus || 0, max: 20, color: 'var(--warning)' },
    { label: '🙏 Gratitude', value: s.gratitude_bonus || 0, max: 10, color: '#c084fc' },
  ];

  function render() {
    let html = `
      <div style="max-width:560px; margin:0 auto;">
        <!-- En-tête -->
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; animation:slideUp 0.3s ease;">
          <button class="btn btn-outline" id="btn-back" style="width:auto; padding:10px 16px;">← Retour</button>
          <h1 style="margin:0; font-size:1.5rem;">🏆 Score</h1>
        </div>

        <!-- Score ring -->
        <div class="card" style="text-align:center; padding:28px 20px; animation:slideUp 0.4s ease 0.05s backwards;">
          <div class="score-ring" style="--progress:${total}%; margin:0 auto; animation:scaleIn 0.6s ease, ringPulse 2s ease-in-out infinite;">
            <span>${total}</span>
          </div>
          <p style="color:var(--text-muted); margin-top:12px;">Score total sur 100</p>
        </div>

        <h2 style="margin:24px 0 12px; animation:fadeIn 0.5s ease;">📋 Détail du score</h2>
    `;

    breakdown.forEach((item, idx) => {
      const percent = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0;
      html += `
        <div class="card" style="margin-bottom:12px; animation:slideUp 0.4s ease ${0.1 + idx * 0.05}s backwards; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600;">${item.label}</span>
            <span style="font-weight:700; color:${item.color};">${item.value} / ${item.max}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${percent}%; background:linear-gradient(90deg, ${item.color}, ${item.color}cc);"></div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    page.innerHTML = html;
    page.querySelector('#btn-back')?.addEventListener('click', () => navigate(`/day/${dayId}`));
  }

  render();
}
// import { days } from '../api.js';
// import { navigate } from '../router.js';
// import { showToast } from '../components/Toast.js';

// export default async function ScorePage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   const dayId = location.pathname.split('/')[2];

//   page.innerHTML = `<div id="content" style="display:flex;align-items:center;justify-content:center;min-height:50vh;"><div class="skeleton" style="width:60px;height:60px;border-radius:50%;"></div></div>`;
//   container.appendChild(page);

//   let scoreData;
//   try {
//     scoreData = await days.score(dayId);
//   } catch {
//     showToast('Score non disponible', 'warning');
//     return navigate(`/day/${dayId}`);
//   }

//   const s = scoreData.score;
//   const total = s.score || 0;
//   const progress = total;

//   const breakdown = [
//     { label: 'Taux de complétion', value: s.completion_rate || 0, max: 100, color: 'var(--primary)' },
//     { label: 'Actions réalisées', value: s.actions_done || 0, max: s.actions_total || 3, color: 'var(--success)' },
//     { label: 'Evening', value: s.evening_bonus || 0, max: 20, color: 'var(--warning)' },
//     { label: 'Gratitude', value: s.gratitude_bonus || 0, max: 10, color: '#a78bfa' },
//   ];

//   let html = `
//     <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;animation:slideUp 0.3s ease;">
//       <button class="btn btn-outline" id="btn-back" style="width:auto;padding:10px 14px;font-size:13px;flex-shrink:0;">
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//       </button>
//       <h1 style="margin:0;font-size:22px;">Score 🏆</h1>
//     </div>

//     <div class="card" style="text-align:center;animation:slideUp 0.4s ease 0.05s backwards;padding:28px 20px;">
//       <div class="score-ring" style="--progress:${progress}%;animation:scaleIn 0.6s ease, ringPulse 2s ease-in-out infinite;">
//         <span>${total}</span>
//       </div>
//       <p style="color:var(--text-muted);font-size:15px;margin-top:8px;">Score total sur 100</p>
//     </div>

//     <h2 style="animation:fadeIn 0.5s ease;margin-top:24px;margin-bottom:12px;">Détail</h2>
//   `;

//   breakdown.forEach((item, i) => {
//     const pct = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0;
//     html += `
//       <div class="card" style="animation:slideUp 0.4s ease ${0.1 + i * 0.05}s backwards;padding:18px 20px;">
//         <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
//           <span style="font-weight:600;font-size:15px;">${item.label}</span>
//           <span style="font-weight:700;color:${item.color};font-size:15px;">${item.value} / ${item.max}</span>
//         </div>
//         <div class="progress-bar">
//           <div class="progress-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${item.color},${item.color}aa);"></div>
//         </div>
//       </div>
//     `;
//   });

//   page.querySelector('#content').innerHTML = html;
//   page.querySelector('#btn-back').onclick = () => navigate(`/day/${dayId}`);
// }
