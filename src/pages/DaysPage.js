// DaysPage.js - Liste de toutes les journées avec pagination, recherche et design moderne

import { days, auth } from '../api.js';
import { navigate } from '../router.js';
import BottomNav from '../components/BottomNav.js';
import { showToast } from '../components/Toast.js';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function DaysPage(container) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h1 style="margin:0;">📅 Mes journées</h1>
      <button class="btn btn-primary btn-sm" id="btn-refresh" style="width:auto; padding:8px 14px;">⟳</button>
    </div>
    <div id="days-list">
      <div class="skeleton" style="height:80px; border-radius:16px; margin-bottom:12px;"></div>
      <div class="skeleton" style="height:80px; border-radius:16px; margin-bottom:12px;"></div>
      <div class="skeleton" style="height:80px; border-radius:16px; margin-bottom:12px;"></div>
    </div>
  `;
  container.appendChild(page);

  let currentPage = 1;
  const limit = 12;
  let pagination = null;
  let allDays = [];
  let isLoading = false;

  async function loadDays(pageNum = 1, append = false) {
    if (isLoading) return;
    isLoading = true;
    const containerDiv = page.querySelector('#days-list');
    if (!append) containerDiv.innerHTML = '<div class="skeleton" style="height:80px; border-radius:16px;"></div>';

    try {
      const data = await days.list(pageNum, limit);
      pagination = data.pagination;
      if (append) {
        allDays = [...allDays, ...(data.days || [])];
      } else {
        allDays = data.days || [];
        currentPage = pageNum;
      }
      renderDays();
    } catch (err) {
      console.error(err);
      if (!append) {
        containerDiv.innerHTML = `
          <div class="empty-state">
            <div style="font-size:48px;">⚠️</div>
            <p>Impossible de charger vos journées</p>
            <button class="btn btn-primary" id="retry-load">Réessayer</button>
          </div>
        `;
        page.querySelector('#retry-load')?.addEventListener('click', () => loadDays(1, false));
      } else {
        showToast('Erreur lors du chargement', 'error');
      }
    } finally {
      isLoading = false;
    }
  }

  function renderDays() {
    const container = page.querySelector('#days-list');
    if (!allDays.length) {
      container.innerHTML = `
        <div class="empty-state" style="margin-top:40px;">
          <div style="font-size:56px;">🌱</div>
          <p style="font-size:1rem; margin:12px 0;">Aucune journée enregistrée</p>
          <button class="btn btn-primary" id="first-day-btn" style="max-width:220px; margin:0 auto;">Commencer aujourd'hui</button>
        </div>
      `;
      page.querySelector('#first-day-btn')?.addEventListener('click', () => navigate('/dashboard'));
      return;
    }

    let html = '<div class="days-grid" style="display:flex; flex-direction:column; gap:12px;">';
    allDays.forEach((day, idx) => {
      const delay = (idx % 10) * 0.04;
      const statusClass = `status-${day.status.toLowerCase()}`;
      const statusLabel = day.status === 'CREATED' ? '📋' : (day.status === 'STARTED' ? '⚡' : '✅');
      html += `
        <div class="card history-card" data-id="${day.id}" style="cursor:pointer; animation:slideUp 0.3s ease ${delay}s backwards; padding:14px 18px; display:flex; align-items:center; gap:12px;">
          <div class="day-icon" style="font-size:28px;">📆</div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:1rem;">${formatDate(day.date)}</div>
            <span class="status-badge ${statusClass}" style="margin-top:6px; display:inline-block; font-size:0.7rem;">
              ${statusLabel} ${day.status}
            </span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.5rem; font-weight:800; color:var(--primary);">${day.completion_rate || 0}%</div>
          </div>
          <span style="color:var(--text-muted);">›</span>
        </div>
      `;
    });
    html += '</div>';

    if (pagination && currentPage < pagination.totalPages) {
      html += `
        <div class="pagination" style="margin:20px 0 10px;">
          <button class="pagination-btn" id="load-more-btn" style="width:100%;">Charger plus (${currentPage}/${pagination.totalPages})</button>
        </div>
      `;
    }

    container.innerHTML = html;

    // Événements
    container.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = card.dataset.id;
        if (id) navigate(`/day/${id}`);
      });
    });

    const loadMoreBtn = container.querySelector('#load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', async () => {
        if (isLoading) return;
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Chargement...';
        currentPage++;
        await loadDays(currentPage, true);
        loadMoreBtn.disabled = false;
      });
    }
  }

  // Rafraîchissement manuel
  page.querySelector('#btn-refresh')?.addEventListener('click', () => {
    currentPage = 1;
    loadDays(1, false);
    showToast('Actualisation...', 'info');
  });

  await loadDays(1, false);
  container.appendChild(BottomNav());
}
// import { days, auth } from '../api.js';
// import { navigate } from '../router.js';
// import BottomNav from '../components/BottomNav.js';
// import { showToast } from '../components/Toast.js';

// export default async function DaysPage(container) {
//   const page = document.createElement('div');
//   page.className = 'page';
//   page.innerHTML = `
//     <h1 style="margin-bottom:16px;">Mes journées</h1>
//     <div id="content">
//       <div class="skeleton" style="height:80px;margin-bottom:12px;"></div>
//       <div class="skeleton" style="height:80px;margin-bottom:12px;"></div>
//       <div class="skeleton" style="height:80px;margin-bottom:12px;"></div>
//     </div>
//   `;
//   container.appendChild(page);

//   let user;
//   try { user = await auth.me(); } catch { return navigate('/', true); }

//   let currentPage = 1;
//   const limit = 15;
//   let pagination = null;
//   let allDays = [];

//   async function loadDays(pageNum = 1, append = false) {
//     try {
//       const data = await days.list(pageNum, limit);
//       pagination = data.pagination;
//       if (append) {
//         allDays = [...allDays, ...(data.days || [])];
//       } else {
//         allDays = data.days || [];
//       }
//       render();
//     } catch {
//       if (!append) {
//         page.querySelector('#content').innerHTML = `
//           <div class="empty-state">
//             <p>Impossible de charger vos journées</p>
//             <button class="btn btn-primary" id="btn-retry" style="margin-top:16px;">Réessayer</button>
//           </div>
//         `;
//         page.querySelector('#btn-retry')?.addEventListener('click', () => loadDays(1, false));
//       }
//     }
//   }

//   function render() {
//     if (allDays.length === 0) {
//       page.querySelector('#content').innerHTML = `
//         <div class="empty-state">
//           <div style="font-size:48px;margin-bottom:12px;opacity:0.6;">📅</div>
//           <p style="font-size:16px;">Aucune journée enregistrée</p>
//           <button class="btn btn-primary" id="btn-create" style="margin-top:16px;max-width:220px;margin-left:auto;margin-right:auto;">Créer ma première journée</button>
//         </div>
//       `;
//       page.querySelector('#btn-create')?.addEventListener('click', () => navigate('/dashboard'));
//       return;
//     }

//     let html = '';
//     allDays.forEach((d, i) => {
//       const delay = i * 0.04;
//       html += `
//         <div class="card history-card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; animation:slideUp 0.4s ease ${delay}s backwards; padding:16px 18px;" data-id="${d.id}">
//           <div style="flex:1;min-width:0;">
//             <div style="font-weight:600;font-size:15px;">${new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
//             <span class="status-badge status-${d.status.toLowerCase()}" style="margin-top:6px;display:inline-block;">${d.status}</span>
//           </div>
//           <div style="text-align:right;margin-left:12px;">
//             <div style="font-size:22px; font-weight:800; color:var(--primary);">${d.completion_rate || 0}%</div>
//           </div>
//         </div>
//       `;
//     });

//     if (pagination && currentPage < pagination.totalPages) {
//       html += `
//         <div class="pagination" style="animation:fadeIn 0.5s ease;">
//           <button class="pagination-btn" id="btn-load-more">Charger plus (${currentPage}/${pagination.totalPages})</button>
//         </div>
//       `;
//     }

//     page.querySelector('#content').innerHTML = html;

//     page.querySelector('#btn-load-more')?.addEventListener('click', async () => {
//       const btn = page.querySelector('#btn-load-more');
//       btn.disabled = true;
//       btn.textContent = 'Chargement...';
//       currentPage++;
//       await loadDays(currentPage, true);
//     });

//     page.querySelectorAll('.history-card').forEach(el => {
//       el.onclick = () => navigate(`/day/${el.dataset.id}`);
//     });
//   }

//   await loadDays(1, false);
//   container.appendChild(BottomNav());
// }
