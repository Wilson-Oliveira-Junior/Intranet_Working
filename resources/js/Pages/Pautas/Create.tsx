import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/pautas.css';

const PautasCreate = () => {
    const { clientes, usuarios } = usePage().props;
    const { data, setData, post, errors } = useForm({
        urgencia: '',
        titulo: '',
        projetopauta: '',
        idresponsavel_pauta: '',
        datadesejada_tarefa: '',
        idusuariocompartilhado: []
    });

    const [showDateField, setShowDateField] = useState(false);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleUrgenciaChange = (e) => {
        const value = e.target.value;
        setData('urgencia', value);
        setShowDateField(value === 'data_estipulada' || value === 'cronograma');
    };

    const handleUsuarioChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedUsuarios(selected);
        setData('idusuariocompartilhado', selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/pautas'); // Ensure the endpoint matches the route in web.php
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleAddUsuario = (usuarioId) => {
        if (usuarioId && !selectedUsuarios.includes(usuarioId)) {
            const updatedUsuarios = [...selectedUsuarios, usuarioId];
            setSelectedUsuarios(updatedUsuarios);
            setData('idusuariocompartilhado', updatedUsuarios);
        }
        setShowModal(false);
    };

    const handleRemoveUsuario = (usuario) => {
        const updatedUsuarios = selectedUsuarios.filter(u => u !== usuario);
        setSelectedUsuarios(updatedUsuarios);
        setData('idusuariocompartilhado', updatedUsuarios);
    };

    return (
        <AuthenticatedLayout>
            <div className="pautas-container">
                <h1 className="pauta-title">Criar Nova Pauta</h1>
                <form onSubmit={handleSubmit} className="pauta-form">
                    <div className="form-group">
                        <label>Urgência</label>
                        <select
                            className="form-control"
                            value={data.urgencia}
                            onChange={handleUrgenciaChange}
                        >
                            <option value="">Selecione a urgência</option>
                            <option value="imediatamente">Tem que ser feito imediatamente!</option>
                            <option value="mesmo_dia">Tem que ser feito no mesmo dia!</option>
                            <option value="data_estipulada">Tem que ser feito até a data estipulada</option>
                            <option value="cronograma">Encaixar no cronograma</option>
                        </select>
                        {errors.urgencia && <div className="error">{errors.urgencia}</div>}
                    </div>
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            className="form-control"
                            value={data.titulo}
                            onChange={e => setData('titulo', e.target.value)}
                        />
                        {errors.titulo && <div className="error">{errors.titulo}</div>}
                    </div>
                    <div className="form-group">
                        <label>Projeto</label>
                        <select
                            className="form-control"
                            value={data.projetopauta}
                            onChange={e => setData('projetopauta', e.target.value)}
                        >
                            <option value="">Selecione um cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                            ))}
                        </select>
                        {errors.projetopauta && <div className="error">{errors.projetopauta}</div>}
                    </div>
                    <div className="form-group">
                        <label>Responsável</label>
                        <select
                            className="form-control"
                            value={data.idresponsavel_pauta}
                            onChange={e => setData('idresponsavel_pauta', e.target.value)}
                        >
                            <option value="">Selecione um responsável</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                            ))}
                        </select>
                        {errors.idresponsavel_pauta && <div className="error">{errors.idresponsavel_pauta}</div>}
                    </div>
                    {showDateField && (
                        <div className="form-group">
                            <label>Data Desejada</label>
                            <input
                                type="date"
                                className="form-control"
                                value={data.datadesejada_tarefa}
                                onChange={e => setData('datadesejada_tarefa', e.target.value)}
                            />
                            {errors.datadesejada_tarefa && <div className="error">{errors.datadesejada_tarefa}</div>}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Usuários Compartilhados</label>
                        <select
                            multiple
                            className="form-control"
                            value={selectedUsuarios}
                            onChange={handleUsuarioChange}
                        >
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(true)}>Adicionar Usuário</button>
                        {selectedUsuarios.map(usuario => (
                            <div key={usuario}>
                                {usuarios.find(u => u.id === usuario)?.name} <button type="button" onClick={() => handleRemoveUsuario(usuario)}>Remover</button>
                            </div>
                        ))}
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">Salvar</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Adicionar Usuário</h2>
                            <select
                                className="form-control"
                                onChange={(e) => handleAddUsuario(e.target.value)}
                            >
                                <option value="">Selecione um usuário</option>
                                {usuarios.map(usuario => (
                                    <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                                ))}
                            </select>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PautasCreate;
