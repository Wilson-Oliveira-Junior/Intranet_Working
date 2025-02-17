import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/fixedcommemorativesdates.css';

const Index: React.FC = () => {
  const { commemorativeDates, auth } = usePage().props;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="container">
        <h1>Datas Comemorativas</h1>
        <a href={route('commemorative-dates.create')} className="btn btn-primary">Adicionar Data Comemorativa</a>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {commemorativeDates.map((date, index) => (
              <tr key={index}>
                <td>{date.name}</td>
                <td>{formatDate(date.date)}</td>
                <td>
                  <a href={route('commemorative-dates.edit', date.id)} className="btn btn-warning">Editar</a>
                  <form action={route('commemorative-dates.destroy', date.id)} method="POST" style={{ display: 'inline' }}>
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="btn btn-danger">Deletar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
