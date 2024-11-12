import { useState, useEffect } from 'react';
import '../../../css/components/Homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';


interface User {
    name: string;
    profilepicture: string;
    birth_date: string;
}

const HomeAdm: React.FC = () => {
  const { user, activeUsersCount: activeUsersCountFromProps } = usePage().props as { user: User, activeUsersCount: number };

  const [activeUsersCount, setActiveUsersCount] = useState<number>(activeUsersCountFromProps || 0);
  const [birthdays, setBirthdays] = useState<User[]>([]);

  if (!user) {
    return <div>Erro: Usuário não encontrado. Verifique a autenticação.</div>;
  }

  useEffect(() => {
    axios.get('/active-users-count')
      .then(response => {
        setActiveUsersCount(response.data.count);
      })
      .catch(error => {
        console.error('Erro ao carregar dados de usuários ativos', error);
      });
  }, []);

  useEffect(() => {
    axios.get('/birthdays-this-month')
      .then(response => setBirthdays(response.data))
      .catch(error => console.error('Erro ao carregar aniversariantes', error));
  }, []);

  return (
    <AuthenticatedLayout user={user}>
      <div className="Home">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card">
              <h2>ENTREGUES</h2>
              <p>{/* valor para entregues */}</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card">
              <h2>TAREFAS</h2>
              <p>{/* valor para tarefas */}</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card">
              <h2>USUÁRIOS</h2>
              <p>{activeUsersCount}</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card">
              <h2>CLIENTES</h2>
              <p>{/* valor para clientes */}</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card">
              <h2>Minhas Pautas (0)</h2>
              <p>Sem registros.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <h2>Sugestões (0)</h2>
              <p>Sem registros.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <h2>Aniversariantes do Mês</h2>
              {birthdays.length > 0 ? (
                <div className="birthday-list">
                  {birthdays.map((person, index) => (
                    <div key={index} className="birthday-item">
                      <img
                        alt={`Foto de perfil de ${person.name}`}
                        src={person.profilepicture || 'https://via.placeholder.com/50'}
                        width="50"
                        height="50"
                      />
                      <div>
                        <p>{person.name}</p>
                        <p>{new Date(person.birth_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum aniversário este mês.</p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <h2>Wiki Lógica Digital</h2>
              <p>
                O wiki da lógica digital foi desenvolvido com o intuito de expor as etapas de
                desenvolvimento de cada área, padrões a serem seguidos em determinados prosseguimentos,
                etapas e treinamento para quem é novo na lógica, e também temos algumas dúvidas frequentes
                dos clientes ou da própria equipe.
              </p>
              <h3>Wiki - Departamentos da Lógica Digital</h3>
              <ul>
                <li>Atendimento</li>
                <li>Comercial</li>
                <li>Desenvolvimento</li>
                <li>Criação</li>
                <li>Marketing</li>
                <li>RH</li>
              </ul>
              <button>Acessar Wiki</button>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card">
              <h2>Ramais</h2>
              <div className="contact">
                <div><i className="bi bi-telephone-fill" style={{ color: '#00c851' }}></i>Marcelo Abib - 7210</div>
                <div><i className="bi bi-telephone-fill" style={{ color: '#33b5e5' }}></i> Rodrigo Camillo - 7211</div>
                <div><i className="bi bi-telephone-fill" style={{ color: '#ff4444' }}></i> Letícia dos Santos Couto - 7201</div>
                <div><i className="bi bi-telephone-fill" style={{ color: '#ff4444' }}></i> José Carvalho - 7202</div>
                <div><i className="bi bi-telephone-fill" style={{ color: '#aa66cc' }}></i> Andre Magalhães - 7209</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default HomeAdm;
