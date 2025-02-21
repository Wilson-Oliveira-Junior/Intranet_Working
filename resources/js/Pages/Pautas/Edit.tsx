import React from 'react';
import { useForm, usePage } from '@inertiajs/react';

const PautasEdit = () => {
    const { pauta } = usePage().props;
    const { data, setData, put, errors } = useForm({
        urgencia: pauta.idUrgencia || '',
        titulo: pauta.titulo || '',
        projetopauta: pauta.idprojeto || '',
        idresponsavel_pauta: pauta.idresponsavel || '',
        datadesejada_tarefa: pauta.data_desejada || '',
        idusuariocompartilhado: pauta.compartilhados.map(c => c.id_usuario) || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/pautas/${pauta.id}`);
    };

    return (
        <div>
            <h1>Editar Pauta</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Urgência</label>
                    <input
                        type="text"
                        value={data.urgencia}
                        onChange={e => setData('urgencia', e.target.value)}
                    />
                    {errors.urgencia && <div>{errors.urgencia}</div>}
                </div>
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        value={data.titulo}
                        onChange={e => setData('titulo', e.target.value)}
                    />
                    {errors.titulo && <div>{errors.titulo}</div>}
                </div>
                <div>
                    <label>Projeto</label>
                    <input
                        type="text"
                        value={data.projetopauta}
                        onChange={e => setData('projetopauta', e.target.value)}
                    />
                    {errors.projetopauta && <div>{errors.projetopauta}</div>}
                </div>
                <div>
                    <label>Responsável</label>
                    <input
                        type="text"
                        value={data.idresponsavel_pauta}
                        onChange={e => setData('idresponsavel_pauta', e.target.value)}
                    />
                    {errors.idresponsavel_pauta && <div>{errors.idresponsavel_pauta}</div>}
                </div>
                <div>
                    <label>Data Desejada</label>
                    <input
                        type="date"
                        value={data.datadesejada_tarefa}
                        onChange={e => setData('datadesejada_tarefa', e.target.value)}
                    />
                    {errors.datadesejada_tarefa && <div>{errors.datadesejada_tarefa}</div>}
                </div>
                <div>
                    <label>Usuários Compartilhados</label>
                    <input
                        type="text"
                        value={data.idusuariocompartilhado}
                        onChange={e => setData('idusuariocompartilhado', e.target.value.split(','))}
                    />
                    {errors.idusuariocompartilhado && <div>{errors.idusuariocompartilhado}</div>}
                </div>
                <button type="submit">Salvar</button>
            </form>
        </div>
    );
};

export default PautasEdit;
