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