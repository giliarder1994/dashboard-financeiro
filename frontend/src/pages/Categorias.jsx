import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({ nome: "", tipo: "receita" });

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        const resposta = await api.get("/categorias");
        setCategorias(resposta.data);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            await api.post("/categorias", form);
            setForm({ nome: "", tipo: "receita" });
            setMostrarForm(false);
            carregar();
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao salvar");
        }
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
            <div style={s.header}>
                <div>
                    <h1 style={s.titulo}>Categorias</h1>
                    <p style={s.subtitulo}>Organize suas receitas e despesas</p>
                </div>
                <button style={s.botaoNovo} onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? "Cancelar" : "+ Nova Categoria"}
                </button>
            </div>

            {mostrarForm && (
                <div style={s.card}>
                    <h3 style={s.formTitulo}>Nova Categoria</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={s.grid}>
                            <div style={s.campo}>
                                <label style={s.label}>Nome</label>
                                <input
                                    style={s.input}
                                    name="nome"
                                    placeholder="Ex: Alimentação"
                                    value={form.nome}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={s.campo}>
                                <label style={s.label}>Tipo</label>
                                <select style={s.input} name="tipo" value={form.tipo} onChange={handleChange}>
                                    <option value="receita">Receita</option>
                                    <option value="despesa">Despesa</option>
                                </select>
                            </div>
                        </div>
                        {erro && <p style={s.erro}>{erro}</p>}
                        <button style={s.botaoSalvar} type="submit">Salvar</button>
                    </form>
                </div>
            )}

            <div style={s.card}>
                {categorias.length === 0 ? (
                    <p style={s.vazio}>Nenhuma categoria encontrada.</p>
                ) : (
                    categorias.map((c) => (
                        <div key={c.id} style={s.item}>
                            <div style={s.itemInfo}>
                                <span style={s.itemNome}>{c.nome}</span>
                                <span style={{
                                    ...s.itemTipo,
                                    color: c.tipo === "receita" ? "var(--receita)" : "var(--despesa)"
                                }}>
                                    {c.tipo === "receita" ? "↑ Receita" : "↓ Despesa"}
                                </span>
                            </div>
                            <button style={s.botaoDeletar} onClick={() => deletar(c.id)}>✕</button>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
}

const s = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
    },
    titulo: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "var(--texto)"
    },
    subtitulo: {
        color: "var(--texto-suave)",
        fontSize: "0.9rem",
        marginTop: "0.25rem"
    },
    botaoNovo: {
        padding: "0.75rem 1.5rem",
        background: "var(--primaria)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.9rem"
    },
    card: {
        background: "var(--card)",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "var(--sombra)",
        marginBottom: "1.5rem"
    },
    formTitulo: {
        fontSize: "1rem",
        fontWeight: "600",
        marginBottom: "1.25rem",
        color: "var(--texto)"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem"
    },
    campo: {
        display: "flex",
        flexDirection: "column"
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "var(--texto)",
        marginBottom: "0.4rem"
    },
    input: {
        padding: "0.75rem 1rem",
        border: "1px solid var(--borda)",
        borderRadius: "8px",
        fontSize: "0.95rem",
        color: "var(--texto)",
        outline: "none"
    },
    botaoSalvar: {
        marginTop: "1.25rem",
        padding: "0.75rem 2rem",
        background: "var(--primaria)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.95rem"
    },
    erro: {
        color: "var(--despesa)",
        fontSize: "0.85rem",
        marginTop: "0.75rem"
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 0",
        borderBottom: "1px solid var(--borda)"
    },
    itemInfo: {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    },
    itemNome: {
        fontWeight: "600",
        fontSize: "0.95rem",
        color: "var(--texto)"
    },
    itemTipo: {
        fontSize: "0.8rem",
        fontWeight: "500"
    },
    botaoDeletar: {
        background: "none",
        border: "none",
        color: "var(--texto-suave)",
        cursor: "pointer",
        fontSize: "1rem",
        padding: "0.25rem"
    },
    vazio: {
        textAlign: "center",
        color: "var(--texto-suave)",
        padding: "2rem 0"
    }
};

export default Categorias;