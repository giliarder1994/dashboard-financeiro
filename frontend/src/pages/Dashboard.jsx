import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const [resumo, setResumo] = useState({ total_receitas: 0, total_despesas: 0, saldo: 0 });
    const [categorias, setCategorias] = useState([]);
    const [mensal, setMensal] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({ descricao: "", valor: "", tipo: "receita", data: "", categoria_id: "" });

    useEffect(() => { carregarTudo(); }, []);

    async function carregarTudo() {
        const [r, c, m] = await Promise.all([
            api.get("/transacoes/resumo"),
            api.get("/categorias"),
            api.get("/transacoes/mensal")
        ]);
        setResumo(r.data);
        setCategorias(c.data);
        setMensal(m.data);
    }

    function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

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
        return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    const categoriasFiltradas = categorias.filter((c) => c.tipo === form.tipo);

    const dadosGrafico = [
        { nome: "Receitas", valor: Number(resumo.total_receitas || 0) },
        { nome: "Despesas", valor: Number(resumo.total_despesas || 0) },
        { nome: "Saldo", valor: Number(resumo.saldo || 0) }
    ];

    return (
        <Layout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.titulo}>Dashboard</h1>
                    <p className={styles.subtitulo}>Resumo das suas finanças</p>
                </div>
                <button className={styles.botaoNovo} onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? "Cancelar" : "+ Nova Transação"}
                </button>
            </div>

            {mostrarForm && (
                <div className={styles.card}>
                    <h3 className={styles.formTitulo}>Nova Transação</h3>
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
                        <button className={styles.botaoSalvar} type="submit">Salvar</button>
                    </form>
                </div>
            )}

            <div className={styles.cards}>
                <div className={styles.cardResumo} style={{ borderTop: "4px solid var(--receita)" }}>
                    <p className={styles.cardLabel}>Total Receitas</p>
                    <p className={styles.cardValor} style={{ color: "var(--receita)" }}>{formatar(resumo.total_receitas)}</p>
                </div>
                <div className={styles.cardResumo} style={{ borderTop: "4px solid var(--despesa)" }}>
                    <p className={styles.cardLabel}>Total Despesas</p>
                    <p className={styles.cardValor} style={{ color: "var(--despesa)" }}>{formatar(resumo.total_despesas)}</p>
                </div>
                <div className={styles.cardResumo} style={{ borderTop: "4px solid var(--primaria)" }}>
                    <p className={styles.cardLabel}>Saldo Atual</p>
                    <p className={styles.cardValor} style={{ color: "var(--primaria)" }}>{formatar(resumo.saldo)}</p>
                </div>
            </div>

            <div className={styles.card} style={{ marginTop: "1.5rem" }}>
                <h3 className={styles.formTitulo}>Visão Geral</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dadosGrafico}>
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip formatter={(v) => formatar(v)} />
                        <Legend />
                        <Bar dataKey="valor" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.card}>
                <h3 className={styles.formTitulo}>Receitas vs Despesas por Mês</h3>
                {mensal.length === 0 ? (
                    <p style={{ textAlign: "center", color: "var(--texto-suave)", padding: "2rem 0" }}>
                        Nenhum dado disponível ainda.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={mensal} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--borda)" />
                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v) => formatar(v)} />
                            <Legend />
                            <Bar dataKey="receitas" name="Receitas" fill="var(--receita)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="despesas" name="Despesas" fill="var(--despesa)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Layout>
    );
}

export default Dashboard;