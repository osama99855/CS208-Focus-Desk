const express = require('express');
const router = express.Router();

// Re-render submitted text when validation fails so the user can correct it.
function showTasks(req, res, next, status = 200, error = '', draft = '', editId = null) {
  req.db.query('SELECT * FROM todos ORDER BY completed ASC, id DESC;', (err, todos) => {
    if (err) return next(err);
    res.status(status).render('index', { title: 'Focus Desk', todos, error, draft, editId });
  });
}

function validId(id) {
  return typeof id === 'string' && /^[1-9]\d*$/.test(id);
}

router.get('/', (req, res, next) => showTasks(req, res, next));

router.post('/create', (req, res, next) => {
  const task = typeof req.body.task === 'string' ? req.body.task.trim() : '';
  if (!task || task.length > 255) {
    return showTasks(req, res, next, 400, 'Enter a task between 1 and 255 characters.', task);
  }
  req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err) => {
    if (err) return next(err);
    res.redirect(303, '/');
  });
});

router.post('/update', (req, res, next) => {
  const { id } = req.body;
  if (!validId(id)) return res.status(400).send('Invalid task ID.');
  const task = typeof req.body.task === 'string' ? req.body.task.trim() : '';
  if (!task || task.length > 255) {
    return showTasks(req, res, next, 400, 'Enter a task between 1 and 255 characters.', task, id);
  }
  const completed = req.body.completed === '1' ? 1 : 0;
  // Placeholders keep submitted descriptions separate from SQL commands.
  req.db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?;',
    [task, completed, id], (err, result) => {
      if (err) return next(err);
      if (!result.affectedRows) return res.status(404).send('Task not found.');
      res.redirect(303, '/');
    });
});

router.post('/delete', (req, res, next) => {
  const { id } = req.body;
  if (!validId(id)) return res.status(400).send('Invalid task ID.');
  req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, result) => {
    if (err) return next(err);
    if (!result.affectedRows) return res.status(404).send('Task not found.');
    res.redirect(303, '/');
  });
});

module.exports = router;
