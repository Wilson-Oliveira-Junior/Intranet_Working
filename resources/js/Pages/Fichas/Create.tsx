import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import "../../../css/components/fichas.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Step1 = ({ data, setData, nextStep }) => (
    <div className="tab-pane active" id="step1">
        <h3>Step 1</h3>
        <h2 className="h2-titulo"><i className="fas fa-child"></i> <span>Dados da</span> Empresa</h2>

        {/* Linha 1 */}
        <div className="row">
            {/* CNPJ/CPF */}
            <div className="form-group col-sm-4 form-ficha-comercial cnpj_cpf">
                <h4 className="h4-fechamento">CNPJ/CPF <span>Somente Números</span></h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        className="form-control"
                        name="cnpj_cpf"
                        id="cnpj_cpf"
                        placeholder="CNPJ/CPF"
                        type="text"
                        maxLength={14}
                        required
                        value={data.cnpj_cpf}
                        onChange={e => setData('cnpj_cpf', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_cnpj_cpf text-center alert alert-danger hidden"></p>
            </div>

            {/* Razão Social */}
            <div className="form-group col-sm-4 form-ficha-comercial razao-social">
                <h4 className="h4-fechamento">Razão Social</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="razao-social"
                        className="form-control"
                        name="razao_social"
                        placeholder="Razão Social"
                        type="text"
                        maxLength={100}
                        required
                        value={data.razao_social}
                        onChange={e => setData('razao_social', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_razao_social text-center alert alert-danger hidden"></p>
            </div>

            {/* Nome Fantasia */}
            <div className="form-group col-sm-4 form-ficha-comercial nome-fantasia">
                <h4 className="h4-fechamento">Nome Fantasia</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="nome-fantasia"
                        className="form-control"
                        name="nome_fantasia"
                        placeholder="Nome Fantasia"
                        type="text"
                        maxLength="100"
                        required
                        value={data.nome_fantasia}
                        onChange={e => setData('nome_fantasia', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_nome_fantasia text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Linha 2 */}
        <div className="row">
            {/* Segmento da Empresa */}
            <div className="form-group col-sm-4 form-ficha-comercial segmento-empresa">
                <h4 className="h4-fechamento">Segmento da Empresa</h4>
                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none !important' }}>
                    <select
                        id="segmento-empresa"
                        className="form-control select-ficha select2"
                        name="segmento_empresa"
                        value={data.segmento_empresa}
                        onChange={e => setData('segmento_empresa', e.target.value)}
                    >
                        <option value="0">Segmento da Empresa</option>
                        {data.segmentos && data.segmentos.map(segmento => (
                            <option key={segmento.id} value={segmento.id}>{segmento.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Inscrição Estadual */}
            <div className="form-group col-sm-4 form-ficha-comercial inscricao_estadual">
                <h4 className="h4-fechamento">Inscrição Estadual</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="inscricao_estadual"
                        className="form-control"
                        name="inscricao_estadual"
                        placeholder="Inscrição Estadual"
                        type="text"
                        value={data.inscricao_estadual}
                        onChange={e => setData('inscricao_estadual', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
            </div>

            {/* CEP */}
            <div className="form-group col-sm-4 form-ficha-comercial cep">
                <h4 className="h4-fechamento">CEP</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="cep"
                        className="form-control"
                        type="text"
                        name="cep"
                        maxLength={9}
                        placeholder="Digite o CEP"
                        required
                        value={data.cep}
                        onChange={e => setData('cep', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_cep text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Linha 3 */}
        <div className="row">
            {/* Endereço */}
            <div className="form-group col-sm-4 form-ficha-comercial endereco">
                <h4 className="h4-fechamento">Endereço <span>Automático</span></h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="endereco"
                        maxLength={164}
                        id="campo_logradouro"
                        placeholder="Endereço"
                        required
                        value={data.endereco}
                        onChange={e => setData('endereco', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_endereco text-center alert alert-danger hidden"></p>
            </div>

            {/* Bairro */}
            <div className="form-group col-sm-4 form-ficha-comercial bairro">
                <h4 className="h4-fechamento">Bairro <span>Automático</span></h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="bairro"
                        id="campo_bairro"
                        maxLength={64}
                        placeholder="Bairro"
                        required
                        value={data.bairro}
                        onChange={e => setData('bairro', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_bairro text-center alert alert-danger hidden"></p>
            </div>

            {/* Cidade */}
            <div className="form-group col-sm-4 form-ficha-comercial cidade">
                <h4 className="h4-fechamento">Cidade <span>Automático</span></h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="cidade"
                        id="campo_cidade"
                        maxLength="64"
                        placeholder="Cidade"
                        required
                        value={data.cidade}
                        onChange={e => setData('cidade', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_cidade text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Botões de Navegação */}
        <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-ficha-comercial" onClick={nextStep}>
                <span className="btn-inner--text">Próximo Passo</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
            </button>
            <Link href="/fichas" className="btn btn-danger">
                <span className="btn-inner--text">Cancelar</span>
            </Link>
        </div>
    </div>
);

const Step2 = ({ data, setData, nextStep, prevStep }) => (
    <div className="tab-pane active" id="step2">
        <h3>Step 2</h3>
        <h2 className="h2-titulo"><i className="ni ni-badge"></i> <span>Dados de</span> Contato</h2>

        {/* Linha 1 */}
        <div className="row">
            {/* Nome do Cliente */}
            <div className="form-group col-sm-4 form-ficha-comercial nome-cliente">
                <h4 className="h4-fechamento">Nome do Cliente</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="nome-cliente"
                        className="form-control"
                        name="nome_cliente"
                        placeholder="Nome"
                        type="text"
                        maxLength="100"
                        required
                        value={data.nome_cliente}
                        onChange={e => setData('nome_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_nome_cliente text-center alert alert-danger hidden"></p>
            </div>

            {/* Cargo */}
            <div className="form-group col-sm-4 form-ficha-comercial cargo-cliente">
                <h4 className="h4-fechamento">Cargo</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="cargo-cliente"
                        className="form-control"
                        name="cargo_cliente"
                        placeholder="Cargo"
                        type="text"
                        maxLength="100"
                        required
                        value={data.cargo_cliente}
                        onChange={e => setData('cargo_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_cargo_cliente text-center alert alert-danger hidden"></p>
            </div>

            {/* Tipo de Contato */}
            <div className="form-group col-sm-4 form-ficha-comercial responsavel-cliente">
                <h4 className="h4-fechamento">Tipo de Contato</h4>
                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none !important' }}>
                    <select
                        className="form-control"
                        name="tipo_contato"
                        value={data.tipo_contato}
                        onChange={e => setData('tipo_contato', e.target.value)}
                    >
                        <option value="--">Tipo de Contato</option>
                        <option value="Responsável do Projeto">Responsável do Projeto</option>
                        <option value="Responsável Financeiro">Responsável Financeiro</option>
                        <option value="Responsável Projeto/Financeiro">Responsável Projeto/Financeiro</option>
                        <option value="Outro">Outro</option>
                    </select>
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_tipo_contato text-center alert alert-danger hidden"></p>
            </div>
        </div>

        {/* Linha 2 */}
        <div className="row">
            {/* Telefone */}
            <div className="form-group col-sm-4 form-ficha-comercial telefone-cliente">
                <h4 className="h4-fechamento">Telefone</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="telefone"
                        className="form-control"
                        name="telefone_cliente"
                        placeholder="Telefone Residencial"
                        type="tel"
                        value={data.telefone_cliente}
                        onChange={e => setData('telefone_cliente', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
            </div>

            {/* Celular */}
            <div className="form-group col-sm-4 form-ficha-comercial celular-cliente">
                <h4 className="h4-fechamento">Celular</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="celular"
                        className="form-control"
                        name="celular"
                        maxLength="15"
                        placeholder="Celular"
                        type="tel"
                        value={data.celular}
                        onChange={e => setData('celular', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_celular text-center alert alert-danger hidden"></p>
            </div>

            {/* E-mail */}
            <div className="form-group col-sm-4 form-ficha-comercial email-cliente">
                <h4 className="h4-fechamento">E-mail</h4>
                <div className="input-group input-group-alternative mb-3">
                    <input
                        id="email"
                        className="form-control"
                        name="email"
                        placeholder="E-mail"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    <div className="icone-input-ficha-comercial">
                        <i className="ni ni-fat-remove"></i>
                    </div>
                </div>
                <p className="error error_email text-center alert alert-danger hidden"></p>
            </div>
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

const Step3 = ({ data, setData, nextStep, prevStep }) => (
    <div className="tab-pane active" id="step3">
        <h3>Step 3</h3>
        <h2 className="h2-titulo"><i className="ni ni-paper-diploma"></i> <span>Dados do</span> Projeto</h2>

        {/* Botões de Navegação */}
        <div className="proximo-anterior">
            <button type="button" className="btn btn-anterior" onClick={prevStep}>
                <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
            </button>
            <button type="button" className="btn btn-proximo" style={{ backgroundColor: '#c2c6ff', cursor: 'inherit' }}>
                <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
            </button>
        </div>

        {/* Campos do Projeto */}
        <div id="clonar-campos-projeto">
            <div className="cloned-projeto-principal">
                <h3 className="h3-numero-projetos">Projeto 1</h3>

                {/* Tipo de Projeto */}
                <div className="form-group col-sm-12 form-ficha-comercial tipo-projeto" style={{ width: '98%' }}>
                    <h4 className="h4-fechamento">Selecione um projeto:</h4>
                    <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none', border: '1px solid #e1e1e1', borderRadius: '3px', padding: '3px', fontSize: '14px' }}>
                        <select
                            className="form-control select-ficha select2"
                            name="tipo_projeto"
                            value={data.tipo_projeto}
                            onChange={e => setData('tipo_projeto', e.target.value)}
                        >
                            <option value="--">Selecione o Tipo de Projeto</option>
                            {data.tipo_projetos && data.tipo_projetos.map(projeto => (
                                <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Campos para Projeto do Tipo Site */}
                {data.tipo_projeto === 'Site' && (
                    <div className="projetos-sites">
                        {/* Data Fechamento do Contrato */}
                        <div className="form-group col-sm-4 form-ficha-comercial data-fechamento-contrato">
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

                        {/* Prazo */}
                        <div className="form-group col-sm-4 form-ficha-comercial prazo_projeto">
                            <h4 className="h4-fechamento">Prazo</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
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

                        {/* Tipo de Manutenção */}
                        <div className="form-group col-sm-4 form-ficha-comercial tipo_manutencao">
                            <h4 className="h4-fechamento">Tipo de Manutenção</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
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
                        <div className="form-group col-sm-4 form-ficha-comercial conteudo_site">
                            <h4 className="h4-fechamento">Conteúdo</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
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

                        {/* Idiomas */}
                        <div className="form-group col-sm-4 form-ficha-comercial idiomas">
                            <h4 className="h4-fechamento">Idiomas</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
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

                        {/* SSL/CDN */}
                        <div className="form-group col-sm-4 form-ficha-comercial ssl-cdn">
                            <h4 className="h4-fechamento">Vai ter SSL/CDN?</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <select
                                    className="form-control select-ficha"
                                    name="ssl-cdn"
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

                        {/* Itens de Menu */}
                        <div className="form-group col-sm-6 form-ficha-comercial itens_menu" style={{ width: '48%' }}>
                            <h4 className="h4-fechamento">Itens de Menu</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
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
                        <div className="form-group col-sm-6 form-ficha-comercial itens_pp" style={{ width: '48%' }}>
                            <h4 className="h4-fechamento">Itens Página Principal</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                <textarea
                                    className="form-control"
                                    name="itens_pp"
                                    placeholder="Escreva aqui os itens da página principal..."
                                    value={data.itens_pp}
                                    onChange={e => setData('itens_pp', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Perguntas sobre o Slider */}
                        <div className="div-slider">
                            <h5>Slider</h5>
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
                        </div>

                        {/* Perguntas sobre o Domínio */}
                        <div className="div-dominio">
                            <h5>Domínio</h5>
                            <div className="form-group col-sm-4 form-ficha-comercial dominio_principal">
                                <h4 className="h4-fechamento">Domínio do Site</h4>
                                <div className="input-group input-group-alternative mb-3">
                                    <input
                                        className="form-control"
                                        name="dominio_principal"
                                        placeholder="Escreva aqui..."
                                        value={data.dominio_principal}
                                        onChange={e => setData('dominio_principal', e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Outros campos do Domínio... */}
                        </div>

                        {/* Perguntas sobre Redirects */}
                        <div className="div-redirects">
                            <h5>Redirects</h5>
                            <div className="form-group col-sm-6 form-ficha-comercial redirect" style={{ width: '49%' }}>
                                <h4 className="h4-fechamento">Haverá Redirect?</h4>
                                <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none' }}>
                                    <select
                                        id="redirect"
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
                            {/* Outros campos de Redirects... */}
                        </div>
                    </div>
                )}

                {/* Campos para Projeto do Tipo Marketing */}
                {data.tipo_projeto === 'Marketing' && (
                    <div className="projetos-marketing">
                        <h5>Marketing</h5>
                        <div className="form-group col-sm-4 form-ficha-comercial data-inicio-marketing">
                            <h4 className="h4-fechamento">Data de Início das Ações</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id="data-inicio-marketing"
                                    className="form-control"
                                    name="data_inicio_marketing"
                                    type="date"
                                    value={data.data_inicio_marketing}
                                    onChange={e => setData('data_inicio_marketing', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Outros campos de Marketing... */}
                    </div>
                )}
            </div>
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

        {/* Botão Finalizar */}
        <button type="button" className="btn btn-ficha-comercial-3" onClick={nextStep}>
            <span className="btn-inner--text">Finalizar</span>
            <span className="btn-inner--icon"><i className="ni ni-bold-right"></i></span>
        </button>
    </div>
);

const Complete = ({ data, setData, prevStep }) => (
    <div className="tab-pane active" id="complete">
        <h3>Complete</h3>
        {/* Campos do Step 4 */}
        <div className="proximo-anterior">
            <button type="button" className="btn btn-anterior" onClick={prevStep}>
                <span className="btn-inner--text">Anterior</span>
                <span className="btn-inner--icon"><i className="ni ni-bold-left"></i></span>
            </button>
            <button type="submit" className="btn btn-ficha-comercial">
                <span className="btn-inner--text">Salvar</span>
                <span className="btn-inner--icon"><i className="ni ni-check-bold"></i></span>
            </button>
        </div>
    </div>
);

const FichasCreate = () => {
    const { data, setData, post } = useForm({
        nome: '',
        cnpj_cpf: '',
        razao_social: '',
        nome_fantasia: '',
        segmento_empresa: '',
        inscricao_estadual: '',
        cep: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
        complemento: '',
        dia_boleto: '',
        observacao_boleto: '',
        nota_fiscal: '',
        nome_cliente: '',
        cargo_cliente: '',
        tipo_contato: '',
        telefone_cliente: '',
        celular: '',
        email: '',
        nascimento: '',
        perfilcliente: [],
        tipo_projetos: [], // Adicionar tipo_projetos ao estado inicial
        // Outros campos necessários
    });

    const [currentStep, setCurrentStep] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fichas');
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    return (
        <AuthenticatedLayout>
            <h1>Nova Ficha</h1>
            <div className="wizard">
                <div className="wizard-inner">
                    <div className="connecting-line"></div>
                    <ul className="nav nav-tabs" role="tablist">
                        <li role="presentation" className={`icone-passo-1 ${currentStep === 1 ? 'active' : ''}`}>
                            <a href="#step1" data-toggle="tab" aria-controls="step1" role="tab" title="Step 1">
                                <span className="round-tab">1</span>
                            </a>
                        </li>
                        <li role="presentation" className={`icone-passo-2 ${currentStep === 2 ? 'active' : 'disabled'}`}>
                            <a href="#step2" data-toggle="tab" aria-controls="step2" role="tab" title="Step 2">
                                <span className="round-tab">2</span>
                            </a>
                        </li>
                        <li role="presentation" className={`icone-passo-3 ${currentStep === 3 ? 'active' : 'disabled'}`}>
                            <a href="#step3" data-toggle="tab" aria-controls="step3" role="tab" title="Step 3">
                                <span className="round-tab">3</span>
                            </a>
                        </li>
                        <li role="presentation" className={`${currentStep === 4 ? 'active' : 'disabled'}`}>
                            <a href="#complete" data-toggle="tab" aria-controls="complete" role="tab" title="Complete">
                                <span className="round-tab"><i className="ni ni-check-bold"></i></span>
                            </a>
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                        {currentStep === 1 && <Step1 data={data} setData={setData} nextStep={nextStep} />}
                        {currentStep === 2 && <Step2 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                        {currentStep === 3 && <Step3 data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />}
                        {currentStep === 4 && <Complete data={data} setData={setData} prevStep={prevStep} />}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default FichasCreate;
