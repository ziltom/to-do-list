import { useState, useEffect } from "react";
import "./dashboard.css";

function Dashboard() {
  const [lista, setLista] = useState([]);
  const [addTarefa, setAddTarefa] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [textoTemporario, setTextoTemporario] = useState("");
  const [erro, setErro] = useState("");
  const capacidade = 10;
  const restante = capacidade - lista.length;

  async function mostrarTarefas() {
    try {
      const response = await fetch(`http://localhost:3000/tarefas`);
      const result = await response.json();
      setLista(result);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }

  async function criarTarefa(e) {
    e.preventDefault();

    if (addTarefa.length > 55) {
      setErro("O texto não pode ter mais de 55 caracteres!");
      return;
    }

    if (lista.length >= capacidade) {
      setErro("Você atingiu o limite de 10 tarefas");
      return;
    }

    try {
      await fetch(`http://localhost:3000/tarefas`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          texto: addTarefa.charAt(0).toUpperCase() + addTarefa.slice(1)
        })
      });

      setAddTarefa("");
      setErro("");
      mostrarTarefas();
    } catch (err) {
      console.log(err);
      console.log("Erro ao criar tarefa - frontEnd");
    }
  }

  async function atualizarTexto(id, novoTexto) {
    await fetch(`http://localhost:3000/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ novoTexto: novoTexto })
    });
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

  async function deletar(id) {
    
    
    await fetch(`http://localhost:3000/tarefas/${id}`, {
      
      method: "DELETE",
    });
    mostrarTarefas();
  }

  useEffect(() => {
    mostrarTarefas();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="todo-card">
        <h1 className="title">Minha Lista</h1>
        <p className="subtitle">Tarefas disponíveis: <strong>{restante}</strong></p>
        
        {erro && <div className="error-message">{erro}</div>}

        <form className="add-form" onSubmit={criarTarefa}>
          <input
            className="input-task"
            type="text"
            value={addTarefa}
            onChange={(e) => setAddTarefa(e.target.value)}
            placeholder="O que precisa ser feito?"
          />
          <button className="btn btn-primary" type="submit">Adicionar</button>
        </form>

        <hr className="divider" />

        <div className="task-list">
          {Array.isArray(lista) && lista.map((t) => (
            <div key={t.id} className="task-item">
              
              {editandoId === t.id ? (
                <form className="edit-form" onSubmit={(e) => {
                  e.preventDefault();
                  const formatado = textoTemporario.charAt(0).toUpperCase() + textoTemporario.slice(1);
                  atualizarTexto(t.id, formatado);
                  setEditandoId(null);
                }}>
                  <input
                    className="input-task edit-input"
                    type="text"
                    value={textoTemporario}
                    onChange={(e) => setTextoTemporario(e.target.value)}
                    autoFocus
                    maxLength={55}
                  />
                  <div className="action-buttons">
                    <button className="btn btn-success" type="submit">Salvar</button>
                    <button className="btn btn-secondary" type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <div className="task-content">
                  <span className={`task-text ${t.concluida ? 'completed' : ''}`}>
                    {t.texto}
                    {Boolean(t.concluida) && (
  <span className="timestamp">
    ✅ (Finalizado às {t.concluida_em})
  </span>
)}
                  </span>
                  
                  <div className="action-buttons">
                    <button 
                      className={`btn ${t.concluida ? 'btn-secondary' : 'btn-success'}`} 
                      onClick={() => atualizarConcluida(t.id, t.concluida)}
                    >
                      {t.concluida ? "Desfazer" : "Concluir"}
                    </button>
                    <button className="btn btn-edit" onClick={() => {
                      setEditandoId(t.id);
                      setTextoTemporario(t.texto);
                    }}>Editar</button>
                    <button className="btn btn-danger" onClick={() => deletar(t.id)}
                      >Excluir</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;