/* =====================================================================
   CONSTRUCCIONES HERMANOS RODRÍGUEZ · script.js
   Vanilla JS · sin dependencias
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Config editable ---------- */
  // Número de WhatsApp principal (formato internacional, sin + ni espacios).
  // Carlos: 34687242997 · Manolo: 34615959391
  var WHATSAPP_NUMERO = "34687242997";
  var WHATSAPP_TEXTO  = "Hola, me gustaría pedir información sobre un proyecto.";

  // Fecha aproximada de inicio. Cambiar por la fecha real de inicio si se conoce.
  var START_DATE = "1975-01-01";

  /* ---------- Web3Forms (PENDIENTE DE CONECTAR) ----------
     Si más adelante queréis recibir las solicitudes por EMAIL además de
     por WhatsApp, registrad una cuenta gratuita en https://web3forms.com,
     obtened vuestra "Access Key" y pegadla aquí abajo.
       1) Sustituid el valor de WEB3FORMS_KEY por vuestra clave real.
       2) Poned WEB3FORMS_ACTIVO = true.
     Mientras WEB3FORMS_ACTIVO sea false, el formulario NO envía email:
     solo prepara el mensaje para enviarlo por WhatsApp.                  */
  var WEB3FORMS_KEY    = "PEGAR_AQUI_TU_ACCESS_KEY";   // <-- access_key de Web3Forms
  var WEB3FORMS_ACTIVO = false;                        // <-- poner en true al conectar

  document.addEventListener("DOMContentLoaded", function () {
    initIntro();
    initYear();
    initNavbar();
    initMobileMenu();
    initReveal();
    initHeroCounter();
    initCounters();
    initBeforeAfter();
    initWizard();
    initWhatsApp();
  });

  /* ---------- Intro de entrada (no bloqueante) ----------
     Activa una entrada animada y sobria del logo y del hero SOLO si:
       · el usuario no la ha visto ya en esta sesión, y
       · no ha pedido reducir el movimiento.
     El contenido SIEMPRE está visible: la clase solo añade matices de animación.
     Nunca hay pantalla negra ni bloqueo de acceso. */
  function initIntro() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var visto;
    try { visto = sessionStorage.getItem("hr_intro"); } catch (e) { visto = null; }
    if (reduce || visto) return;            // entrada directa, sin animación de intro
    document.body.classList.add("intro");
    try { sessionStorage.setItem("hr_intro", "1"); } catch (e) {}
  }

  /* ---------- Año del footer ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Navbar: sólido al hacer scroll ---------- */
  function initNavbar() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("is-scrolled", window.scrollY > 60);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menú móvil hamburguesa ---------- */
  function initMobileMenu() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("navBurger");
    var links = document.getElementById("navLinks");
    if (!nav || !burger || !links) return;

    function close() {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    // Cerrar al pulsar un enlace
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    // Cerrar con Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Animaciones reveal al hacer scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var delay = Math.min(i * 60, 240);
          setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Días transcurridos desde START_DATE (cálculo único compartido) ----------
     Lo usan tanto el contador del hero como el muro de confianza, para que
     siempre muestren EXACTAMENTE el mismo número. Devuelve null si falla. */
  function daysSinceStart() {
    try {
      var start = new Date(START_DATE);
      var d = Math.floor((Date.now() - start.getTime()) / 86400000);
      return (isFinite(d) && d > 0) ? d : null;
    } catch (e) { return null; }
  }

  /* ---------- Contador de días del hero (vivo, desde START_DATE) ----------
     Calcula los días transcurridos desde START_DATE hasta hoy y los anima.
     Si algo falla, se mantiene el valor de respaldo escrito en el HTML. */
  function initHeroCounter() {
    var el = document.getElementById("heroDays");
    if (!el) return;
    var target = daysSinceStart();
    if (target === null) return; // fallback: deja el HTML

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = target.toLocaleString("es-ES") + "+";
      return;
    }

    var hayIntro = document.body.classList.contains("intro");
    var dur = 1800;
    // Con intro arranca más bajo (efecto más visible); sin intro, alto para que no salte feo.
    var from = Math.floor(target * (hayIntro ? 0.82 : 0.9));
    var delay = hayIntro ? 450 : 0; // espera a que el título haya entrado
    var startTs = null;

    // Durante la espera, fija el valor inicial (sin "+") para que no haya salto desde el fallback
    if (hayIntro) el.textContent = from.toLocaleString("es-ES");

    function step(ts) {
      if (!startTs) startTs = ts;
      var p = Math.min((ts - startTs) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var val = Math.floor(from + (target - from) * eased);
      // El símbolo "+" aparece solo al final de la animación
      el.textContent = val.toLocaleString("es-ES") + (p >= 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("es-ES") + "+";
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay);
  }

  /* ---------- Contadores animados (muro de confianza) ---------- */
  function initCounters() {
    var nums = document.querySelectorAll(".trust__num[data-count]");
    if (!nums.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      // Si es el contador de "días", usa el MISMO cálculo dinámico que el hero
      if (el.getAttribute("data-dynamic") === "days") {
        var dyn = daysSinceStart();
        if (dyn !== null) target = dyn;
      }
      var suffix = el.getAttribute("data-suffix") || "";
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { el.textContent = target.toLocaleString("es-ES") + suffix; return; }
      var dur = 1600, start = null;
      var from = Math.floor(target * 0.9); // arranca alto: nunca se ve "0"
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        var val = Math.floor(from + (target - from) * eased);
        el.textContent = val.toLocaleString("es-ES") + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("es-ES") + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Slider Antes / Después (clip-path + variable CSS) ----------
     La posición se guarda en la variable CSS --pos del contenedor.
     El CSS recorta la imagen "antes" con clip-path: inset(...).
     100% responsive: funciona igual en desktop y móvil, sin min-width. */
  function initBeforeAfter() {
    var compare = document.getElementById("baCompare");
    var handle = document.getElementById("baHandle");
    if (!compare || !handle) return;

    var dragging = false;

    function setPos(clientX) {
      var rect = compare.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      compare.style.setProperty("--pos", pct + "%");
      handle.setAttribute("aria-valuenow", Math.round(pct));
    }

    function start(e) { dragging = true; e.preventDefault(); }
    function move(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(clientX);
    }
    function end() { dragging = false; }

    // Ratón (desktop)
    handle.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    compare.addEventListener("mousedown", function (e) { setPos(e.clientX); start(e); });

    // Táctil (móvil)
    handle.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    compare.addEventListener("touchstart", function (e) { setPos(e.touches[0].clientX); start(e); }, { passive: false });

    // Teclado (accesibilidad)
    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") { cur = Math.max(0, cur - 4); }
      else if (e.key === "ArrowRight") { cur = Math.min(100, cur + 4); }
      else return;
      compare.style.setProperty("--pos", cur + "%");
      handle.setAttribute("aria-valuenow", Math.round(cur));
      e.preventDefault();
    });
  }

  /* ---------- Formulario multi-step ---------- */
  function initWizard() {
    var form = document.getElementById("wizard");
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll(".wizard__step"));
    var bar = document.getElementById("wizardBar");
    var prevBtn = document.getElementById("wizardPrev");
    var nextBtn = document.getElementById("wizardNext");
    var sendBtn = document.getElementById("wizardSend");
    var done = document.getElementById("wizardDone");
    var nav = form.querySelector(".wizard__nav");
    var privacyCheck = document.getElementById("privacyCheck");
    var current = 0;

    var data = { necesidad: "", municipio: "", plazo: "", nombre: "", telefono: "", email: "", mensaje: "" };

    // Selección de "choices"
    form.querySelectorAll(".wizard__choices").forEach(function (group) {
      var name = group.getAttribute("data-name");
      group.querySelectorAll(".choice").forEach(function (btn) {
        btn.addEventListener("click", function () {
          group.querySelectorAll(".choice").forEach(function (b) { b.classList.remove("is-selected"); });
          btn.classList.add("is-selected");
          data[name] = btn.getAttribute("data-value");
          hideError(name);
        });
      });
    });

    // Ocultar el error de privacidad al marcar el checkbox
    if (privacyCheck) {
      privacyCheck.addEventListener("change", function () {
        if (privacyCheck.checked) hideError("privacidad");
      });
    }

    function showError(key) {
      var el = form.querySelector('[data-err="' + key + '"]');
      if (el) el.classList.add("is-visible");
    }
    function hideError(key) {
      var el = form.querySelector('[data-err="' + key + '"]');
      if (el) el.classList.remove("is-visible");
    }

    function validate(index) {
      if (index === 0) { if (!data.necesidad) { showError("necesidad"); return false; } }
      else if (index === 1) {
        var m = form.querySelector('[name="municipio"]').value.trim();
        data.municipio = m;
        if (!m) { showError("municipio"); return false; }
      }
      else if (index === 2) { if (!data.plazo) { showError("plazo"); return false; } }
      else if (index === 3) {
        data.nombre = form.querySelector('[name="nombre"]').value.trim();
        data.telefono = form.querySelector('[name="telefono"]').value.trim();
        data.email = form.querySelector('[name="email"]').value.trim();
        data.mensaje = form.querySelector('[name="mensaje"]').value.trim();
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
        if (!data.nombre || !data.telefono || !emailOk) { showError("datos"); return false; }
        // Checkbox de privacidad OBLIGATORIO antes de enviar
        if (!privacyCheck || !privacyCheck.checked) { showError("privacidad"); return false; }
      }
      return true;
    }

    function render() {
      steps.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      bar.style.width = ((current + 1) / steps.length) * 100 + "%";

      var esPrimero = current === 0;
      var esUltimo  = current === steps.length - 1;

      // Atributo hidden (semántico)
      prevBtn.hidden = esPrimero;
      nextBtn.hidden = esUltimo;
      sendBtn.hidden = !esUltimo;

      // Refuerzo: forzamos el display para que NINGÚN CSS pise el atributo hidden.
      // Así "Continuar" desaparece de verdad en el último paso y solo queda "Enviar solicitud".
      prevBtn.style.display = esPrimero ? "none" : "";
      nextBtn.style.display = esUltimo ? "none" : "";
      sendBtn.style.display = esUltimo ? "" : "none";
    }

    nextBtn.addEventListener("click", function () {
      if (!validate(current)) return;
      if (current < steps.length - 1) { current++; render(); }
    });
    prevBtn.addEventListener("click", function () {
      if (current > 0) { current--; render(); }
    });

    // Construye el resumen legible del proyecto
    function construirResumen() {
      return "Nueva solicitud de presupuesto\n" +
             "Tipo de proyecto: " + data.necesidad + "\n" +
             "Municipio: " + data.municipio + "\n" +
             "Plazo: " + data.plazo + "\n" +
             "Nombre: " + data.nombre + "\n" +
             "Teléfono: " + data.telefono + "\n" +
             "Email: " + data.email + "\n" +
             "Mensaje: " + (data.mensaje || "-");
    }

    // Abre WhatsApp con el resumen (encodeURIComponent sobre el mensaje completo)
    function abrirWhatsApp() {
      var resumen = construirResumen();
      var url = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(resumen);
      window.open(url, "_blank", "noopener");
    }

    // Muestra la pantalla de confirmación (sin afirmar un envío por email que no ha ocurrido)
    function mostrarConfirmacion() {
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      nav.style.display = "none";
      bar.style.width = "100%";
      done.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(current)) return;

      if (WEB3FORMS_ACTIVO && WEB3FORMS_KEY && WEB3FORMS_KEY.indexOf("PEGAR_AQUI") === -1) {
        /* ---- Envío real por email mediante Web3Forms ----
           Se activa solo cuando WEB3FORMS_ACTIVO = true y hay una clave válida. */
        var payload = {
          access_key: WEB3FORMS_KEY,
          subject: "Nueva solicitud de presupuesto · web Hnos. Rodríguez",
          from_name: data.nombre,
          "Tipo de proyecto": data.necesidad,
          Municipio: data.municipio,
          Plazo: data.plazo,
          Nombre: data.nombre,
          Teléfono: data.telefono,
          Email: data.email,
          Mensaje: data.mensaje || "-"
        };
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        }).then(function (r) { return r.json(); })
          .then(function () { mostrarConfirmacion(); })
          .catch(function () { mostrarConfirmacion(); }); // si falla el email, igualmente queda WhatsApp
      } else {
        /* ---- Sin Web3Forms: NO se envía email. Solo se prepara WhatsApp ---- */
        mostrarConfirmacion();
        abrirWhatsApp();
      }

      // Registro en consola para desarrollo
      console.log("Solicitud de presupuesto:", data);
    });

    render();
  }

  /* ---------- Enlaces de WhatsApp (botón flotante e inline) ---------- */
  function initWhatsApp() {
    var base = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(WHATSAPP_TEXTO);
    ["waFloat", "waInline"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("href", base);
    });
  }
})();
