const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   STORAGE (in-memory)
========================= */
let tasks = [];
let subjects = [];

/* =========================
   HOME ROUTE 
========================= */

app.get("/", (req, res) => {
  res.send("Task Management System API is running 🚀");
});

/* =========================
   TASK CRUD
========================= */

// CREATE TASK (WITH VALIDATION + RELATION TO SUBJECT)
app.post("/tasks", (req, res) => {

  // validation: name required
  if (!req.body.name) {
    return res.status(400).json({ error: "Task name is required" });
  }

  // validation: subject must exist
  const subjectExists = subjects.find(
    s => s.subject_id === req.body.subject_id
  );

  if (!subjectExists) {
    return res.status(400).json({ error: "Invalid subject_id" });
  }

  const task = {
    task_id: Date.now().toString(),
    name: req.body.name,
    subject_id: req.body.subject_id,
    ...req.body
  };

  tasks.push(task);
  res.status(201).json(task);
});

// GET ALL TASKS
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET TASK BY ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.task_id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.task_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.task_id !== req.params.id);
  res.json({ message: "Task deleted" });
});

/* =========================
   SUBJECT CRUD
========================= */

// CREATE SUBJECT
app.post("/subjects", (req, res) => {

  if (!req.body.name) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  const subject = {
    subject_id: Date.now().toString(),
    name: req.body.name,
    ...req.body
  };

  subjects.push(subject);
  res.status(201).json(subject);
});

// GET ALL SUBJECTS
app.get("/subjects", (req, res) => {
  res.json(subjects);
});

// GET SUBJECT BY ID
app.get("/subjects/:id", (req, res) => {
  const subject = subjects.find(s => s.subject_id === req.params.id);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  res.json(subject);
});

// UPDATE SUBJECT
app.put("/subjects/:id", (req, res) => {
  const index = subjects.findIndex(s => s.subject_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Subject not found" });

  subjects[index] = { ...subjects[index], ...req.body };
  res.json(subjects[index]);
});

// DELETE SUBJECT
app.delete("/subjects/:id", (req, res) => {
  subjects = subjects.filter(s => s.subject_id !== req.params.id);
  res.json({ message: "Subject deleted" });
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
