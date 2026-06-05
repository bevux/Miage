/* ═══════════════════════════════════════════════════
   MASTER MIAGE — Université des Antilles
   JavaScript principal
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── Utilitaires ── */
const clean = h => h ? h.replace(/<!--block-->/g, '').trim() : '';
const txt   = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return d.textContent.trim(); };
const vol   = m => (+m.volume_horaire_cm||0) + (+m.volume_horaire_ci||0) + (+m.volume_horaire_td||0) + (+m.volume_horaire_tp||0);

/* ── Barre de progression & bouton retour ── */
window.addEventListener('scroll', () => {
    const h   = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('back-top').classList.toggle('visible', h.scrollTop > 400);
});

/* ── Scroll spy ── */
function initScrollSpy() {
    const ids  = ['presentation', 'objectifs', 'programme', 'localisation', 'contact'];
    const obs  = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            document.querySelectorAll('#header-nav a').forEach(a => a.classList.remove('active'));
            const link = document.querySelector(`#header-nav a[href="#${e.target.id}"]`);
            if (link) link.classList.add('active');
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}

/* ── Onglets description ── */
function initDescTabs() {
    document.querySelectorAll('#desc-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#desc-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ['tab-obj', 'tab-deb', 'tab-pou'].forEach(id => {
                document.getElementById(id).style.display = id === btn.dataset.target ? '' : 'none';
            });
        });
    });
}

/* ── Rendu d'une matière ── */
function renderMatiere(m) {
    const total  = vol(m);
    const hasSyl = m.syllabus && txt(m.syllabus).length > 10;

    const tags = [
        m.ects        ? `<span class="badge badge-red">${m.ects} ECTS</span>` : '',
        m.coefmatiere ? `<span class="badge badge-orange">Coef. ${m.coefmatiere}</span>` : '',
    ].filter(Boolean).join('');

    const vols = [
        { l:'CM', v:+m.volume_horaire_cm||0 },
        { l:'CI', v:+m.volume_horaire_ci||0 },
        { l:'TD', v:+m.volume_horaire_td||0 },
        { l:'TP', v:+m.volume_horaire_tp||0 },
    ].filter(x => x.v > 0);

    const volTable = total > 0 ? `
        <table class="vol-table">
            <tr>${vols.map(v => `<th>${v.l}</th>`).join('')}<th>Total</th></tr>
            <tr>${vols.map(v => `<td>${v.v}h</td>`).join('')}<td class="total">${total}h</td></tr>
        </table>` : '';

    const resp = m.responsable
        ? `<div class="mat-resp">Responsable : <a href="mailto:${m.responsable}">${m.responsable}</a></div>`
        : '';

    const syllabus = hasSyl ? `
        <button class="syl-btn" onclick="toggleSyl(this)">▾ Voir le syllabus</button>
        <div class="syl-body">${clean(m.syllabus)}</div>` : '';

    return `<div class="mat-item" data-name="${m.intituler_matiere.toLowerCase()}">
        <div class="mat-head">
            <div class="mat-name">${m.intituler_matiere}</div>
            <div class="mat-tags">${tags}</div>
        </div>
        ${volTable}${resp}${syllabus}
    </div>`;
}

/* ── Rendu d'une UE ── */
function renderUE(ue, uid) {
    const totalH   = (ue.matiere || []).reduce((s, m) => s + vol(m), 0);
    const matieres = (ue.matiere || []).map(renderMatiere).join('');

    const meta = [
        `<span class="badge badge-gray">${ue.typeUE}</span>`,
        `<span class="badge">Coef. ${ue.coefue}</span>`,
        totalH ? `<span class="badge badge-gray">${totalH}h</span>` : '',
    ].filter(Boolean).join('');

    return `<div class="ue-item" data-uid="${uid}">
        <div class="ue-head" onclick="toggleUE(this,'${uid}')">
            <div class="ue-title">${ue.descriptifUE}</div>
            <div class="ue-meta">${meta}</div>
            <div class="ue-arrow">▼</div>
        </div>
        <div class="ue-body" id="${uid}">
            ${matieres || '<p style="color:#6b7280;font-size:13px;padding:4px 0">Aucune matière renseignée.</p>'}
        </div>
    </div>`;
}

/* ── Toggles ── */
function toggleUE(head, uid) {
    const body   = document.getElementById(uid);
    const isOpen = body.classList.toggle('open');
    head.classList.toggle('open', isOpen);
    head.querySelector('.ue-arrow').classList.toggle('open', isOpen);
}
function toggleSyl(btn) {
    const open = btn.nextElementSibling.classList.toggle('open');
    btn.textContent = open ? '▴ Masquer le syllabus' : '▾ Voir le syllabus';
}

/* ── Changement de semestre ── */
function switchSem(btn, targetId) {
    document.querySelectorAll('#sem-tabs .sem-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#sem-panels > div').forEach(p => p.style.display = 'none');
    btn.classList.add('active');
    document.getElementById(targetId).style.display = '';
    // Réinitialise la recherche
    document.getElementById('search-mat').value = '';
    document.querySelectorAll('.mat-item').forEach(m => m.style.display = '');
    document.querySelectorAll('.ue-item').forEach(u => u.style.display = '');
    document.getElementById('no-results').style.display = 'none';
}

/* ── Recherche de matières ── */
function initSearch() {
    document.getElementById('search-mat').addEventListener('input', function () {
        const q = this.value.toLowerCase().trim();
        let found = 0;

        document.querySelectorAll('.mat-item').forEach(m => {
            const match = !q || m.dataset.name.includes(q);
            m.style.display = match ? '' : 'none';
            if (match) found++;
        });

        document.querySelectorAll('.ue-item').forEach(ue => {
            const visibles = ue.querySelectorAll('.mat-item:not([style*="none"])').length;
            ue.style.display = (!q || visibles > 0) ? '' : 'none';
            if (q && visibles > 0) {
                const uid = ue.dataset.uid;
                document.getElementById(uid)?.classList.add('open');
                ue.querySelector('.ue-head')?.classList.add('open');
                ue.querySelector('.ue-arrow')?.classList.add('open');
            }
        });

        // Affiche tous les panneaux si recherche active
        if (q) {
            document.querySelectorAll('#sem-panels > div').forEach(p => p.style.display = '');
            document.querySelectorAll('#sem-tabs .sem-btn').forEach(b => b.classList.remove('active'));
        }

        document.getElementById('no-results').style.display = (q && found === 0) ? 'block' : 'none';
    });
}

/* ── Carte Leaflet ── */
function initMap() {
    const lat = 16.2657, lng = -61.5387;
    const map = L.map('map', { scrollWheelZoom: false }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    const icon = L.divIcon({
        html: `<div style="
            width:14px;height:14px;
            background:#00337a;
            border:3px solid #fff;
            box-shadow:0 0 0 2px #00337a;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: ''
    });

    L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup('<strong>Université des Antilles</strong><br>Campus de Fouillole<br>97159 Pointe-à-Pitre')
        .openPopup();
}

/* ── Rendu principal ── */
function render(data) {
    const f = data.parametres.element;

    /* ─ Hero ─ */
    document.getElementById('hero-eyebrow').textContent  = `${f.typeformation} — ${f.modeformation}`;
    document.getElementById('hero-title').textContent    = f.intitule;
    document.getElementById('hero-parcours').textContent = f.parcours ? `Parcours : ${f.parcours}` : '';
    document.getElementById('hero-tags').innerHTML = [
        f.domaine          ? `<span class="hero-tag">${f.domaine}</span>` : '',
        f.natureformation  ? `<span class="hero-tag">${f.natureformation}</span>` : '',
        f.structureaccueil ? `<span class="hero-tag">${f.structureaccueil}</span>` : '',
        f.apogee           ? `<span class="hero-tag accent">Apogée ${f.apogee}</span>` : '',
    ].join('');

    /* ─ Stats ─ */
    const ues     = f.ue || [];
    const semSet  = new Set(ues.map(u => u.periode));
    const nbMat   = ues.reduce((s, u) => s + (u.matiere || []).length, 0);
    const nbEcts  = ues.reduce((s, u) => s + (u.matiere || []).reduce((ss, m) => ss + (+m.ects || 0), 0), 0);
    document.getElementById('s-sem').textContent  = semSet.size;
    document.getElementById('s-ue').textContent   = ues.length;
    document.getElementById('s-mat').textContent  = nbMat;
    document.getElementById('s-ects').textContent = Math.round(nbEcts);
    document.getElementById('s-mode').textContent = f.modeformation || '—';

    /* ─ Présentation ─ */
    document.getElementById('pres-title').textContent   = f.intitule;
    document.getElementById('pres-objectif').innerHTML  = clean(f.objectif) || '<p>Voir onglet Objectifs.</p>';

    /* ─ Fiche ─ */
    const rows = [
        ['Type de diplôme', f.typeformation],
        ['Parcours',        f.parcours],
        ['Domaine',         f.domaine],
        ['Composante',      f.structureaccueil],
        ['Mode',            f.modeformation],
        ['Nature',          f.natureformation],
        ['Lieu',            txt(f.lieu)],
        ['Code Apogée',     f.apogee],
    ].filter(r => r[1]);
    document.getElementById('fiche-rows').innerHTML = rows.map(([k, v]) =>
        `<div class="fiche-row">
            <div class="fiche-key">${k}</div>
            <div class="fiche-val">${v}</div>
        </div>`
    ).join('');

    /* ─ Onglets description ─ */
    document.getElementById('tab-obj').innerHTML = clean(f.objectif)  || '<p><em>Non renseigné.</em></p>';
    document.getElementById('tab-deb').innerHTML = clean(f.debouche)  || '<p><em>Non renseigné.</em></p>';
    document.getElementById('tab-pou').innerHTML = clean(f.poursuite) || '<p><em>Non renseigné.</em></p>';
    initDescTabs();

    /* ─ Programme ─ */
    const semMap = new Map();
    ues.forEach(ue => {
        if (!semMap.has(ue.periode)) semMap.set(ue.periode, { id: +ue.idperiode, ues: [] });
        semMap.get(ue.periode).ues.push(ue);
    });
    const sems = [...semMap.entries()].sort((a, b) => a[1].id - b[1].id);

    const semTabsEl   = document.getElementById('sem-tabs');
    const semPanelsEl = document.getElementById('sem-panels');

    sems.forEach(([label, { ues: semUes }], i) => {
        const pid   = `sp-${i}`;
        const short = label.replace(/semestre\s*/i, 'Sem. ');

        const btn = document.createElement('button');
        btn.className = `sem-btn${i === 0 ? ' active' : ''}`;
        btn.textContent = short;
        btn.onclick = () => switchSem(btn, pid);
        semTabsEl.appendChild(btn);

        const panel = document.createElement('div');
        panel.id        = pid;
        panel.style.display = i === 0 ? '' : 'none';
        panel.style.border  = '1px solid var(--border)';
        panel.style.borderTop = 'none';
        panel.innerHTML = semUes.map((ue, j) => renderUE(ue, `ue-${i}-${j}`)).join('');
        semPanelsEl.appendChild(panel);
    });

    initSearch();

    /* ─ Localisation ─ */
    document.getElementById('map-adresse').innerHTML =
        txt(f.lieu).split('\n').filter(Boolean).join('<br>');
    initMap();

    /* ─ Contact ─ */
    const cards = [
        { label: 'Responsable pédagogique', value: f.responsable
            ? `<a href="mailto:${f.responsable}">${f.responsable}</a>` : '—' },
        { label: 'Localisation',            value: txt(f.lieu).split('\n').filter(Boolean).join('<br>') },
        { label: 'Code Apogée',             value: f.apogee || '—' },
        { label: 'Structure d\'accueil',    value: f.structureaccueil || '—' },
        { label: 'Type de formation',       value: `${f.typeformation}${f.natureformation ? ' — ' + f.natureformation : ''}` },
        { label: 'Mode de formation',       value: f.modeformation || '—' },
    ];
    document.getElementById('contact-grid').innerHTML = cards.map(c =>
        `<div class="contact-card">
            <div class="contact-card-top"></div>
            <div class="contact-label">${c.label}</div>
            <div class="contact-val">${c.value}</div>
        </div>`
    ).join('');

    /* ─ Affichage ─ */
    document.getElementById('loader').style.display = 'none';
    document.getElementById('page').style.display   = '';
    initScrollSpy();
}

/* ── Fetch API ── */
fetch('https://formations.univ-antilles.fr/api/?formation=45')
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(render)
    .catch(err => {
        document.getElementById('loader').innerHTML = `
        <div style="max-width:360px;text-align:center;padding:32px">
            <div style="font-size:2rem;margin-bottom:12px;color:#e8311a">✕</div>
            <div style="font-weight:700;color:#00337a;font-size:1.1rem;margin-bottom:8px">Données inaccessibles</div>
            <div style="color:#6b7280;font-size:13px">${err.message}</div>
        </div>`;
    });
