import { useState, useEffect } from "react";

 function Dashboard(){
  const[lista, setLista]=useState([]);
  const[addTarefa, setAddTarefa]=useState("")
  const [editandoId, setEditandoId] = useState(null);
  const [textoTemporario, setTextoTemporario] = useState("");
  const [erro, setErro] = useState("");

  async function mostrarTarefas(){
    const response = await fetch(`http://localhost:3000/tarefas`);
    console.log("STATUS:", response.status);
    const result = await response.json();

    setLista(result)
  }

  async function criarTarefa(e){
    e.preventDefault()

    if (addTarefa.length > 55) {
      setErro("O texto não pode ter mais de 55 caracteres!");
      return;
    }

    try{
        const response = await fetch(`http://localhost:3000/tarefas`, {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify({
            texto: addTarefa.charAt(0).toUpperCase() + addTarefa.slice(1)
        })
    })

    setAddTarefa("");
    setErro("");
    mostrarTarefas();

    } catch(err){
        console.log(err);
        console.log("Erro ao criar tarefa - frontEnd")

    }
    
  } 

  async function atualizarTexto(id, novoTexto){
    const response = await fetch (`http://localhost:3000/tarefas/${id}`, {
        method: "PUT",
        headers:{"Content-type": "application/json"},
        body: JSON.stringify({novoTexto: novoTexto})
    })
    mostrarTarefas();
  }

  async function atualizarConcluida(id, status) {
    const agora = new Date();
    const horario = !status 
      ? `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')}` 
      : null;

    await fetch(`http://localhost:3000/tarefas/${id}/concluida`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        concluida: !status,
        concluida_em: horario 
      }),
    });
    mostrarTarefas();
  }

  async function deletar(id){
    const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
            method: "DELETE",
    
        })
        mostrarTarefas();
  }

 useEffect(() => {
  mostrarTarefas();
}, []);

return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Minha Lista</h1>
      {erro && <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>{erro}</div>}

      <form onSubmit={criarTarefa}>
        <input
          type="text"
          value={addTarefa}
          onChange={(e) => setAddTarefa(e.target.value)}
          placeholder="O que precisa ser feito?"
        />
        <button type="submit">Adicionar</button>
      </form>

      <hr />

      {Array.isArray(lista) && lista.map((t) => (
        <div key={t.id} style={{ marginBottom: "15px", borderBottom: "1px solid #eee", padding: "10px" }}>
          
          {editandoId === t.id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formatado = textoTemporario.charAt(0).toUpperCase() + textoTemporario.slice(1);
              atualizarTexto(t.id, formatado);
              setEditandoId(null);
            }}>
              <input
                type="text"
                value={textoTemporario}
                onChange={(e) => setTextoTemporario(e.target.value)}
                autoFocus
                maxLength={55}
              />
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
            </form>
          ) : (
            <div>
              <span style={{ textDecoration: t.concluida ? "line-through" : "none", color: t.concluida ? "gray" : "black" }}>
                {t.texto} 
                {t.concluida ? ` ✅ (Finalizado às ${t.concluida_em})` : " "}
              </span>
              <br />
              <button onClick={() => atualizarConcluida(t.id, t.concluida)}>
                {t.concluida ? "Desfazer" : "Concluir"}
              </button>
              <button onClick={() => {
                setEditandoId(t.id);
                setTextoTemporario(t.texto);
              }}>Editar</button>
              <button onClick={() => deletar(t.id)}>Excluir</button>
            </div>
          )}
          
        </div>
      ))}
    </div>
  );

}
export default Dashboard;
