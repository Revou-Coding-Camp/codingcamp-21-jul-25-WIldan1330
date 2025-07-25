document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDateInput = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');
    const filterDateInput = document.getElementById('filter-date');
    const resetFilterBtn = document.getElementById('reset-filter');
    const deleteAllBtn = document.getElementById('delete-all');
    const toggleThemeBtn = document.getElementById('toggle-mode');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = (filteredTasks) => {
        taskList.innerHTML = '';
        const tasksToRender = filteredTasks || tasks;

        if (tasksToRender.length === 0) {
            const noTask = document.createElement('tr');
            noTask.innerHTML = `<td colspan="4" class="no-task">No task found</td>`;
            taskList.appendChild(noTask);
            return;
        }

        tasksToRender.forEach((task, index) => {
            const row = document.createElement('tr');
            row.classList.add('fade-in');
            row.setAttribute('data-index', index);

            // Task
            const taskTd = document.createElement('td');
            const span = document.createElement('span');
            span.textContent = task.text;
            span.className = task.completed ? 'status-done' : '';
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
                const input = document.createElement('input');
                input.value = task.text;
                input.className = 'editable';
                input.addEventListener('blur', () => {
                    task.text = input.value.trim() || task.text;
                    saveTasks();
                    renderTasks();
                });
                taskTd.replaceChild(input, span);
                input.focus();
            });
            taskTd.appendChild(span);

            // Due Date
            const dateTd = document.createElement('td');
            dateTd.textContent = task.date;

            // Status
            const statusTd = document.createElement('td');
            const statusBtn = document.createElement('button');
            statusBtn.textContent = task.completed ? 'Selesai' : 'Belum';
            statusBtn.className = task.completed ? 'btn-done' : 'btn-undone';
            statusBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });
            statusTd.appendChild(statusBtn);

            // Actions
            const actionTd = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                if (confirm('Yakin ingin menghapus task ini?')) {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                }
            });

            actionTd.appendChild(deleteBtn);

            row.appendChild(taskTd);
            row.appendChild(dateTd);
            row.appendChild(statusTd);
            row.appendChild(actionTd);

            taskList.appendChild(row);
        });
    };

    const addTask = (text, date) => {
        tasks.push({ text, date, completed: false });
        saveTasks();
        renderTasks();
    };

    const filterTasks = (date) => {
        const filtered = tasks.filter(task => task.date === date);
        renderTasks(filtered);
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const date = taskDateInput.value;
        if (!text || !date) {
            alert('Harap isi task dan tanggal.');
            return;
        }
        addTask(text, date);
        taskInput.value = '';
        taskDateInput.value = '';
    });

    filterDateInput.addEventListener('change', () => {
        if (filterDateInput.value) {
            filterTasks(filterDateInput.value);
        } else {
            renderTasks();
        }
    });

    resetFilterBtn.addEventListener('click', () => {
        filterDateInput.value = '';
        renderTasks();
    });

    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Hapus semua task?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    renderTasks();
});
