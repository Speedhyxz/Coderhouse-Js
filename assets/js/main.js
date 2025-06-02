document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const sessionBtn = document.getElementById('sessionBtn');

  function cargarUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || {};
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  function usuarioActivo() {
    return localStorage.getItem('usuarioActivo');
  }

  function redirigirSiLogueado() {
    const path = window.location.pathname;
    const estaEnPages = path.includes('/pages/');

    if (usuarioActivo()) {
      if (estaEnPages) {
        window.location.href = '../index.html';
      }
    } else {
      if (!estaEnPages) {
        window.location.href = 'pages/login.html';
      }
    }
  }

  // LOGIN
  if (loginForm) {
    const errorMsg = document.getElementById('errorMsg');
    const forgotLink = document.getElementById('forgotLink');

    redirigirSiLogueado();

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('loginUser').value.trim();
      const password = document.getElementById('loginPass').value;
      const usuarios = cargarUsuarios();

      if (!usuarios[username] || usuarios[username].pass !== password) {
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
      } else {
        localStorage.setItem('usuarioActivo', username);
        errorMsg.textContent = "";
        window.location.href = '../index.html';
      }
    });

    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'forgot.html';
      });
    }
  }

  // REGISTER
  if (registerForm) {
    const registerError = document.getElementById('registerError');

    redirigirSiLogueado();

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim().toLowerCase();
      const usuario = document.getElementById('usuario').value.trim();
      const pass1 = document.getElementById('pass1').value;
      const pass2 = document.getElementById('pass2').value;

      const usuarios = cargarUsuarios();

      registerError.textContent = '';

      if (!nombre || !correo || !usuario || !pass1 || !pass2) {
        registerError.textContent = "Todos los campos son obligatorios.";
        return;
      }

      if (pass1 !== pass2) {
        registerError.textContent = "Las contraseñas no coinciden.";
        return;
      }

      if (usuarios[usuario]) {
        registerError.textContent = "El nombre de usuario ya está en uso.";
        return;
      }

      const correoUsado = Object.values(usuarios).some(u => u.correo === correo);
      if (correoUsado) {
        registerError.textContent = "El correo ya está registrado.";
        return;
      }

      usuarios[usuario] = { nombre, correo, pass: pass1 };
      guardarUsuarios(usuarios);
      window.location.href = 'login.html';
    });
  }

  // FORGOT PASSWORD
  if (forgotForm) {
    const forgotError = document.getElementById('forgotError');

    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('emailForgot').value.trim().toLowerCase();
      const newPass1 = document.getElementById('newPass1').value;
      const newPass2 = document.getElementById('newPass2').value;

      const usuarios = cargarUsuarios();

      forgotError.textContent = '';

      const usuarioEncontrado = Object.entries(usuarios).find(([user, data]) => data.correo === email);

      if (!usuarioEncontrado) {
        forgotError.textContent = "Correo no registrado.";
        return;
      }

      if (!newPass1 || !newPass2) {
        forgotError.textContent = "Complete las contraseñas nuevas.";
        return;
      }

      if (newPass1 !== newPass2) {
        forgotError.textContent = "Las contraseñas nuevas no coinciden.";
        return;
      }

      const [usuario] = usuarioEncontrado;
      usuarios[usuario].pass = newPass1;
      guardarUsuarios(usuarios);
      window.location.href = 'login.html';
    });
  }

  // LOGOUT BUTTON (en páginas dentro de /pages/)
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      window.location.href = 'login.html';
    });

    // Mostrar u ocultar botón según login
    if (usuarioActivo()) {
      logoutBtn.style.display = 'block';
    } else {
      logoutBtn.style.display = 'none';
    }
  }

  // PROTECCIÓN DE index.html
  if (window.location.pathname.endsWith('index.html')) {
    if (!usuarioActivo()) {
      window.location.href = 'pages/login.html';
    }
  }

  // BOTÓN SESSION EN HEADER (iniciar/cerrar sesión)
  if (sessionBtn) {
    const estaLogueado = !!usuarioActivo();

    sessionBtn.textContent = estaLogueado ? 'Cerrar sesión' : 'Iniciar sesión';

    sessionBtn.addEventListener('click', () => {
      if (estaLogueado) {
        localStorage.removeItem('usuarioActivo');
        window.location.href = 'pages/login.html';
      } else {
        window.location.href = 'pages/login.html';
      }
    });
  }
});
