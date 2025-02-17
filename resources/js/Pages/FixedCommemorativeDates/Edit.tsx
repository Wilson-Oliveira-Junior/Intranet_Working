import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Edit: React.FC = () => {
  const { fixedCommemorativeDate } = usePage().props;
  const { data, setData, put, errors } = useForm({
    name: fixedCommemorativeDate.name || '',
    date: fixedCommemorativeDate.date || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('fixed-commemorative-dates.update', fixedCommemorativeDate.id));
  };

  return (
    <AuthenticatedLayout>
      <div className="container">
        <h1>Editar Data Comemorativa Fixa</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={data.date}
              onChange={e => setData('date', e.target.value)}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </div>
          <button type="submit" className="btn btn-primary mt-3">Atualizar</button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Edit;
