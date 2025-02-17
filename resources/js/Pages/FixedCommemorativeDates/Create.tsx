import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/components/fixedcommemorativesdates.css';

const Create: React.FC = () => {
  const { data, setData, post, errors } = useForm({
    name: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('fixed-commemorative-dates.store'));
  };

  return (
    <AuthenticatedLayout>
      <div className="container">
        <h1>Adicionar Data Comemorativa Fixa</h1>
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
              type="text"
              id="date"
              className="form-control"
              placeholder="MM-DD"
              value={data.date}
              onChange={e => setData('date', e.target.value)}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </div>
          <button type="submit" className="btn btn-primary mt-3">Adicionar</button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
