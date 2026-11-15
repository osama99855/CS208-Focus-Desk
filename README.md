# Focus Desk — CS 208 Full Stack Application

A task board built by modifying Shane P's CS208 starter. Uses Express routes,
Pug templates, CSS, and a MariaDB database. No frontend build step is needed.

## Features

- List, create, and delete tasks.
- Expand **Edit task** to change the description, select **Completed**, and save.
- Uncheck **Completed** and save to return a task to Not Completed.
- Reject blank/whitespace-only descriptions and descriptions over 255 characters on the server.
- Responsive cream-and-green design, task totals, completion badges, and empty state.
- Parameterized queries and escaped Pug text output.

## Setup on Ubuntu or WSL

### 1. Install tools and start MariaDB

```bash
sudo apt update
sudo apt install -y nodejs npm git mariadb-server
sudo service mariadb start
```

Use Node.js 18 or newer. In WSL, use Linux Node and npm, not Windows executables.

### 2. Create the database

From the project directory:

```bash
sudo mariadb < setup_scripts/create_demo_table.sql
sudo mariadb
```

At the MariaDB prompt, run the following. Replace the example password with
your own local database password:

```sql
CREATE USER IF NOT EXISTS 'focus_app'@'localhost'
IDENTIFIED BY 'YOUR_LOCAL_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON cs208demo.*
TO 'focus_app'@'localhost';
EXIT;
```

### 3. Install dependencies and run

`bin/db.js` reads the database username and password from `DB_USER` and
`DB_PASSWORD`. The host is `localhost` and the database is `cs208demo`.

```bash
npm install
DB_USER=focus_app DB_PASSWORD='YOUR_LOCAL_PASSWORD' npm start
```

Open http://localhost:3000. Stop the server with Ctrl+C.
Do not commit your actual database password.

## How it works

- `app.js`: Express middleware and error handling.
- `bin/www`: HTTP server; `bin/db.js`: database connection.
- `routes/index.js`: GET `/` lists tasks; POST `/create`, `/update`, `/delete`
  modify database rows and redirect to the list.
- `views/index.pug`: add form, task cards, and edit forms.
- `public/stylesheets/style.css`: original responsive visual design.
- `setup_scripts/create_demo_table.sql`: original database schema; no schema changes required.

The task description is stored in `todos.task`; the checkbox is stored as 0 or
1 in `todos.completed`. Unchecked HTML checkboxes are omitted from the request,
so the update route treats a missing checkbox as 0.

## Verification before submission

1. Open the empty board, add a task, and refresh to confirm it persists.
2. Edit its text, save, and refresh to confirm the change persists.
3. Check Completed and save; confirm its badge and totals change. Uncheck and save.
4. Try an empty description and spaces only for both add and edit.
5. Delete a task; refresh to confirm it stays deleted.
6. Check the layout at a narrow phone width.

Automated route checks were run against a temporary in-memory database adapter
for validation, CRUD, and escaped output. This does not verify MariaDB SQL
execution or persistence; run the checks above with your configured MariaDB.

## Troubleshooting

- Connection refused: `sudo service mariadb start`.
- Access denied: confirm the DB credentials in `bin/db.js` or environment variables.
- Unknown database/table: rerun the schema command above.
- Port 3000 busy: stop the previous server, or set a different `PORT`.
- See the original setup walkthrough at `docs/example_project.md`.

## Citations and assistance

- Shane P, **CS208-full-stack** starter repository:
  https://github.com/shanep/CS208-full-stack
  Retrieved November 14, 2026. The original Express/Pug/MariaDB structure,
  create/delete behavior, setup scripts, and walkthrough were adapted. The
  original license is retained in `LICENSE`.
- **OpenAI ChatGPT/Codex**, assistance on November 14, 2026: generated the
  update route, validation, Focus Desk templates/CSS, README, and verification
  checks. Review and understand this assistance before submitting and follow
  your instructor's disclosure policy.
- No external images, fonts, or copied CSS were used.

## Submit

Commit and push all changed files to **your own GitHub repository**. Submit
that repository URL in Canvas, not a Codespaces preview link or ZIP. This
package has not been published to your GitHub account.
