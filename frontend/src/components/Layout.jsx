import { Link, useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    function sair() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    function ativo(caminho) {
        return location.pathname === caminho;
    }

    return (
        <div style={s.wrapper}>
            <aside style={s.sidebar}>
                <div style={s.logo}>💰 Finança Fácil</div>

                <nav style={s.nav}>
                    <Link to="/dashboard" style={{...s.navItem, ...(ativo("/dashboard") ? s.navAtivo : {})}}>
                        📊 Dashboard
                    </Link>
                    <Link to="/transacoes" style={{...s.navItem, ...(ativo("/transacoes") ? s.navAtivo : {})}}>
                        💸 Transações
                    </Link>
                    <Link to="/categorias" style={{...s.navItem, ...(ativo("/categorias") ? s.navAtivo : {})}}>
                        🏷️ Categorias
                    </Link>
                </nav>

                <button onClick={sair} style={s.sair}>
                    Sair
                </button>
            </aside>

            <main style={s.conteudo}>
                {children}
            </main>
        </div>
    );
}

const s = {
    wrapper: {
        display: "flex",
        minHeight: "100vh"
    },
    sidebar: {
        width: "240px",
        background: "var(--card)",
        boxShadow: "var(--sombra)",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh"
    },
    logo: {
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "var(--primaria)",
        marginBottom: "2.5rem",
        paddingLeft: "0.5rem"
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flex: 1
    },
    navItem: {
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        textDecoration: "none",
        color: "var(--texto-suave)",
        fontWeight: "500",
        fontSize: "0.95rem",
        transition: "all 0.2s"
    },
    navAtivo: {
        background: "var(--fundo)",
        color: "var(--primaria)",
        fontWeight: "600"
    },
    sair: {
        padding: "0.75rem",
        background: "none",
        border: "1px solid var(--borda)",
        borderRadius: "8px",
        color: "var(--texto-suave)",
        cursor: "pointer",
        fontSize: "0.9rem"
    },
    conteudo: {
        marginLeft: "240px",
        padding: "2rem",
        flex: 1,
        width: "100%"
    }
};

export default Layout;