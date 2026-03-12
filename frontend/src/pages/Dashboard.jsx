import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {
    const [resumo, setResumo] = useState({
        total_receitas: 0,
        total_despesas: 0,
        saldo: 0
    });

    useEffect(() => {
        async function carregar() {
            const resposta = await api.get("/transacoes/resumo");
            setResumo(resposta.data);
        }
        carregar();
    }, []);

    function formatar(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return (
        <Layout>
            <h1 style={s.titulo}>Dashboard</h1>
            <p style={s.subtitulo}>Resumo das suas finanças</p>

            <div style={s.cards}>
                <div style={{...s.card, borderTop: "4px solid var(--receita)"}}>
                    <p style={s.cardLabel}>Total Receitas</p>
                    <p style={{...s.cardValor, color: "var(--receita)"}}>
                        {formatar(resumo.total_receitas)}
                    </p>
                </div>

                <div style={{...s.card, borderTop: "4px solid var(--despesa)"}}>
                    <p style={s.cardLabel}>Total Despesas</p>
                    <p style={{...s.cardValor, color: "var(--despesa)"}}>
                        {formatar(resumo.total_despesas)}
                    </p>
                </div>

                <div style={{...s.card, borderTop: "4px solid var(--primaria)"}}>
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
    titulo: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "var(--texto)"
    },
    subtitulo: {
        color: "var(--texto-suave)",
        fontSize: "0.9rem",
        marginTop: "0.25rem",
        marginBottom: "2rem"
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem"
    },
    card: {
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