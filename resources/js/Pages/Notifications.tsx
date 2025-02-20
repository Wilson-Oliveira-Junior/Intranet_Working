import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Notifications: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <div className="container">
        <h1>Notificações</h1>
        <p>Esta é a página de notificações.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Notifications;
