export function showDialog({ title, message, confirmText = 'Confirmer', cancelText = 'Annuler', onConfirm, onCancel, danger = false }) {
  const existing = document.getElementById('app-dialog');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'app-dialog';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: fadeIn 0.2s ease;
    padding: 16px;
  `;

  const confirmBg = danger
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)';

  overlay.innerHTML = `
    <div class="card" style="max-width:360px;width:100%;animation:scaleIn 0.3s cubic-bezier(0.16,1,0.3,1);border:1px solid rgba(255,255,255,0.08);">
      <h2 style="margin-top:0;font-size:20px;">${title}</h2>
      <p style="color:var(--text-muted);line-height:1.5;">${message}</p>
      <div style="display:flex;gap:10px;margin-top:20px;">
        <button class="btn btn-outline" id="dlg-cancel" style="flex:1;">${cancelText}</button>
        <button class="btn" id="dlg-confirm" style="flex:1;background:${confirmBg};color:#fff;border:none;">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.style.animation = 'fadeOut 0.2s ease forwards';
    setTimeout(() => overlay.remove(), 200);
  };

  overlay.querySelector('#dlg-cancel').onclick = () => {
    close();
    if (onCancel) onCancel();
  };

  overlay.querySelector('#dlg-confirm').onclick = () => {
    close();
    if (onConfirm) onConfirm();
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      close();
      if (onCancel) onCancel();
    }
  };
}
