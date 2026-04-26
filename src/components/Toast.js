const toasts = [];

export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 90%;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    info: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  };

  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    color: #fff;
    padding: 14px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);
    animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(10px);
  `;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  toast.innerHTML = `<span style="font-size:18px;font-weight:700;">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  const remove = () => {
    toast.style.animation = 'toastSlideOut 0.25s ease forwards';
    setTimeout(() => toast.remove(), 250);
  };

  setTimeout(remove, duration);
  toast.addEventListener('click', remove);
}
