import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/Permissao.css';

const Permissions: React.FC = () => {
    const { user, permissions } = usePage().props as { user: User, permissions: any[] };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [permissaoAtual, setPermissaoAtual] = useState<any | null>(null);
    const [permissionsState, setPermissionsState] = useState(permissions);

    const editarPermissao = (permissao: any) => {
        setPermissaoAtual(permissao);
        setIsAddModalOpen(true);
    };

    const deletarPermissao = (permissaoId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta permissão?')) {
            Inertia.delete(`/admin/permissoes/${permissaoId}`).then(() => {
                setSuccessMessage('Permissão excluída com sucesso!');
                setPermissionsState(permissionsState.filter((permissao) => permissao.id !== permissaoId)); // Remove a permissão da lista local
            });
        }
    };

    const salvarPermissao = (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        // Para garantir que estamos passando os dados corretamente, vamos verificar se as chaves e valores estão corretos.
        const data = Object.fromEntries(formData.entries());
        console.log(data);  // Para depuração, verifique os dados do formulário

        if (permissaoAtual) {
            // Editar permissão existente
            Inertia.put(`/admin/permissoes/${permissaoAtual.id}`, data).then(() => {
                // Atualiza a permissão no estado local com as novas informações
                setPermissionsState(
                    permissionsState.map((permissao) =>
                        permissao.id === permissaoAtual.id ? { ...permissao, ...data } : permissao
                    )
                );
                setSuccessMessage('Permissão editada com sucesso!');
                setIsAddModalOpen(false);
            });
        } else {
            // Adicionar nova permissão
            Inertia.post('/admin/permissoes', data).then(() => {
                // Adiciona a nova permissão no estado local
                setPermissionsState([...permissionsState, { id: Date.now(), ...data }]);
                setSuccessMessage('Permissão adicionada com sucesso!');
                setIsAddModalOpen(false);
            });
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Permissões Cadastradas</h1>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Label</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(permissionsState) && permissionsState.length > 0 ? (
                            permissionsState.map((permissao) => (
                                <tr key={permissao.id}>
                                    <td>{permissao.id}</td>
                                    <td>{permissao.name}</td>
                                    <td>{permissao.label}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => editarPermissao(permissao)}>
                                            Editar
                                        </button>
                                        <button className="btn deletar" onClick={() => deletarPermissao(permissao.id)}>
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    Nenhuma permissão cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn novo" onClick={() => setIsAddModalOpen(true)}>
                    Adicionar Novo
                </button>

                {isAddModalOpen && (
                    <div className="modal">
                        <form onSubmit={salvarPermissao}>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={permissaoAtual ? permissaoAtual.name : ''}
                                    required
                                />
                            </label>
                            <label>
                                Label:
                                <input
                                    type="text"
                                    name="label"
                                    defaultValue={permissaoAtual ? permissaoAtual.label : ''}
                                    required
                                />
                            </label>
                            <button type="submit">{permissaoAtual ? 'Salvar Edição' : 'Adicionar Permissão'}</button>
                            <button type="button" onClick={() => setIsAddModalOpen(false)}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Permissions;
