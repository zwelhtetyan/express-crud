"use strict";
const form = document.getElementById("form");
const editFrom = document.getElementById("edit-form");
const successAlert = document.querySelector(".alert-success");
const errorAlert = document.querySelector(".alert-danger");
const modalBtn = document.querySelector(".detail-modal-btn");
const modalTitle = (document.querySelector(".detail-modal-title"));
const modalBody = document.querySelector(".detail-modal-body");
const modalCloseBtn = (document.querySelector(".modal-close-btn"));
const modalDeleteBtn = (document.querySelector(".modal-delete-btn"));
const editModalBtn = (document.querySelector(".edit-modal-btn"));
const editModalTitle = (document.querySelector(".edit-modal-title"));
const editModalBody = (document.querySelector(".edit-modal-body"));
insertUsers();
let CURRENT_USER_ID = "";
async function insertUsers() {
    const usersElem = document.querySelector(".users");
    const users = await getAllUsers();
    const HTML = users
        .map((user) => `<div class="user mb-2 position-relative" onclick="showUserDetail(${user.id})">
      <h4 class="">${user.name}</h4>
      <p class="fw-normal fs-5">Email: ${user.email}</p>
      <p class="m-0 fs-6">Created At: ${user.createdAt}</p>
      <p class="m-0 fs-6 ${user.updatedAt ? "d-block" : "d-none"}">Updated At: ${user.updatedAt}</p>

      <div class="edit-icon btn btn-primary position-absolute top-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="18" height="18" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
        </svg>
      </div>

      <div class="trash-icon btn btn-danger position-absolute top-0 end-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="18" height="18" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
        </svg>
      </div>
    </div>`)
        .join("");
    usersElem.innerHTML = HTML;
    const allEditIcons = document.querySelectorAll(".edit-icon");
    allEditIcons.forEach((editIcon, idx) => editIcon.addEventListener("click", (e) => handleEditUser(e, users[idx])));
    const allTrashIcons = document.querySelectorAll(".trash-icon");
    allTrashIcons.forEach((trashIcon, idx) => trashIcon.addEventListener("click", (e) => deleteConfirm(e, users[idx])));
}
async function getAllUsers() {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    console.log(data);
    return data;
}
async function getUser(id) {
    const res = await fetch(`http://localhost:5000/users/${id}`);
    const data = await res.json();
    return data;
}
async function addUser(newUser) {
    await fetch("http://localhost:5000/users", {
        method: "POST",
        body: newUser,
    });
    console.log("ik");
}
async function deleteUser(id) {
    const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
    });
    const data = await res.json();
    return data.message;
}
function deleteConfirm(e, user) {
    e.stopPropagation();
    modalTitle.textContent = "Delete User";
    modalBody.innerHTML = `<h5>Are you sure you want to delete this user ?</h5><p class="mb-0">Name - ${user.name}</p><p class="mb-0">Email - ${user.email}</p>`;
    modalCloseBtn.classList.add("d-none");
    modalDeleteBtn.classList.remove("d-none");
    CURRENT_USER_ID = user.id;
    modalBtn.click();
}
async function handleDeleteUser(id) {
    const message = await deleteUser(id);
    insertUsers();
    showAlert(successAlert, message);
}
modalDeleteBtn.addEventListener("click", () => handleDeleteUser(CURRENT_USER_ID));
async function editUser(updatedUser) {
    const res = await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
    });
    const data = await res.json();
    return { status: res.ok ? "success" : "error", message: data.message };
}
function handleEditUser(e, user) {
    e.stopPropagation();
    const nameInput = editFrom.querySelector("#name");
    const emailInput = editFrom.querySelector("#email");
    const passwordInput = editFrom.querySelector("#password");
    nameInput.value = user.name;
    emailInput.value = user.email;
    passwordInput.value = user.password;
    CURRENT_USER_ID = user.id;
    editModalBtn.click();
}
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("ok");
    const formData = new FormData(form);
    await addUser(formData);
});
editFrom.addEventListener("submit", async function (e) {
    var _a, _b, _c;
    e.preventDefault();
    const formData = new FormData(this);
    const updatedUser = {
        id: CURRENT_USER_ID,
        name: (_a = formData.get("name")) === null || _a === void 0 ? void 0 : _a.toString(),
        email: (_b = formData.get("email")) === null || _b === void 0 ? void 0 : _b.toString(),
        password: (_c = formData.get("password")) === null || _c === void 0 ? void 0 : _c.toString(),
    };
    if (!updatedUser.name || !updatedUser.email || !updatedUser.password) {
        const message = "Please fill all required fields";
        showAlert(errorAlert, message);
        return;
    }
    const { status, message } = await editUser(updatedUser);
    if (status === "success") {
        insertUsers();
        form.reset();
        editModalBtn.click();
        showAlert(successAlert, message);
    }
    else {
        showAlert(errorAlert, message);
    }
});
async function showUserDetail(id) {
    const userDetail = await getUser(id);
    modalTitle.textContent = userDetail.name;
    modalBody.textContent = `Email is ${userDetail.email}`;
    modalCloseBtn.classList.remove("d-none");
    modalDeleteBtn.classList.add("d-none");
    modalBtn.click();
}
function removeAlert(elem) {
    setTimeout(() => (elem.style.top = "-50%"), 1500);
}
function showAlert(elem, message) {
    elem.textContent = message;
    elem.style.top = "0";
    removeAlert(elem);
}
