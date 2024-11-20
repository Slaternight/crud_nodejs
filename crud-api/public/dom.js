const form = document.getElementById('dataForm');
    const itemsTable = document.getElementById('itemsTable').querySelector('tbody');
    const itemNameInput = document.getElementById('itemName');
    const itemLastNameInput = document.getElementById('itemLastName');
    const itemIdInput = document.getElementById('itemId');

    // Cargar todos los datos al inicio
    const loadItems = async () => {
      const res = await fetch('/items');
      const data = await res.json();
      renderTable(data);
    };

    // Renderizar la tabla con los datos
    const renderTable = (data) => {
      itemsTable.innerHTML = '';
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.lastname}</td>
          <td>
            <button onclick="editItem(${item.id}, '${item.name}', '${item.lastname}')">Editar</button>
            <button onclick="deleteItem(${item.id})">Eliminar</button>
          </td>
        `;
        itemsTable.appendChild(row);
      });
    };

    // Agregar o actualizar un dato
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = itemNameInput.value;
      const lastname = itemLastNameInput.value;
      const id = itemIdInput.value;

      const method = id ? 'PUT' : 'POST'; // PUT si estamos actualizando, POST si es nuevo
      const url = id ? `/items/${id}` : '/items';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname })
      });
      const data = await res.json();

      // Reiniciar el formulario
      itemNameInput.value = '';
      itemLastNameInput.value = '';
      itemIdInput.value = '';

      loadItems(); // Recargar los datos
    });

    // Cargar un dato para editar
    const editItem = (id, name, lastname) => {
      itemNameInput.value = name;
      itemLastNameInput.value = lastname;
      itemIdInput.value = id;
    };
// Eliminar un dato
const deleteItem = async (id) => {
      const res = await fetch(`/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      loadItems(); // Recargar los datos
    };

    // Cargar los elementos al iniciar
    loadItems();


// Lista con dom y cronometro
let tareas = [];
let temporizador;
let minutos = 25;
let segundos = 0;
let temporizadorActivo = false;

function mostrarTareas() {
    const listaTareas = document.getElementById('listaTareas');
    listaTareas.innerHTML = '';

    tareas.forEach((tarea, indice) => {
        const itemTarea = document.createElement('div');
        itemTarea.className = 'item-tarea';
        
        const textoTarea = document.createElement('span');
        textoTarea.textContent = tarea;
        
        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.className = 'boton-editar';
        botonEditar.onclick = () => editarTarea(indice);

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.className = 'boton-eliminar';
        botonEliminar.onclick = () => eliminarTarea(indice);

        itemTarea.appendChild(textoTarea);
        itemTarea.appendChild(botonEditar);
        itemTarea.appendChild(botonEliminar);
        listaTareas.appendChild(itemTarea);
    });
}

function crearTarea() {
    const entradaTarea = document.getElementById('entradaTarea');
    const textoTarea = entradaTarea.value.trim();
    if (textoTarea) {
        tareas.push(textoTarea);
        entradaTarea.value = '';
        mostrarTareas();
    }
}

function editarTarea(indice) {
    const nuevaTarea = prompt("Edita tu tarea:", tareas[indice]);
    if (nuevaTarea !== null) {
        tareas[indice] = nuevaTarea.trim();
        mostrarTareas();
    }
}

function eliminarTarea(indice) {
    tareas.splice(indice, 1);
    mostrarTareas();
}

// Temporizador para tareas
function iniciarTemporizador() {
    if (temporizadorActivo) {
        // Si el temporizador ya está en marcha, lo detenemos
        clearInterval(temporizador);
        temporizadorActivo = false;
        document.querySelector('button[onclick="iniciarTemporizador()"]').textContent = 'Iniciar Temporizador';
    } else {
        // Si el temporizador no está en marcha, lo iniciamos
        temporizador = setInterval(() => {
            if (segundos === 0) {
                if (minutos === 0) {
                    clearInterval(temporizador);
                    temporizadorActivo = false;
                    alert("¡Tiempo terminado!");
                    reiniciarTemporizador();
                } else {
                    minutos--;
                    segundos = 59;
                }
            } else {
                segundos--;
            }
            document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
            document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
        }, 1000);

        temporizadorActivo = true;
        document.querySelector('button[onclick="iniciarTemporizador()"]').textContent = 'Pausar Temporizador';
    }
}

function reiniciarTemporizador() {
    clearInterval(temporizador);
    minutos = 25;
    segundos = 0;
    document.getElementById('minutos').textContent = '25';
    document.getElementById('segundos').textContent = '00';
    temporizadorActivo = false;
    document.querySelector('button[onclick="iniciarTemporizador()"]').textContent = 'Iniciar Temporizador';
}

document.addEventListener("DOMContentLoaded", mostrarTareas);
