import { useState,useEffect } from "react"
import api from "../services/api"

function Transacoes(){

    const [transacoes,setTransacoes] = useState([])

    useEffect(()=>{

        async function carregar(){

            const resposta = await api.get("/transacoes")

            setTransacoes(resposta.data)

        }

        carregar()

    },[])

    return(

        <div>

            <h1>Transações</h1>

            {transacoes.map((t)=>(
                <div key={t.id}>

                    <p>{t.descricao}</p>
                    <p>{t.valor}</p>
                    <p>{t.tipo}</p>
                    <p>{t.categoria}</p>

                </div>
            ))}

        </div>

    )

}

export default Transacoes