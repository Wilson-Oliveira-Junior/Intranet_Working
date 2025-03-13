import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/components/fichas.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Função para validar CPF/CNPJ
const validarCpfCnpj = (value) => {
    const cpfCnpj = value.replace(/[^\d]+/g, '');
    if (cpfCnpj.length === 11) {
        // Validação de CPF
        let soma = 0;
        let resto;
        if (cpfCnpj === "00000000000") return false;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpfCnpj.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpfCnpj.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpfCnpj.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpfCnpj.substring(10, 11))) return false;
        return true;
    } else if (cpfCnpj.length === 14) {
        // Validação de CNPJ
        let tamanho = cpfCnpj.length - 2;
        let numeros = cpfCnpj.substring(0, tamanho);
        let digitos = cpfCnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        tamanho = tamanho + 1;
        numeros = cpfCnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;
        return true;
    }
    return false;
};

// Função para buscar dados da empresa com base no CNPJ
const buscarDadosEmpresa = async (cpfCnpj) => {
    try {
        const response = await fetch(`/buscar-dados-empresa/${cpfCnpj}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error); // Log para depuração
    }
    return null;
};

const Step1 = ({ data, setData, nextStep }) => {
    const [cpfCnpjError, setCpfCnpjError] = useState('');

    const handleCpfCnpjChange = async (e) => {
        const value = e.target.value;
        setData('cnpj_cpf', value);
        if (!validarCpfCnpj(value)) {
            setCpfCnpjError('CPF/CNPJ inválido');
        } else {
            setCpfCnpjError('');
            if (value.length === 14) {
                const dadosEmpresa = await buscarDadosEmpresa(value);
                if (dadosEmpresa && dadosEmpresa.status !== 'ERROR') {
                    console.log('Preenchendo dados da empresa...'); // Log para depuração
                    setData({
                        ...data,
                        cnpj_cpf: value, // Manter o valor do CNPJ/CPF
                        razao_social: dadosEmpresa.nome || '',
                        nome_fantasia: dadosEmpresa.fantasia || '',
                        cep: dadosEmpresa.cep || '',
                        endereco: dadosEmpresa.logradouro || '',
                        bairro: dadosEmpresa.bairro || '',
                        cidade: dadosEmpresa.municipio || '',
                        estado: dadosEmpresa.uf || '',
                        inscricao_estadual: dadosEmpresa.uf || '', // Preencher com o estado
                        numero: dadosEmpresa.numero || '',
                        complemento: dadosEmpresa.complemento || '',
                        telefone_cliente: dadosEmpresa.telefone || '',
                        email: dadosEmpresa.email || ''
                    });
                    // Adicionar logs para depuração
                    console.log('Dados preenchidos:', {
                        razao_social: dadosEmpresa.nome,
                        nome_fantasia: dadosEmpresa.fantasia,
                        cep: dadosEmpresa.cep,
                        endereco: dadosEmpresa.logradouro,
                        bairro: dadosEmpresa.bairro,
                        cidade: dadosEmpresa.municipio,
                        estado: dadosEmpresa.uf,
                        inscricao_estadual: dadosEmpresa.uf, // Log para depuração
                        numero: dadosEmpresa.numero,
                        complemento: dadosEmpresa.complemento,
                        telefone_cliente: dadosEmpresa.telefone,
                        email: dadosEmpresa.email,
                    });
                }
            }
        }
    };

    useEffect(() => {
        const fetchSegmentos = async () => {
            try {
                const response = await fetch('/api/segmentos');
                if (response.ok) {
                    const result = await response.json();
                    console.log('Segmentos:', result.data); // Verifique os dados no console
                    setData('segmentos', result.data); // Use result.data
                } else {
                    console.error('Erro ao carregar segmentos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar segmentos:', error);
            }
        };

        fetchSegmentos();
    }, []);



    return (
        <div className="tab-pane active" id="step1">
            <h2 className="h2-titulo"><i className="fas fa-child"></i> <span>Dados da</span> Empresa</h2>

            {/* Linha 1 */}
            <div className="row">
                {/* CNPJ/CPF */}
                <div className="form-group col-sm-4 form-ficha-comercial cnpj_cpf">
                    <h4 className="h4-fechamento">CNPJ/CPF <span>Somente Números</span></h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            name="cnpj_cpf"
                            id="cnpj_cpf"
                            placeholder="CNPJ/CPF"
                            type="text"
                            maxLength={14}
                            required
                            value={data.cnpj_cpf}
                            onChange={handleCpfCnpjChange}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    {cpfCnpjError && <p className="error text-center alert alert-danger">{cpfCnpjError}</p>}
                </div>

                {/* Razão Social */}
                <div className="form-group col-sm-4 form-ficha-comercial razao-social">
                    <h4 className="h4-fechamento">Razão Social</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            id="razao-social"
                            className="form-control"
                            name="razao_social"
                            placeholder="Razão Social"
                            type="text"
                            maxLength={100}
                            required
                            value={data.razao_social}
                            onChange={e => setData('razao_social', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_razao_social text-center alert alert-danger hidden"></p>
                </div>

                {/* Nome Fantasia */}
                <div className="form-group col-sm-4 form-ficha-comercial nome-fantasia">
                    <h4 className="h4-fechamento">Nome Fantasia</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            id="nome-fantasia"
                            className="form-control"
                            name="nome_fantasia"
                            placeholder="Nome Fantasia"
                            type="text"
                            maxLength="100"
                            required
                            value={data.nome_fantasia}
                            onChange={e => setData('nome_fantasia', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_nome_fantasia text-center alert alert-danger hidden"></p>
                </div>
            </div>

            {/* Linha 2 */}
            <div className="row">
                {/* Segmento da Empresa */}
                <div className="form-group col-sm-4 form-ficha-comercial segmento-empresa">
                    <h4 className="h4-fechamento">Segmento da Empresa</h4>
                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none !important' }}>
                        <select
                            id="segmento-empresa"
                            className="form-control select-ficha select2"
                            name="segmento_empresa"
                            value={data.segmento_empresa}
                            onChange={e => setData('segmento_empresa', e.target.value)}
                        >
                            <option value="0">Segmento da Empresa</option>
                            {Array.isArray(data.segmentos) && data.segmentos.map((segmento: { id: string, nome: string }) => (
                                <option key={segmento.id} value={segmento.id}>{segmento.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Inscrição Estadual */}
                <div className="form-group col-sm-4 form-ficha-comercial inscricao_estadual">
                    <h4 className="h4-fechamento">Inscrição Estadual</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            id="inscricao_estadual"
                            className="form-control"
                            name="inscricao_estadual"
                            placeholder="Inscrição Estadual"
                            type="text"
                            value={data.inscricao_estadual}
                            onChange={e => setData('inscricao_estadual', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                </div>

                {/* CEP */}
                <div className="form-group col-sm-4 form-ficha-comercial cep">
                    <h4 className="h4-fechamento">CEP</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            id="cep"
                            className="form-control"
                            type="text"
                            name="cep"
                            maxLength={9}
                            placeholder="Digite o CEP"
                            required
                            value={data.cep}
                            onChange={e => setData('cep', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_cep text-center alert alert-danger hidden"></p>
                </div>
            </div>

            {/* Linha 3 */}
            <div className="row">
                {/* Endereço */}
                <div className="form-group col-sm-4 form-ficha-comercial endereco">
                    <h4 className="h4-fechamento">Endereço</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="endereco"
                            maxLength={164}
                            id="campo_logradouro"
                            placeholder="Endereço"
                            required
                            value={data.endereco}
                            onChange={e => setData('endereco', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_endereco text-center alert alert-danger hidden"></p>
                </div>

                {/* Bairro */}
                <div className="form-group col-sm-4 form-ficha-comercial bairro">
                    <h4 className="h4-fechamento">Bairro</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="bairro"
                            id="campo_bairro"
                            maxLength={64}
                            placeholder="Bairro"
                            required
                            value={data.bairro}
                            onChange={e => setData('bairro', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_bairro text-center alert alert-danger hidden"></p>
                </div>

                {/* Cidade */}
                <div className="form-group col-sm-4 form-ficha-comercial cidade">
                    <h4 className="h4-fechamento">Cidade</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="cidade"
                            id="campo_cidade"
                            maxLength="64"
                            placeholder="Cidade"
                            required
                            value={data.cidade}
                            onChange={e => setData('cidade', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_cidade text-center alert alert-danger hidden"></p>
                </div>
            </div>

            {/* Botões de Navegação */}
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-ficha-comercial" onClick={nextStep}>
                    <span className="btn-inner--text">Próximo Passo</span>
                    <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
                </button>
                <Link href="/fichas" className="btn btn-danger">
                    <span className="btn-inner--text">Cancelar</span>
                </Link>
            </div>
        </div>
    );
};

const Step2 = ({ data, setData, nextStep, prevStep }) => (
    <div className="tab-pane active" id="step2">
        <h2 className="h2-titulo"><i className="ni ni-badge"></i> <span>Dados de</span> Contato</h2>

        {/* Linha 1 */}
        <div className="row">
            {/* Nome do Cliente */}
            <div className="form-group col-sm-4 form-ficha-comercial nome-cliente">
                <h4 className="h4-fechamento">Nome do Cliente</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="nome-cliente"
                        className="form-control"
                        name="nome_cliente"
                        placeholder="Nome"
                        type="text"
                        maxLength="100"
                        required
                        value={data.nome_cliente}
                        onChange={e => setData('nome_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_nome_cliente text-center alert alert-danger hidden"></p>
            </div>

            {/* Cargo */}
            <div className="form-group col-sm-4 form-ficha-comercial cargo-cliente">
                <h4 className="h4-fechamento">Cargo</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="cargo-cliente"
                        className="form-control"
                        name="cargo_cliente"
                        placeholder="Cargo"
                        type="text"
                        maxLength="100"
                        required
                        value={data.cargo_cliente}
                        onChange={e => setData('cargo_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_cargo_cliente text-center alert alert-danger hidden"></p>
            </div>

            {/* Tipo de Contato */}
            <div className="form-group col-sm-4 form-ficha-comercial responsavel-cliente">
                <h4 className="h4-fechamento">Tipo de Contato</h4>
                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none !important' }}>
                    <select
                        className="form-control"
                        name="tipo_contato"
                        value={data.tipo_contato}
                        onChange={e => setData('tipo_contato', e.target.value)}
                    >
                        <option value="--">Tipo de Contato</option>
                        <option value="Responsável do Projeto">Responsável do Projeto</option>
                        <option value="Responsável Financeiro">Responsável Financeiro</option>
                        <option value="Responsável Projeto/Financeiro">Responsável Projeto/Financeiro</option>
                        <option value="Outro">Outro</option>
                    </select>
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_tipo_contato text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Linha 2 */}
        <div className="row">
            {/* Telefone */}
            <div className="form-group col-sm-4 form-ficha-comercial telefone-cliente">
                <h4 className="h4-fechamento">Telefone</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="telefone"
                        className="form-control"
                        name="telefone_cliente"
                        placeholder="Telefone Residencial"
                        type="tel"
                        value={data.telefone_cliente}
                        onChange={e => setData('telefone_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
            </div>

            {/* Celular */}
            <div className="form-group col-sm-4 form-ficha-comercial celular-cliente">
                <h4 className="h4-fechamento">Celular</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="celular"
                        className="form-control"
                        name="celular"
                        maxLength="15"
                        placeholder="Celular"
                        type="tel"
                        value={data.celular}
                        onChange={e => setData('celular', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_celular text-center alert alert-danger hidden"></p>
            </div>

            {/* E-mail */}
            <div className="form-group col-sm-4 form-ficha-comercial email-cliente">
                <h4 className="h4-fechamento">E-mail</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="email"
                        className="form-control"
                        name="email"
                        placeholder="E-mail"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_email text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Botões de Navegação */}
        <div className="proximo-anterior">
            <button type="button" className="btn btn-anterior" onClick={prevStep}>
                <span className="btn-inner--text">Anterior</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
            </button>
            <button type="button" className="btn btn-proximo" onClick={nextStep}>
                <span className="btn-inner--text">Próximo Passo</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
            </button>
        </div>
    </div>
);

const Step3 = ({ data, setData, nextStep, prevStep }) => (
    <div className="tab-pane active" id="step3">
        <h2 className="h2-titulo"><i className="ni ni-paper-diploma"></i> <span>Dados do</span> Projeto</h2>

        {/* Campos do Projeto */}
        <div id="clonar-campos-projeto">
            <div className="cloned-projeto-principal">
                <h3 className="h3-numero-projetos">Projeto 1</h3>

                {/* Tipo de Projeto */}
                <div className="form-group col-sm-12 form-ficha-comercial tipo-projeto" style={{ width: '98%' }}>
                    <h4 className="h4-fechamento">Selecione um projeto:</h4>
                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none', border: '1px solid #e1e1e1', borderRadius: '3px', padding: '3px', fontSize: '14px' }}>
                        <select
                            className="form-control select-ficha select2"
                            name="tipo_projeto"
                            value={data.tipo_projeto}
                            onChange={e => setData('tipo_projeto', e.target.value)}
                        >
                            <option value="--">Selecione o Tipo de Projeto</option>
                            {data.tipo_projetos && data.tipo_projetos.map(projeto => (
                                <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Campos para Projeto do Tipo Site */}
                {data.tipo_projeto === 'Site' && (
                    <div className="projetos-sites">
                        {/* Data Fechamento do Contrato */}
                        <div className="form-group col-sm-4 form-ficha-comercial data-fechamento-contrato">
                            <h4 className="h4-fechamento">Data Fechamento do Contrato</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    className="form-control"
                                    name="fechamento_contrato"
                                    type="date"
                                    value={data.fechamento_contrato}
                                    onChange={e => setData('fechamento_contrato', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Prazo */}
                        <div className="form-group col-sm-4 form-ficha-comercial prazo_projeto">
                            <h4 className="h4-fechamento">Prazo</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="prazo_projeto"
                                    value={data.prazo_projeto}
                                    onChange={e => setData('prazo_projeto', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="30">30 dias</option>
                                    <option value="45">45 dias</option>
                                    <option value="50">50 dias</option>
                                    <option value="65">65 dias</option>
                                </select>
                            </div>
                        </div>

                        {/* Tipo de Manutenção */}
                        <div className="form-group col-sm-4 form-ficha-comercial tipo_manutencao">
                            <h4 className="h4-fechamento">Tipo de Manutenção</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="tipo_manutencao"
                                    value={data.tipo_manutencao}
                                    onChange={e => setData('tipo_manutencao', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Mensal">Mensal</option>
                                    <option value="Hora Técnica">Hora Técnica</option>
                                </select>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="form-group col-sm-4 form-ficha-comercial conteudo_site">
                            <h4 className="h4-fechamento">Conteúdo</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="conteudo_site"
                                    value={data.conteudo_site}
                                    onChange={e => setData('conteudo_site', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Responsabilidade do Cliente">Responsabilidade do Cliente</option>
                                    <option value="Nós vamos desenvolver">Nós vamos desenvolver</option>
                                    <option value="Baseado no site antigo">Baseado no site antigo</option>
                                    <option value="Reestrutura do Conteúdo">Reestrutura do Conteúdo</option>
                                </select>
                            </div>
                        </div>

                        {/* Idiomas */}
                        <div className="form-group col-sm-4 form-ficha-comercial idiomas">
                            <h4 className="h4-fechamento">Idiomas</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="idiomas"
                                    value={data.idiomas}
                                    onChange={e => setData('idiomas', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Português">Português</option>
                                    <option value="Inglês">Inglês</option>
                                    <option value="Espanhol">Espanhol</option>
                                    <option value="Italiano">Italiano</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>

                        {/* SSL/CDN */}
                        <div className="form-group col-sm-4 form-ficha-comercial ssl-cdn">
                            <h4 className="h4-fechamento">Vai ter SSL/CDN?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="ssl-cdn"
                                    value={data.ssl_cdn}
                                    onChange={e => setData('ssl_cdn', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="SSL">SSL</option>
                                    <option value="CDN">CDN</option>
                                    <option value="SSL/CDN">SSL/CDN</option>
                                    <option value="Não Terá">Não Terá</option>
                                </select>
                            </div>
                        </div>

                        {/* Itens de Menu */}
                        <div className="form-group col-sm-6 form-ficha-comercial itens_menu" style={{ width: '48%' }}>
                            <h4 className="h4-fechamento">Itens de Menu</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <textarea
                                    className="form-control"
                                    name="itens_menu"
                                    placeholder="Escreva aqui os itens de menu..."
                                    value={data.itens_menu}
                                    onChange={e => setData('itens_menu', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Itens Página Principal */}
                        <div className="form-group col-sm-6 form-ficha-comercial itens_pp" style={{ width: '48%' }}>
                            <h4 className="h4-fechamento">Itens Página Principal</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <textarea
                                    className="form-control"
                                    name="itens_pp"
                                    placeholder="Escreva aqui os itens da página principal..."
                                    value={data.itens_pp}
                                    onChange={e => setData('itens_pp', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Perguntas sobre o Slider */}
                        <div className="div-slider">
                            <h5>Slider</h5>
                            <div className="form-group col-sm-4 form-ficha-comercial slider_pp">
                                <h4 className="h4-fechamento">Vai ter na Página Principal?</h4>
                                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                    <select
                                        className="form-control select-ficha"
                                        name="slider_pp"
                                        value={data.slider_pp}
                                        onChange={e => setData('slider_pp', e.target.value)}
                                    >
                                        <option value="--">--</option>
                                        <option value="Sim">Sim</option>
                                        <option value="Não">Não</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Perguntas sobre o Domínio */}
                        <div className="div-dominio">
                            <h5>Domínio</h5>
                            <div className="form-group col-sm-4 form-ficha-comercial dominio_principal">
                                <h4 className="h4-fechamento">Domínio do Site</h4>
                                <div className="input-group input-group-alternative mb-3">
                                    <input
                                        className="form-control"
                                        name="dominio_principal"
                                        placeholder="Escreva aqui..."
                                        value={data.dominio_principal}
                                        onChange={e => setData('dominio_principal', e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Outros campos do Domínio... */}
                        </div>

                        {/* Perguntas sobre Redirects */}
                        <div className="div-redirects">
                            <h5>Redirects</h5>
                            <div className="form-group col-sm-6 form-ficha-comercial redirect" style={{ width: '49%' }}>
                                <h4 className="h4-fechamento">Haverá Redirect?</h4>
                                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                    <select
                                        id="redirect"
                                        className="form-control select-ficha"
                                        name="redirect"
                                        value={data.redirect}
                                        onChange={e => setData('redirect', e.target.value)}
                                    >
                                        <option value="--">--</option>
                                        <option value="Sim">Sim</option>
                                        <option value="Não">Não</option>
                                    </select>
                                </div>
                            </div>
                            {/* Outros campos de Redirects... */}
                        </div>
                    </div>
                )}

                {/* Campos para Projeto do Tipo Marketing */}
                {data.tipo_projeto === 'Marketing' && (
                    <div className="projetos-marketing">
                        <h5>Marketing</h5>
                        <div className="form-group col-sm-4 form-ficha-comercial data-inicio-marketing">
                            <h4 className="h4-fechamento">Data de Início das Ações</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id="data-inicio-marketing"
                                    className="form-control"
                                    name="data_inicio_marketing"
                                    type="date"
                                    value={data.data_inicio_marketing}
                                    onChange={e => setData('data_inicio_marketing', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Outros campos de Marketing... */}
                    </div>
                )}
            </div>
        </div>

        {/* Botão para Adicionar mais Projetos */}
        <div id="adicionar-mais-projeto" className="mais-projeto">
            <button type="button" className="btn btn-add-mais" onClick={() => setData('projetos', [...data.projetos, {}])}>
                <span className="btn-inner--icon">
                    <i className="fas fa-plus my-float"></i>
                    Adicionar mais Projeto
                </span>
            </button>
        </div>

        {/* Botões de Navegação */}
        <div className="proximo-anterior">
            <button type="button" className="btn btn-anterior" onClick={prevStep}>
                <span className="btn-inner--text">Anterior</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
            </button>
            <button type="button" className="btn btn-proximo" onClick={nextStep}>
                <span className="btn-inner--text">Próximo Passo</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
            </button>
        </div>
    </div>
);

const Complete = ({ data, prevStep }) => (
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
            {/* Adicione outros campos conforme necessário */}

            <h4>Dados de Contato</h4>
            <p><strong>Nome do Cliente:</strong> {data.nome_cliente}</p>
            <p><strong>Cargo:</strong> {data.cargo_cliente}</p>
            <p><strong>Tipo de Contato:</strong> {data.tipo_contato}</p>
            <p><strong>Telefone:</strong> {data.telefone_cliente}</p>
            <p><strong>Celular:</strong> {data.celular}</p>
            <p><strong>E-mail:</strong> {data.email}</p>
            {/* Adicione outros campos conforme necessário */}

            <h4>Dados do Projeto</h4>
            <p><strong>Tipo de Projeto:</strong> {data.tipo_projeto}</p>
            {data.tipo_projeto === 'Site' && (
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
                    <p><strong>Haverá Redirect:</strong> {data.redirect}</p>
                    {/* Adicione outros campos conforme necessário */}
                </>
            )}
            {data.tipo_projeto === 'Marketing' && (
                <>
                    <p><strong>Data de Início das Ações:</strong> {data.data_inicio_marketing}</p>
                    {/* Adicione outros campos conforme necessário */}
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
        tipo_projetos: [], // Adicionar tipo_projetos ao estado inicial
        segmentos: [], // Adicionar segmentos ao estado inicial
        // Outros campos necessários
    });

    const [currentStep, setCurrentStep] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fichas');
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

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
                    <div className="tab-content">
                        {currentStep === 1 && <Step1 data={data} setData={setData} nextStep={nextStep} />}
                        {currentStep === 2 && <Step2 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                        {currentStep === 3 && <Step3 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                        {currentStep === 4 && <Complete data={data} setData={setData} prevStep={prevStep} />}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default FichasCreate;
