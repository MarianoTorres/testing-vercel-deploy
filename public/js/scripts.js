// Almacenamos los usuarios en una variable global
let users = []
let selectedUserId = null

// Elementos del DOM
const elements = {
  userCountInput: document.getElementById("userCount"),
  fetchButton: document.getElementById("fetchUsers"),
  loadingElement: document.getElementById("loading"),
  errorElement: document.getElementById("error"),
  userTableElement: document.getElementById("userTable"),
  userCountDisplay: document.getElementById("userCount"),
  userListElement: document.getElementById("userList"),
  userModal: document.getElementById("userModal"),
  userDetails: document.getElementById("userDetails"),
  deleteUserBtn: document.getElementById("deleteUserBtn"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  overlay: document.getElementById("overlay"),
  closeButton: document.querySelector(".close-button"),
}

/**
 * Función para obtener usuarios de la API
 * @param {number} count - Cantidad de usuarios a obtener
 * @returns {Promise} - Promesa con los datos de los usuarios
 */
async function fetchUsers(count) {
  try {
    // Mostramos el indicador de carga
    showLoading(true)
    hideError()

    // Realizamos la solicitud a la API
    const response = await fetch(`https://randomuser.me/api/?results=${count}`)

    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    // Convertimos la respuesta a JSON
    const data = await response.json()

    // Añadimos IDs únicos a los usuarios
    return data.results.map((user) => ({
      ...user,
      id: crypto.randomUUID(),
    }))
  } catch (error) {
    // Mostramos el error
    showError(error.message)
    return []
  } finally {
    // Ocultamos el indicador de carga
    showLoading(false)
  }
}

/**
 * Función para renderizar la tabla de usuarios
 * @param {Array} users - Array de usuarios a mostrar
 */
function renderUserTable(users) {
  // Actualizamos el contador de usuarios
  elements.userCountDisplay.textContent = users.length

  // Limpiamos la tabla
  elements.userListElement.innerHTML = ""

  // Si no hay usuarios, ocultamos la tabla
  if (users.length === 0) {
    elements.userTableElement.classList.add("hidden")
    return
  }

  // Mostramos la tabla
  elements.userTableElement.classList.remove("hidden")

  // Creamos las filas de la tabla
  users.forEach((user) => {
    const row = document.createElement("tr")
    row.dataset.userId = user.id

    row.innerHTML = `
      <td><img src="${user.picture.thumbnail}" alt="${user.name.first}" class="user-thumbnail"></td>
      <td>${user.name.first} ${user.name.last}</td>
      <td>${user.email}</td>
      <td>${user.location.country}</td>
      <td><button class="view-btn">Ver detalles</button></td>
    `

    // Añadimos evento de clic a la fila
    row.addEventListener("click", () => showUserDetails(user.id))

    // Añadimos la fila a la tabla
    elements.userListElement.appendChild(row)
  })
}

/**
 * Función para mostrar los detalles de un usuario en el modal
 * @param {string} userId - ID del usuario a mostrar
 */
function showUserDetails(userId) {
  // Buscamos el usuario por su ID
  const user = users.find((u) => u.id === userId)

  if (!user) return

  // Guardamos el ID del usuario seleccionado
  selectedUserId = userId

  // Creamos el contenido del modal
  elements.userDetails.innerHTML = `
    <div class="user-details">
      <img src="${user.picture.large}" alt="${user.name.first}" class="user-avatar">
      <div class="user-info">
        <h3>${user.name.title} ${user.name.first} ${user.name.last}</h3>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span>${user.email}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Teléfono:</span>
            <span>${user.phone}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Género:</span>
            <span>${user.gender}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Edad:</span>
            <span>${user.dob.age} años</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Fecha de nacimiento:</span>
            <span>${formatDate(user.dob.date)}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Nacionalidad:</span>
            <span>${user.nat}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Dirección:</span>
            <span>${user.location.street.number} ${user.location.street.name}, ${user.location.city}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">País:</span>
            <span>${user.location.country}</span>
          </div>
        </div>
      </div>
    </div>
  `

  // Mostramos el modal y el overlay
  elements.userModal.classList.remove("hidden")
  elements.overlay.classList.remove("hidden")
}

/**
 * Función para cerrar el modal
 */
function closeModal() {
  elements.userModal.classList.add("hidden")
  elements.overlay.classList.add("hidden")
  selectedUserId = null
}

/**
 * Función para eliminar un usuario
 */
function deleteUser() {
  if (!selectedUserId) return

  // Filtramos el usuario seleccionado
  users = users.filter((user) => user.id !== selectedUserId)

  // Actualizamos la tabla
  renderUserTable(users)

  // Cerramos el modal
  closeModal()
}

/**
 * Función para mostrar u ocultar el indicador de carga
 * @param {boolean} show - Indica si se debe mostrar el indicador
 */
function showLoading(show) {
  if (show) {
    elements.loadingElement.classList.remove("hidden")
  } else {
    elements.loadingElement.classList.add("hidden")
  }
}

/**
 * Función para mostrar un mensaje de error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
  elements.errorElement.textContent = `Error: ${message}`
  elements.errorElement.classList.remove("hidden")
}

/**
 * Función para ocultar el mensaje de error
 */
function hideError() {
  elements.errorElement.classList.add("hidden")
}

/**
 * Función para formatear una fecha
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Evento para el botón de obtener usuarios
  elements.fetchButton.addEventListener("click", async () => {
    const count = Number.parseInt(elements.userCountInput.value) || 5

    // Limitamos la cantidad de usuarios
    if (count < 1) {
      elements.userCountInput.value = 1
      return
    } else if (count > 50) {
      elements.userCountInput.value = 50
      return
    }

    // Obtenemos los usuarios
    users = await fetchUsers(count)

    // Renderizamos la tabla
    renderUserTable(users)
  })

  // Evento para cerrar el modal
  elements.closeButton.addEventListener("click", closeModal)
  elements.closeModalBtn.addEventListener("click", closeModal)
  elements.overlay.addEventListener("click", closeModal)

  // Evento para eliminar un usuario
  elements.deleteUserBtn.addEventListener("click", deleteUser)
})
