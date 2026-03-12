import { useEffect,useState } from "react"
import api from "../services/api"

function Categorias(){

    const [categorias,setCategorias] = useState([])

    useEffect(()=>{

        async function carregar(){

            const resposta = await api.get("/categorias")

            setCategorias(resposta.data)

        }

        carregar()

    },[])

    return(

        <div>

            <h1>Categorias</h1>

            {categorias.map((c)=>(
                <p key={c.id}>
                    {c.nome} - {c.tipo}
                </p>
            ))}

        </div>

    )

}

export default Categorias