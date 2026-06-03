const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   FILE STORAGE (SAFE VERSION)
========================= */

const DATA_FILE = path.join(__dirname, "data.json");

/* default structure */
const defaultData = {
  tasks: [],
  subjects: []
};

/* load data safely */
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }

    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || JSON.stringify(defaultData));
  } catch (err) {
    console.error("Load error:", err);
    return defaultData;
  }
}

/* save data */
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Save error:", err);
  }
}

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.send("Task Management System API is running 🚀");
});

/* =========================
   TASK CRUD
========================= */

// CREATE TASK
app.post("/tasks", (req, res) => {
  const data = loadData();

  if (!req.body.name) {
    return res.status(400).json({ error: "Task name is required" });
  }

  const subjectExists = data.subjects.find(
    s => s.subject_id === req.body.subject_id
  );

  if (!subjectExists) {
    return res.status(400).json({ error: "Invalid subject_id" });
  }

  const task = {
    task_id: Date.now().toString(),
    name: req.body.name,
    subject_id: req.body.subject_id,
    dueDate: req.body.dueDate || "",
    difficulty: req.body.difficulty || "Medium",
    completed: false,
    createdAt: new Date().toISOString()
  };

  data.tasks.push(task);
  saveData(data);

  res.status(201).json(task);
});

// GET ALL TASKS
app.get("/tasks", (req, res) => {
  const data = loadData();
  res.json(data.tasks);
});

// GET TASK BY ID
app.get("/tasks/:id", (req, res) => {
  const data = loadData();

  const task = data.tasks.find(t => t.task_id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  res.json(task);
});

// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
  const data = loadData();

  const index = data.tasks.findIndex(t => t.task_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  data.tasks[index] = { ...data.tasks[index], ...req.body };

  saveData(data);
  res.json(data.tasks[index]);
});

// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
  const data = loadData();

  data.tasks = data.tasks.filter(t => t.task_id !== req.params.id);

  saveData(data);
  res.json({ message: "Task deleted" });
});

/* =========================
   SUBJECT CRUD
========================= */

// CREATE SUBJECT
app.post("/subjects", (req, res) => {
  const data = loadData();

  if (!req.body.name) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  const subject = {
    subject_id: Date.now().toString(),
    name: req.body.name
  };

  data.subjects.push(subject);
  saveData(data);

  res.status(201).json(subject);
});

// GET ALL SUBJECTS
app.get("/subjects", (req, res) => {
  const data = loadData();
  res.json(data.subjects);
});

// GET SUBJECT BY ID
app.get("/subjects/:id", (req, res) => {
  const data = loadData();

  const subject = data.subjects.find(s => s.subject_id === req.params.id);
  if (!subject) return res.status(404).json({ error: "Subject not found" });

  res.json(subject);
});

// UPDATE SUBJECT
app.put("/subjects/:id", (req, res) => {
  const data = loadData();

  const index = data.subjects.findIndex(s => s.subject_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Subject not found" });

  data.subjects[index] = { ...data.subjects[index], ...req.body };

  saveData(data);
  res.json(data.subjects[index]);
});

// DELETE SUBJECT
app.delete("/subjects/:id", (req, res) => {
  const data = loadData();

  data.subjects = data.subjects.filter(s => s.subject_id !== req.params.id);

  saveData(data);
  res.json({ message: "Subject deleted" });
});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});