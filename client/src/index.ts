interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const form = <HTMLFormElement>document.getElementById('form');
const editFrom = <HTMLFormElement>document.getElementById('edit-form');
const successAlert = <HTMLDivElement>document.querySelector('.alert-success');
const errorAlert = <HTMLDivElement>document.querySelector('.alert-danger');
const modalBtn = <HTMLButtonElement>document.querySelector('.detail-modal-btn');
const modalTitle = <HTMLHeadingElement>(
  document.querySelector('.detail-modal-title')
);
const modalBody = <HTMLDivElement>document.querySelector('.detail-modal-body');
const modalCloseBtn = <HTMLButtonElement>(
  document.querySelector('.modal-close-btn')
);
const modalDeleteBtn = <HTMLButtonElement>(
  document.querySelector('.modal-delete-btn')
);
const editModalBtn = <HTMLButtonElement>(
  document.querySelector('.edit-modal-btn')
);
const editModalTitle = <HTMLHeadingElement>(
  document.querySelector('.edit-modal-title')
);
const editModalBody = <HTMLDivElement>(
  document.querySelector('.edit-modal-body')
);

insertUsers();

// id to edit user --global variable
let CURRENT_USER_ID: string = '';

async function insertUsers() {
  const userContainer = <HTMLDivElement>(
    document.querySelector('.user_container')
  );

  userContainer.innerHTML = '';

  const users: User[] = await getAllUsers();

  users.forEach(({ id, name, email, images }) => {
    // create element
    const userName = document.createElement('p');
    const userEmail = document.createElement('p');
    const userCard = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const userImagesContainer = document.createElement('div');

    // add classnames
    userCard.classList.add('userCard', 'position-relative');
    userImagesContainer.classList.add('img_container', 'mt-2');
    editBtn.classList.add(
      'edit-btn',
      'btn',
      'btn-primary',
      'position-absolute',
      'top-0'
    );
    deleteBtn.classList.add(
      'delete-btn',
      'btn',
      'btn-danger',
      'position-absolute',
      'top-0',
      'end-0'
    );

    // add content
    userName.textContent = `Name: ${name}`;
    userEmail.textContent = `Email: ${email}`;
    editBtn.textContent = 'Edit';
    deleteBtn.textContent = 'Delete';

    if (images) {
      images.forEach((img) => {
        userImagesContainer.innerHTML += `<img src='http://localhost:5000/${img}' class="user_img" alt='user_img'/>`;
      });
    }

    userCard.id = id;

    userCard.append(
      userName,
      userEmail,
      userImagesContainer,
      editBtn,
      deleteBtn
    );

    userContainer.appendChild(userCard);
  });

  document
    .querySelectorAll('.userCard')
    .forEach((card) =>
      card.addEventListener('click', () => showUserDetail(card.id))
    );

  //edit
  const allEditBtn = document.querySelectorAll('.edit-btn');
  allEditBtn.forEach((editIcon, idx) =>
    editIcon.addEventListener('click', (e) => handleEditUser(e, users[idx]))
  );

  // delete
  const allTrashBtn = document.querySelectorAll('.delete-btn');
  allTrashBtn.forEach((trashIcon, idx) =>
    trashIcon.addEventListener('click', (e) => deleteConfirm(e, users[idx]))
  );
}

async function getAllUsers() {
  const res = await fetch('http://localhost:5000/users');
  const data = await res.json();
  return data;
}

async function getUser(id: string) {
  const res = await fetch(`http://localhost:5000/users/${id}`);
  const data = await res.json();
  return data;
}

async function addUser(newUser: FormData) {
  const res = await fetch('http://localhost:5000/users', {
    method: 'POST',
    body: newUser,
  });

  const data = await res.json();

  return { status: res.ok ? 'success' : 'error', message: data.message };
}

async function deleteUser(id: string) {
  const res = await fetch(`http://localhost:5000/users/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  return data.message;
}

function deleteConfirm(e: Event, user: User) {
  e.stopPropagation();

  modalTitle.textContent = 'Delete User';
  modalBody.innerHTML = `<h5>Are you sure you want to delete this user ?</h5><p class="mb-0">Name - ${user.name}</p><p class="mb-0">Email - ${user.email}</p>`;

  modalCloseBtn.classList.add('d-none');
  modalDeleteBtn.classList.remove('d-none');

  CURRENT_USER_ID = user.id;

  modalBtn.click();
}

async function handleDeleteUser(id: string) {
  const message = await deleteUser(id);

  insertUsers();

  showAlert(successAlert, message);
}

modalDeleteBtn.addEventListener('click', () =>
  handleDeleteUser(CURRENT_USER_ID)
);

async function editUser(updatedUser: User) {
  const res = await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser),
  });

  const data = await res.json();

  return { status: res.ok ? 'success' : 'error', message: data.message };
}

function handleEditUser(e: Event, user: User) {
  e.stopPropagation();

  const nameInput = <HTMLInputElement>editFrom.querySelector('#name');
  const emailInput = <HTMLInputElement>editFrom.querySelector('#email');
  const passwordInput = <HTMLInputElement>editFrom.querySelector('#password');

  nameInput.value = user.name;
  emailInput.value = user.email;
  passwordInput.value = user.password;

  CURRENT_USER_ID = user.id;
  editModalBtn.click();
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const { status, message } = await addUser(formData);

  if (status === 'success') {
    insertUsers();

    form.reset();

    showAlert(successAlert, message);
  } else {
    showAlert(errorAlert, message);
  }
});

editFrom.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const updatedUser = {
    id: CURRENT_USER_ID,
    name: formData.get('name')?.toString()!,
    email: formData.get('email')?.toString()!,
    password: formData.get('password')?.toString()!,
  };

  const { status, message } = await editUser(updatedUser);

  if (status === 'success') {
    insertUsers();

    form.reset();

    editModalBtn.click();

    showAlert(successAlert, message);
  } else {
    showAlert(errorAlert, message);
  }
});

async function showUserDetail(id: string) {
  const userDetail = await getUser(id);

  modalTitle.textContent = userDetail.name;
  modalBody.textContent = `Email: ${userDetail.email}`;

  modalCloseBtn.classList.remove('d-none');
  modalDeleteBtn.classList.add('d-none');

  modalBtn.click();
}

function removeAlert(elem: HTMLDivElement) {
  setTimeout(() => (elem.style.top = '-50%'), 1500);
}

function showAlert(elem: HTMLDivElement, message: string) {
  elem.textContent = message;
  elem.style.top = '0';

  removeAlert(elem);
}
