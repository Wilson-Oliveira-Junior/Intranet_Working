import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const UserTypes: React.FC = () => {
    const { userTypes } = usePage().props;

    // Estado para o formulário de adição
    const [newUserType, setNewUserType] = useState({ name: '', description: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewUserType(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.post('/admin/user-types', newUserType, {
            onSuccess: () => {
                setSuccessMessage('Tipo de usuário adicionado com sucesso!');
                setNewUserType({ name: '', description: '' }); // Limpar o formulário após o envio
            },
        });
    };

    const editarUsuario = (id: number) => {
        // Lógica para editar tipo de usuário
        console.log(`Editar usuário com ID: ${id}`);
    };

    const gerenciarPermissoes = (id: number) => {
        // Lógica para gerenciar permissões
        console.log(`Gerenciar permissões para usuário com ID: ${id}`);
    };

    const deletarUsuario = (id: number) => {
        // Lógica para deletar tipo de usuário
        console.log(`Deletar usuário com ID: ${id}`);
    };

    return (
        <div className="container">
            <h1>Tipos de Usuários</h1>

            {/* Mensagem de sucesso */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Formulário para adicionar novo tipo de usuário */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={newUserType.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descrição"
                    value={newUserType.description}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="btn novo">Adicionar Novo Tipo de Usuário</button>
            </form>

            {/* Tabela de tipos de usuários */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(userTypes) && userTypes.length > 0 ? (
                        userTypes.map((userType) => (
                            <tr key={userType.id}>
                                <td>{userType.name}</td>
                                <td>{userType.description}</td>
                                <td>
                                    <button className="btn editar" onClick={() => editarUsuario(userType.id)}>
                                        Editar
                                    </button>
                                    <button className="btn permissoes" onClick={() => gerenciarPermissoes(userType.id)}>
                                        Permissões
                                    </button>
                                    <button className="btn deletar" onClick={() => deletarUsuario(userType.id)}>
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center">
                                Nenhum tipo de usuário encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTypes;
