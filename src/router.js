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

function matchRoute(path) {
  // Match exact first
  if (routes[path]) {
    return { render: routes[path], params: {} };
  }

  // Try pattern matching for routes like /day/:id
  for (const routePath of Object.keys(routes)) {
    if (!routePath.includes(':')) continue;

    const routeParts = routePath.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return { render: routes[routePath], params };
    }
  }

  return null;
}

export function renderCurrentRoute() {
  const path = location.pathname;
  const app = document.getElementById('app');
  const matched = matchRoute(path);

  // Animate out
  if (app.firstElementChild) {
    app.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    app.style.opacity = '0';
    app.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      app.innerHTML = '';
      app.style.opacity = '';
      app.style.transform = '';
      app.style.transition = '';
      if (matched) matched.render(app);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  } else {
    app.innerHTML = '';
    if (matched) matched.render(app);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.addEventListener('popstate', renderCurrentRoute);
