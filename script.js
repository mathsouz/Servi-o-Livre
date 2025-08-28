// Catálogo de serviços (mock)
const servicos = [
  { nome: "Aula de Violão", descricao: "Professor particular de violão", categoria: "Educação", preco: 50, imagem: "img/violao.jpg", oferta: true },
  { nome: "Manutenção de Computadores", descricao: "Formatação e upgrades", categoria: "Tecnologia", preco: 120, imagem: "img/pc.jpg" },
  { nome: "Corte de Cabelo", descricao: "Barbeiro profissional", categoria: "Beleza", preco: 40, imagem: "img/cabelo.jpg", oferta: false },
  { nome: "Limpeza Residencial", descricao: "Faxina completa", categoria: "Casa", preco: 100, imagem: "img/limpeza.jpg" },
  // Itens extras para demonstrar grid e pagina cheia
  { nome: "Aula de Inglês", descricao: "Conversação e gramática", categoria: "Educação", preco: 80, imagem: "img/ingles.jpg" },
  { nome: "Design de Logo", descricao: "Criação de identidade visual", categoria: "Tecnologia", preco: 250, imagem: "img/logo.webp" },
  { nome: "Manicure e Pedicure", descricao: "Atendimento domiciliar", categoria: "Beleza", preco: 60, imagem: "img/manicure.webp" },
  { nome: "Montagem de Móveis", descricao: "Montagem rápida e segura", categoria: "Casa", preco: 150, imagem: "img/moveis.jpeg", oferta: true },
];

// Estado e elementos
let termoBusca = "";
let categoriaAtiva = "Todas";
let ordenacao = "relevancia";
let somenteOfertas = false;

const cardsGrid = document.getElementById('cardsGrid');
const resultsCount = document.getElementById('resultsCount');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryList = document.getElementById('categoryList');
const sortSelect = document.getElementById('sortSelect');
const filterToggle = document.getElementById('filterToggle');
const filtersAside = document.getElementById('filters');
const clearFilters = document.getElementById('clearFilters');
const qlOfertas = document.getElementById('qlOfertas');
const qlAjuda = document.getElementById('qlAjuda');
const helpModal = document.getElementById('helpModal');
const helpBackdrop = document.getElementById('helpBackdrop');
const helpClose = document.getElementById('helpClose');
const qlConta = document.getElementById('qlConta');
const loginModal = document.getElementById('loginModal');
const loginBackdrop = document.getElementById('loginBackdrop');
const loginClose = document.getElementById('loginClose');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginSenha = document.getElementById('loginSenha');

// Utils
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterCategorias() {
  const set = new Set(["Todas", ...servicos.map(s => s.categoria)]);
  return Array.from(set);
}

function getCategoryColor(categoria) {
  switch (categoria) {
    case 'Educação': return '#E0F2FE';
    case 'Tecnologia': return '#EDE9FE';
    case 'Beleza': return '#FFE4E6';
    case 'Casa': return '#ECFCCB';
    default: return '#F5F5F5';
  }
}

function gerarPlaceholderSVG(servico) {
  const bg = getCategoryColor(servico.categoria);
  const title = (servico?.nome || 'Serviço').slice(0, 22);
  const cat = servico?.categoria || '';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <g fill="#3483fa" font-family="Inter, Arial, sans-serif" text-anchor="middle">
      <text x="400" y="290" font-size="28" font-weight="700">${title}</text>
      <text x="400" y="330" font-size="18" font-weight="600">${cat}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function aplicarOrdenacao(lista) {
  const arr = [...lista];
  switch (ordenacao) {
    case 'preco-asc':
      return arr.sort((a, b) => a.preco - b.preco);
    case 'preco-desc':
      return arr.sort((a, b) => b.preco - a.preco);
    case 'nome-asc':
      return arr.sort((a, b) => a.nome.localeCompare(b.nome));
    case 'nome-desc':
      return arr.sort((a, b) => b.nome.localeCompare(a.nome));
    default:
      return arr; // relevância: sem ordenação específica
  }
}

function filtrarServicos() {
  const termo = termoBusca.trim().toLowerCase();
  let lista = servicos.filter(s => {
    const bateBusca = !termo || s.nome.toLowerCase().includes(termo);
    const bateCategoria = categoriaAtiva === 'Todas' || s.categoria === categoriaAtiva;
    const bateOferta = !somenteOfertas || !!s.oferta;
    return bateBusca && bateCategoria && bateOferta;
  });
  lista = aplicarOrdenacao(lista);
  return lista;
}

function criarCard(servico) {
  const card = document.createElement('article');
  card.className = 'card';

  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  const img = document.createElement('img');
  img.alt = servico.nome;
  img.loading = 'lazy';
  const placeholderUrl = gerarPlaceholderSVG(servico);
  img.src = servico.imagem || placeholderUrl;
  img.onerror = () => {
    img.onerror = null;
    img.src = placeholderUrl;
  };
  thumb.appendChild(img);

  const content = document.createElement('div');
  content.className = 'content';

  if (servico.oferta) {
    const oferta = document.createElement('span');
    oferta.className = 'chip';
    oferta.textContent = 'Oferta';
    content.appendChild(oferta);
  }

  const price = document.createElement('div');
  price.className = 'price';
  price.textContent = formatarPreco(servico.preco);

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = servico.nome;

  const desc = document.createElement('div');
  desc.className = 'desc';
  desc.textContent = servico.descricao;

  const cat = document.createElement('span');
  cat.className = 'chip';
  cat.textContent = servico.categoria;

  content.appendChild(price);
  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(cat);

  card.appendChild(thumb);
  card.appendChild(content);
  return card;
}

function render() {
  const lista = filtrarServicos();
  cardsGrid.innerHTML = '';
  lista.forEach(s => cardsGrid.appendChild(criarCard(s)));
  resultsCount.textContent = `${lista.length} resultado${lista.length !== 1 ? 's' : ''}`;
}

function popularCategorias() {
  const categorias = obterCategorias();
  categoryList.innerHTML = '';
  categorias.forEach(cat => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.setAttribute('type', 'button');
    if (cat === categoriaAtiva) btn.classList.add('active');
    btn.addEventListener('click', () => {
      categoriaAtiva = cat;
      Array.from(categoryList.querySelectorAll('button')).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
    li.appendChild(btn);
    categoryList.appendChild(li);
  });
}

// Eventos
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  termoBusca = searchInput.value;
  render();
});

searchInput.addEventListener('input', (e) => {
  termoBusca = e.target.value;
  render();
});

sortSelect.addEventListener('change', (e) => {
  ordenacao = e.target.value;
  render();
});

filterToggle.addEventListener('click', () => {
  const isOpen = filtersAside.classList.toggle('open');
  filterToggle.setAttribute('aria-expanded', String(isOpen));
});

if (clearFilters) {
  clearFilters.addEventListener('click', () => {
    // Resetar estado
    termoBusca = "";
    categoriaAtiva = "Todas";
    ordenacao = "relevancia";
    somenteOfertas = false;
    // UI
    searchInput.value = "";
    sortSelect.value = "relevancia";
    const btnOfertas = document.getElementById('qlOfertas');
    if (btnOfertas) btnOfertas.setAttribute('aria-pressed', 'false');
    // Reset categorias ativas visualmente
    popularCategorias();
    render();
  });
}

// Quick links

if (qlOfertas) {
  qlOfertas.addEventListener('click', (e) => {
    e.preventDefault();
    const pressed = qlOfertas.getAttribute('aria-pressed') === 'true';
    somenteOfertas = !pressed;
    qlOfertas.setAttribute('aria-pressed', String(somenteOfertas));
    render();
  });
}

function abrirAjuda() {
  if (!helpModal) return;
  helpModal.hidden = false;
}

function fecharAjuda() {
  if (!helpModal) return;
  helpModal.hidden = true;
}

if (qlAjuda) {
  qlAjuda.addEventListener('click', (e) => {
    e.preventDefault();
    abrirAjuda();
  });
}
if (helpBackdrop) helpBackdrop.addEventListener('click', fecharAjuda);
if (helpClose) helpClose.addEventListener('click', fecharAjuda);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharAjuda();
});

// Login fictício
function abrirLogin() { if (loginModal) loginModal.hidden = false; }
function fecharLogin() { if (loginModal) loginModal.hidden = true; }

if (qlConta) {
  qlConta.addEventListener('click', (e) => {
    e.preventDefault();
    const isLogged = localStorage.getItem('sl_user');
    if (isLogged) {
      // Logout rápido
      localStorage.removeItem('sl_user');
      qlConta.textContent = '👤 Conta';
      alert('Você saiu da conta.');
    } else {
      abrirLogin();
    }
  });
}
if (loginBackdrop) loginBackdrop.addEventListener('click', fecharLogin);
if (loginClose) loginClose.addEventListener('click', fecharLogin);
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail?.value?.trim();
    const senha = loginSenha?.value?.trim();
    if (!email || !senha) return;
    // Simula sucesso
    const usuario = { email, nome: email.split('@')[0] };
    localStorage.setItem('sl_user', JSON.stringify(usuario));
    qlConta.textContent = `Olá, ${usuario.nome}`;
    fecharLogin();
  });
}

// Restaurar estado de conta ao carregar
try {
  const saved = localStorage.getItem('sl_user');
  if (saved) {
    const u = JSON.parse(saved);
    if (u?.nome && qlConta) qlConta.textContent = `Olá, ${u.nome}`;
  }
} catch {}

// Inicialização
popularCategorias();
render();

