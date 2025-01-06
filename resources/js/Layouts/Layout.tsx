import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>Intranet</h1>
                {/* Adicione aqui o código do cabeçalho */}
            </header>
            <main>
                {children}
            </main>
            <footer>
                {/* Adicione aqui o código do rodapé */}
            </footer>
        </div>
    );
};

export default Layout;
