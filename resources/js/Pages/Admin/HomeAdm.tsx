import '../../../css/components/Homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeAdm = () => {
  return (
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
            <p>{/* valor para usuários */}</p>
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
            <h2>Aniversariante do Mês</h2>
            <div className="profile">
              <img
                alt="Profile picture of Pedro Pavan"
                height="50"
                src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-M52z0QnaG6sJcPhw7H6PLtKs.png"
                width="50"
              />
              <p>Pedro Pavan</p>
            </div>
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
              <div><i className="fas fa-phone-alt" style={{ color: '#00c851' }}></i> Marcelo Abib - 7210</div>
              <div><i className="fas fa-phone-alt" style={{ color: '#33b5e5' }}></i> Rodrigo Camillo - 7211</div>
              <div><i className="fas fa-phone-alt" style={{ color: '#ff4444' }}></i> Letícia dos Santos Couto - 7201</div>
              <div><i className="fas fa-phone-alt" style={{ color: '#ff4444' }}></i> José Carvalho - 7202</div>
              <div><i className="fas fa-phone-alt" style={{ color: '#aa66cc' }}></i> Andre Magalhães - 7209</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdm;
