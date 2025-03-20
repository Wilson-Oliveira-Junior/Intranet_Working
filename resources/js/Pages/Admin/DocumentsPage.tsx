import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DocumentsTable from './DocumentsTable';
import axios from 'axios';

const DocumentsPage = ({ area }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Busca os documentos do setor do usuário logado
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`/api/documents?area=${area.toLowerCase()}`);
                setDocuments(response.data);
            } catch (error) {
                console.error('Erro ao buscar documentos:', error);
            }
        };

        fetchDocuments();
    }, [area]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('area', area.toLowerCase());

            try {
                const response = await axios.post('/api/documents/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setDocuments((prevDocuments) => [...prevDocuments, response.data]);
            } catch (error) {
                console.error('Erro ao fazer upload do documento:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Documentos - {area}</h1>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <DocumentsTable documents={documents} />
            </div>
        </AuthenticatedLayout>
    );
};

export default DocumentsPage;
