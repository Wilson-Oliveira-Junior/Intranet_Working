import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Settings: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <div className="container">
        <h1>Configurações</h1>
        <p>Esta é a página de configurações.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Settings;
