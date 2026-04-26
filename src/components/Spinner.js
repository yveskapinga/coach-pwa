export function showSpinner(parent) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner-overlay';
  spinner.style.cssText = `
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15,23,42,0.7);
    backdrop-filter: blur(4px);
    border-radius: inherit;
    z-index: 10;
    animation: fadeIn 0.2s ease;
  `;
  spinner.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      border: 3px solid rgba(56,189,248,0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    "></div>
  `;
  parent.style.position = 'relative';
  parent.appendChild(spinner);
  return {
    remove: () => spinner.remove(),
  };
}
