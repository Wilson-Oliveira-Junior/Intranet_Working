import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/profile.css';

const ProfileShow: React.FC = ({ user, sectors, isAdmin }) => {
    const [userDetails, setUserDetails] = useState(user);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'details' | 'address' | 'redesociais' | 'sobre'>('details');

    const handleSaveDetails = () => {
        Inertia.patch(`/profile`, userDetails, {
            onSuccess: () => {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUserDetails({ ...userDetails, profilepicture: e.target.files[0] });
        }
    };

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Meu Perfil</h1>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
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

                {activeTab === 'details' && (
                    <div className="tab-content">
                        <h2>Informações do Usuário</h2>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    value={userDetails.name || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Sobrenome:</label>
                                <input
                                    type="text"
                                    value={userDetails.middlename || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, middlename: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Último Nome:</label>
                                <input
                                    type="text"
                                    value={userDetails.lastname || ''}
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
                                    value={userDetails.email || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Sexo:</label>
                                <div className="radio-group">
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
                            {isAdmin && (
                                <div className="form-group col-4">
                                    <label>Setor:</label>
                                    <input
                                        type="text"
                                        value={userDetails.sector || ''}
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
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>Data de Nascimento:</label>
                                <input
                                    type="date"
                                    value={userDetails.birth_date ? new Date(userDetails.birth_date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, birth_date: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Celular:</label>
                                <input
                                    type="text"
                                    value={userDetails.cellphone || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, cellphone: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="profilepicture">Imagem de Perfil:</label>
                                <input
                                    type="file"
                                    id="profilepicture"
                                    name="profilepicture"
                                    accept="image/*"
                                    onChange={handleFileChange}
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
                                    value={userDetails.password || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Ramal:</label>
                                <input
                                    type="text"
                                    value={userDetails.ramal || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, ramal: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'address' && (
                    <div className="tab-content">
                        <h2>Endereço do Usuário</h2>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>CEP:</label>
                                <input
                                    type="text"
                                    value={userDetails.cep || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, cep: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Rua:</label>
                                <input
                                    type="text"
                                    value={userDetails.rua || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, rua: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Bairro:</label>
                                <input
                                    type="text"
                                    value={userDetails.bairro || ''}
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
                                    value={userDetails.cidade || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, cidade: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Estado:</label>
                                <input
                                    type="text"
                                    value={userDetails.estado || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, estado: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'redesociais' && (
                    <div className="tab-content">
                        <h2>Redes Sociais</h2>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>Facebook:</label>
                                <input
                                    type="text"
                                    value={userDetails.facebook || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, facebook: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>Instagram:</label>
                                <input
                                    type="text"
                                    value={userDetails.instagram || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, instagram: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-4">
                                <label>LinkedIn:</label>
                                <input
                                    type="text"
                                    value={userDetails.linkedin || ''}
                                    onChange={(e) => setUserDetails({ ...userDetails, linkedin: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sobre' && (
                    <div className="tab-content">
                        <h2>Curiosidades sobre Você</h2>
                        <div className="form-group">
                            <textarea
                                value={userDetails.sobre || ''}
                                onChange={(e) => setUserDetails({ ...userDetails, sobre: e.target.value })}
                                className="form-control"
                            ></textarea>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary ml-2"
                        onClick={handleSaveDetails}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProfileShow;

