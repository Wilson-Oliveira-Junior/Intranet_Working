import React, { useState, useEffect, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputMask from 'react-input-mask';
import "../../../css/components/fichas.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';

// Função para validar CPF/CNPJ
const validarCpfCnpj = (value: string) => {
    // Garante que o valor é uma string
    value = value.toString();

    // Remove caracteres inválidos do valor
    value = value.replace(/[^0-9]/g, '');

    // Verifica CPF
    if (value.length === 11) {
        return 'CPF';
    }

    // Verifica CNPJ
    else if (value.length === 14) {
        return 'CNPJ';
    }

    // Não retorna nada
    else {
        return false;
    }
};

// Função para calcular dígitos das posições
const calc_digitos_posicoes = (digitos: string, posicoes = 10, soma_digitos = 0) => {
    digitos = digitos.toString();
    for (let i = 0; i < digitos.length; i++) {
        soma_digitos += parseInt(digitos[i]) * posicoes--;
        if (posicoes < 2) posicoes = 9;
    }
    soma_digitos = soma_digitos % 11;
    return digitos + (soma_digitos < 2 ? 0 : 11 - soma_digitos);
};

// Função para validar CPF
const valida_cpf = (valor: string) => {
    valor = valor.toString().replace(/[^0-9]/g, '');
    console.log('Validando CPF:', valor); // Log para depuração
    let digitos = valor.substring(0, 9);
    let novo_cpf = calc_digitos_posicoes(digitos);
    novo_cpf = calc_digitos_posicoes(novo_cpf, 11);
    console.log('CPF calculado:', novo_cpf); // Log para depuração
    return novo_cpf === valor;
};

// Função para validar CNPJ
const valida_cnpj = (valor: string) => {
    valor = valor.toString().replace(/[^0-9]/g, '');
    console.log('Validando CNPJ:', valor); // Log para depuração
    let primeiros_numeros_cnpj = valor.substring(0, 12);
    let primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);
    let segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);
    console.log('CNPJ calculado:', segundo_calculo); // Log para depuração
    return segundo_calculo === valor;
};

// Função para validar CPF ou CNPJ
const valida_cpf_cnpj = (valor: string) => {
    let valida = validarCpfCnpj(valor);
    console.log('Tipo de documento:', valida); // Log para depuração
    valor = valor.toString().replace(/[^0-9]/g, '');
    if (valida === 'CPF') return valida_cpf(valor);
    else if (valida === 'CNPJ') return valida_cnpj(valor);
    else return false;
};

// Função para buscar dados da empresa com base no CNPJ
const buscarDadosEmpresa = async (cpfCnpj: string) => {
    try {
        const response = await fetch(`/buscar-dados-empresa/${cpfCnpj}`);
        console.log('Resposta da API:', response); // Log para depuração
        if (response.ok) {
            const data = await response.json();
            console.log('Dados da empresa:', data); // Log para depuração
            return data;
        } else {
            console.error('Erro na resposta da API:', response.statusText); // Log para depuração
        }
    } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error); // Log para depuração
    }
    return null;
};

export { valida_cpf_cnpj, buscarDadosEmpresa }; // Export these functions

const Complete = ({ data, prevStep }: { data: any, prevStep: any }) => (
    <div className="tab-pane active" id="complete">
        <h2 className="h2-titulo"><i className="ni ni-check-bold"></i> <span>Resumo</span></h2>

        <div className="resumo">
            <h4>Dados da Empresa</h4>
            <p><strong>CNPJ/CPF:</strong> {data.cnpj_cpf}</p>
            <p><strong>Razão Social:</strong> {data.razao_social}</p>
            <p><strong>Nome Fantasia:</strong> {data.nome_fantasia}</p>
            <p><strong>Segmento da Empresa:</strong> {data.segmento_empresa}</p>
            <p><strong>Inscrição Estadual:</strong> {data.inscricao_estadual}</p>
            <p><strong>CEP:</strong> {data.cep}</p>
            <p><strong>Endereço:</strong> {data.endereco}</p>
            <p><strong>Bairro:</strong> {data.bairro}</p>
            <p><strong>Cidade:</strong> {data.cidade}</p>

            <h4>Dados de Contato</h4>
            {data.contacts.map((contact: any, index: number) => (
                <div key={index}>
                    <p><strong>Nome do Cliente:</strong> {contact.nome_cliente}</p>
                    <p><strong>Cargo:</strong> {contact.cargo_cliente}</p>
                    <p><strong>Tipo de Contato:</strong> {contact.tipo_contato}</p>
                    <p><strong>Telefone:</strong> {contact.telefone_cliente}</p>
                    <p><strong>Celular:</strong> {contact.celular}</p>
                    <p><strong>E-mail:</strong> {contact.email}</p>
                </div>
            ))}

            {data.tipo_projeto === 'Marketing' && (
                <>
                    <p><strong>Data Fechamento do Contrato:</strong> {data.fechamento_contrato}</p>
                    <p><strong>Prazo:</strong> {data.prazo_projeto}</p>
                    <p><strong>Tipo de Manutenção:</strong> {data.tipo_manutencao}</p>
                    <p><strong>Conteúdo:</strong> {data.conteudo_site}</p>
                    <p><strong>Idiomas:</strong> {data.idiomas}</p>
                    <p><strong>SSL/CDN:</strong> {data.ssl_cdn}</p>
                    <p><strong>Itens de Menu:</strong> {data.itens_menu}</p>
                    <p><strong>Itens Página Principal:</strong> {data.itens_pp}</p>
                    <p><strong>Slider na Página Principal:</strong> {data.slider_pp}</p>
                    <p><strong>Domínio do Site:</strong> {data.dominio_principal}</p>
                    <p><strong>Data de Início das Ações:</strong> {data.data_inicio_marketing}</p>
                </>
            )}
        </div>

        <div className="proximo-anterior">
            <button type="button" className="btn btn-anterior" onClick={prevStep}>
                <span className="btn-inner--text">Anterior</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
            </button>
            <button type="submit" className="btn btn-ficha-comercial">
                <span className="btn-inner--text">Salvar</span>
                <span className="btn-inner--icon"><i className="ni ni-check-bold"></i></span>
            </button>
        </div>
    </div>
);

const FichasCreate = () => {
    const { data, setData, post } = useForm({
        nome: '',
        cnpj_cpf: '',
        razao_social: '',
        nome_fantasia: '',
        segmento_empresa: '',
        inscricao_estadual: '',
        cep: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
        complemento: '',
        dia_boleto: '',
        observacao_boleto: '',
        nota_fiscal: '',
        nome_cliente: '',
        cargo_cliente: '',
        tipo_contato: '',
        telefone_cliente: '',
        celular: '',
        email: '',
        nascimento: '',
        perfilcliente: [],
        tipo_projetos: [],
        segmentos: [],
        contacts: [],
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => setLoading(false);
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/fichas');
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthenticatedLayout>
            <h1>Nova Ficha</h1>
            <div className="wizard">
                <div className="wizard-inner">
                    <div className="connecting-line"></div>
                    <ul className="nav nav-tabs justify-content-center" role="tablist">
                        <li role="presentation" className={`icone-passo-1 ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                            <a href="#step1" data-toggle="tab" aria-controls="step1" role="tab" title="Step 1">
                                <span className="round-tab">1</span>
                                <span className="step-title">Dados da Empresa</span>
                            </a>
                        </li>
                        <li role="presentation" className={`icone-passo-2 ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : 'disabled'}`}>
                            <a href="#step2" data-toggle="tab" aria-controls="step2" role="tab" title="Step 2">
                                <span className="round-tab">2</span>
                                <span className="step-title">Dados de Contato</span>
                            </a>
                        </li>
                        <li role="presentation" className={`icone-passo-3 ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : 'disabled'}`}>
                            <a href="#step3" data-toggle="tab" aria-controls="step3" role="tab" title="Step 3">
                                <span className="round-tab">3</span>
                                <span className="step-title">Dados do Projeto</span>
                            </a>
                        </li>
                        <li role="presentation" className={`${currentStep === 4 ? 'active' : 'disabled'}`}>
                            <a href="#complete" data-toggle="tab" aria-controls="complete" role="tab" title="Complete">
                                <span className="round-tab">4</span>
                                <span className="step-title">Completado</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && <Step1 data={data} setData={setData} nextStep={nextStep} />}
                    {currentStep === 2 && <Step2 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                    {currentStep === 3 && <Step3 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                    {currentStep === 4 && <Complete data={data} prevStep={prevStep} />}
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default FichasCreate;
