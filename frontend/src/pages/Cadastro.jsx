import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import styles from "./Cadastro.module.css";

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
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>💰</div>
                <h1 className={styles.titulo}>Criar conta</h1>
                <p className={styles.subtitulo}>Comece a controlar suas finanças hoje</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.campo}>
                        <label className={styles.label}>Nome</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Senha</label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    {erro && <p className={styles.erro}>{erro}</p>}
                    <button className={styles.botao} type="submit">Cadastrar</button>
                </form>

                <p className={styles.linkTexto}>
                    Já tem conta?{" "}
                    <Link to="/login" className={styles.link}>Entrar</Link>
                </p>
            </div>
        </div>
    );
}

export default Cadastro;