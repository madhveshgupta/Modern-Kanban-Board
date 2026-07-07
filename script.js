let col = document.querySelectorAll(".task-column");
let todo = document.querySelector("#todo");
let draggedItem = null;

function drag(task){
    task.addEventListener("dragstart", () => {
        draggedItem = task;
        
        setTimeout(() => task.classList.add("dragging"), 0);
    });
    task.addEventListener("dragend", () => {
        draggedItem = null;
        task.classList.remove("dragging");
    });
}

function delete_task(task){
    let deleteBtn = task.querySelector(".delete-btn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            // Added a smooth scale down effect before removing
            task.style.transform = "scale(0.9)";
            task.style.opacity = "0";
            setTimeout(() => {
                task.remove(); 
                updateCounts();
                saveData();
            }, 200);
        });
    }
}

function updateCounts(){
    col.forEach((tc) => {
        let count = tc.querySelector(".right");
        let tasks_in_col = tc.querySelectorAll(".task");
        count.innerText = tasks_in_col.length;
    });
}

function createTask(taskTitle, taskDes){
    let div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    
    div.innerHTML = `
        <div>
            <h2>${taskTitle}</h2>
            <p>${taskDes}</p>
        </div>
        <button class="delete-btn" aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
        </button>
    `;

    drag(div);
    delete_task(div);
    return div;
}

function saveData(){
    let tasksData = {};
    col.forEach((tc)=>{
        let tasks_in_col = tc.querySelectorAll(".task");
        tasksData[tc.id] = Array.from(tasks_in_col).map(t=>{
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText,
            }
        })
        
    });
    localStorage.setItem("tasks_data", JSON.stringify(tasksData));
}

function loadData(){
    if(localStorage.getItem("tasks_data")){
        const data = JSON.parse(localStorage.getItem("tasks_data"));
        for(const columnId in data){
            const column = document.querySelector(`#${columnId}`);
            if(column){
                data[columnId].forEach(task => {
                    let div = createTask(task.title, task.desc);
                    column.append(div);
                    
                })
            }
        }
        updateCounts();
    }
}

col.forEach((tc)=>{
    tc.addEventListener("dragenter", (event)=>{
        tc.classList.add("hover-over");
    })
    tc.addEventListener("dragleave", ()=>{
        tc.classList.remove("hover-over");
    })
    tc.addEventListener("dragover", (e)=>{
        e.preventDefault(); 
    })
    tc.addEventListener("drop", (event)=>{
        event.preventDefault();
        tc.classList.remove("hover-over");
        if(draggedItem){
            tc.append(draggedItem);
            updateCounts();
            saveData();
        }
    });
})

let togglemodalbutton = document.querySelector("#toggle-modal");
let modal = document.querySelector(".modal");
let bg = document.querySelector(".bg");
let addtask = document.querySelector("#add-new-task");

togglemodalbutton.addEventListener("click", ()=>{
    modal.classList.add("active");
    document.querySelector("#task-title-input").focus();
})

bg.addEventListener("click", ()=>{
    modal.classList.remove("active");
})

addtask.addEventListener("click", ()=>{
    let taskTitle = document.querySelector("#task-title-input");
    let taskDes = document.querySelector("#task-description-input");
    
    if (taskTitle.value.trim() === "") return;
    let div = createTask(taskTitle.value, taskDes.value);
    todo.append(div);

    updateCounts();
    saveData();

    taskTitle.value = "";
    taskDes.value = "";
    modal.classList.remove("active");
})

loadData();
updateCounts();