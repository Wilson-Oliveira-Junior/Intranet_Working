import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Help: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <div className="container">
        <h1>Ajuda</h1>
        <p>Esta é a página de ajuda.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Help;
