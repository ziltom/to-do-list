import express from "express";
import { createPool } from "mysql2/promise";
import "dotenv/config";

import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const pool = createPool(dbconfig);


(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Banco de dados conectado");
    conn.release();
  } catch (err) {
    console.log("Erro ao conectar o banco de dados: " + err);
  }
})();


app.post("/tarefas", async(req,res)=>{
    const {texto}=req.body;

    if (!texto){
        return res.status(400).json({message:"Insera o texto"})
    }

    try{

        await pool.execute(
            `INSERT INTO tarefas (texto, concluida) 
            VALUES(?, false)`,
            [texto]
        )

        res.json({sucesso:true, message:"tarefa criada"})

    } catch(err){
        console.log(err);
        return res.status(500).json({message:"Erro ao criar tarefa"});

    }
})

app.get("/tarefas", async(req,res)=>{
    try{

        const [rows]= await pool.execute(
            `SELECT * FROM tarefas`
        )

        res.json(rows)

    } catch(err){
        console.log("Erro:", err); 
        res.status(500).json({ erro: err.message });

    }
})

app.put("/tarefas/:id", async(req,res)=>{
    const{id}=req.params;
    const {novoTexto}=req.body;

    if(!novoTexto){
        return res.status(400).json({message:"Insira o novo texto"})
    }

    try{
        await pool.execute(
             `UPDATE tarefas SET texto=? WHERE id=?`,
             [novoTexto, id]

        )
       

        res.json({concluida:true, message:"Texto atualizado"})

    } catch(err){

        console.log(err);
        return res.status(500).json({message:"Não foi possível atualizar o texto da tarefa"})

    }


})

app.patch("/tarefas/:id/concluida", async (req, res) => {
  const { id } = req.params;
  const { concluida, concluida_em } = req.body; 

  try {
    await pool.execute(
      `UPDATE tarefas SET concluida=?, concluida_em=? WHERE id=?`,
      [concluida, concluida_em, id]
    );
    res.json({ message: "Status atualizado" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar status" });
  }
});

app.delete("/tarefas/:id", async(req,res)=>{
    const {id}=req.params;
    try{

        await pool.execute(
            `DELETE FROM tarefas WHERE id=?`,
            [id]
        )

        res.json({message: "TAREFA APAGADA"})

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Não foi possível deletar tarefa"})

    }

})

app.listen(3000, () => {
    console.log(" Servidor rodando em http://localhost:3000");
});