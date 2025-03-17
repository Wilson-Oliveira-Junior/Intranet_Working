import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { valida_cpf_cnpj, buscarDadosEmpresa } from '../Create'; // Add this import

const Step1 = ({ data, setData, nextStep }: { data: any, setData: any, nextStep: any }) => {
    const [cpfCnpjError, setCpfCnpjError] = useState('');

    const handleCpfCnpjChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('cnpj_cpf', value);
        if (!valida_cpf_cnpj(value)) {
            setCpfCnpjError('CPF/CNPJ inválido');
        } else {
            setCpfCnpjError('');
            try {
                const dadosEmpresa = await buscarDadosEmpresa(value);
                if (dadosEmpresa) {
                    if (dadosEmpresa.status === 'CPF válido') {
                        // Limpar campos relacionados à empresa para CPF válido
                        setData({
                            ...data,
                            razao_social: '',
                            nome_fantasia: '',
                            cep: '',
                            endereco: '',
                            bairro: '',
                            cidade: '',
                            estado: '',
                            inscricao_estadual: '',
                            numero: '',
                            complemento: '',
                            telefone_cliente: '',
                            email: ''
                        });
                    } else {
                        // Preencher campos para CNPJ
                        setData({
                            ...data,
                            razao_social: dadosEmpresa.nome || '',
                            nome_fantasia: dadosEmpresa.fantasia || '',
                            cep: dadosEmpresa.cep || '',
                            endereco: dadosEmpresa.logradouro || '',
                            bairro: dadosEmpresa.bairro || '',
                            cidade: dadosEmpresa.municipio || '',
                            estado: dadosEmpresa.uf || '',
                            inscricao_estadual: dadosEmpresa.uf || '', // Preencher com o estado
                            numero: dadosEmpresa.numero || '',
                            complemento: dadosEmpresa.complemento || '',
                            telefone_cliente: dadosEmpresa.telefone || '',
                            email: dadosEmpresa.email || ''
                        });
                    }
                    // Adicionar logs para depuração
                    console.log('Dados preenchidos:', {
                        razao_social: dadosEmpresa.nome,
                        nome_fantasia: dadosEmpresa.fantasia,
                        cep: dadosEmpresa.cep,
                        endereco: dadosEmpresa.logradouro,
                        bairro: dadosEmpresa.bairro,
                        cidade: dadosEmpresa.municipio,
                        estado: dadosEmpresa.uf, // Log para depuração
                        inscricao_estadual: dadosEmpresa.uf,
                        numero: dadosEmpresa.numero,
                        complemento: dadosEmpresa.complemento,
                        telefone_cliente: dadosEmpresa.telefone,
                        email: dadosEmpresa.email,
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar dados da empresa:', error);
            }
        }
    };

    useEffect(() => {
        const fetchSegmentos = async () => {
            try {
                const response = await fetch('/api/segmentos');
                if (response.ok) {
                    const result = await response.json();
                    setData('segmentos', result.data); // Use result.data
                } else {
                    console.error('Erro ao carregar segmentos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar segmentos:', error);
            }
        };

        fetchSegmentos();
    }, []);

    return (
        <div className="tab-pane active" id="step1">
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
                            onChange={handleCpfCnpjChange}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
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
                            maxLength={100}
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
            {cpfCnpjError && <p className="error text-center alert alert-danger">{cpfCnpjError}</p>}
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
                            {Array.isArray(data.segmentos) && data.segmentos.map((segmento: { id: string, nome: string }) => (
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
                    <h4 className="h4-fechamento">Endereço</h4>
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
                    <h4 className="h4-fechamento">Bairro</h4>
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
                    <h4 className="h4-fechamento">Cidade</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="cidade"
                            maxLength={64}
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
            {/* Linha 4 */}
            <div className="row">
                {/* Estado */}
                <div className="form-group col-sm-4 form-ficha-comercial estado">
                    <h4 className="h4-fechamento">Estado</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="estado"
                            maxLength={2}
                            placeholder="Estado"
                            required
                            value={data.estado}
                            onChange={e => setData('estado', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_estado text-center alert alert-danger hidden"></p>
                </div>
                {/* Número */}
                <div className="form-group col-sm-4 form-ficha-comercial numero">
                    <h4 className="h4-fechamento">Número</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="numero"
                            maxLength={10}
                            placeholder="Número"
                            required
                            value={data.numero}
                            onChange={e => setData('numero', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_numero text-center alert alert-danger hidden"></p>
                </div>
                {/* Complemento */}
                <div className="form-group col-sm-4 form-ficha-comercial complemento">
                    <h4 className="h4-fechamento">Complemento</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="complemento"
                            id="campo_complemento"
                            maxLength={100}
                            placeholder="Complemento"
                            value={data.complemento}
                            onChange={e => setData('complemento', e.target.value)}
                        />
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_complemento text-center alert alert-danger hidden"></p>
                </div>
            </div>
            {/* Linha 6 */}
            <div className="row">
                {/* Dia do Boleto */}
                <div className="form-group col-sm-4 form-ficha-comercial dia-boleto">
                    <h4 className="h4-fechamento">Dia do Boleto</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control"
                            name="dia_boleto"
                            id="campo_dia_boleto"
                            value={data.dia_boleto}
                            onChange={e => setData('dia_boleto', e.target.value)}
                        >
                            <option value="Melhor dia para boleto">Melhor dia para boleto</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                        </select>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_dia_boleto text-center alert alert-danger hidden"></p>
                </div>
                {/* Observação sobre o boleto */}
                <div className="form-group col-sm-4 form-ficha-comercial observacao-boleto">
                    <h4 className="h4-fechamento">Observação sobre o boleto</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <textarea
                            className="form-control"
                            name="observacao_boleto"
                            id="campo_observacao_boleto"
                            placeholder="Observação sobre o boleto"
                            value={data.observacao_boleto}
                            onChange={e => setData('observacao_boleto', e.target.value)}
                        ></textarea>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_observacao_boleto text-center alert alert-danger hidden"></p>
                </div>
                {/* Nota Fiscal */}
                <div className="form-group col-sm-4 form-ficha-comercial nota-fiscal">
                    <h4 className="h4-fechamento">Nota Fiscal</h4>
                    <div className="input-group input-group-alternative mb-3">
                        <select
                            className="form-control"
                            name="nota_fiscal"
                            id="campo_nota_fiscal"
                            value={data.nota_fiscal}
                            onChange={e => setData('nota_fiscal', e.target.value)}
                        >
                            <option value="Nota Fiscal">Nota Fiscal</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                        <div className="icone-input-ficha-comercial">
                            <i className="ni ni-fat-remove"></i>
                        </div>
                    </div>
                    <p className="error error_nota_fiscal text-center alert alert-danger hidden"></p>
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
};

export default Step1;
