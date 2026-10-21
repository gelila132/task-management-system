const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    ...req.body
  };
  app.put("/tasks/:id", (req, res) => {

  const id = Number(req.params.id);

  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, ...req.body }
      : task
  );

  res.json({
    message: "Task updated"
  });

});
app.delete("/tasks/:id", (req, res) => {

  const id = Number(req.params.id);

  tasks = tasks.filter(
    task => task.id !== id
  );

  res.json({
    message: "Task deleted"
  });

});

  tasks.push(task);

  res.status(201).json(task);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});