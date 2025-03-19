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

                {/* Dados da Empresa */}
                <div className="resumo mb-4">
                    <h4 className="section-title">Dados da Empresa</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Nome da Empresa:</strong> {ficha.nome_empresa}</p>
                            <p><strong>CNPJ:</strong> {ficha.cnpj}</p>
                            <p><strong>Responsável:</strong> {ficha.responsavel}</p>
                            <p><strong>Telefone:</strong> {ficha.telefone}</p>
                            <p><strong>Email:</strong> {ficha.email}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Status:</strong>
                                <span className={`badge ${ficha.status === 'Autorizada' ? 'badge-success' : ficha.status === 'Reprovada' ? 'badge-danger' : 'badge-warning'}`}>
                                    {ficha.status}
                                </span>
                            </p>
                            <p><strong>Limite de Crédito:</strong> {ficha.limite_credito}</p>
                            <p><strong>Tipo de Pagamento:</strong> {ficha.tipo_pagamento}</p>
                            <p><strong>Prazo de Pagamento:</strong> {ficha.prazo_pagamento} dias</p>
                            <p><strong>Observações:</strong> {ficha.observacoes}</p>
                        </div>
                    </div>
                </div>

                {/* Observação do Administrador */}
                {ficha.status === 'Reprovada' && (
                    <div className="resumo mb-4">
                        <h4 className="section-title">Observação do Administrador</h4>
                        <p>{ficha.observacao_rejeicao}</p>
                    </div>
                )}

                {/* Endereço */}
                <div className="resumo mb-4">
                    <h4 className="section-title">Endereço</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>CEP:</strong> {ficha.cep}</p>
                            <p><strong>Rua:</strong> {ficha.rua}</p>
                            <p><strong>Número:</strong> {ficha.numero}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Bairro:</strong> {ficha.bairro}</p>
                            <p><strong>Cidade:</strong> {ficha.cidade}</p>
                            <p><strong>Estado:</strong> {ficha.estado}</p>
                        </div>
                    </div>
                </div>

                {/* Dados do Usuário */}
                <div className="resumo mb-4">
                    <h4 className="section-title">Dados do Usuário</h4>
                    <p><strong>Criado por:</strong> {ficha.user?.name || 'N/A'}</p>
                    <p><strong>Aprovado por:</strong> {ficha.aprovadoPor?.name || 'N/A'}</p>
                    <p><strong>Data de Aprovação:</strong> {ficha.data_aprovacao || 'N/A'}</p>
                </div>

                {/* Botões de Navegação */}
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
