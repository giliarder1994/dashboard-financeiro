import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import styles from "./Categorias.module.css";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({ nome: "", tipo: "receita" });

    useEffect(() => { carregar(); }, []);

    async function carregar() {
        const resposta = await api.get("/categorias");
        setCategorias(resposta.data);
    }

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            if (editando) {
                await api.put(`/categorias/${editando}`, form);
                setEditando(null);
            } else {
                await api.post("/categorias", form);
            }
            setForm({ nome: "", tipo: "receita" });
            setMostrarForm(false);
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao salvar");
        }
    }

    function iniciarEdicao(c) {
        setForm({ nome: c.nome, tipo: c.tipo });
        setEditando(c.id);
        setMostrarForm(true);
    }

    async function deletar(id) {
        if (!confirm("Deletar esta categoria?")) return;
        try {
            await api.delete(`/categorias/${id}`);
            carregar();
        } catch (err) {
            alert("Não é possível deletar uma categoria que possui transações.");
        }
    }

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.titulo}>Categorias</h1>
                    <p className={styles.subtitulo}>Organize suas receitas e despesas</p>
                </div>
                <button className={styles.botaoNovo} onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nome: "", tipo: "receita" }); }}>
                    {mostrarForm ? "Cancelar" : "+ Nova Categoria"}
                </button>
            </div>

            {mostrarForm && (
                <div className={styles.card}>
                    <h3 className={styles.formTitulo}>{editando ? "Editar Categoria" : "Nova Categoria"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.grid}>
                            <div className={styles.campo}>
                                <label className={styles.label}>Nome</label>
                                <input className={styles.input} name="nome" placeholder="Ex: Alimentação" value={form.nome} onChange={handleChange} />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label}>Tipo</label>
                                <select className={styles.input} name="tipo" value={form.tipo} onChange={handleChange}>
                                    <option value="receita">Receita</option>
                                    <option value="despesa">Despesa</option>
                                </select>
                            </div>
                        </div>
                        {erro && <p className={styles.erro}>{erro}</p>}
                        <button className={styles.botaoSalvar} type="submit">{editando ? "Atualizar" : "Salvar"}</button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                {categorias.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma categoria encontrada.</p>
                ) : (
                    categorias.map((c) => (
                        <div key={c.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemNome}>{c.nome}</span>
                                <span className={styles.itemTipo} style={{ color: c.tipo === "receita" ? "var(--receita)" : "var(--despesa)" }}>
                                    {c.tipo === "receita" ? "↑ Receita" : "↓ Despesa"}
                                </span>
                            </div>
                            <div className={styles.itemDireita}>
                                <button className={styles.botaoEditar} onClick={() => iniciarEdicao(c)}>✏️</button>
                                <button className={styles.botaoDeletar} onClick={() => deletar(c.id)}>✕</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
}

export default Categorias;