'use strict';


/* Utilitaires */
const clean = h => h ? h.replace(/<!--block-->/g, '').trim() : '';
const txt   = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return d.textContent.trim(); };
const vol   = m => [m.volume_horaire_cm, m.volume_horaire_ci, m.volume_horaire_td, m.volume_horaire_tp]
                    .reduce((s, v) => s + (+v || 0), 0);

/* Scroll : progression + retour en haut */
window.addEventListener('scroll', () => {
    const h   = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('back-top').classList.toggle('vis', h.scrollTop > 400);
}, { passive: true });

/* Menu mobile */
window.openMenu = () => {
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('nav-overlay').classList.add('open');
    document.getElementById('burger-btn').setAttribute('aria-expanded', 'true');
    document.getElementById('mobile-drawer').setAttribute('aria-hidden', 'false');
};
window.closeMenu = () => {
    document.getElementById('mobile-drawer').classList.remove('open');
    document.getElementById('nav-overlay').classList.remove('open');
    document.getElementById('burger-btn').setAttribute('aria-expanded', 'false');
    document.getElementById('mobile-drawer').setAttribute('aria-hidden', 'true');
};

/* Scroll spy */
function initScrollSpy() {
    const links = document.querySelectorAll('.desk-nav .nav-link');
    const ids   = ['presentation', 'objectifs', 'programme', 'localisation', 'contact'];
    const obs   = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(a => a.classList.remove('active'));
            const a = document.querySelector(`.desk-nav a[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}

/* Onglets description */
function initDescTabs() {
    const pairs = [
        ['btn-obj', 'tab-obj'],
        ['btn-deb', 'tab-deb'],
        ['btn-pou', 'tab-pou'],
    ];
    pairs.forEach(([btnId, panelId]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            pairs.forEach(([b, p]) => {
                document.getElementById(b).classList.remove('active');
                document.getElementById(b).setAttribute('aria-selected', 'false');
                document.getElementById(p).classList.add('hidden');
            });
            document.getElementById(btnId).classList.add('active');
            document.getElementById(btnId).setAttribute('aria-selected', 'true');
            document.getElementById(panelId).classList.remove('hidden');
        });
    });
}

/* Syllabus */
window.toggleSyl = btn => {
    const body = btn.nextElementSibling;
    const open = body.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? '- Masquer le syllabus' : '+ Voir le syllabus';
};

/* Rendu d'une matière */
function renderMatiere(m) {
    const total  = vol(m);
    const hasSyl = m.syllabus && txt(m.syllabus).length > 10;

    const chips = [
        m.ects        ? `<span class="badge badge-red">${m.ects} ECTS</span>` : '',
        m.coefmatiere ? `<span class="badge badge-orange">Coef. ${m.coefmatiere}</span>` : '',
    ].filter(Boolean).join('');

    const cols = [
        { l:'CM', v:+m.volume_horaire_cm||0 },
        { l:'CI', v:+m.volume_horaire_ci||0 },
        { l:'TD', v:+m.volume_horaire_td||0 },
        { l:'TP', v:+m.volume_horaire_tp||0 },
    ].filter(c => c.v > 0);

    const volTable = total > 0 ? `
        <table class="vol-table" aria-label="Volumes horaires">
            <thead><tr>${cols.map(c => `<th scope="col">${c.l}</th>`).join('')}<th scope="col">Total</th></tr></thead>
            <tbody><tr>${cols.map(c => `<td>${c.v}h</td>`).join('')}<td class="tot">${total}h</td></tr></tbody>
        </table>` : '';

    const resp = m.responsable
        ? `<p class="mat-resp">Responsable : <a href="mailto:${m.responsable}">${m.responsable}</a></p>` : '';

    const syllabus = hasSyl ? `
        <button class="syl-btn" onclick="toggleSyl(this)" aria-expanded="false">+ Voir le syllabus</button>
        <div class="syl-content" role="region" aria-label="Syllabus">${clean(m.syllabus)}</div>` : '';

    return `<article class="mat-item" data-name="${m.intituler_matiere.toLowerCase()}">
        <div class="mat-head">
            <h4 class="mat-name">${m.intituler_matiere}</h4>
            <div class="mat-chips">${chips}</div>
        </div>
        ${volTable}${resp}${syllabus}
    </article>`;
}

/* Rendu du détail d'une UE */
function renderDetail(ue) {
    const totalH   = (ue.matiere || []).reduce((s, m) => s + vol(m), 0);
    const matieres = (ue.matiere || []).map(renderMatiere).join('');
    const chips = [
        `<span class="badge badge-gray">${ue.typeUE}</span>`,
        `<span class="badge badge-blue">Coef. ${ue.coefue}</span>`,
        totalH ? `<span class="badge badge-gray">${totalH}h total</span>` : '',
        (ue.matiere||[]).length ? `<span class="badge badge-gray">${(ue.matiere||[]).length} matière(s)</span>` : '',
    ].filter(Boolean).join('');

    return `<section aria-label="Détail de l'UE">
        <div class="detail-hd">
            <h3 class="detail-title">${ue.descriptifUE}</h3>
            <div class="detail-chips">${chips}</div>
        </div>
        ${matieres || '<p style="color:var(--text2);font-size:13px">Aucune matière renseignée.</p>'}
    </section>`;
}

/* Sélection d'une UE */
let currentSemData = {};

function selectUE(btn, semId, ueIdx) {
    const ue = currentSemData[semId]?.[ueIdx];
    if (!ue) return;

    // Mise à jour visuelle
    document.querySelectorAll('.ue-row').forEach(r => r.classList.remove('active'));
    btn.classList.add('active');

    // Affichage du détail
    document.getElementById('prog-detail').innerHTML = renderDetail(ue);

    // Sur mobile, scroll vers le détail
    if (window.innerWidth <= 820) {
        document.getElementById('prog-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* Construction de la liste des UE pour un semestre */
function buildUEList(semId, ues) {
    currentSemData[semId] = ues;
    return ues.map((ue, i) => {
        const totalH = (ue.matiere || []).reduce((s, m) => s + vol(m), 0);
        const nb     = (ue.matiere || []).length;
        return `<div class="ue-row" role="listitem" tabindex="0"
                     data-sem="${semId}" data-idx="${i}"
                     onclick="selectUE(this,'${semId}',${i})"
                     onkeydown="if(event.key==='Enter'||event.key===' ')selectUE(this,'${semId}',${i})">
            <div class="ue-row-body">
                <div class="ue-row-title">${ue.descriptifUE}</div>
                <div class="ue-row-meta">${nb} matière(s) · ${totalH}h · Coef. ${ue.coefue}</div>
            </div>
            <span class="ue-row-arrow" aria-hidden="true"></span>
        </div>`;
    }).join('');
}

/* Changement de semestre */
function switchSem(btn, semId) {
    // Tabs
    document.querySelectorAll('.sem-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Contenu liste
    document.getElementById('prog-list').innerHTML = buildUEList(semId, currentSemData[semId]);

    // Reset détail
    document.getElementById('prog-detail').innerHTML =
        `<div class="detail-placeholder"><p>Sélectionnez une unité d'enseignement</p></div>`;

    // Reset recherche
    document.getElementById('search-mat').value = '';
    document.getElementById('no-results').style.display = 'none';
}

/* Recherche de matières (toutes UE de tous semestres) */
function initSearch() {
    document.getElementById('search-mat').addEventListener('input', function () {
        const q = this.value.toLowerCase().trim();
        if (!q) {
            document.getElementById('no-results').style.display = 'none';
            return;
        }

        // Cherche dans toutes les UE de tous les semestres
        let results = [];
        Object.entries(currentSemData).forEach(([semId, ues]) => {
            ues.forEach(ue => {
                const mats = (ue.matiere || []).filter(m =>
                    m.intituler_matiere.toLowerCase().includes(q)
                );
                if (mats.length) results.push({ semId, ue, mats });
            });
        });

        if (results.length === 0) {
            document.getElementById('prog-list').innerHTML =
                `<p style="padding:20px;font-size:13px;color:var(--text2)">Aucun résultat pour « ${q} »</p>`;
            document.getElementById('prog-detail').innerHTML =
                `<div class="detail-placeholder"><p>Aucune matière trouvée.</p></div>`;
            document.getElementById('no-results').style.display = 'none';
            // Désactive les onglets semestre
            document.querySelectorAll('.sem-btn').forEach(b => b.classList.remove('active'));
            return;
        }

        // Affiche les résultats sous forme de liste UE filtrée
        document.getElementById('prog-list').innerHTML = results.map((r, i) =>
            `<div class="ue-row" tabindex="0" role="listitem"
                  onclick="showSearchResult(${i})"
                  onkeydown="if(event.key==='Enter')showSearchResult(${i})">
                <div class="ue-row-body">
                    <div class="ue-row-title">${r.ue.descriptifUE}</div>
                    <div class="ue-row-meta">${r.mats.length} résultat(s) · ${r.ue.periode}</div>
                </div>
                <span class="ue-row-arrow" aria-hidden="true"></span>
             </div>`
        ).join('');

        // Stocke les résultats pour affichage du détail
        window._searchResults = results.map(r => ({ ue: r.ue, mats: r.mats }));
        document.querySelectorAll('.sem-btn').forEach(b => b.classList.remove('active'));

        // Affiche le premier résultat automatiquement
        showSearchResult(0);
        document.querySelectorAll('.ue-row')[0]?.classList.add('active');
    });
}

window.showSearchResult = idx => {
    const r = window._searchResults?.[idx];
    if (!r) return;
    document.querySelectorAll('.ue-row').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ue-row')[idx]?.classList.add('active');
    const matieres = r.mats.map(renderMatiere).join('');
    const chips = [`<span class="badge badge-gray">${r.ue.typeUE}</span>`,
                   `<span class="badge badge-blue">Coef. ${r.ue.coefue}</span>`].join('');
    document.getElementById('prog-detail').innerHTML = `
        <section>
            <div class="detail-hd">
                <h3 class="detail-title">${r.ue.descriptifUE}</h3>
                <div class="detail-chips">${chips}</div>
            </div>
            ${matieres}
        </section>`;
};

/* Carte Leaflet */
function initMap() {
    const lat = 16.2657, lng = -61.5387;
    const map = L.map('map', { scrollWheelZoom: false }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#00337a;border:3px solid #fff;box-shadow:0 0 0 2px #00337a;"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7], className: ''
    });
    L.marker([lat, lng], { icon })
     .addTo(map)
     .bindPopup('<strong>Université des Antilles</strong><br>Campus de Fouillole<br>97159 Pointe-à-Pitre')
     .openPopup();
}

/* Rendu principal */
function render(data) {
    const f = data.parametres.element;

    /* Hero */
    document.getElementById('hero-label').textContent    = `${f.typeformation} — ${f.modeformation}`;
    document.getElementById('hero-title').textContent    = f.intitule;
    document.getElementById('hero-parcours').textContent = f.parcours ? `Parcours : ${f.parcours}` : '';
    document.getElementById('hero-chips').innerHTML = [
        f.domaine          ? `<span class="chip">${f.domaine}</span>` : '',
        f.natureformation  ? `<span class="chip">${f.natureformation}</span>` : '',
        f.structureaccueil ? `<span class="chip">${f.structureaccueil}</span>` : '',
        f.apogee           ? `<span class="chip red">Apogée ${f.apogee}</span>` : '',
    ].join('');

    /* Stats */
    const ues    = f.ue || [];
    const semSet = new Set(ues.map(u => u.periode));
    const nbMat  = ues.reduce((s, u) => s + (u.matiere || []).length, 0);
    const nbEcts = ues.reduce((s, u) => s + (u.matiere || []).reduce((ss, m) => ss + (+m.ects || 0), 0), 0);
    document.getElementById('s-sem').textContent  = semSet.size;
    document.getElementById('s-ue').textContent   = ues.length;
    document.getElementById('s-mat').textContent  = nbMat;
    document.getElementById('s-ects').textContent = Math.round(nbEcts);
    document.getElementById('s-mode').textContent = f.modeformation || '—';

    /* Présentation */
    document.querySelector('#h-presentation').textContent = f.intitule;
    document.getElementById('pres-objectif').innerHTML    = clean(f.objectif) || '<p>Voir onglet Objectifs.</p>';

    /* Fiche */
    const fiches = [
        ['Type de diplôme', f.typeformation],
        ['Parcours',        f.parcours],
        ['Domaine',         f.domaine],
        ['Composante',      f.structureaccueil],
        ['Mode',            f.modeformation],
        ['Nature',          f.natureformation],
        ['Lieu',            txt(f.lieu)],
        ['Code Apogée',     f.apogee],
    ].filter(r => r[1]);
    document.getElementById('fiche-dl').innerHTML = fiches.map(([k, v]) =>
        `<div class="row"><dt>${k}</dt><dd>${v}</dd></div>`
    ).join('');

    /* Onglets description */
    document.getElementById('content-obj').innerHTML = clean(f.objectif)  || '<p><em>Non renseigné.</em></p>';
    document.getElementById('content-deb').innerHTML = clean(f.debouche)  || '<p><em>Non renseigné.</em></p>';
    document.getElementById('content-pou').innerHTML = clean(f.poursuite) || '<p><em>Non renseigné.</em></p>';
    initDescTabs();

    /* Programme */
    const semMap = new Map();
    ues.forEach(ue => {
        if (!semMap.has(ue.periode)) semMap.set(ue.periode, { id: +ue.idperiode, ues: [] });
        semMap.get(ue.periode).ues.push(ue);
    });
    const sems = [...semMap.entries()].sort((a, b) => a[1].id - b[1].id);

    const semTabsEl = document.getElementById('sem-tabs');
    sems.forEach(([label, { ues: semUes }], i) => {
        const semId = `sem-${i}`;
        currentSemData[semId] = semUes;

        const btn = document.createElement('button');
        btn.className   = `sem-btn${i === 0 ? ' active' : ''}`;
        btn.textContent = label.replace(/semestre\s*/i, 'Sem. ');
        btn.setAttribute('role', 'tab');
        btn.onclick = () => switchSem(btn, semId);
        semTabsEl.appendChild(btn);
    });

    // Affiche le premier semestre
    if (sems.length > 0) {
        const firstId = 'sem-0';
        document.getElementById('prog-list').innerHTML = buildUEList(firstId, currentSemData[firstId]);
    }

    initSearch();

    /* Localisation */
    document.getElementById('campus-address').innerHTML =
        txt(f.lieu).split('\n').filter(Boolean).join('<br>');
    initMap();

    /* Contact */
    const contacts = [
        { label: 'Responsable pédagogique', value: f.responsable
            ? `<a href="mailto:${f.responsable}">${f.responsable}</a>` : '—' },
        { label: 'Localisation',            value: txt(f.lieu).split('\n').filter(Boolean).join('<br>') },
        { label: 'Code Apogée',             value: f.apogee || '—' },
        { label: 'Structure d\'accueil',    value: f.structureaccueil || '—' },
        { label: 'Type de formation',       value: `${f.typeformation}${f.natureformation ? ' — ' + f.natureformation : ''}` },
        { label: 'Mode de formation',       value: f.modeformation || '—' },
    ];
    document.getElementById('contact-grid').innerHTML = contacts.map(c =>
        `<div class="contact-card" role="listitem">
            <div class="c-label">${c.label}</div>
            <div class="c-val">${c.value}</div>
        </div>`
    ).join('');

    /* Affichage */
    document.getElementById('loader').style.display = 'none';
    document.getElementById('page').style.display   = '';
    initScrollSpy();
}

/* Fetch */
fetch('https://formations.univ-antilles.fr/api/?formation=45')
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(render)
    .catch(err => {
        document.getElementById('loader').innerHTML = `
        <div style="max-width:340px;text-align:center;padding:32px">
            <div style="font-size:1rem;font-weight:700;color:#e8311a;margin-bottom:12px">Erreur</div>
            <div style="font-weight:700;color:#00337a;font-size:1.05rem;margin-bottom:8px">Données inaccessibles</div>
            <div style="color:#4b5563;font-size:13px">${err.message}</div>
        </div>`;
    });
