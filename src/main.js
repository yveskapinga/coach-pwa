import './style.css';
import { registerRoute, renderCurrentRoute } from './router.js';

import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import DashboardPage from './pages/DashboardPage.js';
import DaysPage from './pages/DaysPage.js';
import DayPage from './pages/DayPage.js';
import MorningPage from './pages/MorningPage.js';
import ExecutionPage from './pages/ExecutionPage.js';
import EveningPage from './pages/EveningPage.js';
import GratitudePage from './pages/GratitudePage.js';
import ScorePage from './pages/ScorePage.js';
import PatternsPage from './pages/PatternsPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import ResetPasswordPage from './pages/ResetPasswordPage.js';

registerRoute('/', LoginPage);
registerRoute('/register', RegisterPage);
registerRoute('/dashboard', DashboardPage);
registerRoute('/day', DaysPage);
registerRoute('/day/:id', DayPage);
registerRoute('/day/:id/morning', MorningPage);
registerRoute('/day/:id/execution', ExecutionPage);
registerRoute('/day/:id/evening', EveningPage);
registerRoute('/day/:id/gratitude', GratitudePage);
registerRoute('/day/:id/score', ScorePage);
registerRoute('/patterns', PatternsPage);
registerRoute('/profile', ProfilePage);
registerRoute('/forgot-password', ForgotPasswordPage);
registerRoute('/reset-password', ResetPasswordPage);

renderCurrentRoute();

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered', reg.scope))
    .catch(err => console.error('SW error', err));
}
