import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const FichasEdit = ({ ficha }) => {
    const { data, setData, put } = useForm({
        nome_empresa: ficha.nome_empresa || '',
        cnpj: ficha.cnpj || '',
        responsavel: ficha.responsavel || '',
        telefone: ficha.telefone || '',
        email: ficha.email || '',
        limite_credito: ficha.limite_credito || '',
        tipo_pagamento: ficha.tipo_pagamento || '',
        prazo_pagamento: ficha.prazo_pagamento || '',
        observacoes: ficha.observacoes || '',
        cep: ficha.cep || '',
        rua: ficha.rua || '',
        numero: ficha.numero || '',
        bairro: ficha.bairro || '',
        cidade: ficha.cidade || '',
        estado: ficha.estado || '',
        contatos: ficha.contatos || [],
        tipo_projeto: ficha.tipo_projeto || '',
        fechamento_contrato: ficha.fechamento_contrato || '',
        tipo_manutencao: ficha.tipo_manutencao || '',
        conteudo_site: ficha.conteudo_site || '',
        ssl_cdn: ficha.ssl_cdn || '',
        prazo_projeto: ficha.prazo_projeto || '',
        idiomas: ficha.idiomas || '',
        itens_menu: ficha.itens_menu || '',
        itens_pp: ficha.itens_pp || '',
        slider_pp: ficha.slider_pp || '',
        dominio_site: ficha.dominio_site || '',
        data_inicio_acoes: ficha.data_inicio_acoes || '',
        investimento_mensal: ficha.investimento_mensal || '',
        numero_post_mes: ficha.numero_post_mes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/fichas/${ficha.id}`, {
            onSuccess: () => alert('Ficha atualizada com sucesso! O aprovador foi notificado.'),
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="container">
                <h1 className="text-center mb-4">Editar Ficha</h1>
                <form onSubmit={handleSubmit}>
                    {/* Dados da Empresa */}
                    <div className="resumo mb-4">
                        <h4 className="section-title">Dados da Empresa</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nome da Empresa</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.nome_empresa}
                                        onChange={(e) => setData('nome_empresa', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Responsável</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.responsavel}
                                        onChange={(e) => setData('responsavel', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>CNPJ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.cnpj}
                                        onChange={(e) => setData('cnpj', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.telefone}
                                        onChange={(e) => setData('telefone', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Limite de Crédito</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={data.limite_credito}
                                        onChange={(e) => setData('limite_credito', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="resumo mb-4">
                        <h4 className="section-title">Endereço</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>CEP</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.cep}
                                        onChange={(e) => setData('cep', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rua</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.rua}
                                        onChange={(e) => setData('rua', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bairro</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.bairro}
                                        onChange={(e) => setData('bairro', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Número</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.numero}
                                        onChange={(e) => setData('numero', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cidade</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.cidade}
                                        onChange={(e) => setData('cidade', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.estado}
                                        onChange={(e) => setData('estado', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dados do Projeto */}
                    <div className="resumo mb-4">
                        <h4 className="section-title">Dados do Projeto</h4>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Tipo de Projeto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.tipo_projeto}
                                    onChange={(e) => setData('tipo_projeto', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Data de Fechamento do Contrato</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={data.fechamento_contrato}
                                    onChange={(e) => setData('fechamento_contrato', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Tipo de Manutenção</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.tipo_manutencao}
                                    onChange={(e) => setData('tipo_manutencao', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Conteúdo do Site</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.conteudo_site}
                                    onChange={(e) => setData('conteudo_site', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Idiomas</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.idiomas}
                                    onChange={(e) => setData('idiomas', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Prazo do Projeto</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.prazo_projeto}
                                    onChange={(e) => setData('prazo_projeto', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos adicionais */}
                    <div className="additional-fields">
                        <h4>Campos Adicionais</h4>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Idiomas</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.idiomas}
                                    onChange={(e) => setData('idiomas', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Itens de Menu</label>
                                <textarea
                                    className="form-control"
                                    value={data.itens_menu}
                                    onChange={(e) => setData('itens_menu', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Itens Página Principal</label>
                                <textarea
                                    className="form-control"
                                    value={data.itens_pp}
                                    onChange={(e) => setData('itens_pp', e.target.value)}
                                ></textarea>
                            </div>
                            <div className="form-group col-md-6">
                                <label>Slider na Página Principal</label>
                                <select
                                    className="form-control"
                                    value={data.slider_pp}
                                    onChange={(e) => setData('slider_pp', e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Domínio do Site</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.dominio_site}
                                    onChange={(e) => setData('dominio_site', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Data de Início das Ações</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={data.data_inicio_acoes}
                                    onChange={(e) => setData('data_inicio_acoes', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>Investimento Mensal</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.investimento_mensal}
                                    onChange={(e) => setData('investimento_mensal', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Número de Posts por Mês</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.numero_post_mes}
                                    onChange={(e) => setData('numero_post_mes', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="d-flex justify-content-between mt-4">
                        <Link href="/fichas" className="btn btn-secondary">Voltar</Link>
                        <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default FichasEdit;
