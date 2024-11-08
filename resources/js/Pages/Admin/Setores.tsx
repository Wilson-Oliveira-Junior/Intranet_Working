import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/setores.css';

const sectors: React.FC = () => {
    const { user, sectors } = usePage().props as { user: User, sectors: any[] };

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [setorAtual, setSetorAtual] = useState<any | null>(null);
    const [sectorsState, setsectorsState] = useState(sectors);

    // Lógica de edição
    const editarSetor = (setor: any) => {
        setSetorAtual(setor);
        setIsAddModalOpen(true);
    };

    // Lógica de exclusão
    const deletarSetor = (setorId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este setor?')) {
            Inertia.delete(`/admin/setores/${setorId}`).then(() => {
                setSuccessMessage('Setor excluído com sucesso!');
                setsectorsState(sectorsState.filter(setor => setor.id !== setorId));
            });
        }
    };

    const salvarSetor = (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        if (setorAtual) {
            Inertia.put(`/admin/setores/${setorAtual.id}`, formData).then(() => {
                setSuccessMessage('Setor editado com sucesso!');
                Inertia.get('/admin/sectors');
                setIsAddModalOpen(false);
            });
        } else {
            Inertia.post('/admin/setores', formData).then(() => {
                setSuccessMessage('Setor adicionado com sucesso!');
                Inertia.get('/admin/sectors');
                setIsAddModalOpen(false);
            });
        }
    };


    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Setores Cadastrados</h1>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Descrição</th>
                            <th>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(sectorsState) && sectorsState.length > 0 ? (
                            sectorsState.map((setor) => (
                                <tr key={setor.id}>
                                    <td>{setor.id}</td>
                                    <td>{setor.name}</td>
                                    <td>{setor.email}</td>
                                    <td>{setor.description}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => editarSetor(setor)}>
                                            Editar
                                        </button>
                                        <button className="btn deletar" onClick={() => deletarSetor(setor.id)}>
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Nenhum setor cadastrado.
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
                        <form onSubmit={salvarSetor}>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={setorAtual ? setorAtual.name : ''}
                                    required
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={setorAtual ? setorAtual.email : ''}
                                    required
                                />
                            </label>
                            <label>
                                Descrição:
                                <textarea
                                    name="description"
                                    defaultValue={setorAtual ? setorAtual.description : ''}
                                    required
                                />
                            </label>
                            <button type="submit">{setorAtual ? 'Salvar Edição' : 'Adicionar Setor'}</button>
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

export default sectors;
