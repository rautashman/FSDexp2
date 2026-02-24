// ── DOM Elements ──
const nameInput  = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const nameError  = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");

const addBtn      = document.getElementById("addBtn");
const contactList = document.getElementById("contactList");

// ── State ──
let contacts     = loadContacts();   // array of { id, name, email, phone }
let editingId    = null;             // id of the contact currently being edited

// ── Initial Render ──
renderContacts();

// ── Event Listener ──
addBtn.addEventListener("click", handleAddOrUpdate);

// ── Core Functions ──

function handleAddOrUpdate() {
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!validate(name, email, phone)) return;

    if (editingId !== null) {
        // Update existing contact
        const index = contacts.findIndex(c => c.id === editingId);
        if (index !== -1) {
            contacts[index] = { id: editingId, name, email, phone };
        }
        editingId = null;
        addBtn.textContent = "Add Contact";
    } else {
        // Add new contact
        contacts.push({
            id: Date.now(),
            name,
            email,
            phone
        });
    }

    saveContacts();
    renderContacts();
    clearForm();
}

// ── Validation ──

function validate(name, email, phone) {
    let valid = true;

    // Reset errors
    clearErrors();

    if (!name) {
        showError(nameInput, nameError, "Name is required.");
        valid = false;
    }

    if (!email) {
        showError(emailInput, emailError, "Email is required.");
        valid = false;
    } else if (!isValidEmail(email)) {
        showError(emailInput, emailError, "Enter a valid email address.");
        valid = false;
    }

    if (!phone) {
        showError(phoneInput, phoneError, "Phone number is required.");
        valid = false;
    }

    return valid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, errorEl, message) {
    input.classList.add("error");
    errorEl.textContent = message;
}

function clearErrors() {
    [nameInput, emailInput, phoneInput].forEach(i => i.classList.remove("error"));
    [nameError, emailError, phoneError].forEach(e => e.textContent = "");
}

// ── Render ──

function renderContacts() {
    contactList.innerHTML = "";

    if (contacts.length === 0) {
        contactList.innerHTML = '<li class="empty-state">No contacts added yet.</li>';
        return;
    }

    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.className = "contact-item";
        li.innerHTML = `
            <div class="contact-info">
                <p><strong>Name:</strong> ${escapeHTML(contact.name)}</p>
                <p><strong>Email:</strong> ${escapeHTML(contact.email)}</p>
                <p><strong>Phone:</strong> ${escapeHTML(contact.phone)}</p>
            </div>
            <div class="contact-actions">
                <button class="btn btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        contactList.appendChild(li);
    });
}

// ── Edit ──

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    nameInput.value  = contact.name;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;

    editingId = id;
    addBtn.textContent = "Update Contact";
    clearErrors();

    // Scroll to form
    nameInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Delete ──

function deleteContact(id) {
    contacts = contacts.filter(c => c.id !== id);

    // If the deleted contact was being edited, reset the form
    if (editingId === id) {
        editingId = null;
        addBtn.textContent = "Add Contact";
        clearForm();
    }

    saveContacts();
    renderContacts();
}

// ── Helpers ──

function clearForm() {
    nameInput.value  = "";
    emailInput.value = "";
    phoneInput.value = "";
    clearErrors();
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// ── Local Storage ──

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContacts() {
    try {
        return JSON.parse(localStorage.getItem("contacts")) || [];
    } catch {
        return [];
    }
}
