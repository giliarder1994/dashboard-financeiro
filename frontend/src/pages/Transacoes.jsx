import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Transacoes() {
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({
        descricao: "",
        valor: "",
        tipo: "receita",
        data: "",
        categoria_id: ""
    });

    useEffect(() => {
        carregarTudo();
    }, []);

    async function carregarTudo() {
        const [t, c] = await Promise.all([
            api.get("/transacoes"),
            api.get("/categorias")
        ]);
        setTransacoes(t.data);
        setCategorias(c.data);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            await api.post("/transacoes", form);
            setForm({ descricao: "", valor: "", tipo: "receita", data: "", categoria_id: "" });
            setMostrarForm(false);
            carregarTudo();
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao salvar");
        }
    }

    async function deletar(id) {
        if (!confirm("Deletar esta transação?")) return;
        await api.delete(`/transacoes/${id}`);
        carregarTudo();
    }

    function formatar(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return (
        <Layout>
            <div style={s.header}>
                <div>
                    <h1 style={s.titulo}>Transações</h1>
                    <p style={s.subtitulo}>Gerencie suas receitas e despesas</p>
                </div>
                <button style={s.botaoNovo} onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? "Cancelar" : "+ Nova Transação"}
                </button>
            </div>

            {mostrarForm && (
                <div style={s.card}>
                    <h3 style={s.formTitulo}>Nova Transação</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={s.grid}>
                            <div style={s.campo}>
                                <label style={s.label}>Descrição</label>
                                <input
                                    style={s.input}
                                    name="descricao"
                                    placeholder="Ex: Salário"
                                    value={form.descricao}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={s.campo}>
                                <label style={s.label}>Valor</label>
                                <input
                                    style={s.input}
                                    name="valor"
                                    type="number"
                                    placeholder="0.00"
                                    value={form.valor}
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
                            <div style={s.campo}>
                                <label style={s.label}>Data</label>
                                <input
                                    style={s.input}
                                    name="data"
                                    type="date"
                                    value={form.data}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={s.campo}>
                                <label style={s.label}>Categoria</label>
                                <select style={s.input} name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                                    <option value="">Selecione...</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {erro && <p style={s.erro}>{erro}</p>}
                        <button style={s.botaoSalvar} type="submit">Salvar</button>
                    </form>
                </div>
            )}

            <div style={s.card}>
                {transacoes.length === 0 ? (
                    <p style={s.vazio}>Nenhuma transação encontrada.</p>
                ) : (
                    transacoes.map((t) => (
                        <div key={t.id} style={s.item}>
                            <div style={s.itemInfo}>
                                <span style={s.itemDescricao}>{t.descricao}</span>
                                <span style={s.itemCategoria}>{t.categoria} • {t.data?.slice(0, 10)}</span>
                            </div>
                            <div style={s.itemDireita}>
                                <span style={{
                                    ...s.itemValor,
                                    color: t.tipo === "receita" ? "var(--receita)" : "var(--despesa)"
                                }}>
                                    {t.tipo === "receita" ? "+" : "-"}{formatar(t.valor)}
                                </span>
                                <button style={s.botaoDeletar} onClick={() => deletar(t.id)}>✕</button>
                            </div>
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
        flexDirection: "column",
        gap: "0.25rem"
    },
    itemDescricao: {
        fontWeight: "600",
        fontSize: "0.95rem",
        color: "var(--texto)"
    },
    itemCategoria: {
        fontSize: "0.8rem",
        color: "var(--texto-suave)"
    },
    itemDireita: {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    },
    itemValor: {
        fontWeight: "700",
        fontSize: "1rem"
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

export default Transacoes;