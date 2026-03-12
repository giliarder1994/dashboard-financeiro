import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            await api.post("/cadastrar", { nome, email, senha });
            navigate("/login");
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao cadastrar");
        }
    }

    return (
        <div style={s.container}>
            <div style={s.card}>
                <div style={s.logo}>💰</div>
                <h1 style={s.titulo}>Criar conta</h1>
                <p style={s.subtitulo}>Comece a controlar suas finanças hoje</p>

                <form onSubmit={handleSubmit}>
                    <div style={s.campo}>
                        <label style={s.label}>Nome</label>
                        <input
                            style={s.input}
                            type="text"
                            placeholder="Seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div style={s.campo}>
                        <label style={s.label}>Email</label>
                        <input
                            style={s.input}
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={s.campo}>
                        <label style={s.label}>Senha</label>
                        <input
                            style={s.input}
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    {erro && <p style={s.erro}>{erro}</p>}
                    <button style={s.botao} type="submit">Cadastrar</button>
                </form>

                <p style={s.linkTexto}>
                    Já tem conta?{" "}
                    <Link to="/login" style={s.link}>Entrar</Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--fundo)"
    },
    card: {
        background: "var(--card)",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "var(--sombra)",
        width: "100%",
        maxWidth: "420px"
    },
    logo: {
        fontSize: "2.5rem",
        textAlign: "center",
        marginBottom: "0.5rem"
    },
    titulo: {
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "var(--texto)"
    },
    subtitulo: {
        textAlign: "center",
        color: "var(--texto-suave)",
        fontSize: "0.9rem",
        marginBottom: "2rem"
    },
    campo: {
        marginBottom: "1.2rem"
    },
    label: {
        display: "block",
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "var(--texto)",
        marginBottom: "0.4rem"
    },
    input: {
        width: "100%",
        padding: "0.75rem 1rem",
        border: "1px solid var(--borda)",
        borderRadius: "8px",
        fontSize: "0.95rem",
        outline: "none",
        color: "var(--texto)"
    },
    botao: {
        width: "100%",
        padding: "0.85rem",
        background: "var(--primaria)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "0.5rem"
    },
    erro: {
        color: "var(--despesa)",
        fontSize: "0.85rem",
        marginBottom: "0.75rem"
    },
    linkTexto: {
        textAlign: "center",
        marginTop: "1.5rem",
        fontSize: "0.9rem",
        color: "var(--texto-suave)"
    },
    link: {
        color: "var(--primaria)",
        fontWeight: "600",
        textDecoration: "none"
    }
};

export default Cadastro;