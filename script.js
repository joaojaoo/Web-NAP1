// Array para armazenar o histórico de envios (apenas em memória)
let historicoEnviados = [];

// Função para salvar formulário no histórico
function salvarHistorico(dados) {
    const registro = {
        id: Date.now(),
        ...dados,
        data: new Date().toLocaleString('pt-BR')
    };
    historicoEnviados.push(registro);
    return registro;
}

// Função principal de validação e envio
function validarFormulario(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const feedback = document.getElementById('msgFeedback');

    // Validação dos campos obrigatórios
    if (nome === '' || email === '' || mensagem === '') {
        feedback.style.color = '#e53e3e';
        feedback.textContent = '⚠️ Todos os campos obrigatórios (*) devem ser preenchidos!';
        return false;
    }

    // Validação de e-mail
    if (!email.includes('@') || !email.includes('.')) {
        feedback.style.color = '#e53e3e';
        feedback.textContent = '⚠️ Digite um e-mail válido (ex: email@dominio.com)';
        return false;
    }

    // Validação de telefone (opcional, mas se preenchido deve ter formato mínimo)
    if (telefone && !/^[\d\(\)\s-]{10,15}$/.test(telefone)) {
        feedback.style.color = '#e53e3e';
        feedback.textContent = '⚠️ Telefone inválido. Use o formato (00) 00000-0000';
        return false;
    }

    // Se passou na validação
    const dados = { nome, email, telefone: telefone || 'Não informado', mensagem };
    
    // Salva no histórico
    const registro = salvarHistorico(dados);

    // Mensagem de sucesso
    feedback.style.color = '#38a169';
    feedback.textContent = '✅ Formulário enviado com sucesso! Registro #' + registro.id;

    // Limpa o formulário
    document.getElementById('contatoForm').reset();

    // Atualiza o histórico se estiver visível
    if (document.getElementById('historicoContainer').style.display !== 'none') {
        atualizarListaHistorico();
    }

    return false;
}

// Função para mostrar o histórico
function mostrarHistorico() {
    const container = document.getElementById('historicoContainer');
    const lista = document.getElementById('listaHistorico');
    
    if (historicoEnviados.length === 0) {
        lista.innerHTML = '<p style="color: #718096;">Nenhum formulário enviado ainda.</p>';
    } else {
        atualizarListaHistorico();
    }
    
    container.style.display = 'block';
    
    // Scroll suave até o histórico
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Função para atualizar a lista do histórico
function atualizarListaHistorico() {
    const lista = document.getElementById('listaHistorico');
    
    if (historicoEnviados.length === 0) {
        lista.innerHTML = '<p style="color: #718096;">Nenhum formulário enviado ainda.</p>';
        return;
    }

    // Ordena do mais recente para o mais antigo
    const historicoOrdenado = [...historicoEnviados].reverse();
    
    let html = '';
    historicoOrdenado.forEach(item => {
        html += `
            <div class="item-historico">
                <strong>#${item.id}</strong> - ${item.data}
                <br>
                <strong>Nome:</strong> ${item.nome} | 
                <strong>E-mail:</strong> ${item.email} | 
                <strong>Telefone:</strong> ${item.telefone}
                <br>
                <strong>Mensagem:</strong> ${item.mensagem.substring(0, 60)}${item.mensagem.length > 60 ? '...' : ''}
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

// Função para fechar o histórico
function fecharHistorico() {
    document.getElementById('historicoContainer').style.display = 'none';
}

// Função para limpar o histórico (opcional, para uso em desenvolvimento)
function limparHistorico() {
    historicoEnviados = [];
    document.getElementById('listaHistorico').innerHTML = '<p style="color: #718096;">Histórico limpo.</p>';
    document.getElementById('msgFeedback').textContent = '';
    document.getElementById('msgFeedback').style.color = '';
}

// Configurar o evento de submit do formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contatoForm');
    form.addEventListener('submit', validarFormulario);
    
    // Verifica se há histórico salvo no sessionStorage ao carregar
    try {
        const stored = sessionStorage.getItem('historicoFormularios');
        if (stored) {
            historicoEnviados = JSON.parse(stored);
        }
    } catch (e) {
        // Silenciosamente ignora erro de parsing
    }
});

// Salva o histórico no sessionStorage antes de fechar a página
window.addEventListener('beforeunload', function() {
    try {
        sessionStorage.setItem('historicoFormularios', JSON.stringify(historicoEnviados));
    } catch (e) {
        // Silenciosamente ignora erro de storage
    }
});

// Função para limpar histórico do sessionStorage (opcional)
function limparHistoricoCompleto() {
    historicoEnviados = [];
    sessionStorage.removeItem('historicoFormularios');
    document.getElementById('listaHistorico').innerHTML = '<p style="color: #718096;">Histórico limpo.</p>';
    document.getElementById('msgFeedback').textContent = '';
    document.getElementById('msgFeedback').style.color = '';
    fecharHistorico();
}