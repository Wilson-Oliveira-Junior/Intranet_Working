import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProfileEdit: React.FC = ({ user }) => {
    const [userDetails, setUserDetails] = useState(user);
    const [successMessage, setSuccessMessage] = useState<string>('');

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

    return (
        <AuthenticatedLayout user={user}>
            <div className="container">
                <h1>Editar Perfil</h1>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
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
                            value={userDetails.sector || ''}
                            onChange={(e) => setUserDetails({ ...userDetails, sector: e.target.value })}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-4">
                        <label>Data de Nascimento:</label>
                        <input
                            type="date"
                            value={userDetails.birth_date || ''}
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
                            onChange={(e) => {
                                if (e.target.files) {
                                    setUserDetails({ ...userDetails, profilepicture: e.target.files[0] });
                                }
                            }}
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

export default ProfileEdit;
