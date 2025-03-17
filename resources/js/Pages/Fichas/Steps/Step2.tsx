import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

const Step2 = ({ data, setData, nextStep, prevStep }: { data: any, setData: any, nextStep: any, prevStep: any }) => {
    const [contacts, setContacts] = useState(data.contacts.length > 0 ? data.contacts : [{ nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }]);

    useEffect(() => {
        setContacts(data.contacts.length > 0 ? data.contacts : [{ nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }]);
    }, [data.contacts]);

    const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [name]: value };
        setContacts(newContacts);
        setData('contacts', newContacts);
    };

    const handleCheckboxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const newContacts = [...contacts];
        if (checked) {
            newContacts[index].perfilcliente = [...(newContacts[index].perfilcliente || []), name];
        } else {
            newContacts[index].perfilcliente = (newContacts[index].perfilcliente || []).filter((item: string) => item !== name);
        }
        setContacts(newContacts);
        setData('contacts', newContacts);
    };

    const addContact = () => {
        if (contacts.length < 2) {
            const newContacts = [...contacts, { nome_cliente: '', cargo_cliente: '', tipo_contato: '', telefone_cliente: '', celular: '', email: '', nascimento: '', perfilcliente: [] }];
            setContacts(newContacts);
            setData('contacts', newContacts);
        }
    };

    return (
        <div className="tab-pane active" id="step2">
            <h2 className="h2-titulo"><i className="ni ni-badge"></i> <span>Dados de</span> Contato</h2>

            {contacts.map((contact, index) => (
                <div key={index}>
                    <h3>Contato {index + 1}</h3>
                    {/* Linha 1 */}
                    <div className="row">
                        {/* Nome do Cliente */}
                        <div className="form-group col-sm-4 form-ficha-comercial nome-cliente">
                            <h4 className="h4-fechamento">Nome do Cliente</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id={`nome-cliente-${index}`}
                                    className="form-control"
                                    name="nome_cliente"
                                    placeholder="Nome"
                                    type="text"
                                    maxLength={100}
                                    value={contact.nome_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>

                        {/* Cargo */}
                        <div className="form-group col-sm-4 form-ficha-comercial cargo-cliente">
                            <h4 className="h4-fechamento">Cargo</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id={`cargo-cliente-${index}`}
                                    className="form-control"
                                    name="cargo_cliente"
                                    placeholder="Cargo"
                                    type="text"
                                    maxLength={100}
                                    value={contact.cargo_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>

                        {/* Tipo de Contato */}
                        <div className="form-group col-sm-4 form-ficha-comercial responsavel-cliente">
                            <h4 className="h4-fechamento">Tipo de Contato</h4>
                            <div className="input-group input-group-alternative mb-3" style={{ boxShadow: 'none !important' }}>
                                <select
                                    className="form-control"
                                    name="tipo_contato"
                                    value={contact.tipo_contato || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                        </div>
                    </div>

                    {/* Linha 2 */}
                    <div className="row">
                        {/* Telefone */}
                        <div className="form-group col-sm-4 form-ficha-comercial telefone-cliente">
                            <h4 className="h4-fechamento">Telefone</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id={`telefone-${index}`}
                                    className="form-control"
                                    name="telefone_cliente"
                                    placeholder="Telefone Residencial"
                                    value={contact.telefone_cliente || ''}
                                    onChange={e => handleContactChange(index, e)}
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
                                    id={`celular-${index}`}
                                    className="form-control"
                                    maxLength={15}
                                    placeholder="Celular"
                                    value={contact.celular || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>

                        {/* E-mail */}
                        <div className="form-group col-sm-4 form-ficha-comercial email-cliente">
                            <h4 className="h4-fechamento">E-mail</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <input
                                    id={`email-${index}`}
                                    className="form-control"
                                    name="email"
                                    placeholder="E-mail"
                                    value={contact.email || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linha 3 */}
                    <div className="row">
                        {/* Data de Nascimento */}
                        <div className="form-group col-sm-4 form-ficha-comercial nascimento-cliente">
                            <h4 className="h4-fechamento">Data de Nascimento</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <InputMask
                                    id={`nascimento-${index}`}
                                    className="form-control"
                                    name="nascimento"
                                    mask="99/99/9999"
                                    placeholder="DD/MM/AAAA"
                                    value={contact.nascimento || ''}
                                    onChange={e => handleContactChange(index, e)}
                                />
                                <div className="icone-input-ficha-comercial">
                                    <i className="ni ni-fat-remove"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linha 4 */}
                    <div className="row">
                        {/* Perfil do Cliente */}
                        <div className="form-group col-sm-12 form-ficha-comercial perfil-cliente">
                            <h4 className="h4-fechamento">Perfil do Cliente</h4>
                            <div className="input-group input-group-alternative mb-3">
                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento básico"
                                            checked={contact.perfilcliente?.includes('Conhecimento básico') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento básico
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento Intermediário"
                                            checked={contact.perfilcliente?.includes('Conhecimento Intermediário') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento Intermediário
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Conhecimento Avançado"
                                            checked={contact.perfilcliente?.includes('Conhecimento Avançado') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Conhecimento Avançado
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Exigente"
                                            checked={contact.perfilcliente?.includes('Exigente') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Exigente
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Pró Ativo"
                                            checked={contact.perfilcliente?.includes('Pró Ativo') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Pró Ativo
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Indeciso/Confuso"
                                            checked={contact.perfilcliente?.includes('Indeciso/Confuso') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Indeciso/Confuso
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="Aberto a novas Ideias"
                                            checked={contact.perfilcliente?.includes('Aberto a novas Ideias') || false}
                                            onChange={e => handleCheckboxChange(index, e)}
                                        />
                                        Aberto a novas Ideias
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Botão para adicionar mais um contato */}
            {contacts.length < 2 && (
                <div className="d-flex justify-content-end mb-3">
                    <button type="button" className="btn btn-add-mais" onClick={addContact}>
                        <span className="btn-inner--icon"><i className="fas fa-plus"></i></span>
                        <span className="btn-inner--text">Adicionar Contato</span>
                    </button>
                </div>
            )}

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

export default Step2;
