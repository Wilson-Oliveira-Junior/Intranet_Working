import React from 'react';

const DocumentsTable = ({ documents }) => {
    return (
        <div className="documents-table">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Área</th>
                        <th className="border border-gray-300 px-4 py-2">Documento</th>
                        <th className="border border-gray-300 px-4 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{doc.area}</td>
                            <td className="border border-gray-300 px-4 py-2">{doc.name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Visualizar
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentsTable;
