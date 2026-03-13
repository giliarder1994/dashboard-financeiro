import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import styles from "./Login.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            const resposta = await api.post("/login", { email, senha });
            localStorage.setItem("token", resposta.data.token);
            navigate("/dashboard");
        } catch (err) {
            setErro("Email ou senha inválidos");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>💰</div>
                <h1 className={styles.titulo}>Finança Fácil</h1>
                <p className={styles.subtitulo}>Controle seu dinheiro com simplicidade</p>

                <form onSubmit={handleSubmit}>
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
                    <button className={styles.botao} type="submit">Entrar</button>
                </form>

                <p className={styles.linkTexto}>
                    Não tem conta?{" "}
                    <Link to="/cadastro" className={styles.link}>Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;