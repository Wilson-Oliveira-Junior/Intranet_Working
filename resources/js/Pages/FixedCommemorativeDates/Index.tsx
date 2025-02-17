import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Index: React.FC = () => {
  const { fixedCommemorativeDates, auth } = usePage().props;

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="container">
        <h1>Datas Comemorativas Fixas</h1>
        <a href={route('fixed-commemorative-dates.create')} className="btn btn-primary">Adicionar Data Comemorativa Fixa</a>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fixedCommemorativeDates.map((date, index) => (
              <tr key={index}>
                <td>{date.name}</td>
                <td>{new Date(date.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</td>
                <td>
                  <a href={route('fixed-commemorative-dates.edit', date.id)} className="btn btn-warning">Editar</a>
                  <form action={route('fixed-commemorative-dates.destroy', date.id)} method="POST" style={{ display: 'inline' }}>
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
