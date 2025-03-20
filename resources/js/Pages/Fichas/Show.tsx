import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/components/fichas.css";

const FichasShow = ({ ficha }) => {
    const isEditable = ficha.status !== 'Autorizada';

    return (
        <AuthenticatedLayout>
            <div className="container">
                <h1 className="text-center mb-4">Detalhes da Ficha</h1>
                <div className="resumo mb-4">
                    <h4 className="section-title">Dados da Empresa</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nome da Empresa</label>
                                <p className="form-control-static">{ficha.nome_empresa}</p>
                            </div>
                            <div className="form-group">
                                <label>CNPJ</label>
                                <p className="form-control-static">{ficha.cnpj}</p>
                            </div>
                            <div className="form-group">
                                <label>Responsável</label>
                                <p className="form-control-static">{ficha.responsavel}</p>
                            </div>
                            <div className="form-group">
                                <label>Telefone</label>
                                <p className="form-control-static">{ficha.telefone}</p>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <p className="form-control-static">{ficha.email}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Status</label>
                                <p className="form-control-static">
                                    <span className={`badge ${ficha.status === 'Autorizada' ? 'badge-success' : ficha.status === 'Reprovada' ? 'badge-danger' : 'badge-warning'}`}>
                                        {ficha.status}
                                    </span>
                                </p>
                            </div>
                            <div className="form-group">
                                <label>Limite de Crédito</label>
                                <p className="form-control-static">{ficha.limite_credito}</p>
                            </div>
                            <div className="form-group">
                                <label>Tipo de Pagamento</label>
                                <p className="form-control-static">{ficha.tipo_pagamento}</p>
                            </div>
                            <div className="form-group">
                                <label>Prazo de Pagamento</label>
                                <p className="form-control-static">{ficha.prazo_pagamento} dias</p>
                            </div>
                            <div className="form-group">
                                <label>Observações</label>
                                <p className="form-control-static">{ficha.observacoes}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {ficha.status === 'Reprovada' && (
                    <div className="resumo mb-4">
                        <h4 className="section-title">Observação do Administrador</h4>
                        <p className="form-control-static">{ficha.observacao_rejeicao}</p>
                    </div>
                )}

                <div className="resumo mb-4">
                    <h4 className="section-title">Endereço</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>CEP</label>
                                <p className="form-control-static">{ficha.cep}</p>
                            </div>
                            <div className="form-group">
                                <label>Rua</label>
                                <p className="form-control-static">{ficha.rua}</p>
                            </div>
                            <div className="form-group">
                                <label>Número</label>
                                <p className="form-control-static">{ficha.numero}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Bairro</label>
                                <p className="form-control-static">{ficha.bairro}</p>
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <p className="form-control-static">{ficha.cidade}</p>
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <p className="form-control-static">{ficha.estado}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="resumo mb-4">
                    <h4 className="section-title">Dados do Projeto</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Tipo de Projeto</label>
                                <p className="form-control-static">{ficha.tipo_projeto}</p>
                            </div>
                            <div className="form-group">
                                <label>Data de Fechamento do Contrato</label>
                                <p className="form-control-static">{ficha.fechamento_contrato}</p>
                            </div>
                            <div className="form-group">
                                <label>Tipo de Manutenção</label>
                                <p className="form-control-static">{ficha.tipo_manutencao}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Conteúdo do Site</label>
                                <p className="form-control-static">{ficha.conteudo_site}</p>
                            </div>
                            <div className="form-group">
                                <label>Idiomas</label>
                                <p className="form-control-static">{ficha.idiomas}</p>
                            </div>
                            <div className="form-group">
                                <label>Prazo do Projeto</label>
                                <p className="form-control-static">{ficha.prazo_projeto} dias</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="resumo mb-4">
                    <h4 className="section-title">Dados do Usuário</h4>
                    <div className="form-group">
                        <label>Criado por</label>
                        <p className="form-control-static">{ficha.user?.name || 'N/A'}</p>
                    </div>
                    <div className="form-group">
                        <label>Aprovado por</label>
                        <p className="form-control-static">{ficha.aprovadoPor?.name || 'N/A'}</p>
                    </div>
                    <div className="form-group">
                        <label>Data de Aprovação</label>
                        <p className="form-control-static">{ficha.data_aprovacao || 'N/A'}</p>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <Link href="/fichas" className="btn btn-secondary">Voltar</Link>
                    {isEditable && (
                        <Link href={`/fichas/${ficha.id}/edit`} className="btn btn-primary">Editar</Link>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default FichasShow;
