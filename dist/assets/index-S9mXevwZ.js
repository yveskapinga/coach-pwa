(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();const h={};function y(n,t){h[n]=t}function r(n,t=!1){t?history.replaceState(null,"",n):history.pushState(null,"",n),f()}function f(){const n=location.pathname,t=document.getElementById("app"),e=h[n]||h["/404"];t.innerHTML="",e&&e(t)}window.addEventListener("popstate",f);const k="";function C(){return localStorage.getItem("token")||""}async function p(n,t={}){const e=`${k}${n}`,s=await fetch(e,{...t,headers:{"Content-Type":"application/json",...C()?{Authorization:`Bearer ${C()}`}:{},...t.headers}}),a=s.status!==204?await s.json().catch(()=>({})):{};if(!s.ok){const i=new Error(a.error||`HTTP ${s.status}`);throw i.status=s.status,i.data=a,i}return a}const v={register:n=>p("/auth/register",{method:"POST",body:JSON.stringify(n)}),login:n=>p("/auth/login",{method:"POST",body:JSON.stringify(n)}),me:()=>p("/auth/me"),logout:()=>p("/auth/logout",{method:"POST",body:JSON.stringify({refresh_token:localStorage.getItem("refresh_token")})})},m={list:()=>p("/days"),create:n=>p("/days",{method:"POST",body:JSON.stringify(n)}),get:n=>p(`/days/${n}`),morning:(n,t)=>p(`/days/${n}/morning`,{method:"POST",body:JSON.stringify(t)}),execution:(n,t)=>p(`/days/${n}/execution`,{method:"PATCH",body:JSON.stringify(t)}),evening:(n,t)=>p(`/days/${n}/evening`,{method:"POST",body:JSON.stringify(t)}),gratitude:(n,t)=>p(`/days/${n}/gratitude`,{method:"POST",body:JSON.stringify(t)}),score:n=>p(`/days/${n}/score`)},T={patterns:()=>p("/patterns")},L={subscribe:n=>p("/push/subscribe",{method:"POST",body:JSON.stringify(n)})};function N(n){const t=document.createElement("div");t.className="page",t.innerHTML=`
    <div style="text-align:center; padding: 40px 0;">
      <div style="font-size:64px;">💪</div>
      <h1>Coach Life</h1>
      <p style="color:var(--text-muted);">Discipline. Focus. Résultats.</p>
    </div>
    <div class="card">
      <label>Identifiant</label>
      <input type="text" id="username" placeholder="votre pseudo" value="alice" />
      <label>Mot de passe</label>
      <input type="password" id="password" placeholder="••••••" value="password123" />
      <button class="btn btn-primary" id="btn-login">Se connecter</button>
      <button class="btn btn-outline" id="btn-register" style="margin-top:8px;">Créer un compte</button>
    </div>
  `,n.appendChild(t),t.querySelector("#btn-login").onclick=async()=>{const e=t.querySelector("#username").value.trim(),s=t.querySelector("#password").value;try{const a=await v.login({username:e,password:s});localStorage.setItem("token",a.access_token),localStorage.setItem("refresh_token",a.refresh_token),r("/dashboard",!0)}catch(a){alert(a.message||"Erreur de connexion")}},t.querySelector("#btn-register").onclick=()=>r("/register")}function _(n){const t=document.createElement("div");t.className="page",t.innerHTML=`
    <div style="text-align:center; padding: 30px 0;"><h1>Coach Life</h1></div>
    <div class="card">
      <label>Pseudo</label>
      <input type="text" id="username" placeholder="john" />
      <label>Email</label>
      <input type="email" id="email" placeholder="john@mail.com" />
      <label>Prénom</label>
      <input type="text" id="first_name" placeholder="John" />
      <label>Mot de passe</label>
      <input type="password" id="password" placeholder="6 caractères min" />
      <button class="btn btn-primary" id="btn-register">S'inscrire</button>
      <button class="btn btn-outline" id="btn-back" style="margin-top:8px;">Déjà un compte ?</button>
    </div>
  `,n.appendChild(t),t.querySelector("#btn-register").onclick=async()=>{const e={username:t.querySelector("#username").value.trim(),email:t.querySelector("#email").value.trim(),first_name:t.querySelector("#first_name").value.trim(),password:t.querySelector("#password").value};try{await v.register(e),alert("Compte créé ! Connectez-vous."),r("/")}catch(s){alert(s.message||"Erreur inscription")}},t.querySelector("#btn-back").onclick=()=>r("/")}const O=[{path:"/dashboard",label:"Accueil",icon:"🏠"},{path:"/day",label:"Journée",icon:"📅"},{path:"/patterns",label:"Stats",icon:"📊"},{path:"/profile",label:"Profil",icon:"👤"}];function b(){const n=document.createElement("nav");n.className="bottom-nav";const t=location.pathname;return O.forEach(e=>{const s=document.createElement("a");s.className="nav-item"+(t===e.path?" active":""),s.href=e.path,s.innerHTML=`<span>${e.icon}</span><span>${e.label}</span>`,s.onclick=a=>{a.preventDefault(),r(e.path)},n.appendChild(s)}),n}async function q(n){var o,c;const t=document.createElement("div");t.className="page",t.innerHTML='<h1>Dashboard</h1><div id="content">Chargement...</div>',n.appendChild(t);let e;try{e=await v.me()}catch{return r("/",!0)}const s=new Date().toISOString().split("T")[0];let a=[];try{a=(await m.list()).days||[]}catch{}const i=a.find(l=>l.date===s);let d=`
    <div class="card" style="text-align:center;">
      <div style="font-size:48px;">👋</div>
      <h2>Bonjour ${e.user.first_name}</h2>
      <p style="color:var(--text-muted);">${new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>
    </div>
  `;if(!i)d+=`
      <div class="card empty-state">
        <p>Aucune journée pour aujourd'hui</p>
        <button class="btn btn-primary" id="btn-create" style="margin-top:12px;">Créer ma journée</button>
      </div>
    `;else{const l=`status-${i.status.toLowerCase()}`;d+=`
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Aujourd'hui</h2>
            <span class="status-badge ${l}">${i.status}</span>
          </div>
          <div style="font-size:32px;">${i.completion_rate||0}%</div>
        </div>
        <button class="btn btn-primary" style="margin-top:16px;" id="btn-continue">Continuer</button>
      </div>
    `}a.length>1&&(d+='<h2 style="margin-top:24px;">Historique</h2>',a.slice(1,6).forEach(l=>{d+=`
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" data-id="${l.id}">
          <div>
            <div style="font-weight:600;">${new Date(l.date).toLocaleDateString("fr-FR")}</div>
            <span class="status-badge status-${l.status.toLowerCase()}">${l.status}</span>
          </div>
          <div style="font-size:20px; font-weight:700; color:var(--primary);">${l.completion_rate||0}%</div>
        </div>
      `})),t.querySelector("#content").innerHTML=d,(o=t.querySelector("#btn-create"))==null||o.addEventListener("click",async()=>{try{const l=await m.create({date:s});r(`/day/${l.day.id}`)}catch(l){alert(l.message)}}),(c=t.querySelector("#btn-continue"))==null||c.addEventListener("click",()=>{r(`/day/${i.id}`)}),t.querySelectorAll("[data-id]").forEach(l=>{l.onclick=()=>r(`/day/${l.dataset.id}`)}),n.appendChild(b())}async function P(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML='<div id="content">Chargement...</div>',n.appendChild(e);let s;try{s=await m.get(t)}catch{return alert("Journée non trouvée"),r("/dashboard")}const a=s.day,i=s.entries||[],d=i.filter(u=>u.type==="ACTION"),o=i.find(u=>u.type==="FOCUS"),c=i.some(u=>["ACCOMPLISHMENT","LESSON","RULE"].includes(u.type)),l=i.some(u=>u.type==="GRATITUDE");let g=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">${new Date(a.date).toLocaleDateString("fr-FR")}</h1>
    </div>
    <span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span>
  `;a.status==="CREATED"?g+=`
      <div class="card" style="margin-top:16px;">
        <h2>☀️ Matin</h2>
        <p style="color:var(--text-muted);">Définissez vos actions et votre focus.</p>
        <button class="btn btn-primary" id="btn-morning">Configurer le matin</button>
      </div>
    `:(g+=`
      <div class="card" style="margin-top:16px;">
        <h2>☀️ Matin</h2>
        ${o?`<p style="color:var(--primary); font-weight:600;">🎯 Focus : ${o.raw_text}</p>`:""}
        ${d.map(u=>`
          <div class="action-item">
            <span>${u.raw_text}</span>
            <span class="action-check ${u.status==="DONE"?"done":u.status==="NOT_DONE"?"not-done":""}">
              ${u.status==="DONE"?"✓":u.status==="NOT_DONE"?"✕":""}
            </span>
          </div>
        `).join("")}
        ${a.status==="STARTED"?'<button class="btn btn-primary" style="margin-top:12px;" id="btn-exec">Faire le point</button>':""}
      </div>
    `,a.status==="COMPLETED"&&(g+=`
        <div class="card">
          <h2>🌙 Soir</h2>
          ${c?'<p style="color:var(--success);">✅ Analyse complétée</p>':`<button class="btn btn-primary" id="btn-evening">Faire l'analyse du soir</button>`}
        </div>
        <div class="card">
          <h2>🙏 Gratitude</h2>
          ${l?'<p style="color:var(--success);">✅ 3 items enregistrés</p>':'<button class="btn btn-primary" id="btn-gratitude">Ajouter gratitude</button>'}
        </div>
        <div class="card" style="text-align:center;">
          <h2>Score</h2>
          <div class="score-ring" id="score-ring">-</div>
          <button class="btn btn-outline" id="btn-score">Voir le détail</button>
        </div>
      `)),e.querySelector("#content").innerHTML=g,e.querySelector("#btn-back").onclick=()=>r("/dashboard");const x=e.querySelector("#btn-morning");x&&(x.onclick=()=>r(`/day/${t}/morning`));const S=e.querySelector("#btn-exec");S&&(S.onclick=()=>r(`/day/${t}/execution`));const w=e.querySelector("#btn-evening");w&&(w.onclick=()=>r(`/day/${t}/evening`));const $=e.querySelector("#btn-gratitude");$&&($.onclick=()=>r(`/day/${t}/gratitude`));const E=e.querySelector("#btn-score");if(E&&(E.onclick=()=>r(`/day/${t}/score`)),a.status==="COMPLETED")try{const u=await m.score(t);e.querySelector("#score-ring").textContent=u.score.score}catch{}n.appendChild(b())}async function M(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">☀️ Matin</h1>
    </div>
    <div class="card">
      <label>Action 1</label>
      <input type="text" id="a1" placeholder="Faire du sport" />
      <label>Action 2</label>
      <input type="text" id="a2" placeholder="Coder API" />
      <label>Action 3 (optionnel)</label>
      <input type="text" id="a3" placeholder="Lire 20 pages" />
      <label>Focus du jour</label>
      <input type="text" id="focus" placeholder="Discipline" />
      <button class="btn btn-primary" id="btn-save">Valider</button>
    </div>
  `,n.appendChild(e),e.querySelector("#btn-back").onclick=()=>r(`/day/${t}`),e.querySelector("#btn-save").onclick=async()=>{const s=[e.querySelector("#a1").value,e.querySelector("#a2").value,e.querySelector("#a3").value].map(i=>i.trim()).filter(Boolean),a=e.querySelector("#focus").value.trim();if(s.length<1||s.length>3)return alert("1 à 3 actions requises");if(!a)return alert("Focus requis");try{await m.morning(t,{actions:s,focus:a}),r(`/day/${t}`)}catch(i){alert(i.message)}}}async function z(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML='<div id="content">Chargement...</div>',n.appendChild(e);let s;try{s=await m.get(t)}catch{return r("/dashboard")}const a=s.entries.filter(o=>o.type==="ACTION");let i=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">⚡ Exécution</h1>
    </div>
    <div class="card">
  `;a.forEach(o=>{i+=`
      <div class="action-item" data-id="${o.id}">
        <span>${o.raw_text}</span>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" style="width:auto; padding:6px 12px; font-size:13px;" data-status="DONE" data-id="${o.id}">✓ Fait</button>
          <button class="btn btn-outline" style="width:auto; padding:6px 12px; font-size:13px;" data-status="NOT_DONE" data-id="${o.id}">✕ Non</button>
        </div>
      </div>
    `}),i+='<button class="btn btn-primary" style="margin-top:16px;" id="btn-save">Enregistrer</button></div>',e.querySelector("#content").innerHTML=i;const d={};e.querySelectorAll("[data-status]").forEach(o=>{o.onclick=()=>{d[o.dataset.id]=o.dataset.status,o.parentElement.parentElement.querySelectorAll("button").forEach(c=>c.style.borderColor="var(--surface-light)"),o.style.borderColor=o.dataset.status==="DONE"?"var(--success)":"var(--danger)"}}),e.querySelector("#btn-back").onclick=()=>r(`/day/${t}`),e.querySelector("#btn-save").onclick=async()=>{const o=a.map(c=>({id:c.id,status:d[c.id]||c.status}));try{await m.execution(t,{actions:o}),r(`/day/${t}`)}catch(c){alert(c.message)}}}function A(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">🌙 Soir</h1>
    </div>
    <div class="card">
      <label>Accomplissements</label>
      <textarea id="accomplishments" placeholder="Qu'avez-vous accompli aujourd'hui ?"></textarea>
      <label>Évitements</label>
      <textarea id="avoidances" placeholder="Qu'avez-vous évité ?"></textarea>
      <label>Raison d'échec (si applicable)</label>
      <textarea id="failure_reason" placeholder="Pourquoi certaines actions n'ont pas été faites ?"></textarea>
      <label>Leçons apprises</label>
      <textarea id="lessons" placeholder="Qu'avez-vous appris ?"></textarea>
      <label>Règle pour demain</label>
      <textarea id="rule_for_tomorrow" placeholder="Quelle règle vous imposez-vous ?"></textarea>
      <button class="btn btn-primary" id="btn-save">Enregistrer</button>
    </div>
  `,n.appendChild(e),e.querySelector("#btn-back").onclick=()=>r(`/day/${t}`),e.querySelector("#btn-save").onclick=async()=>{const s={};["accomplishments","avoidances","failure_reason","lessons","rule_for_tomorrow"].forEach(a=>{const i=e.querySelector("#"+a).value.trim();i.length>=10&&(s[a]=i)});try{await m.evening(t,s),r(`/day/${t}`)}catch(a){alert(a.message)}}}function D(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">🙏 Gratitude</h1>
    </div>
    <div class="card">
      <p style="color:var(--text-muted); margin-bottom:16px;">Notez 3 choses pour lesquelles vous êtes reconnaissant aujourd'hui.</p>
      <div class="gratitude-input" contenteditable id="g1">Ma santé</div>
      <div class="gratitude-input" contenteditable id="g2">Ma famille</div>
      <div class="gratitude-input" contenteditable id="g3">Le soleil</div>
      <button class="btn btn-primary" id="btn-save">Enregistrer</button>
    </div>
  `,n.appendChild(e),e.querySelector("#btn-back").onclick=()=>r(`/day/${t}`),e.querySelector("#btn-save").onclick=async()=>{const s=[1,2,3].map(a=>e.querySelector("#g"+a).innerText.trim()).filter(Boolean);if(s.length!==3)return alert("Exactement 3 items requis");try{await m.gratitude(t,{items:s}),r(`/day/${t}`)}catch(a){alert(a.message)}}}async function H(n){const t=location.pathname.split("/").pop(),e=document.createElement("div");e.className="page",e.innerHTML='<div id="content">Chargement...</div>',n.appendChild(e);let s;try{s=await m.score(t)}catch{return r("/dashboard")}const a=s.score;e.querySelector("#content").innerHTML=`
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <button class="btn btn-outline" style="width:auto; padding:8px 14px;" id="btn-back">←</button>
      <h1 style="margin:0;">Score</h1>
    </div>
    <div class="card" style="text-align:center;">
      <div class="score-ring">${a.score}</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
        <div class="card" style="margin:0;">
          <div style="font-size:24px; font-weight:700; color:var(--primary);">${a.completion_rate}%</div>
          <div style="font-size:12px; color:var(--text-muted);">Actions faites</div>
        </div>
        <div class="card" style="margin:0;">
          <div style="font-size:24px; font-weight:700; color:var(--success);">${a.actions_done}/${a.actions_total}</div>
          <div style="font-size:12px; color:var(--text-muted);">Ratio</div>
        </div>
        <div class="card" style="margin:0; ${a.has_evening?"border:1px solid var(--success);":""}">
          <div style="font-size:24px;">${a.has_evening?"✅":"❌"}</div>
          <div style="font-size:12px; color:var(--text-muted);">Soir</div>
        </div>
        <div class="card" style="margin:0; ${a.has_gratitude?"border:1px solid var(--success);":""}">
          <div style="font-size:24px;">${a.has_gratitude?"✅":"❌"}</div>
          <div style="font-size:12px; color:var(--text-muted);">Gratitude</div>
        </div>
      </div>
    </div>
  `,e.querySelector("#btn-back").onclick=()=>r(`/day/${t}`)}async function j(n){const t=document.createElement("div");t.className="page",t.innerHTML='<div id="content">Chargement...</div>',n.appendChild(t);let e;try{e=await T.patterns()}catch{return r("/dashboard")}const s=e.patterns;let a='<h1>📊 Tendances</h1><div class="card">';a+=`
    <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
      <div style="text-align:center; flex:1;">
        <div style="font-size:28px; font-weight:700; color:var(--primary);">${s.avg_completion}%</div>
        <div style="font-size:12px; color:var(--text-muted);">Moyenne</div>
      </div>
      <div style="text-align:center; flex:1;">
        <div style="font-size:28px; font-weight:700; color:var(--success);">${s.days_count}</div>
        <div style="font-size:12px; color:var(--text-muted);">Jours</div>
      </div>
    </div>
  `,s.top_concepts&&s.top_concepts.length&&(a+="<h2>Top concepts</h2>",s.top_concepts.forEach(i=>{a+=`<div class="action-item"><span>${i.label}</span><span style="color:var(--text-muted);">${i.count}x</span></div>`})),s.common_failure_reasons&&s.common_failure_reasons.length&&(a+='<h2 style="margin-top:16px;">Freins récurrents</h2>',s.common_failure_reasons.forEach(i=>{a+=`<div class="action-item" style="border-left:3px solid var(--danger);"><span>${i.label}</span><span style="color:var(--text-muted);">${i.count}x</span></div>`})),a+="</div>",t.querySelector("#content").innerHTML=a,n.appendChild(b())}async function R(n){const t=document.createElement("div");t.className="page",t.innerHTML='<div id="content">Chargement...</div>',n.appendChild(t);let e;try{e=await v.me()}catch{return r("/")}t.querySelector("#content").innerHTML=`
    <h1>👤 Profil</h1>
    <div class="card" style="text-align:center;">
      <div style="font-size:64px;">👤</div>
      <h2>${e.user.first_name}</h2>
      <p style="color:var(--text-muted);">@${e.user.username}</p>
      <p style="color:var(--text-muted); font-size:13px;">${e.user.email}</p>
    </div>
    <div class="card">
      <button class="btn btn-danger" id="btn-logout">Se déconnecter</button>
    </div>
    <div class="card">
      <h2>🔔 Notifications</h2>
      <p style="color:var(--text-muted); font-size:13px;">Activez les notifications pour recevoir des rappels.</p>
      <button class="btn btn-primary" id="btn-notif">Activer les notifications</button>
      <p id="notif-status" style="margin-top:8px; font-size:12px; color:var(--text-muted);"></p>
    </div>
  `,t.querySelector("#btn-logout").onclick=async()=>{try{await v.logout()}catch{}localStorage.removeItem("token"),localStorage.removeItem("refresh_token"),r("/",!0)},t.querySelector("#btn-notif").onclick=async()=>{const i=t.querySelector("#notif-status");if(!("Notification"in window)||!("serviceWorker"in navigator)){i.textContent="Notifications non supportées";return}if(await Notification.requestPermission()!=="granted"){i.textContent="Permission refusée";return}try{const c=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:s("BGLD9WdavWjvKy9acHP1pHzryoP5R8aTGlQ1gEwG7P3XautFqAlSblsAJYGn69byH6fx7w5dCimLVadHdiCRKRk")});await L.subscribe({endpoint:c.endpoint,keys:{p256dh:a(c.getKey("p256dh")),auth:a(c.getKey("auth"))}}),i.textContent="Notifications push activées !",i.style.color="var(--success)",await fetch("/api/push/test",{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})}catch(o){i.textContent="Erreur: "+(o.message||"inconnue"),console.error(o)}};function s(i){const d="=".repeat((4-i.length%4)%4),o=(i+d).replace(/\-/g,"+").replace(/_/g,"/"),c=atob(o);return Uint8Array.from([...c].map(l=>l.charCodeAt(0)))}function a(i){const d=new Uint8Array(i);let o="";for(let c=0;c<d.byteLength;c++)o+=String.fromCharCode(d[c]);return btoa(o)}n.appendChild(b())}y("/",N);y("/register",_);y("/dashboard",q);y("/day",q);y("/day/:id",P);y("/day/:id/morning",M);y("/day/:id/execution",z);y("/day/:id/evening",A);y("/day/:id/gratitude",D);y("/day/:id/score",H);y("/patterns",j);y("/profile",R);f();"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(n=>console.log("SW registered",n.scope)).catch(n=>console.error("SW error",n));
