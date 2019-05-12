// JS code that accessses the server

function loadTasks() {
    fetch('https://8080-dot-6867331-dot-devshell.appspot.com/api/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error', response.status);
            }
            else {
                return response.json()
            }
        })
        .then(data => {
            let div = document.getElementById('tasks');
            div.innerHTML = "";
            data.forEach(element => {
                let p = document.createElement('p');
                p.innerHTML = element.name;


                div.appendChild(p);
            });
        })
        .catch(error => {
            console.log('Failed to retrieve user');
        });
}

function addTask() {
    /* 
    {
  "name": "stumbea",
  "deadline":"20/20/20",
  "authorId":10
}*/
    let inputText = document.getElementById("input-task").value;
    let taskDetails = {
        "name": inputText,
        "deadline": "1/04/2019",
        "authorId": 10
    }
    fetch('https://8080-dot-6867331-dot-devshell.appspot.com/api/tasks', {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(taskDetails), 
    })
    .then(response => {
        console.log(response);
        loadTasks();
    }); // parses JSON response into native Javascript objects 
}
