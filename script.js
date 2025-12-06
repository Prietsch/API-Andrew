// --- LÓGICA DA PÁGINA 1 (CEP) ---

async function buscarCEP() {
    const inputCep = document.getElementById('cepInput').value;
    const divResultado = document.getElementById('resultado');
    const msgErro = document.getElementById('msgErro');
    
    // Limpeza: Remove tudo que NÃO for número
    const cepLimpo = inputCep.replace(/\D/g, ''); 

    // Reset visual
    divResultado.style.display = 'none';
    msgErro.style.display = 'none';
    divResultado.innerHTML = '';

    // Validação
    if (cepLimpo.length !== 8) {
        msgErro.innerText = "CEP inválido. Digite 8 números (o hífen é opcional).";
        msgErro.style.display = 'block';
        return;
    }

    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro de conexão com o servidor.');
        
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado na base de dados.');
        }

        divResultado.innerHTML = `
            <h3>Endereço Encontrado:</h3>
            <p><strong>Logradouro:</strong> ${data.logradouro}</p>
            <p><strong>Bairro:</strong> ${data.bairro}</p>
            <p><strong>Cidade:</strong> ${data.localidade} - ${data.uf}</p>
            <p><strong>DDD:</strong> ${data.ddd}</p>
        `;
        divResultado.style.display = 'block';

    } catch (error) {
        console.error("Erro capturado:", error);
        msgErro.innerText = error.message;
        msgErro.style.display = 'block';
    }
}

// --- LÓGICA DA PÁGINA 2 (DASHBOARD APIS) ---

document.addEventListener("DOMContentLoaded", () => {
    // Verifica se estamos na página 2 procurando um elemento específico dela
    // Isso evita erros no console quando estamos na página 1
    if (document.getElementById('dogContent')) {
        carregarDog();
        carregarMoedas();
        carregarFeriados();
    }
});

// 1. API Dog CEO
async function carregarDog() {
    const container = document.getElementById('dogContent');
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if(!response.ok) throw new Error('Falha ao carregar imagem');
        const data = await response.json();
        
        container.innerHTML = `<img src="${data.message}" alt="Cachorro aleatório" class="dog-img" />`;
    } catch (error) {
        if(container) container.innerHTML = `<p class="error-msg">Erro: ${error.message}</p>`;
    }
}

// 2. API AwesomeAPI (Lista de Moedas)
async function carregarMoedas() {
    const container = document.getElementById('moedasContent');
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/available/uniq');
        if(!response.ok) throw new Error('Falha ao carregar moedas');
        const data = await response.json();
        
        const listaMoedas = Object.entries(data);
        let listaHTML = '<ul>';
        listaMoedas.forEach(([sigla, nome]) => {
            listaHTML += `<li><strong>${sigla}</strong> <span>${nome}</span></li>`;
        });
        listaHTML += '</ul>';
        
        container.innerHTML = listaHTML;
    } catch (error) {
        if(container) container.innerHTML = `<p class="error-msg">Erro: ${error.message}</p>`;
    }
}

// 3. API Brasil API (Feriados)
async function carregarFeriados() {
    const container = document.getElementById('feriadosContent');
    const anoAtual = new Date().getFullYear();
    try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${anoAtual}`);
        if(!response.ok) throw new Error('Falha ao carregar feriados');
        const data = await response.json();
        
        let listaHTML = '<ul>';
        data.forEach(feriado => {
            const dataFormatada = new Date(feriado.date + 'T00:00:00').toLocaleDateString('pt-BR');
            listaHTML += `<li><strong>${dataFormatada}</strong> <span>${feriado.name}</span></li>`;
        });
        listaHTML += '</ul>';

        container.innerHTML = listaHTML;
    } catch (error) {
        if(container) container.innerHTML = `<p class="error-msg">Erro: ${error.message}</p>`;
    }
}