import React, { useState, useEffect, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputMask from 'react-input-mask';
import "../../../css/components/fichas.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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

const Step1 = ({ data, setData, nextStep }: { data: any, setData: any, nextStep: any }) => {
    const [cpfCnpjError, setCpfCnpjError] = useState('');

    const handleCpfCnpjChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('cnpj_cpf', value);
        if (!valida_cpf_cnpj(value)) {
            setCpfCnpjError('CPF/CNPJ inválido');
        } else {
            setCpfCnpjError('');
            try {
                const dadosEmpresa = await buscarDadosEmpresa(value);
                if (dadosEmpresa) {
                    if (dadosEmpresa.status === 'CPF válido') {
                        // Limpar campos relacionados à empresa para CPF válido
                        setData({
                            ...data,
                            razao_social: '',
                            nome_fantasia: '',
                            cep: '',
                            endereco: '',
                            bairro: '',
                            cidade: '',
                            estado: '',
                            inscricao_estadual: '',
                            numero: '',
                            complemento: '',
                            telefone_cliente: '',
                            email: ''
                        });
                    } else {
                        // Preencher campos para CNPJ
                        setData({
                            ...data,
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
                    }
                    // Adicionar logs para depuração
                    console.log('Dados preenchidos:', {
                        razao_social: dadosEmpresa.nome,
                        nome_fantasia: dadosEmpresa.fantasia,
                        cep: dadosEmpresa.cep,
                        endereco: dadosEmpresa.logradouro,
                        bairro: dadosEmpresa.bairro,
                        cidade: dadosEmpresa.municipio,
                        estado: dadosEmpresa.uf, // Log para depuração
                        inscricao_estadual: dadosEmpresa.uf,
                        numero: dadosEmpresa.numero,
                        complemento: dadosEmpresa.complemento,
                        telefone_cliente: dadosEmpresa.telefone,
                        email: dadosEmpresa.email,
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar dados da empresa:', error);
            }
        }
    };

    useEffect(() => {
        const fetchSegmentos = async () => {
            try {
                const response = await fetch('/api/segmentos');
                if (response.ok) {
                    const result = await response.json();
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
                            maxLength={100}
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
            {cpfCnpjError && <p className="error text-center alert alert-danger">{cpfCnpjError}</p>}
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
                            maxLength={64}
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

            {/* Linha 4 */}
            <div className="row">
                {/* Estado */}
                <div className="form-group col-sm-4 form-ficha-comercial estado">
                    <h4 className="h4-fechamento">Estado</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="estado"
                            maxLength={2}
                            placeholder="Estado"
                            required
                            value={data.estado}
                            onChange={e => setData('estado', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_estado text-center alert alert-danger hidden"></p>
                </div>

                {/* Número */}
                <div className="form-group col-sm-4 form-ficha-comercial numero">
                    <h4 className="h4-fechamento">Número</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="numero"
                            maxLength={10}
                            placeholder="Número"
                            required
                            value={data.numero}
                            onChange={e => setData('numero', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_numero text-center alert alert-danger hidden"></p>
                </div>

                {/* Complemento */}
                <div className="form-group col-sm-4 form-ficha-comercial complemento">
                    <h4 className="h4-fechamento">Complemento</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="complemento"
                            id="campo_complemento"
                            maxLength={100}
                            placeholder="Complemento"
                            value={data.complemento}
                            onChange={e => setData('complemento', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_complemento text-center alert alert-danger hidden"></p>
                </div>
            </div>

            {/* Linha 6 */}
            <div className="row">
                {/* Dia do Boleto */}
                <div className="form-group col-sm-4 form-ficha-comercial dia-boleto">
                    <h4 className="h4-fechamento">Dia do Boleto</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control"
                            name="dia_boleto"
                            id="campo_dia_boleto"
                            value={data.dia_boleto}
                            onChange={e => setData('dia_boleto', e.target.value)}
                        >
                            <option value="Melhor dia para boleto">Melhor dia para boleto</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                        </select>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_dia_boleto text-center alert alert-danger hidden"></p>
                </div>

                {/* Observação sobre o boleto */}
                <div className="form-group col-sm-4 form-ficha-comercial observacao-boleto">
                    <h4 className="h4-fechamento">Observação sobre o boleto</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <textarea
                            className="form-control"
                            name="observacao_boleto"
                            id="campo_observacao_boleto"
                            placeholder="Observação sobre o boleto"
                            value={data.observacao_boleto}
                            onChange={e => setData('observacao_boleto', e.target.value)}
                        ></textarea>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_observacao_boleto text-center alert alert-danger hidden"></p>
                </div>

                {/* Nota Fiscal */}
                <div className="form-group col-sm-4 form-ficha-comercial nota-fiscal">
                    <h4 className="h4-fechamento">Nota Fiscal</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control"
                            name="nota_fiscal"
                            id="campo_nota_fiscal"
                            value={data.nota_fiscal}
                            onChange={e => setData('nota_fiscal', e.target.value)}
                        >
                            <option value="Nota Fiscal">Nota Fiscal</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_nota_fiscal text-center alert alert-danger hidden"></p>
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

const Step2 = ({ data, setData, nextStep, prevStep }: { data: any, setData: any, nextStep: any, prevStep: any }) => {
    const [contacts, setContacts] = useState(data.contacts.length > 0 ? data.contacts : [{ nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }]);
    const [contactError, setContactError] = useState('');

    useEffect(() => {
        setContacts(data.contacts.length > 0 ? data.contacts : [{ nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }]);
    }, [data.contacts]);

    const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [name]: value };
        setContacts(newContacts);
        setData('contacts', newContacts);
    };

    const handleCheckboxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const newContacts = [...contacts];
        if (checked) {
            newContacts[index].perfilcliente = [...(newContacts[index].perfilcliente || []), name];
        } else {
            newContacts[index].perfilcliente = (newContacts[index].perfilcliente || []).filter((item: string) => item !== name);
        }
        setContacts(newContacts);
        setData('contacts', newContacts);
    };

    const validateContact = () => {
        for (const contact of contacts) {
            if (!contact.nome_cliente || !contact.cargo_cliente || !contact.tipo_contato || !contact.telefone_cliente || !contact.email) {
                setContactError('Todos os campos são obrigatórios');
                return false;
            }
        }
        setContactError('');
        return true;
    };

    const handleNextStep = () => {
        if (validateContact()) {
            nextStep();
        }
    };

    const addContact = () => {
        if (contacts.length < 2) {
            const newContacts = [...contacts, { nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }];
            setContacts(newContacts);
            setData('contacts', newContacts);
        }
    };

    return (
        <div className="tab-pane active" id="step2">
            <h2 className="h2-titulo"><i className="ni ni-badge"></i> <span>Dados de</span> Contato</h2>

            {contacts.map((contact, index) => (
                <div key={index}>
                    <h3>Contato {index + 1}</h3>
                    {/* Linha 1 */}
                    <div className="row">
                        {/* Nome do Cliente */}
                        <div className="form-group col-sm-4 form-ficha-comercial nome-cliente">
                            <h4 className="h4-fechamento">Nome do Cliente</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id={`nome-cliente-${index}`}
                                    className="form-control"
                                    name="nome_cliente"
                                    placeholder="Nome"
                                    type="text"
                                    maxLength={100}
                                    value={contact.nome_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    id={`cargo-cliente-${index}`}
                                    className="form-control"
                                    name="cargo_cliente"
                                    placeholder="Cargo"
                                    type="text"
                                    maxLength={100}
                                    value={contact.cargo_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    value={contact.tipo_contato || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    id={`telefone-${index}`}
                                    className="form-control"
                                    name="telefone_cliente"
                                    placeholder="Telefone Residencial"
                                    value={contact.telefone_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    id={`celular-${index}`}
                                    className="form-control"
                                    maxLength={15}
                                    placeholder="Celular"
                                    value={contact.celular || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    id={`email-${index}`}
                                    className="form-control"
                                    name="email"
                                    placeholder="E-mail"
                                    value={contact.email || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                            <p className="error error_email text-center alert alert-danger hidden"></p>
                        </div>
                    </div>

                    {/* Linha 3 */}
                    <div className="row">
                        {/* Data de Nascimento */}
                        <div className="form-group col-sm-4 form-ficha-comercial nascimento-cliente">
                            <h4 className="h4-fechamento">Data de Nascimento</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <InputMask
                                    id={`nascimento-${index}`}
                                    className="form-control"
                                    name="nascimento"
                                    mask="99/99/9999"
                                    placeholder="DD/MM/AAAA"
                                    value={contact.nascimento || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linha 4 */}
                    <div className="row">
                        {/* Perfil do Cliente */}
                        <div className="form-group col-sm-12 form-ficha-comercial perfil-cliente">
                            <h4 className="h4-fechamento">Perfil do Cliente</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento básico"
                                            checked={contact.perfilcliente?.includes('Conhecimento básico') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento básico
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento Intermediário"
                                            checked={contact.perfilcliente?.includes('Conhecimento Intermediário') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento Intermediário
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento Avançado"
                                            checked={contact.perfilcliente?.includes('Conhecimento Avançado') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento Avançado
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Exigente"
                                            checked={contact.perfilcliente?.includes('Exigente') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Exigente
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Pró Ativo"
                                            checked={contact.perfilcliente?.includes('Pró Ativo') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Pró Ativo
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Indeciso/Confuso"
                                            checked={contact.perfilcliente?.includes('Indeciso/Confuso') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Indeciso/Confuso
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Aberto a novas Ideias"
                                            checked={contact.perfilcliente?.includes('Aberto a novas Ideias') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Aberto a novas Ideias
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {contactError && <p className="error text-center alert alert-danger">{contactError}</p>}

            {/* Botão para adicionar mais um contato */}
            {contacts.length < 2 && (
                <div className="d-flex justify-content-end mb-3">
                    <button type="button" className="btn btn-add-mais" onClick={addContact}>
                        <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                        <span className="btn-inner--text">Adicionar Contato</span>
                    </button>
                </div>
            )}

            {/* Botões de Navegação */}
            <div className="proximo-anterior">
                <button type="button" className="btn btn-anterior" onClick={prevStep}>
                    <span className="btn-inner--text">Anterior</span>
                    <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
                </button>
                <button type="button" className="btn btn-proximo" onClick={handleNextStep}>
                    <span className="btn-inner--text">Próximo Passo</span>
                    <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
                </button>
            </div>
        </div>
    );
};

const Step3 = ({ data, setData, nextStep, prevStep }: { data: any, setData: any, nextStep: any, prevStep: any }) => {
    useEffect(() => {
        const fetchTipoProjetos = async () => {
            try {
                const response = await fetch('/api/tipo-projetos');
                if (response.ok) {
                    const result = await response.json();
                    setData('tipo_projetos', result.data);
                } else {
                    console.error('Erro ao carregar tipo de projetos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar tipo de projetos:', error);
            }
        };

        fetchTipoProjetos();
    }, [setData]);

    return (
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
                                <option value="0">Selecione um projeto</option>
                                {Array.isArray(data.tipo_projetos) && data.tipo_projetos.map((projeto: any) => (
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
                                {/* Nós que vamos fazer as artes? */}
                                <div className="form-group col-sm-4 form-ficha-comercial slider_nos_desenvolvemos">
                                    <h4 className="h4-fechamento">Nós que vamos fazer as artes?</h4>
                                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                        <select
                                            className="form-control select-ficha"
                                            name="slider_nos_desenvolvemos"
                                            value={data.slider_nos_desenvolvemos}
                                            onChange={e => setData('slider_nos_desenvolvemos', e.target.value)}
                                        >
                                            <option value="--">--</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Quantidade? */}
                                <div className="form-group col-sm-4 form-ficha-comercial slider_qtd">
                                    <h4 className="h4-fechamento">Quantidade?</h4>
                                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                        <select
                                            className="form-control select-ficha"
                                            name="slider_qtd"
                                            value={data.slider_qtd}
                                            onChange={e => setData('slider_qtd', e.target.value)}
                                        >
                                            <option value="--">--</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Vai ser feito uma vez só? */}
                                <div className="form-group col-sm-4 form-ficha-comercial slider_vezes">
                                    <h4 className="h4-fechamento">Vai ser feito uma vez só?</h4>
                                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                        <select
                                            className="form-control select-ficha"
                                            name="slider_vezes"
                                            value={data.slider_vezes}
                                            onChange={e => setData('slider_vezes', e.target.value)}
                                        >
                                            <option value="--">--</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Qual Periodicidade? */}
                                <div className="form-group col-sm-4 form-ficha-comercial slider_periodicidade">
                                    <h4 className="h4-fechamento">Qual Periodicidade?</h4>
                                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                        <select
                                            className="form-control select-ficha"
                                            name="slider_periodicidade"
                                            value={data.slider_periodicidade}
                                            onChange={e => setData('slider_periodicidade', e.target.value)}
                                        >
                                            <option value="--">--</option>
                                            <option value="Mensal">Mensal</option>
                                            <option value="Trimestral">Trimestral</option>
                                            <option value="Semestral">Semestral</option>
                                            <option value="Anual">Anual</option>
                                            <option value="Sazonal">Sazonal</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Observação do Slider */}
                                <div className="form-group col-sm-6 form-ficha-comercial slider_observacao">
                                    <h4 className="h4-fechamento">Observação do Slider</h4>
                                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                        <input
                                            className="form-control"
                                            name="slider_observacao"
                                            placeholder="Escreva aqui..."
                                            value={data.slider_observacao}
                                            onChange={e => setData('slider_observacao', e.target.value)}
                                        />
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
};

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
