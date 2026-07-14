function y(e){const n=[...e];for(let s=n.length-1;s>0;s--){const o=Math.floor(Math.random()*(s+1)),t=n[s];n[s]=n[o],n[o]=t}return n}const v=window.adPool||[],w=v.length;let c=parseInt(localStorage.getItem("tgnav-ad-offset")||"0",10);isNaN(c)&&(c=0);const $=[];for(let e=0;e<10;e++){const n=(c+e)%w;$.push(v[n])}const d=document.getElementById("promo-grid-container");d&&(d.innerHTML=$.map(e=>{const n=e.image?`background: url('${e.image}') no-repeat center center / cover;`:`background: ${e.gradient||"var(--glass-bg)"};`,s=e.image||!e.icon?"":`<i class="${e.icon} promo-card-icon"></i>`,o=e.display==="always"?"always":"hover";let t=e.link||"";return t&&(t.startsWith("http://")||t.startsWith("https://"))&&(t.includes(window.location.hostname)||(t=`/link/?url=${encodeURIComponent(t)}`)),`
        <a href="${t}" target="_blank" rel="noopener noreferrer" class="promo-card-item display-${o}">
          <div class="promo-card-banner" style="${n}">
            ${s}
            <span class="promo-card-badge">${e.tag||"推荐"}</span>
            <div class="promo-card-hover-overlay">
              <h4 class="promo-card-title">${e.title}</h4>
              <p class="promo-card-desc">${e.desc}</p>
            </div>
          </div>
        </a>
      `}).join(""));const E=(c+1)%w;localStorage.setItem("tgnav-ad-offset",E.toString());const m=document.getElementById("close-promo-btn"),a=document.getElementById("promo-section");m&&a&&m.addEventListener("click",()=>{a.style.opacity="0",a.style.transform="translateY(-10px)",a.style.transition="opacity 0.3s ease, transform 0.3s ease",setTimeout(()=>{a.style.display="none"},300)});function k(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function b(e){const n=`https://avatar.tgnav.org/small/${e.username.toLowerCase()}.jpg`,s="/images/default.jpg",o="/images/loading.gif",t=`/detail/${e.username.toLowerCase()}/`,r=k(e.title);return`
      <a href="${t}" class="rec-list-item">
        <img 
          class="rec-item-avatar" 
          src="${o}" 
          data-src="${n}"
          alt="${r} Avatar" 
          loading="lazy"
          onload="if(this.dataset.src && !this.src.includes(this.dataset.src)){const temp=new Image();temp.onload=()=>{this.src=this.dataset.src;};temp.onerror=()=>{this.src='${s}';};temp.src=this.dataset.src;}"
          onerror="this.onerror=null; this.src='${s}';"
        />
        <span class="rec-item-title" title="${r}">${r}</span>
      </a>
    `}function i(e,n,s){const o=document.getElementById(n);if(!o||!e||e.length===0)return;const t=s.querySelector(".refresh-icon");t&&(t.style.transform="rotate(360deg)",t.style.transition="transform 0.5s ease-in-out",setTimeout(()=>{t.style.transform="none",t.style.transition="none"},500));const I=y(e).slice(0,10);o.style.opacity="0.3",o.style.transition="opacity 0.2s ease",setTimeout(()=>{o.innerHTML=I.map(L=>b(L)).join(""),o.style.opacity="1"},200)}function l(e,n){const s=document.getElementById(n);if(!s||!e||e.length===0)return;const t=y(e).slice(0,10);s.innerHTML=t.map(r=>b(r)).join("")}l(window.cleanChannelsPool,"channels-list-container");l(window.cleanGroupsPool,"groups-list-container");l(window.cleanRobotsPool,"robots-list-container");const g=document.getElementById("refresh-channels-btn"),f=document.getElementById("refresh-groups-btn"),p=document.getElementById("refresh-robots-btn");g?.addEventListener("click",()=>{i(window.cleanChannelsPool,"channels-list-container",g)});f?.addEventListener("click",()=>{i(window.cleanGroupsPool,"groups-list-container",f)});p?.addEventListener("click",()=>{i(window.cleanRobotsPool,"robots-list-container",p)});const h=document.getElementById("home-search-trigger"),u=document.getElementById("search-trigger");h&&u&&h.addEventListener("click",()=>{u.click()});
