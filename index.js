// ── DOM Elements ──
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const formStatus = document.getElementById("formStatus");

const addBtn = document.getElementById("addBtn");
const contactList = document.getElementById("contactList");

// ── State ──
let contacts = [];
let editingId = null;

// ── Initial Render ──
loadContacts();

// ── Event Listener ──
contactForm.addEventListener("submit", handleAddOrUpdate);

// ── Core Functions ──

async function handleAddOrUpdate(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!validate(name, email, phone)) return;

    setFormStatus("Saving contact...");
    addBtn.disabled = true;

    try {
        const payload = { name, email, phone };
        const isEditing = editingId !== null;
        const response = await fetch(isEditing ? `/api/contacts/${editingId}` : "/api/contacts", {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const responseBody = response.status === 204 ? null : await response.json();

        if (!response.ok) {
            throw new Error(responseBody?.message || "Unable to save contact.");
        }

        editingId = null;
        addBtn.textContent = "Add Contact";
        clearForm();
        setFormStatus("Contact saved successfully.", false);
        await loadContacts();
    } catch (error) {
        setFormStatus(error.message, true);
    } finally {
        addBtn.disabled = false;
    }
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

function setFormStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.style.color = isError ? "red" : "#1f7a1f";
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
                <button class="btn btn-edit" onclick="editContact('${contact.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteContact('${contact.id}')">Delete</button>
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
    setFormStatus(`Editing ${contact.name}.`);

    // Scroll to form
    nameInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Delete ──

async function deleteContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: "DELETE"
        });

        if (!response.ok && response.status !== 204) {
            const responseBody = await response.json().catch(() => null);
            setFormStatus(responseBody?.message || "Unable to delete contact.", true);
            return;
        }

        if (editingId === id) {
            editingId = null;
            addBtn.textContent = "Add Contact";
            clearForm();
        }

        setFormStatus("Contact deleted.", false);
        await loadContacts();
    } catch (error) {
        setFormStatus("Unable to delete contact. Check that the server is running.", true);
    }
}

// ── Helpers ──

function clearForm() {
    nameInput.value  = "";
    emailInput.value = "";
    phoneInput.value = "";
    clearErrors();
    formStatus.textContent = "";
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

async function loadContacts() {
    try {
        const response = await fetch("/api/contacts");

        if (!response.ok) {
            throw new Error("Failed to load contacts.");
        }

        contacts = await response.json();
        renderContacts();
        clearErrors();
    } catch (error) {
        contacts = [];
        renderContacts();
        setFormStatus(error.message || "Unable to load contacts.", true);
    }
}
