import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/users.css';

interface User {
    id: number;
    name: string;
    email: string;
    sector: string;
    status: string;
    image?: string;
    middlename?: string;
    lastname?: string;
    sex?: string;
    birth_date?: string;
    cellphone?: string;
    profilepicture?: string;
    password?: string;
    ramal?: string;
    cep?: string;
    rua?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
}

interface UserType {
    id: number;
    name: string;
}

interface Sector {
    id: number;
    name: string;
}

const Users: React.FC = () => {
    const { users, user, userTypes, sectors } = usePage().props as {
        users: User[],
        user: User,
        userTypes: UserType[],
        sectors: Sector[]
    };
    console.log(sectors);

    if (!user) {
        return <div>Usuário não encontrado ou não autenticado.</div>;
    }

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [usersState, setUsersState] = useState<User[]>(users);
    const [activeTab, setActiveTab] = useState<'details' | 'address' | 'redesociais' | 'sobre'>('details');

    const [userDetails, setUserDetails] = useState<User>({
        id: 0,
        name: '',
        email: '',
        sector: '',
        status: '',
        middlename: '',
        lastname: '',
        sex: '',
        birth_date: '',
        cellphone: '',
        profilepicture: '',
        password: '',
        ramal: '',
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
        facebook: '',
        instagram: '',
        linkedin: '',
    });

    const toggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        setUsersState((prevState) =>
            prevState.map((user) =>
                user.id === id ? { ...user, status: newStatus } : user
            )
        );

        const url = `/admin/users/${id}/status`;
        Inertia.put(url, { status: newStatus }, {
            onSuccess: () => {
                setSuccessMessage(`Status do usuário atualizado para ${newStatus}!`);
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDeleteUser = (id: number) => {
        if (window.confirm('Tem certeza de que deseja deletar este usuário?')) {
            Inertia.delete(`/admin/users/${id}`, {
                onSuccess: () => {
                    setSuccessMessage('Usuário deletado com sucesso!');
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const handleAssignRole = () => {
        if (selectedUserType && userId) {
            Inertia.put(`/admin/users/${userId}/assign-role`, { user_type_id: selectedUserType }, {
                onSuccess: () => {
                    setShowRoleModal(false);
                    setSuccessMessage('Papel atribuído com sucesso!');
                },
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleEditUser = (id: number) => {
        const userToEdit = usersState.find((u) => u.id === id);
        if (userToEdit) {
            setUserDetails(userToEdit);
        }
        setUserId(id);
        setShowDetailsModal(true);
    };

    const handleSaveDetails = () => {
        Inertia.put(`/admin/users/${userId}/update-profile`, userDetails, {
            onSuccess: () => {
                setShowDetailsModal(false);
                setSuccessMessage('Detalhes do usuário atualizados com sucesso!');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error(errors);
                setSuccessMessage('Erro ao atualizar os detalhes do usuário. Tente novamente.');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
    };

    // Função de manipulação do campo 'setor'
    const handleSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, sector: e.target.value });
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Painel de Controle de Usuários</h1>

                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Setor</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(usersState) && usersState.length > 0 ? (
                            usersState.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        {user.image ? (
                                            <img src={user.image} alt="Imagem do usuário" width="50" height="50" />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.sector}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={user.status === 'Ativo'}
                                                onChange={() => toggleStatus(user.id, user.status)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td>
                                        <button
                                            className="btn editar"
                                            onClick={() => handleEditUser(user.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn papel"
                                            onClick={() => {
                                                setUserId(user.id);
                                                setShowRoleModal(true);
                                            }}
                                        >
                                            Papel
                                        </button>
                                        <button
                                            className="btn deletar"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {showRoleModal && (
                    <div className={`modal-overlay ${showRoleModal ? 'show' : ''}`}>
                        <div className="modal-content">
                            <h2>Atribuir Papel</h2>
                            <select
                                onChange={(e) => setSelectedUserType(Number(e.target.value))}
                                value={selectedUserType || ''}
                            >
                                <option value="">Selecione um tipo de usuário</option>
                                {userTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAssignRole}>Atribuir</button>
                            <button onClick={() => setShowRoleModal(false)} className="cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {showDetailsModal && (
                    <div className={`modal-overlay edit-modal-overlay ${showDetailsModal ? 'show' : ''}`}>
                        <div className="edit-modal-content">
                            {/* Abas de navegação */}
                            <div className="edit-modal-tabs">
                                <button
                                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Informações do Usuário
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    Endereço
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'redesociais' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('redesociais')}
                                >
                                    Redes Sociais
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'sobre' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('sobre')}
                                >
                                    Curiosidade
                                </button>
                            </div>

                            {/* Informações do Usuário */}
                            {activeTab === 'details' && (
                                <div className="tab-content">
                                    <h2>Informações do Usuário</h2>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Nome:</label>
                                            <input
                                                type="text"
                                                value={userDetails.name}
                                                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Sobrenome:</label>
                                            <input
                                                type="text"
                                                value={userDetails.middlename}
                                                onChange={(e) => setUserDetails({ ...userDetails, middlename: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Último Nome:</label>
                                            <input
                                                type="text"
                                                value={userDetails.lastname}
                                                onChange={(e) => setUserDetails({ ...userDetails, lastname: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>E-mail:</label>
                                            <input
                                                type="email"
                                                value={userDetails.email}
                                                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Sexo:</label>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="Masculino"
                                                        checked={userDetails.sex === 'Masculino'}
                                                        onChange={(e) => setUserDetails({ ...userDetails, sex: e.target.value })}
                                                    />
                                                    Masculino
                                                </label>
                                                <label className="ml-3">
                                                    <input
                                                        type="radio"
                                                        value="Feminino"
                                                        checked={userDetails.sex === 'Feminino'}
                                                        onChange={(e) => setUserDetails({ ...userDetails, sex: e.target.value })}
                                                    />
                                                    Feminino
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Setor:</label>
                                            <input
                                                type="text"
                                                value={userDetails.sector}
                                                onChange={(e) => setUserDetails({ ...userDetails, sector: e.target.value })}
                                                className="form-control"
                                                list="sectorSuggestions"
                                            />
                                            <datalist id="sectorSuggestions">
                                                {sectors.map((sector) => (
                                                    <option key={sector.id} value={sector.name} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Data de Nascimento:</label>
                                            <input
                                                type="date"
                                                value={userDetails.birth_date}
                                                onChange={(e) => setUserDetails({ ...userDetails, birth_date: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Celular:</label>
                                            <input
                                                type="text"
                                                value={userDetails.cellphone}
                                                onChange={(e) => setUserDetails({ ...userDetails, cellphone: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Foto de Perfil:</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleProfilePictureChange(e)}
                                                className="form-control"
                                            />
                                            {userDetails.profilepicture && (
                                                <img
                                                    src={userDetails.profilepicture}
                                                    alt="Pré-visualização da Foto de Perfil"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Senha:</label>
                                            <input
                                                type="password"
                                                value={userDetails.password}
                                                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Ramal:</label>
                                            <input
                                                type="text"
                                                value={userDetails.ramal}
                                                onChange={(e) => setUserDetails({ ...userDetails, ramal: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Endereço */}
                            {activeTab === 'address' && (
                                <div className="tab-content">
                                    <h2>Endereço do Usuário</h2>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>CEP:</label>
                                            <input
                                                type="text"
                                                value={userDetails.cep}
                                                onChange={(e) => setUserDetails({ ...userDetails, cep: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Rua:</label>
                                            <input
                                                type="text"
                                                value={userDetails.rua}
                                                onChange={(e) => setUserDetails({ ...userDetails, rua: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Bairro:</label>
                                            <input
                                                type="text"
                                                value={userDetails.bairro}
                                                onChange={(e) => setUserDetails({ ...userDetails, bairro: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Cidade:</label>
                                            <input
                                                type="text"
                                                value={userDetails.cidade}
                                                onChange={(e) => setUserDetails({ ...userDetails, cidade: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Estado:</label>
                                            <input
                                                type="text"
                                                value={userDetails.estado}
                                                onChange={(e) => setUserDetails({ ...userDetails, estado: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Redes Sociais */}
                            {activeTab === 'redesociais' && (
                                <div className="tab-content">
                                    <h2>Redes Sociais</h2>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label>Facebook:</label>
                                            <input
                                                type="text"
                                                value={userDetails.facebook}
                                                onChange={(e) => setUserDetails({ ...userDetails, facebook: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>Instagram:</label>
                                            <input
                                                type="text"
                                                value={userDetails.instagram}
                                                onChange={(e) => setUserDetails({ ...userDetails, instagram: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-4">
                                            <label>LinkedIn:</label>
                                            <input
                                                type="text"
                                                value={userDetails.linkedin}
                                                onChange={(e) => setUserDetails({ ...userDetails, linkedin: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Curiosidades sobre o Usuário */}
                            {activeTab === 'sobre' && (
                                <div className="tab-content">
                                    <h2>Curiosidades sobre Você</h2>
                                    <div className="form-group">
                                        <textarea
                                            value={userDetails.sobre}
                                            onChange={(e) => setUserDetails({ ...userDetails, sobre: e.target.value })}
                                            className="form-control"
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Botões de ação */}
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary ml-2"
                                    onClick={handleSaveDetails}
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Users;
