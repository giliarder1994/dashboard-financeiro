import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import styles from "./Perfil.module.css";

function Perfil() {
    const [dados, setDados] = useState({ nome: "", email: "" });
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            const resposta = await api.get("/perfil");
            setDados(resposta.data);
        }
        carregar();
    }, []);

    async function atualizarNome(e) {
        e.preventDefault();
        setErro(""); setSucesso("");
        try {
            await api.put("/perfil", { nome: dados.nome });
            setSucesso("Nome atualizado com sucesso!");
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao atualizar");
        }
    }

    async function atualizarSenha(e) {
        e.preventDefault();
        setErro(""); setSucesso("");
        try {
            await api.put("/perfil/senha", { senhaAtual, novaSenha });
            setSucesso("Senha atualizada com sucesso!");
            setSenhaAtual(""); setNovaSenha("");
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao atualizar senha");
        }
    }

    return (
        <Layout>
            <h1 className={styles.titulo}>Perfil</h1>
            <p className={styles.subtitulo}>Gerencie suas informações pessoais</p>

            <div className={styles.card}>
                <h3 className={styles.formTitulo}>Informações pessoais</h3>
                <form onSubmit={atualizarNome}>
                    <div className={styles.campo}>
                        <label className={styles.label}>Nome</label>
                        <input
                            className={styles.input}
                            value={dados.nome}
                            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                        />
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={`${styles.input} ${styles.inputDesabilitado}`}
                            value={dados.email}
                            disabled
                        />
                    </div>
                    {sucesso && <p className={styles.sucesso}>{sucesso}</p>}
                    {erro && <p className={styles.erro}>{erro}</p>}
                    <button className={styles.botao} type="submit">Salvar alterações</button>
                </form>
            </div>

            <div className={styles.card}>
                <h3 className={styles.formTitulo}>Alterar senha</h3>
                <form onSubmit={atualizarSenha}>
                    <div className={styles.campo}>
                        <label className={styles.label}>Senha atual</label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                        />
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Nova senha</label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />
                    </div>
                    <button className={styles.botao} type="submit">Alterar senha</button>
                </form>
            </div>
        </Layout>
    );
}

export default Perfil;