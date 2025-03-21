import React, { useState } from 'react';
import ClipboardJS from 'clipboard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/listagemftp.css'; // Importação do CSS

const ListagemFTP = ({ auth, ftps }) => {
    const [search, setSearch] = useState('');

    const filteredData = ftps.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    React.useEffect(() => {
        new ClipboardJS('.btn-copy');
    }, []);

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="listagem-ftp">
                <h1 className="listagem-ftp-title">Listagem de FTPs</h1>
                <div className="listagem-ftp-search">
                    <input
                        type="text"
                        placeholder="Buscar Servidor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="listagem-ftp-input"
                    />
                </div>
                <table className="listagem-ftp-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Servidor</th>
                            <th>Protocolo</th>
                            <th>Usuário</th>
                            <th>Senha</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.servidor}</td>
                                <td>{item.protocolo}</td>
                                <td>{item.usuario}</td>
                                <td>{item.senha}</td>
                                <td>{item.observacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default ListagemFTP;
