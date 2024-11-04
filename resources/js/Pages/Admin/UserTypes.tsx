import React from 'react';
import { usePage } from '@inertiajs/react';

interface UserType {
    id: number;
    name: string;
    description: string;
}

interface Props {
    userTypes: UserType[];
}

const UserTypes: React.FC<Props> = ({ userTypes }) => {
    const editarUsuario = (id: number) => {
        Inertia.visit(`/admin/user-types/${id}/edit`);
    };

    const gerenciarPermissoes = (id: number) => {
        Inertia.visit(`/admin/user-types/${id}/permissions`);
    };

    const deletarUsuario = (id: number) => {
        if (confirm(`Tem certeza que deseja deletar o usuário com ID: ${id}?`)) {
            Inertia.delete(`/admin/user-types/${id}`);
        }
    };

    return (
        <div className="container">
            <h1>Tipos de Usuários</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {userTypes.map(userType => (
                        <tr key={userType.id}>
                            <td>{userType.name}</td>
                            <td>{userType.description}</td>
                            <td>
                                <button className="btn editar" onClick={() => editarUsuario(userType.id)}>Editar</button>
                                <button className="btn permissoes" onClick={() => gerenciarPermissoes(userType.id)}>Permissões</button>
                                <button className="btn deletar" onClick={() => deletarUsuario(userType.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTypes;
