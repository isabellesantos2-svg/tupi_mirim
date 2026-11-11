const $ = id => document.getElementById(id); let soundOn = true;
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); $(id).classList.add('active'); scrollTo(0, 0) }
function go(v) { ['dash', 'profile', 'lessons', 'games'].forEach(k => { $('v-' + k).classList.toggle('d-none', k !== v); $('m-' + k).classList.toggle('active', k === v) }); scrollTo(0, 0) }
function login() {
    const u = $('u'), p = $('p'), e = $('err');
    e.classList.add('d-none'); u.classList.remove('is-invalid'); p.classList.remove('is-invalid');
    const uv = u.value.trim();
    const fail = m => { $('errt').textContent = m; e.classList.remove('d-none') };
    if (!uv || !p.value) { fail('Preencha o usuário e a senha para entrar.'); if (!uv) u.classList.add('is-invalid'); if (!p.value) p.classList.add('is-invalid'); return }
    if (uv.toLowerCase() !== 'kurumim' || p.value !== 'tupi123') { fail('Usuário ou senha incorretos. Tente de novo!'); u.classList.add('is-invalid'); p.classList.add('is-invalid'); return }
    $('nm').textContent = uv[0].toUpperCase() + uv.slice(1);
    go('dash'); show('s-app'); toast('Bem-vindo de volta! 🐆');
}
function logout() { $('u').value = ''; $('p').value = ''; $('err').classList.add('d-none'); show('s-login') }
document.addEventListener('keydown', e => { if (e.key === 'Enter' && $('s-login').classList.contains('active')) login() });
function toast(m) { $('toastmsg').textContent = m; bootstrap.Toast.getOrCreateInstance($('toast'), { delay: 2300 }).show() }
function speak(t) { if (!soundOn || !window.speechSynthesis) return; const s = new SpeechSynthesisUtterance(t); s.lang = 'pt-BR'; s.rate = .8; speechSynthesis.cancel(); speechSynthesis.speak(s) }
function say(a, b) { toast('🔊 ' + a + ' — ' + b); speak(a + '. Significa ' + b) }
document.querySelectorAll('.pcard').forEach(c => c.addEventListener('keydown', e => { if (e.key === 'Enter') c.click() }));

/* ===== LIÇÕES ===== */
const LESSONS = [
    { t: 'Y — Água', e: '🌊', d: 'Os rios e igarapés da Amazônia', w: [['Y', 'Água', '💧'], ['Amana', 'Chuva', '🌧️'], ['Pará', 'Rio grande', '🏞️']] },
    { t: 'Ka’a — Floresta', e: '🌳', d: 'As árvores e a mata', w: [['Ka’a', 'Floresta', '🌳'], ['Ybyrá', 'Árvore', '🌴'], ['Yby', 'Terra', '🌎'], ['Tatá', 'Fogo', '🔥']] },
    { t: 'Pirá — Peixe', e: '🐟', d: 'Os animais do rio e da mata', w: [['Pirá', 'Peixe', '🐟'], ['Jaguara', 'Onça', '🐆'], ['Guyrá', 'Pássaro', '🦜'], ['Mbói', 'Cobra', '🐍']] },
    { t: 'Kwarahy — Céu', e: '☀️', d: 'O sol, a lua e o tempo', w: [['Kwarahy', 'Sol', '☀️'], ['Yasy', 'Lua', '🌙'], ['Ara', 'Dia', '🌤️']] },
    { t: 'Kunumĩ — Gente', e: '👦', d: 'As pessoas e a casa', w: [['Kunumĩ', 'Menino', '👦'], ['Kunhã', 'Menina', '👧'], ['Abá', 'Homem', '🧑'], ['Oka', 'Casa', '🏠']] }
];
const ALL = LESSONS.flatMap(L => L.w);
let pts = 240, prog = [80, 40, 0, 0, 0], cur = 0, idx = 0, shown = false;
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a };
function addPts(n) { pts += n; $('pts').textContent = pts }
function lcard(i) {
    const L = LESSONS[i], c = ['c-pink', 'c-blue', 'c-yellow'][i % 3], p = prog[i];
    return `<div class="col"><div class="card pcard ${c} p-4 h-100" tabindex="0" onkeydown="if(event.key==='Enter')this.click()" onclick="openLesson(${i})"><div class="display-3">${L.e}</div><h3>${L.t}</h3><p>${L.d}</p><div class="progress"><div class="progress-bar" style="width:${p}%"></div></div><p class="mt-2 mb-0">${p === 0 ? 'Novo!' : p + '%' + (p === 100 ? ' ✓ Completa' : '')}</p></div></div>`
}
function renderLessons() { $('lessonGrid').innerHTML = LESSONS.map((_, i) => lcard(i)).join(''); $('dashLessons').innerHTML = [0, 1, 2].map(lcard).join('') }
function openLesson(i) { cur = i; idx = 0; showCard(); bootstrap.Modal.getOrCreateInstance($('lessonModal')).show() }
function showCard() {
    const L = LESSONS[cur], w = L.w[idx]; shown = false;
    $('lmTitle').textContent = L.t; $('fEmoji').textContent = w[2]; $('fText').textContent = w[0]; $('fHint').textContent = 'Toque no cartão para ver o significado';
    $('lmBar').style.width = ((idx + 1) / L.w.length * 100) + '%';
    $('prevB').disabled = idx === 0; $('nextB').textContent = idx === L.w.length - 1 ? 'Concluir ✓' : 'Próxima →'
}
function flip() { const w = LESSONS[cur].w[idx]; shown = !shown; $('fText').textContent = shown ? w[1] : w[0]; $('fHint').textContent = shown ? 'Toque para voltar ao Tupi' : 'Toque no cartão para ver o significado' }
function speakCard() { const w = LESSONS[cur].w[idx]; speak(shown ? w[1] : w[0]) }
function step(d) { const L = LESSONS[cur]; if (d > 0 && idx === L.w.length - 1) return finish(); idx += d; showCard() }
function finish() {
    bootstrap.Modal.getInstance($('lessonModal')).hide();
    if (prog[cur] < 100) { prog[cur] = 100; addPts(20); toast('Lição completa! +20 pontos 🎉') } else toast('Lição revisada! 👏'); renderLessons()
}

/* ===== JOGOS ===== */
function area(h, sc) { const a = $('gameArea'); a.classList.remove('d-none'); a.innerHTML = h; if (sc) a.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

// Jogo da memória
let mem = {};
function startMemory() {
    const w = shuffle(ALL).slice(0, 6);
    mem = { cards: shuffle(w.flatMap((x, i) => [{ id: i, t: x[0], k: 'tupi' }, { id: i, t: x[1], k: 'pt' }])), open: [], done: 0, moves: 0, lock: false }; drawMem(true)
}
function drawMem(sc) {
    area(`<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"><h3 class="mb-0">🧠 Jogo da Memória</h3><span class="fw-bold">Jogadas: ${mem.moves} · Pares: ${mem.done}/6</span></div>
 <div class="row row-cols-3 row-cols-md-4 g-3">${mem.cards.map((c, i) => `<div class="col"><button class="mcard ${c.show ? 'show ' + c.k : ''} ${c.ok ? 'ok' : ''}" onclick="flipMem(${i})" aria-label="${c.show ? c.t : 'Carta virada para baixo'}">${c.show ? c.t : '❓'}</button></div>`).join('')}</div>
 <div class="text-center mt-4"><button class="btn btn-tm-g" onclick="startMemory()">Embaralhar de novo</button></div>`, sc)
}
function flipMem(i) {
    const c = mem.cards[i]; if (mem.lock || c.show) return; c.show = true; mem.open.push(i);
    if (mem.open.length < 2) return drawMem();
    mem.moves++; const [a, b] = mem.open.map(k => mem.cards[k]);
    if (a.id === b.id) {
        a.ok = b.ok = true; mem.done++; mem.open = []; drawMem();
        if (mem.done === 6) { addPts(30); toast('Parabéns! Achou todos os pares! +30 pontos 🎉') }
    }
    else { mem.lock = true; drawMem(); setTimeout(() => { a.show = b.show = false; mem.open = []; mem.lock = false; drawMem() }, 1000) }
}

// Quiz
let qz = {};
function startQuiz() { qz = { q: shuffle(ALL).slice(0, 5), i: 0, s: 0 }; newQ(true) }
function newQ(sc) {
    if (qz.i >= qz.q.length) return endQ(); const w = qz.q[qz.i];
    qz.opts = shuffle([w[1], ...shuffle(ALL.filter(x => x[1] !== w[1])).slice(0, 3).map(x => x[1])]); qz.pick = null; drawQ(sc)
}
function drawQ(sc) {
    const w = qz.q[qz.i], ok = qz.pick === w[1];
    area(`<div class="d-flex justify-content-between mb-3"><h3 class="mb-0">❓ Quiz do Tupi</h3><span class="fw-bold">Pergunta ${qz.i + 1}/${qz.q.length}</span></div>
 <div class="text-center my-4"><div class="display-1">${w[2]}</div><div class="display-5 fw-bold" style="color:var(--navy)">${w[0]}</div><p>O que significa essa palavra em Tupi?</p><button class="btn btn-tm-b btn-sm" onclick="speak(qz.q[qz.i][0])" aria-label="Ouvir a palavra">🔊 Ouvir</button></div>
 <div class="row row-cols-1 row-cols-md-2 g-3">${qz.opts.map(o => {
        let c = 'btn-tm-g'; if (qz.pick !== null) { if (o === w[1]) c = 'btn-success'; else if (o === qz.pick) c = 'btn-danger' }
        return `<div class="col"><button class="btn ${c} w-100" ${qz.pick !== null ? 'disabled' : ''} data-o="${o}" onclick="answer(this.dataset.o)">${o}</button></div>`
    }).join('')}</div>
 ${qz.pick !== null ? `<div class="alert ${ok ? 'alert-success' : 'alert-danger'} mt-4 fw-bold d-flex justify-content-between align-items-center flex-wrap gap-2" role="alert"><span>${ok ? '✅ Muito bem!' : '❌ Quase! A resposta certa é “' + w[1] + '”.'}</span><button class="btn btn-tm-y btn-sm" onclick="qz.i++;newQ()">Próxima →</button></div>` : ''}`, sc)
}
function answer(o) { if (qz.pick !== null) return; qz.pick = o; if (o === qz.q[qz.i][1]) qz.s++; drawQ() }
function endQ() {
    const g = qz.s; addPts(g * 5);
    area(`<div class="text-center"><div class="display-1">${g >= 4 ? '🏆' : g >= 2 ? '👏' : '💪'}</div><h3>Você acertou ${g} de ${qz.q.length}!</h3><p>+${g * 5} pontos</p><button class="btn btn-tm-y" onclick="startQuiz()">Jogar de novo</button></div>`)
}

renderLessons();
