import React, { useEffect, useState } from 'react';

const Step3 = ({ data, setData, nextStep, prevStep }: { data: any, setData: any, nextStep: any, prevStep: any }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sliderOpen1, setSliderOpen1] = useState(false);
    const [sliderOpen2, setSliderOpen2] = useState(false);
    const [sliderOpen3, setSliderOpen3] = useState(false);
    const [sliderOpen4, setSliderOpen4] = useState(false);

    useEffect(() => {
        const fetchTipoProjetos = async () => {
            try {
                const response = await fetch('/api/tipo-projetos');
                if (response.ok) {
                    const result = await response.json();
                    console.log('Fetched tipo_projetos:', result.data); // Debug log
                    setData('tipo_projetos', result.data);
                } else {
                    console.error('Erro ao carregar tipo de projetos:', response.statusText);
                    setError('Erro ao carregar tipo de projetos');
                }
            } catch (error) {
                console.error('Erro ao buscar tipo de projetos:', error);
                setError('Erro ao buscar tipo de projetos');
            } finally {
                setLoading(false);
            }
        };

        fetchTipoProjetos();
    }, []);

    useEffect(() => {
        console.log('Data:', data);
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="tab-pane active" id="step3">
            <h2 className="h2-titulo"><i className="ni ni-paper-diploma"></i> <span>Dados do</span> Projeto</h2>

            {/* Campos do Projeto */}
            <div id="clonar-campos-projeto" className="row">
                {/* Tipo de Projeto */}
                <div className="form-group form-ficha-comercial col-md-12">
                    <h4 className="h4-fechamento">Selecione um projeto:</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha select2"
                            name="tipo_projeto"
                            value={data.tipo_projeto}
                            onChange={e => setData('tipo_projeto', e.target.value)}
                        >
                            <option value="0">Selecione um projeto</option>
                            {Array.isArray(data.tipo_projetos) && data.tipo_projetos.map((projeto: any) => (
                                <option key={projeto.id} value={projeto.nome}>{projeto.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Fechamento do Contrato */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Data Fechamento do Contrato</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            name="fechamento_contrato"
                            type="date"
                            value={data.fechamento_contrato}
                            onChange={e => setData('fechamento_contrato', e.target.value)}
                        />
                    </div>
                </div>

                {/* Tipo de Manutenção */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Tipo de Manutenção</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha"
                            name="tipo_manutencao"
                            value={data.tipo_manutencao}
                            onChange={e => setData('tipo_manutencao', e.target.value)}
                        >
                            <option value="--">--</option>
                            <option value="Mensal">Mensal</option>
                            <option value="Hora Técnica">Hora Técnica</option>
                        </select>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Conteúdo</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha"
                            name="conteudo_site"
                            value={data.conteudo_site}
                            onChange={e => setData('conteudo_site', e.target.value)}
                        >
                            <option value="--">--</option>
                            <option value="Responsabilidade do Cliente">Responsabilidade do Cliente</option>
                            <option value="Nós vamos desenvolver">Nós vamos desenvolver</option>
                            <option value="Baseado no site antigo">Baseado no site antigo</option>
                            <option value="Reestrutura do Conteúdo">Reestrutura do Conteúdo</option>
                        </select>
                    </div>
                </div>

                {/* Vai ter SSL/CDN */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Vai ter SSL/CDN?</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha"
                            name="ssl_cdn"
                            value={data.ssl_cdn}
                            onChange={e => setData('ssl_cdn', e.target.value)}
                        >
                            <option value="--">--</option>
                            <option value="SSL">SSL</option>
                            <option value="CDN">CDN</option>
                            <option value="SSL/CDN">SSL/CDN</option>
                            <option value="Não Terá">Não Terá</option>
                        </select>
                    </div>
                </div>

                {/* Prazo */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Prazo</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha"
                            name="prazo_projeto"
                            value={data.prazo_projeto}
                            onChange={e => setData('prazo_projeto', e.target.value)}
                        >
                            <option value="--">--</option>
                            <option value="30">30 dias</option>
                            <option value="45">45 dias</option>
                            <option value="50">50 dias</option>
                            <option value="65">65 dias</option>
                        </select>
                    </div>
                </div>

                {/* Idiomas */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Idiomas</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control select-ficha"
                            name="idiomas"
                            value={data.idiomas}
                            onChange={e => setData('idiomas', e.target.value)}
                        >
                            <option value="--">--</option>
                            <option value="Português">Português</option>
                            <option value="Inglês">Inglês</option>
                            <option value="Espanhol">Espanhol</option>
                            <option value="Italiano">Italiano</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                </div>

                {/* Itens de Menu */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Itens de Menu</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <textarea
                            className="form-control"
                            name="itens_menu"
                            placeholder="Escreva aqui os itens de menu..."
                            value={data.itens_menu}
                            onChange={e => setData('itens_menu', e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Itens Página Principal */}
                <div className="form-group form-ficha-comercial col-md-4">
                    <h4 className="h4-fechamento">Itens Página Principal</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <textarea
                            className="form-control"
                            name="itens_pp"
                            placeholder="Escreva aqui os itens da página principal..."
                            value={data.itens_pp}
                            onChange={e => setData('itens_pp', e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Slider Sections */}
            <div className="slider-section slider-section-1">
                <h5 onClick={() => setSliderOpen1(!sliderOpen1)} style={{ cursor: 'pointer' }}>
                    Criação {sliderOpen1 ? '-' : '+'}
                </h5>
                {sliderOpen1 && (
                    <div className="div-slider row">
                        <div className="form-group col-sm-4 form-ficha-comercial slider_pp">
                            <h4 className="h4-fechamento">Vai ter na Página Principal?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="slider_pp"
                                    value={data.slider_pp}
                                    onChange={e => setData('slider_pp', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Nós que vamos fazer as artes? */}
                        <div className="form-group col-sm-4 form-ficha-comercial slider_nos_desenvolvemos">
                            <h4 className="h4-fechamento">Nós que vamos fazer as artes?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="slider_nos_desenvolvemos"
                                    value={data.slider_nos_desenvolvemos}
                                    onChange={e => setData('slider_nos_desenvolvemos', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Quantidade? */}
                        <div className="form-group col-sm-4 form-ficha-comercial slider_qtd">
                            <h4 className="h4-fechamento">Quantidade?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="slider_qtd"
                                    value={data.slider_qtd}
                                    onChange={e => setData('slider_qtd', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </div>
                        {/* Vai ser feito uma vez só? */}
                        <div className="form-group col-sm-4 form-ficha-comercial slider_vezes">
                            <h4 className="h4-fechamento">Vai ser feito uma vez só?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="slider_vezes"
                                    value={data.slider_vezes}
                                    onChange={e => setData('slider_vezes', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Qual Periodicidade? */}
                        <div className="form-group col-sm-4 form-ficha-comercial slider_periodicidade">
                            <h4 className="h4-fechamento">Qual Periodicidade?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="slider_periodicidade"
                                    value={data.slider_periodicidade}
                                    onChange={e => setData('slider_periodicidade', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Mensal">Mensal</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Semestral">Semestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                            </div>
                        </div>
                        {/* Observação do Slider */}
                        <div className="form-group col-sm-6 form-ficha-comercial slider_observacao">
                            <h4 className="h4-fechamento">Observação do Slider</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="slider_observacao"
                                    placeholder="Escreva aqui..."
                                    value={data.slider_observacao}
                                    onChange={e => setData('slider_observacao', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="slider-section slider-section-2">
                <h5 onClick={() => setSliderOpen2(!sliderOpen2)} style={{ cursor: 'pointer' }}>
                    Desenvolvimento {sliderOpen2 ? '-' : '+'}
                </h5>
                {sliderOpen2 && (
                    <div className="div-slider row">
                        {/* Domínio do Site */}
                        <div className="form-group col-sm-4 form-ficha-comercial dominio_site">
                            <h4 className="h4-fechamento">Domínio do Site</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="dominio_site"
                                    placeholder="Escreva aqui o domínio..."
                                    value={data.dominio_site}
                                    onChange={e => setData('dominio_site', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Domínio já está registrado? */}
                        <div className="form-group col-sm-4 form-ficha-comercial dominio_registrado">
                            <h4 className="h4-fechamento">Domínio já está registrado?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="dominio_registrado"
                                    value={data.dominio_registrado}
                                    onChange={e => setData('dominio_registrado', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Criação/Migração? */}
                        <div className="form-group col-sm-4 form-ficha-comercial criacao_migracao">
                            <h4 className="h4-fechamento">Criação/Migração?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="criacao_migracao"
                                    value={data.criacao_migracao}
                                    onChange={e => setData('criacao_migracao', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Criação">Criação</option>
                                    <option value="Migração">Migração</option>
                                </select>
                            </div>
                        </div>
                        {/* Qual momento vamos executar? */}
                        <div className="form-group col-sm-4 form-ficha-comercial momento_execucao">
                            <h4 className="h4-fechamento">Qual momento vamos executar?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="momento_execucao"
                                    placeholder="Escreva aqui o momento..."
                                    value={data.momento_execucao}
                                    onChange={e => setData('momento_execucao', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Os e-mails vão ficar com a gente? */}
                        <div className="form-group col-sm-4 form-ficha-comercial emails_conosco">
                            <h4 className="h4-fechamento">Os e-mails vão ficar com a gente?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="emails_conosco"
                                    value={data.emails_conosco}
                                    onChange={e => setData('emails_conosco', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Observação do Domínio */}
                        <div className="form-group col-sm-6 form-ficha-comercial dominio_observacao">
                            <h4 className="h4-fechamento">Observação do Domínio</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="dominio_observacao"
                                    placeholder="Escreva aqui..."
                                    value={data.dominio_observacao}
                                    onChange={e => setData('dominio_observacao', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="slider-section slider-section-3">
                <h5 onClick={() => setSliderOpen3(!sliderOpen3)} style={{ cursor: 'pointer' }}>
                    Marketing {sliderOpen3 ? '-' : '+'}
                </h5>
                {sliderOpen3 && (
                    <div className="div-slider row">
                        {/* Haverá Redirect? */}
                        <div className="form-group col-sm-4 form-ficha-comercial redirect">
                            <h4 className="h4-fechamento">Haverá Redirect?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="redirect"
                                    value={data.redirect}
                                    onChange={e => setData('redirect', e.target.value)}
                                >
                                    <option value="--">--</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                        </div>
                        {/* Se sim, Para onde eles devem ir? */}
                        <div className="form-group col-sm-4 form-ficha-comercial redirect_para_onde">
                            <h4 className="h4-fechamento">Se sim, Para onde eles devem ir?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="redirect_para_onde"
                                    placeholder="Escreva aqui o destino..."
                                    value={data.redirect_para_onde}
                                    onChange={e => setData('redirect_para_onde', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Observação sobre Redirect */}
                        <div className="form-group col-sm-6 form-ficha-comercial redirect_observacao">
                            <h4 className="h4-fechamento">Observação sobre Redirect</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="redirect_observacao"
                                    placeholder="Escreva aqui..."
                                    value={data.redirect_observacao}
                                    onChange={e => setData('redirect_observacao', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="slider-section slider-section-4">
                <h5 onClick={() => setSliderOpen4(!sliderOpen4)} style={{ cursor: 'pointer' }}>
                    Comercial {sliderOpen4 ? '-' : '+'}
                </h5>
                {sliderOpen4 && (
                    <div className="div-slider row">
                        {/* Data de Inicio das ações */}
                        <div className="form-group col-sm-4 form-ficha-comercial data_inicio_acoes">
                            <h4 className="h4-fechamento">Data de Inicio das ações</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="data_inicio_acoes"
                                    type="date"
                                    value={data.data_inicio_acoes}
                                    onChange={e => setData('data_inicio_acoes', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Investimento Mensal P/ Média */}
                        <div className="form-group col-sm-4 form-ficha-comercial investimento_mensal">
                            <h4 className="h4-fechamento">Investimento Mensal P/ Média</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="investimento_mensal"
                                    placeholder="Escreva aqui o valor..."
                                    value={data.investimento_mensal}
                                    onChange={e => setData('investimento_mensal', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Número de Post por Mês */}
                        <div className="form-group col-sm-4 form-ficha-comercial numero_post_mes">
                            <h4 className="h4-fechamento">Número de Post por Mês</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <input
                                    className="form-control"
                                    name="numero_post_mes"
                                    placeholder="Escreva aqui o número..."
                                    value={data.numero_post_mes}
                                    onChange={e => setData('numero_post_mes', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Botão para Adicionar mais Projetos */}
            <div id="adicionar-mais-projeto" className="mais-projeto">
                <button type="button" className="btn btn-add-mais" onClick={() => setData('projetos', [...data.projetos, {}])}>
                    <span className="btn-inner--icon">
                        <i className="fas fa-plus my-float"></i>
                        Adicionar mais Projeto
                    </span>
                </button>
            </div>

            {/* Botões de Navegação */}
            <div className="proximo-anterior">
                <button type="button" className="btn btn-anterior" onClick={prevStep}>
                    <span className="btn-inner--text">Anterior</span>
                    <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
                </button>
                <button type="button" className="btn btn-proximo" onClick={nextStep}>
                    <span className="btn-inner--text">Próximo Passo</span>
                    <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
                </button>
            </div>
        </div>
    );
};

export default Step3;
