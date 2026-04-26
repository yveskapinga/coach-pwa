const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path, replace = false) {
  if (replace) {
    history.replaceState(null, '', path);
  } else {
    history.pushState(null, '', path);
  }
  renderCurrentRoute();
}

export function renderCurrentRoute() {
  const path = location.pathname;
  const app = document.getElementById('app');
  const render = routes[path] || routes['/404'];
  app.innerHTML = '';
  if (render) render(app);
}

window.addEventListener('popstate', renderCurrentRoute);
