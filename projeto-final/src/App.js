import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill }
    from "react-icons/bs";
const API = "http://localhost:5000";
function App() {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    //Função anonima
    //Carregar tarefas na página
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const res = await fetch(API + "/projeto-final")
                .then((res) => res.json())
                .then((data) => data)
                .catch((err) => console.log(err));
            setLoading(false);
            setTodos(res);
        };
        loadData();
    }, []);
    //esse E é um evento do próprio js
    //ele para o evento de load do form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const todo = {
            id: Math.random(),
            title,
            time,
            done: false,
        };
        //função assincrona pq ela vai
        //e não sabemos quando ela volta
        await fetch(API + "/projeto-final", {
            method: "POST",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json",
            },
        });
        //para trabalhar com o SPA
        //Pega o ultimo TODO sem fazer load e sem
        //fazer um novo estado
        setTodos((prevState) => [...prevState, todo]);
        if (loading) {
            return <p>Carregando...</p>
        }
        setTitle("");
        setTime("");
    };
    //método para deletar
    const handleDelete = async (id) => {
        await fetch(API + "/projeto-final/" + id, {
            method: "DELETE",
        });
        setTodos((prevState) =>
            prevState.filter((todo) =>
                todo.id !== id));
    };
    //método para alterar
    const handleEdit = async (todo) => {
        todo.done = !todo.done;
        const data = await fetch(API + "/projeto-final/" + todo.id, {
            method: "PUT",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setTodos((prevState) =>
            prevState.map((t) =>
                (t.id === data.id ? (t = data) : t))
        );
    };
    return (
        <div className="App">
            <div className="todo-header">
                <h1>React Afazeres</h1>
            </div>
            <div className="form-todo">
                <h2>Insira a próxima tarefa:</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="title">O que você vai fazer?</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título da tarefa"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title || ""}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="time">Duração: </label>
                        <input
                            type="text"
                            name="time"
                            placeholder="Tempo estimado em horas"
                            onChange={(e) => setTime(e.target.value)}
                            value={time || ""}
                            required
                        />
                    </div>
                    <input type="submit" value="Criar tarefa" />
                </form>
            </div>
            <div className="list-todo">
                <h2>Lista de Tarefas: </h2>
                {todos.length === 0 && <p> Não há tarefas</p>}
                {todos.map((todo) => (
                    <div className="todo" key={todo.id}>
                        <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                        <p>Duração: {todo.time}</p>
                        <div className="actions">
                            <span onClick={() => handleEdit(todo)}>
                                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill
                                />}
                            </span>
                            <BsTrash onClick={() => handleDelete(todo.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default App;