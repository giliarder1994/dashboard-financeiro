import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import styles from "./Transacoes.module.css";

function Transacoes() {
    const [transacoes, setTransacoes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [erro, setErro] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroDataInicio, setFiltroDataInicio] = useState("");
    const [filtroDataFim, setFiltroDataFim] = useState("");
    const [form, setForm] = useState({ descricao: "", valor: "", tipo: "receita", data: "", categoria_id: "" });

    useEffect(() => { carregarTudo(); }, []);

    async function carregarTudo() {
        const [t, c] = await Promise.all([
            api.get("/transacoes"),
            api.get("/categorias")
        ]);
        setTransacoes(t.data);
        setCategorias(c.data);
    }

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            if (editando) {
                await api.put(`/transacoes/${editando}`, form);
                setEditando(null);
            } else {
                await api.post("/transacoes", form);
            }
            setForm({ descricao: "", valor: "", tipo: "receita", data: "", categoria_id: "" });
            setMostrarForm(false);
            carregarTudo();
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao salvar");
        }
    }

    function iniciarEdicao(t) {
        setForm({
            descricao: t.descricao,
            valor: t.valor,
            tipo: t.tipo,
            data: t.data?.slice(0, 10),
            categoria_id: categorias.find((c) => c.nome === t.categoria)?.id || ""
        });
        setEditando(t.id);
        setMostrarForm(true);
    }

    async function deletar(id) {
        if (!confirm("Deletar esta transação?")) return;
        await api.delete(`/transacoes/${id}`);
        carregarTudo();
    }

    function formatar(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    const categoriasFiltradas = categorias.filter((c) => c.tipo === form.tipo);

    const transacoesFiltradas = transacoes.filter((t) => {
        if (filtroTipo && t.tipo !== filtroTipo) return false;
        if (filtroDataInicio && t.data?.slice(0, 10) < filtroDataInicio) return false;
        if (filtroDataFim && t.data?.slice(0, 10) > filtroDataFim) return false;
        return true;
    });

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.titulo}>Transações</h1>
                    <p className={styles.subtitulo}>Gerencie suas receitas e despesas</p>
                </div>
                <button className={styles.botaoNovo} onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ descricao: "", valor: "", tipo: "receita", data: "", categoria_id: "" }); }}>
                    {mostrarForm ? "Cancelar" : "+ Nova Transação"}
                </button>
            </div>

            {mostrarForm && (
                <div className={styles.card}>
                    <h3 className={styles.formTitulo}>{editando ? "Editar Transação" : "Nova Transação"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.grid}>
                            <div className={styles.campo}>
                                <label className={styles.label}>Descrição</label>
                                <input className={styles.input} name="descricao" placeholder="Ex: Salário" value={form.descricao} onChange={handleChange} />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label}>Valor</label>
                                <input className={styles.input} name="valor" type="number" placeholder="0.00" value={form.valor} onChange={handleChange} />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label}>Tipo</label>
                                <select className={styles.input} name="tipo" value={form.tipo} onChange={handleChange}>
                                    <option value="receita">Receita</option>
                                    <option value="despesa">Despesa</option>
                                </select>
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label}>Data</label>
                                <input className={styles.input} name="data" type="date" value={form.data} onChange={handleChange} />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label}>Categoria</label>
                                <select className={styles.input} name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                                    <option value="">Selecione...</option>
                                    {categoriasFiltradas.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {erro && <p className={styles.erro}>{erro}</p>}
                        <button className={styles.botaoSalvar} type="submit">{editando ? "Atualizar" : "Salvar"}</button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <h3 className={styles.formTitulo}>Filtros</h3>
                <div className={styles.grid}>
                    <div className={styles.campo}>
                        <label className={styles.label}>Tipo</label>
                        <select className={styles.input} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                        </select>
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Data início</label>
                        <input className={styles.input} type="date" value={filtroDataInicio} onChange={(e) => setFiltroDataInicio(e.target.value)} />
                    </div>
                    <div className={styles.campo}>
                        <label className={styles.label}>Data fim</label>
                        <input className={styles.input} type="date" value={filtroDataFim} onChange={(e) => setFiltroDataFim(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                {transacoesFiltradas.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma transação encontrada.</p>
                ) : (
                    transacoesFiltradas.map((t) => (
                        <div key={t.id} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemDescricao}>{t.descricao}</span>
                                <span className={styles.itemCategoria}>{t.categoria} • {t.data?.slice(0, 10)}</span>
                            </div>
                            <div className={styles.itemDireita}>
                                <span className={styles.itemValor} style={{ color: t.tipo === "receita" ? "var(--receita)" : "var(--despesa)" }}>
                                    {t.tipo === "receita" ? "+" : "-"}{formatar(t.valor)}
                                </span>
                                <button className={styles.botaoEditar} onClick={() => iniciarEdicao(t)}>✏️</button>
                                <button className={styles.botaoDeletar} onClick={() => deletar(t.id)}>✕</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
}

export default Transacoes;