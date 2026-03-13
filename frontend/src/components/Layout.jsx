import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuAberto, setMenuAberto] = useState(false);

    function sair() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    function ativo(caminho) {
        return location.pathname === caminho;
    }

    return (
        <div className={styles.wrapper}>

            <div className={styles.topbar}>
                <span className={styles.topbarLogo}>💰 Finança Fácil</span>
                <button className={styles.hamburguer} onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? "✕" : "☰"}
                </button>
            </div>

            {menuAberto && (
                <div className={styles.overlay} onClick={() => setMenuAberto(false)} />
            )}

            <aside className={`${styles.sidebar} ${menuAberto ? styles.sidebarAberta : ""}`}>
                <div className={styles.logo}>💰 Finança Fácil</div>
                <nav className={styles.nav}>
                    <Link to="/dashboard" onClick={() => setMenuAberto(false)} className={`${styles.navItem} ${ativo("/dashboard") ? styles.navAtivo : ""}`}>
                        📊 Dashboard
                    </Link>
                    <Link to="/transacoes" onClick={() => setMenuAberto(false)} className={`${styles.navItem} ${ativo("/transacoes") ? styles.navAtivo : ""}`}>
                        💸 Transações
                    </Link>
                    <Link to="/categorias" onClick={() => setMenuAberto(false)} className={`${styles.navItem} ${ativo("/categorias") ? styles.navAtivo : ""}`}>
                        🏷️ Categorias
                    </Link>
                    <Link to="/perfil" onClick={() => setMenuAberto(false)} className={`${styles.navItem} ${ativo("/perfil") ? styles.navAtivo : ""}`}>
                        👤 Perfil
                    </Link>
                </nav>
                <button onClick={sair} className={styles.sair}>Sair</button>
            </aside>

            <main className={styles.conteudo}>
                {children}
            </main>
        </div>
    );
}

export default Layout;