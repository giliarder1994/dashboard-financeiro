import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {
    const [resumo, setResumo] = useState({
        total_receitas: 0,
        total_despesas: 0,
        saldo: 0
    });
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
        const [r, c] = await Promise.all([
            api.get("/transacoes/resumo"),
            api.get("/categorias")
        ]);
        setResumo(r.data);
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

    function formatar(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    const categoriasFiltradas = categorias.filter((c) => c.tipo === form.tipo);

    return (
        <Layout>
            <div style={s.header}>
                <div>
                    <h1 style={s.titulo}>Dashboard</h1>
                    <p style={s.subtitulo}>Resumo das suas finanças</p>
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
                                    {categoriasFiltradas.map((c) => (
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

            <div style={s.cards}>
                <div style={{...s.cardResumo, borderTop: "4px solid var(--receita)"}}>
                    <p style={s.cardLabel}>Total Receitas</p>
                    <p style={{...s.cardValor, color: "var(--receita)"}}>
                        {formatar(resumo.total_receitas)}
                    </p>
                </div>
                <div style={{...s.cardResumo, borderTop: "4px solid var(--despesa)"}}>
                    <p style={s.cardLabel}>Total Despesas</p>
                    <p style={{...s.cardValor, color: "var(--despesa)"}}>
                        {formatar(resumo.total_despesas)}
                    </p>
                </div>
                <div style={{...s.cardResumo, borderTop: "4px solid var(--primaria)"}}>
                    <p style={s.cardLabel}>Saldo Atual</p>
                    <p style={{...s.cardValor, color: "var(--primaria)"}}>
                        {formatar(resumo.saldo)}
                    </p>
                </div>
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
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem"
    },
    cardResumo: {
        background: "var(--card)",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "var(--sombra)"
    },
    cardLabel: {
        fontSize: "0.85rem",
        color: "var(--texto-suave)",
        fontWeight: "500",
        marginBottom: "0.75rem"
    },
    cardValor: {
        fontSize: "1.75rem",
        fontWeight: "700"
    }
};

export default Dashboard;