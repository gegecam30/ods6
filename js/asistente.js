// Módulos completos de Human-AI Interaction e Interfaces Emergentes (Filas 1 a 6)

// =========================================================================
// FILA 1: ACCESIBILIDAD ADAPTATIVA (TAMAÑO DE TEXTO Y ALTO CONTRASTE)
// =========================================================================
const btnNormal = document.querySelector('#btn-texto-normal');
const btnGrande = document.querySelector('#btn-texto-grande');
const btnContraste = document.querySelector('#btn-alto-contraste');

if (btnNormal && btnGrande) {
  btnNormal.addEventListener('click', () => {
    document.documentElement.classList.remove('texto-grande');
    btnNormal.classList.add('activo');
    btnNormal.setAttribute('aria-pressed', 'true');
    btnGrande.classList.remove('activo');
    btnGrande.setAttribute('aria-pressed', 'false');
  });

  btnGrande.addEventListener('click', () => {
    document.documentElement.classList.add('texto-grande');
    btnGrande.classList.add('activo');
    btnGrande.setAttribute('aria-pressed', 'true');
    btnNormal.classList.remove('activo');
    btnNormal.setAttribute('aria-pressed', 'false');
  });
}

if (btnContraste) {
  btnContraste.addEventListener('click', () => {
    const activo = document.body.classList.toggle('alto-contraste');
    btnContraste.classList.toggle('activo', activo);
    btnContraste.setAttribute('aria-pressed', String(activo));
  });
}

// Helper reutilizable para dictado por voz (Web Speech API)
function vincularDictadoVoz(boton, destinoInput, callbackAlTerminar) {
  if (!boton || !destinoInput) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  boton.addEventListener('click', () => {
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta dictado por voz. Puedes escribir directamente en el campo.');
      destinoInput.focus();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.interimResults = false;
    const textoOriginalBtn = boton.textContent;
    boton.textContent = '🎙️ Escuchando...';

    recognition.onresult = (event) => {
      const transcripcion = event.results[0][0].transcript;
      destinoInput.value = transcripcion;
      boton.textContent = textoOriginalBtn;
      if (callbackAlTerminar) callbackAlTerminar(transcripcion);
    };

    recognition.onerror = () => {
      boton.textContent = textoOriginalBtn;
      alert('No se pudo reconocer la voz con claridad. Inténtalo nuevamente o escribe tu texto.');
    };

    recognition.onend = () => {
      boton.textContent = textoOriginalBtn;
    };

    recognition.start();
  });
}

// =========================================================================
// FILA 6: BUSCADOR Y FILTROS DINÁMICOS CON COMANDOS DE VOZ EN INICIATIVAS
// =========================================================================
const inputBuscadorInit = document.querySelector('#buscador-iniciativas');
const selectTipoInit = document.querySelector('#filtro-tipo-iniciativa');
const btnVozInit = document.querySelector('#btn-voz-iniciativas');
const btnLimpiarInit = document.querySelector('#btn-limpiar-iniciativas');
const feedbackInit = document.querySelector('#feedback-voz-iniciativas');
const itemsIniciativa = document.querySelectorAll('.item-iniciativa');

function filtrarIniciativas() {
  if (!itemsIniciativa.length) return;
  const texto = (inputBuscadorInit ? inputBuscadorInit.value : '').toLowerCase().trim();
  const tipo = selectTipoInit ? selectTipoInit.value : 'todos';
  let visibles = 0;

  itemsIniciativa.forEach((item) => {
    const itemTipo = item.dataset.tipo || '';
    const itemTexto = (item.dataset.texto || '') + ' ' + item.innerText.toLowerCase();
    const coincideTipo = tipo === 'todos' || itemTipo === tipo;
    const coincideTexto = !texto || itemTexto.includes(texto);
    item.hidden = !(coincideTipo && coincideTexto);
    if (!item.hidden) visibles++;
  });

  if (feedbackInit) {
    feedbackInit.textContent = visibles > 0
      ? `Mostrando ${visibles} iniciativa(s) o punto(s) comunitario(s) que coinciden con tu filtro.`
      : 'No se encontraron coincidencias exactas. Pulsa "Restablecer" para ver todas las iniciativas.';
  }
}

if (inputBuscadorInit) {
  inputBuscadorInit.addEventListener('input', filtrarIniciativas);
}
if (selectTipoInit) {
  selectTipoInit.addEventListener('change', filtrarIniciativas);
}
if (btnLimpiarInit) {
  btnLimpiarInit.addEventListener('click', () => {
    if (inputBuscadorInit) inputBuscadorInit.value = '';
    if (selectTipoInit) selectTipoInit.value = 'todos';
    filtrarIniciativas();
  });
}
vincularDictadoVoz(btnVozInit, inputBuscadorInit, (comando) => {
  // Limpiar frases comunes de comando como "mostrar iniciativas en "
  const limpio = comando.toLowerCase()
    .replace(/mostrar iniciativas en|buscar en|filtrar por|iniciativas de/g, '')
    .trim();
  inputBuscadorInit.value = limpio || comando;
  filtrarIniciativas();
  if (feedbackInit) {
    feedbackInit.textContent = `Comando de voz reconocido: "${comando}". Filtro aplicado (puedes editarlo o restablecer).`;
  }
});

// =========================================================================
// FILA 3: GENERADOR DE PLAN PERSONALIZADO DE AHORRO DE AGUA (INDEX.HTML)
// =========================================================================
const btnGenerarPlan = document.querySelector('#btn-generar-plan');
const resultadoPlan = document.querySelector('#resultado-plan-ia');
const textoPlan = document.querySelector('#texto-plan-ia');
const criterioPlan = document.querySelector('#criterio-plan-ia');
const btnLeerPlan = document.querySelector('#btn-leer-plan');
const btnCerrarPlan = document.querySelector('#btn-cerrar-plan');

if (btnGenerarPlan) {
  btnGenerarPlan.addEventListener('click', () => {
    const perfil = document.querySelector('#perfil-hogar').value;
    const prioridad = document.querySelector('#prioridad-ahorro').value;

    const planes = {
      individual: {
        bano: 'Plan Individual (Baño): Reduce tus duchas a 4 minutos (ahorras ~45 L/día) y cierra el grifo al cepillarte.',
        cocina: 'Plan Individual (Cocina): Usa un recipiente para lavar tus alimentos y reutiliza esa agua para tus plantas.',
        fugas: 'Plan Individual (Prevención): Revisa mensualmente el tanque del inodoro con colorante para detectar fugas silenciosas.'
      },
      familia: {
        bano: 'Plan Familiar (Baño): Coloca una botella de 1L en cada tanque de inodoro y establece un cronómetro de 5 min para duchas.',
        cocina: 'Plan Familiar (Cocina y Lavado): Usa la lavadora solo con carga completa y aprovecha el agua de enjuague para limpiar pisos.',
        fugas: 'Plan Familiar (Prevención): Realiza una inspección quincenal de grifos y llaves de paso; un goteo pierde 30 L diarios.'
      },
      jardin: {
        bano: 'Plan Hogar con Jardín (Baño): Recolecta el agua fría inicial de la ducha en un balde para regar macetas.',
        cocina: 'Plan Hogar con Jardín (Cocina): Reutiliza el agua de lavado de verduras (sin detergente) directamente en el jardín.',
        fugas: 'Plan Hogar con Jardín (Riego): Riega antes de las 8:00 a. m. o después de las 6:00 p. m. para evitar evaporación.'
      }
    };

    textoPlan.textContent = planes[perfil][prioridad];
    criterioPlan.textContent = `Sugerencia generada según perfil "${perfil}" y prioridad "${prioridad}". Basado en la guía verificada ODS 6.`;
    resultadoPlan.hidden = false;
  });

  btnLeerPlan.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textoPlan.textContent);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
    }
  });

  btnCerrarPlan.addEventListener('click', () => {
    resultadoPlan.hidden = true;
  });
}

// =========================================================================
// FILA 2: REPORTES COMUNITARIOS CON VOZ Y ANÁLISIS PRELIMINAR DE IMAGEN
// =========================================================================
const formReporte = document.querySelector('#form-reporte-comunitario');
const btnVozReporte = document.querySelector('#btn-voz-reporte');
const textoReporteInput = document.querySelector('#texto-reporte');
const imagenReporteInput = document.querySelector('#imagen-reporte');
const previewBox = document.querySelector('#analisis-imagen-preview');
const previewImg = document.querySelector('#preview-foto-reporte');
const textoAnalisisImg = document.querySelector('#texto-analisis-imagen');
const muroReportes = document.querySelector('#muro-reportes-lista');

vincularDictadoVoz(btnVozReporte, textoReporteInput);

if (imagenReporteInput && previewBox) {
  imagenReporteInput.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (!archivo) {
      previewBox.hidden = true;
      return;
    }
    const lector = new FileReader();
    lector.onload = (ev) => {
      previewImg.src = ev.target.result;
      textoAnalisisImg.textContent = `Análisis preliminar IA: Imagen "${archivo.name}" adjuntada correctamente (${Math.round(archivo.size / 1024)} KB). Lista para revisión comunitaria.`;
      previewBox.hidden = false;
    };
    lector.readAsDataURL(archivo);
  });
}

if (formReporte && muroReportes) {
  formReporte.addEventListener('submit', (e) => {
    e.preventDefault();
    const autor = document.querySelector('#autor-reporte').value.trim();
    const tipo = document.querySelector('#tipo-reporte').value;
    const detalle = textoReporteInput.value.trim();

    const nuevoArticulo = document.createElement('article');
    nuevoArticulo.className = 'tarjeta destacada';
    nuevoArticulo.innerHTML = `
      <span class="etiqueta-contexto">${tipo} · Recién publicado</span>
      <h3>${autor}</h3>
      <p>${detalle}</p>
    `;
    if (previewImg && previewImg.src && !previewBox.hidden) {
      const imgClon = document.createElement('img');
      imgClon.src = previewImg.src;
      imgClon.alt = 'Evidencia adjunta por el vecino';
      imgClon.style.maxHeight = '140px';
      imgClon.style.borderRadius = '.4rem';
      imgClon.style.marginTop = '.5rem';
      nuevoArticulo.appendChild(imgClon);
    }

    muroReportes.prepend(nuevoArticulo);
    formReporte.reset();
    if (previewBox) previewBox.hidden = true;
  });
}

// =========================================================================
// FILA 5: FEEDBACK RÁPIDO EMBEBIDO (ESTRELLAS + VOZ)
// =========================================================================
const estrellasBtns = document.querySelectorAll('.estrella-btn');
const comentarioFeedback = document.querySelector('#comentario-feedback');
const btnVozFeedback = document.querySelector('#btn-voz-feedback');
const btnEnviarFeedback = document.querySelector('#btn-enviar-feedback');
const confirmacionFeedback = document.querySelector('#confirmacion-feedback');
let calificacionSeleccionada = 0;

estrellasBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    calificacionSeleccionada = Number(btn.dataset.valor);
    estrellasBtns.forEach((b) => {
      b.classList.toggle('seleccionada', Number(b.dataset.valor) <= calificacionSeleccionada);
    });
  });
});

vincularDictadoVoz(btnVozFeedback, comentarioFeedback);

if (btnEnviarFeedback) {
  btnEnviarFeedback.addEventListener('click', () => {
    if (!calificacionSeleccionada && !comentarioFeedback.value.trim()) {
      confirmacionFeedback.textContent = 'Selecciona una puntuación (1 a 5 estrellas) o deja un breve comentario.';
      return;
    }
    confirmacionFeedback.textContent = `¡Gracias! Registramos tu valoración (${calificacionSeleccionada || 'sin'} estrellas) directamente en la plataforma sin salir de la página.`;
    comentarioFeedback.value = '';
  });
}

// =========================================================================
// ASISTENTE DE CONTACTO EN INDEX.HTML
// =========================================================================
const inputConsulta = document.querySelector('#consulta-ia-contacto');
const btnAnalizar = document.querySelector('#btn-analizar-contacto');
const btnVoz = document.querySelector('#btn-voz-contacto');
const cajaResultado = document.querySelector('#respuesta-ia-contacto');
const textoResultado = document.querySelector('#texto-ia-contacto');
const criterioResultado = document.querySelector('#criterio-ia-contacto');
const btnAplicar = document.querySelector('#btn-aplicar-ia');
const btnDescartar = document.querySelector('#btn-descartar-ia');

let sugerenciaActual = null;

function clasificarConsulta(texto) {
  const t = texto.toLowerCase();
  if (t.includes('mapa') || t.includes('punto') || t.includes('pilon') || t.includes('pilón') || t.includes('reportar') || t.includes('ubica') || t.includes('agua')) {
    return {
      categoria: 'Mapeo Comunitario',
      criterio: 'Criterio detectado: palabras clave relacionadas con ubicación o reporte de puntos de agua.',
      explicacion: 'Sugerencia IA: Tu consulta corresponde a "Mapeo Comunitario". Puedes aplicar esta categoría al formulario y revisarla antes de enviar.'
    };
  }
  if (t.includes('huella') || t.includes('consumo') || t.includes('medir') || t.includes('calcula') || t.includes('litros') || t.includes('ahorr')) {
    return {
      categoria: 'Calculadora de Huella',
      criterio: 'Criterio detectado: mención a medición de consumo hídrico o ahorro personal.',
      explicacion: 'Sugerencia IA: Tu consulta corresponde a "Calculadora de Huella". Puedes aplicarla o cambiarla manualmente.'
    };
  }
  return {
    categoria: 'Talleres de concientización',
    criterio: 'Criterio detectado: consulta general, educativa o de participación comunitaria.',
    explicacion: 'Sugerencia IA: Recomendamos seleccionar "Talleres de concientización" para recibir orientación personalizada.'
  };
}

if (btnAnalizar && inputConsulta) {
  btnAnalizar.addEventListener('click', () => {
    const consulta = inputConsulta.value.trim();
    if (!consulta) {
      textoResultado.textContent = 'Por favor, escribe o dicta una breve consulta para que el asistente pueda orientarte.';
      criterioResultado.textContent = 'Control del usuario: también puedes completar el formulario directamente sin usar el asistente.';
      cajaResultado.hidden = false;
      btnAplicar.hidden = true;
      return;
    }
    sugerenciaActual = clasificarConsulta(consulta);
    sugerenciaActual.textoOriginal = consulta;
    textoResultado.textContent = sugerenciaActual.explicacion;
    criterioResultado.textContent = sugerenciaActual.criterio;
    btnAplicar.hidden = false;
    cajaResultado.hidden = false;
  });

  btnAplicar.addEventListener('click', () => {
    if (!sugerenciaActual) return;
    const selectActividad = document.querySelector('#actividad');
    const textareaDetalle = document.querySelector('#detalle');
    if (selectActividad) selectActividad.value = sugerenciaActual.categoria;
    if (textareaDetalle && !textareaDetalle.value.trim()) {
      textareaDetalle.value = sugerenciaActual.textoOriginal;
    }
    criterioResultado.textContent = 'Sugerencia aplicada al formulario. Revisa los campos y presiona "Enviar mensaje" cuando estés listo.';
  });

  btnDescartar.addEventListener('click', () => {
    sugerenciaActual = null;
    cajaResultado.hidden = true;
    inputConsulta.value = '';
  });
}

vincularDictadoVoz(btnVoz, inputConsulta, () => {
  if (btnAnalizar) btnAnalizar.click();
});

// =========================================================================
// FILA 3 & 4: RECOMENDADOR CONTEXTUAL Y LECTURA MULTIMODAL EN RECURSOS.HTML
// =========================================================================
const botonesFiltro = document.querySelectorAll('.filtro-guia');
const tarjetasGuia = document.querySelectorAll('.tarjeta-guia');
const estadoGuia = document.querySelector('#estado-guia-ia');
const btnLeerGuia = document.querySelector('#btn-leer-guia');
const btnDetenerGuia = document.querySelector('#btn-detener-guia');
const botonesLeerTarjeta = document.querySelectorAll('.btn-leer-tarjeta');

if (botonesFiltro.length > 0) {
  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach((b) => b.classList.remove('activo'));
      boton.classList.add('activo');
      const contexto = boton.dataset.contexto;

      let visibles = 0;
      tarjetasGuia.forEach((tarjeta) => {
        const tipos = tarjeta.dataset.contexto || '';
        const mostrar = contexto === 'todos' || tipos.includes(contexto);
        tarjeta.hidden = !mostrar;
        if (mostrar) visibles++;
      });

      if (estadoGuia) {
        if (contexto === 'todos') {
          estadoGuia.textContent = 'Mostrando todos los consejos verificados de la guía ODS 6 (4 tarjetas).';
        } else {
          estadoGuia.textContent = `Criterio aplicado: consejos priorizados para "${contexto}" (${visibles} tarjetas visibles). Pulsa "Ver todos" para restaurar.`;
        }
      }
    });
  });
}

if (btnLeerGuia && 'speechSynthesis' in window) {
  btnLeerGuia.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    const textosVisibles = Array.from(tarjetasGuia)
      .filter((t) => !t.hidden)
      .map((t) => t.innerText.replace(/🔊 Oír/g, '').replace(/\s+/g, ' '))
      .join('. ');

    const locucion = new SpeechSynthesisUtterance(textosVisibles);
    locucion.lang = 'es-ES';
    locucion.rate = 1.0;

    locucion.onstart = () => {
      btnLeerGuia.hidden = true;
      btnDetenerGuia.hidden = false;
      if (estadoGuia) estadoGuia.textContent = 'Reproduciendo guía completa en audio (interfaz multimodal activa)...';
    };

    locucion.onend = () => {
      btnLeerGuia.hidden = false;
      btnDetenerGuia.hidden = true;
    };

    window.speechSynthesis.speak(locucion);
  });

  btnDetenerGuia.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    btnLeerGuia.hidden = false;
    btnDetenerGuia.hidden = true;
    if (estadoGuia) estadoGuia.textContent = 'Lectura en audio detenida por el usuario.';
  });
}

botonesLeerTarjeta.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const tarjeta = btn.closest('.tarjeta');
    const texto = tarjeta.innerText.replace(/🔊 Oír/g, '').replace(/\s+/g, ' ');
    const locucion = new SpeechSynthesisUtterance(texto);
    locucion.lang = 'es-ES';
    window.speechSynthesis.speak(locucion);
  });
});
