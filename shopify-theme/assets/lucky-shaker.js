/**
 * LUCKY SHAKER BARTENDER — SHOPIFY OS 2.0 MASTER SCRIPT
 * Full-fidelity port of prototype engine with 60fps HTML5 Canvas sequence rendering
 */

/* ==========================================================================
   SAFE STORAGE HELPER (Prevents SecurityError in Sandboxed Iframes)
   ========================================================================== */
window.SafeStorage = (function() {
  var memory = {};
  var testAvailability = function(type) {
    try {
      if (typeof window === 'undefined' || !window[type]) return false;
      var s = window[type];
      var key = '__ls_test__';
      s.setItem(key, '1');
      s.removeItem(key);
      return true;
    } catch(e) {
      return false;
    }
  };

  var hasLocal = testAvailability('localStorage');
  var hasSession = testAvailability('sessionStorage');

  return {
    getItem: function(key) {
      try {
        if (hasLocal) return window.localStorage.getItem(key);
      } catch(e) {}
      return memory[key] || null;
    },
    setItem: function(key, val) {
      try {
        if (hasLocal) {
          window.localStorage.setItem(key, String(val));
          return;
        }
      } catch(e) {}
      memory[key] = String(val);
    },
    removeItem: function(key) {
      try {
        if (hasLocal) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch(e) {}
      delete memory[key];
    },
    getSessionItem: function(key) {
      try {
        if (hasSession) return window.sessionStorage.getItem(key);
      } catch(e) {}
      return memory['__sess_' + key] || null;
    },
    setSessionItem: function(key, val) {
      try {
        if (hasSession) {
          window.sessionStorage.setItem(key, String(val));
          return;
        }
      } catch(e) {}
      memory['__sess_' + key] = String(val);
    },
    removeSessionItem: function(key) {
      try {
        if (hasSession) {
          window.sessionStorage.removeItem(key);
          return;
        }
      } catch(e) {}
      delete memory['__sess_' + key];
    }
  };
})();

/* ==========================================================================
   0. BILINGUAL INTERNATIONALIZATION ENGINE (ES default / EN toggle)
   ========================================================================== */
window.LuckyShakerLang = {
  currentLang: 'es',
  dict: {
    es: {
      // Nav
      'nav.events': 'Eventos & Servicios',
      'nav.experience': 'Experiencia',
      'nav.gallery': 'Galería',
      'nav.about': 'Nosotros',
      'nav.shop': 'Tienda Online',
      'nav.faq': 'Preguntas',
      'nav.book_event': 'COTIZAR EVENTO',
      'nav.bag': 'Bolsa',

      // Hero
      'hero.eyebrow': 'LUCKY SHAKER — COCTELERÍA & BARTENDING DE AUTOR',
      'hero.headline': 'HAZ QUE TU EVENTO<br><span class="highlight-pink">SEA MÁS LUCKY.</span>',
      'hero.subtitle': 'Servicio premium de barras móviles, coctelería de autor y hospitalidad inolvidable para bodas, fiestas privadas, galas corporativas y celebraciones.',
      'hero.primary_cta': 'COTIZAR TU EVENTO',
      'hero.secondary_cta': 'TIENDA ONLINE',
      'hero.trust1': 'Barras Móviles de Lujo',
      'hero.trust2': 'Mixólogos de Autor Certificados',
      'hero.trust3': 'Servicio 5 Estrellas',

      // Cinematic Scroll
      'cinematic.brand_tag': 'BOTELLAS ARTESANALES • LISTAS PARA SERVIR',
      'cinematic.headline': 'LLEVA LUCKY SHAKER A CASA',
      'cinematic.subtitle': 'Cócteles de autor elaborados a mano y listos para servir. Descubre cada botella a través del scroll interactivo.',
      'cinematic.shop_all_cta': 'VER TODA LA COLECCIÓN',
      'cinematic.book_cta': 'COTIZAR TU EVENTO',
      'cinematic.scroll_cue': 'SCROLL PARA DESCUBRIR LA MAGIA',
      'cinematic.b1_title': 'Whiskey Añejado Triple Destilación',
      'cinematic.b1_sub': 'Madurado en roble americano tostado',
      'cinematic.b2_title': 'Cacao Tostado Venezolano',
      'cinematic.b2_sub': 'Con infusión de vainilla Bourbon',
      'cinematic.b3_title': 'Crema Láctea Pura Terciopelo',
      'cinematic.b3_sub': '17% Alc / Vol • Copa de 110 ML',
      'cinematic.b4_title': 'Reserva Privada por Katherin',
      'cinematic.b4_sub': 'Elaborado a mano y sellado en vidrio',
      'cinematic.buy_btn': 'COMPRAR',

      // Types
      'types.eyebrow': 'CREADO PARA TU MOMENTO',
      'types.headline': 'Coctelería a Medida para Cada Ocasión',
      'types.subtitle': 'Desde celebraciones íntimas hasta grandes recepciones de bodas, adaptamos cada cóctel, estación de barra y detalle de hospitalidad a tu evento.',
      'types.cat_1': 'Bodas',
      'types.c1_tag': 'ELEGANTE • MEMORABLE',
      'types.c1_title': 'Bodas & Recepción',
      'types.c1_desc': 'Servicio integral de coctelería de lujo con cócteles personalizados para los novios, cristalería de cristal, servicio de champaña y mixólogos de autor.',
      'types.cat_2': 'Gender Reveal',
      'types.c2_tag': 'MÁGICO • CELEBRACIÓN',
      'types.c2_title': 'Gender Reveal & Baby Shower',
      'types.c2_desc': 'Celebraciones mágicas con coctelería temática, mocktails de autor sin alcohol y estaciones de barra personalizadas para la revelación.',
      'types.cat_3': 'Evento de Negocios',
      'types.c3_tag': 'SOFISTICADO • IMPECABLE',
      'types.c3_title': 'Evento de Negocios & Galas',
      'types.c3_desc': 'Mixología profesional de alto volumen, activación de marca en barra, servicio ágil y hospitalidad ejecutiva para invitados VIP.',
      'types.cat_4': 'Fiestas',
      'types.c4_tag': 'ÍNTIMO • VIBRANTE',
      'types.c4_title': 'Fiestas Privadas & VIP',
      'types.c4_desc': 'Eleva cumpleaños, aniversarios y veladas exclusivas con barras móviles privadas, ambientación de lujo y total tranquilidad para el anfitrión.',
      'types.quote_btn': 'SOLICITAR COTIZACIÓN',
      'types.view_gallery': 'VER GALERÍA DE FOTOS',
      'types.gallery_modal_sub': 'Momentos reales de eventos por Lucky Shaker',
      'types.modal_quote_btn': 'COTIZAR ESTE EVENTO',

      // Experience
      'exp.eyebrow': 'MÁS QUE UNA BARRA',
      'exp.headline': 'La Experiencia Lucky Shaker',
      'exp.subtitle': 'Gestionamos cada aspecto de la logística de barra, la coreografía de mixología y el servicio para que puedas disfrutar plenamente con tus invitados.',
      'exp.s1_title': '01 • PLANIFICA',
      'exp.s1_desc': 'Asesoría personalizada de menú. Diseñamos cócteles de autor que combinan con la temática de tu evento, el perfil de los invitados y el estilo del lugar.',
      'exp.s2_title': '02 • PREPARA',
      'exp.s2_desc': 'Jarabes botánicos artesanales, cítricos recién exprimidos, hielo artesanal cristalino, garnituras exclusivas y montaje de la barra antes de que lleguen los invitados.',
      'exp.s3_title': '03 • AGITA',
      'exp.s3_desc': 'Arte de coctelera y hospitalidad de alto nivel. Cada cóctel se agita al momento con dinamismo, precisión y una presentación impecable.',
      'exp.s4_title': '04 • CELEBRA',
      'exp.s4_desc': 'Cero estrés para el anfitrión. Disfruta de un servicio fluido, invitados fascinados y un desmontaje de barra limpio al finalizar la noche.',
      'exp.book_btn': 'COTIZAR TU EVENTO',

      // Services
      'services.eyebrow': 'SERVICIOS & PAQUETES',
      'services.headline': 'Servicio Integral de Coctelería',
      'services.subtitle': 'Todo lo necesario para brindar una experiencia de bar de coctelería de clase mundial en tu residencia, salón o espacio de eventos.',
      'services.srv1_title': 'Barras Móviles Iluminadas',
      'services.srv1_desc': 'Estaciones de barra modulares con iluminación decorativa, acabados en bronce, herramientas profesionales de coctelería y estación de hielo.',
      'services.srv1_f1': 'Diseño de barra e iluminación personalizada',
      'services.srv1_f2': 'Mixólogos certificados y asegurados',
      'services.srv1_f3': 'Pozos de hielo y herramental profesional',
      'services.srv2_title': 'Menús de Coctelería de Autor',
      'services.srv2_desc': 'Curaduría de recetas a medida con cartas de menú impresas, garnituras botánicas frescas, ahumados en vivo y opciones sin alcohol (mocktails).',
      'services.srv2_f1': 'Jarabes y bitters artesanales de la casa',
      'services.srv2_f2': 'Cristalería fina y hielo cristalino',
      'services.srv2_f3': 'Cócteles vírgenes / mocktails de autor',
      'services.srv3_title': 'Masterclasses Interactivas',
      'services.srv3_desc': 'Talleres prácticos e interactivos de coctelería para eventos corporativos, despedidas de soltera y cenas privadas dirigidos por nuestros mixólogos.',
      'services.srv3_f1': 'Estaciones de coctelera individuales',
      'services.srv3_f2': 'Historia de destilados y maridaje',
      'services.srv3_f3': 'Guía de recetas para llevar a casa',

      // Gallery
      'gallery.eyebrow': 'LA ATMÓSFERA',
      'gallery.headline': 'Momentos Que Hemos Creado',
      'gallery.subtitle': 'Un vistazo a la energía, el arte de la mixología y la atmósfera sofisticada que llevamos a cada evento privado.',
      'gallery.p1': 'BODAS',
      'gallery.t1': 'Montaje de Barra al Atardecer',
      'gallery.p2': 'EL ARTE',
      'gallery.t2': 'Precisión y Pasión en Coctelera',
      'gallery.p3': 'EVENTOS PRIVADOS',
      'gallery.t3': 'Celebraciones en Terrazas',
      'gallery.p4': 'GALAS CORPORATIVAS',
      'gallery.t4': 'Servicio VIP para Empresas',
      'gallery.p5': 'COLECCIÓN RESERVA',
      'gallery.t5': 'Elegancia Embotellada a Mano',

      // Testimonials
      'reviews.eyebrow': 'OPINIONES DE CLIENTES',
      'reviews.headline': 'Amado por Anfitriones e Invitados',
      'reviews.badge_text': 'Servicio de Coctelería para Eventos Calificado con 5.0 Estrellas',
      'reviews.r1_quote': '“Lucky Shaker elevó por completo la recepción de nuestra boda. El menú de cócteles personalizados fue un éxito total y los bartenders fueron excepcionalmente rápidos y profesionales.”',
      'reviews.r1_author': 'Sofía & Lucas M.',
      'reviews.r1_event': 'Recepción de Boda • Coral Gables, FL',
      'reviews.r2_quote': '“Contratamos a Lucky Shaker para nuestra gala corporativa anual de 180 invitados. Ejecución impecable, cero filas en barra y el Old Fashioned ahumado fue inolvidable.”',
      'reviews.r2_author': 'David R., Director Ejecutivo',
      'reviews.r2_event': 'Gala Corporativa • Brickell, Miami',
      'reviews.r3_quote': '“La masterclass de coctelería para mi cumpleaños número 40 fue la mejor fiesta que hemos organizado. ¡Katherin y su equipo hicieron que todos se sintieran como expertos!”',
      'reviews.r3_author': 'Camila T.',
      'reviews.r3_event': 'Celebración de Cumpleaños • Miami Beach',

      // Booking Form
      'booking.eyebrow': 'RESERVA TU EVENTO',
      'booking.headline': 'Solicita una Cotización Personalizada',
      'booking.subtitle': 'Cuéntanos sobre tu próxima celebración. Nuestro equipo preparará una propuesta de barra a tu medida y confirmará disponibilidad en menos de 24 horas.',
      'booking.success_title': '¡Muchas gracias! Hemos recibido tu solicitud.',
      'booking.success_desc': 'Nuestro director de eventos revisará los detalles y te enviará una propuesta personalizada en menos de 24 horas.',
      'booking.lbl_name': 'Nombre Completo *',
      'booking.lbl_email': 'Correo Electrónico *',
      'booking.lbl_phone': 'Número de Teléfono *',
      'booking.lbl_type': 'Tipo de Evento *',
      'booking.opt_select': 'Selecciona el tipo de evento',
      'booking.opt_wedding': 'Boda & Recepción',
      'booking.opt_gender_reveal': 'Gender Reveal / Baby Shower',
      'booking.opt_corp': 'Gala Corporativa / Evento de Negocios',
      'booking.opt_private': 'Fiesta Privada / Cumpleaños VIP',
      'booking.opt_masterclass': 'Masterclass de Coctelería / Taller',
      'booking.opt_other': 'Otra Celebración Especial',
      'booking.lbl_date': 'Fecha Estimada del Evento *',
      'booking.lbl_guests': 'Número Estimado de Invitados *',
      'booking.opt_guest_select': 'Selecciona el rango de invitados',
      'booking.opt_g1': '10–25 Invitados (Íntimo)',
      'booking.opt_g2': '26–50 Invitados (Mediano)',
      'booking.opt_g3': '51–100 Invitados (Grande)',
      'booking.opt_g4': '101–200+ Invitados (Gala / Boda)',
      'booking.lbl_location': 'Ubicación / Ciudad y Lugar del Evento *',
      'booking.lbl_notes': 'Peticiones Especiales / Preferencias de Cócteles',
      'booking.btn_submit': 'ENVIAR SOLICITUD DE COTIZACIÓN',
      'booking.guarantee': 'Sin pagos por adelantado • Respuesta personalizada en 24 horas',

      // Shop Preview
      'shop_preview.eyebrow': 'LLEVA LUCKY SHAKER A CASA',
      'shop_preview.headline': 'La Colección de Botellas Reserva',
      'shop_preview.subtitle': 'Cócteles de autor elaborados a mano y sellados en pesadas botellas de vidrio. Cada botella de 750ml rinde 6–8 copas de nivel coctelería para tu barra personal.',
      'shop_preview.add_bag': 'AÑADIR A LA BOLSA',

      // FAQs
      'faq.eyebrow': 'PREGUNTAS FRECUENTES',
      'faq.headline': 'Detalles del Servicio de Barras',
      'faq.subtitle': 'Todo lo que necesitas saber sobre reservar Lucky Shaker para tu celebración.',
      'faq.q1': '¿Qué incluye el servicio de barra para eventos de Lucky Shaker?',
      'faq.a1': 'Incluye estaciones de barra móviles completas, mixólogos profesionales certificados y asegurados, cartas de menú impresas a medida, jarabes y mixers artesanales de la casa, cítricos frescos exprimidos, garnituras de diseño, cristalería de cristal y pozos de hielo completos.',
      'faq.q2': '¿Con cuánta anticipación debo reservar mi fecha?',
      'faq.a2': 'Recomendamos reservar con 3 a 8 semanas de anticipación para eventos privados y de 3 a 6 meses para bodas y galas corporativas de fin de año. Sin embargo, siempre atendemos solicitudes con menor tiempo según disponibilidad.',
      'faq.q3': '¿Ustedes proporcionan el alcohol o lo provee el cliente?',
      'faq.a3': 'Ofrecemos ambas opciones flexibles. Podemos coordinar y gestionar la lista completa de licores a través de nuestros distribuidores autorizados asociados, o proveerte una lista exacta de compras si prefieres suministrar los licores por tu cuenta.',
      'faq.q4': '¿Pueden personalizar los nombres de los cócteles para nuestro evento?',
      'faq.a4': '¡Absolutamente! Es uno de nuestros servicios insignia. Creamos cócteles con nombres alusivos a los novios, a la empresa o a la temática del anfitrión, maridados con sus licores preferidos.',
      'faq.q5': '¿Tienen opciones sin alcohol (Mocktails)?',
      'faq.a5': 'Sí. Diseñamos mocktails de autor utilizando botánicos frescos, infusiones aromáticas y espumosos sin alcohol para que todos los invitados disfruten de una experiencia de barra sofisticada.',
      'faq.cta_text': '¿Tienes alguna pregunta específica para tu evento?',
      'faq.cta_btn': 'HABLAR CON NUESTRO CONCIERGE',

      // Shop & PDP
      'shop.bestseller': 'MÁS VENDIDO',
      'shop.craft_cocktail': 'CÓCTEL DE AUTOR',
      'shop.default_notes': 'Cóctel artesanal de lujo listo para servir',
      'shop.add_bag': 'AGREGAR A LA BOLSA',
      'shop.sold_out': 'AGOTADO',
      'pdp.crumb_home': 'Inicio',
      'pdp.crumb_collection': 'Colección Reserva',
      'pdp.reserve_badge': 'BOTELLA RESERVA',
      'pdp.eyebrow': 'RESERVA PRIVADA // LOTE DE MIXÓLOGO MAESTRO',
      'pdp.subtitle': 'Formulado por Katherin • Cóctel de Autor Listo para Servir',
      'pdp.reviews_count': '(+180 Reseñas Verificadas)',
      'pdp.free_shipping': 'Envío Express Gratis +21 en órdenes de $80+',
      'pdp.select_format': 'SELECCIONAR PRESENTACIÓN:',
      'pdp.add_to_bag': 'AGREGAR A LA BOLSA',
      'pdp.trust_pkg': 'Empaque Térmico con Garantía Total contra Roturas',
      'pdp.trust_id': 'Verificación de Firma de Adulto +21 Obligatoria en la Entrega',
      'pdp.tab1_title': 'PERFIL DE CATA & NOTAS DE PALADAR',
      'pdp.aroma_label': 'Aroma:',
      'pdp.aroma_val': 'Infusión botánica aromática fresca, matices de roble añejo y cítricos brillantes.',
      'pdp.palate_label': 'Paladar:',
      'pdp.palate_val': 'Textura sedosa y envolvente con profundidad de destilado artesanal, equilibrada por caña de azúcar pura y cítricos prensados en frío.',
      'pdp.finish_label': 'Final:',
      'pdp.finish_val': 'Excepcionalmente suave, final prolongado de coctelería de autor con sensación limpia y fresca.',
      'pdp.tab2_title': 'EL RITUAL DE SERVIDO',
      'pdp.ritual_1': '1. Enfría la botella a 4°C antes de servir.',
      'pdp.ritual_2': '2. Agita enérgicamente 3 veces para emulsionar todos los aceites botánicos naturales.',
      'pdp.ritual_3': '3. Vierte 3.5oz a 4.0oz sobre una esfera de hielo cristalino o rocas.',
      'pdp.ritual_4': '4. Decora con un twist fresco de piel de cítrico y disfruta.',
      'pdp.tab3_title': 'CONSERVACIÓN, VIDA ÚTIL & ALÉRGENOS',
      'pdp.shelf_label': 'Vida Útil:',
      'pdp.shelf_val': '12 meses sin abrir a temperatura ambiente lejos del sol directo. Una vez abierta, refrigerar y consumir dentro de los 6 meses.',
      'pdp.volume_label': 'Volumen:',
      'pdp.volume_val': 'Botella de vidrio de 750 ML (Rinde 6 a 8 copas completas de alta coctelería).',
      'pdp.formulation_label': 'Formulación:',
      'pdp.formulation_val': 'Ingredientes 100% libres de gluten, destilados premium naturales, sin conservantes químicos sintéticos.',

      // Cart
      'cart.title': 'Tu Selección',
      'cart.item_single': '1 PRODUCTO',
      'cart.item_plural': 'PRODUCTOS',
      'cart.empty_title': 'TU BARRA ESTÁ VACÍA',
      'cart.empty_desc': 'Explora nuestra colección de botellas para comenzar.',
      'cart.explore_btn': 'EXPLORAR CÓCTELES',
      'cart.subtotal': 'SUBTOTAL',
      'cart.taxes_note': 'Impuestos y gastos de envío calculados en la pantalla de pago.',
      'cart.checkout': 'FINALIZAR COMPRA',
      'cart.continue': 'Continuar Explorando →',
      'cart.shipping_empty': 'Agrega <strong>$80.00</strong> para <strong>Envío Express Gratis</strong>',
      'cart.shipping_progress': 'Agrega <strong>${remaining}</strong> más para <strong>Envío Express Gratis</strong> 🍸',
      'cart.shipping_unlocked': '🎉 <strong>¡Envío Express de Cortesía Desbloqueado!</strong>',

      // Footer
      'footer.brand_desc': 'Servicio de coctelería y barras móviles de ultra lujo para eventos privados, bodas y celebraciones. Agitado con pasión, servido con distinción.',
      'footer.badge_21': 'Certificación +21 y Servicio Asegurado',
      'footer.col1_title': 'EVENTOS & SERVICIOS',
      'footer.weddings': 'Bodas & Recepciones',
      'footer.private_parties': 'Fiestas Privadas',
      'footer.corporate': 'Galas Corporativas',
      'footer.masterclasses': 'Masterclasses & Talleres',
      'footer.request_quote': 'Cotizar Barra para Evento',
      'footer.col2_title': 'TIENDA & MARCA',
      'footer.shop_bottles': 'Tienda de Botellas Reserva',
      'footer.our_story': 'Nuestra Historia',
      'footer.faqs': 'Preguntas Frecuentes',
      'footer.col3_title': 'POLÍTICAS & LEGAL',
      'footer.shipping': 'Envíos & Entregas',
      'footer.refunds': 'Reembolsos & Cancelaciones',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos del Servicio',
      'footer.copyright': '© 2026 LUCKY SHAKER LLC. TODOS LOS DERECHOS RESERVADOS.',
      'footer.notice': 'Disfruta con moderación. Venta y servicio de bebidas con alcohol exclusivo para mayores de 21 años.'
    },

    en: {
      // Nav
      'nav.events': 'Events & Services',
      'nav.experience': 'Experience',
      'nav.gallery': 'Gallery',
      'nav.about': 'About Us',
      'nav.shop': 'Online Shop',
      'nav.faq': 'FAQ',
      'nav.book_event': 'BOOK EVENT',
      'nav.bag': 'Bag',

      // Hero
      'hero.eyebrow': 'LUCKY SHAKER — BESPOKE BARTENDING & EXPERIENCES',
      'hero.headline': 'MAKE YOUR EVENT<br><span class="highlight-pink">A LITTLE MORE LUCKY.</span>',
      'hero.subtitle': 'Premium mobile bartending, bespoke cocktail catering, and unforgettable hospitality for weddings, private parties, corporate galas, and celebrations.',
      'hero.primary_cta': 'BOOK YOUR EVENT',
      'hero.secondary_cta': 'ONLINE SHOP',
      'hero.trust1': 'Luxury Mobile Bars',
      'hero.trust2': 'Certified Master Mixologists',
      'hero.trust3': '5-Star Hospitality',

      // Cinematic Scroll
      'cinematic.brand_tag': 'HAND-BATCHED • READY TO POUR',
      'cinematic.headline': 'BRING LUCKY SHAKER HOME',
      'cinematic.subtitle': 'Artisan craft cocktails hand-batched and sealed in glass. Scroll to explore each signature reserve creation.',
      'cinematic.shop_all_cta': 'EXPLORE ALL BOTTLES',
      'cinematic.book_cta': 'BOOK YOUR EVENT',
      'cinematic.scroll_cue': 'SCROLL TO EXPLORE THE CRAFT',
      'cinematic.b1_title': 'Triple-Distilled Aged Whiskey',
      'cinematic.b1_sub': 'Matured in charred American oak',
      'cinematic.b2_title': 'Venezuelan Roasted Cocoa',
      'cinematic.b2_sub': 'Infused with bourbon vanilla beans',
      'cinematic.b3_title': 'Pure Velvet Dairy Cream',
      'cinematic.b3_sub': '17% Alc / Vol • 110 ML single pour',
      'cinematic.b4_title': 'Private Reserve By Katherin',
      'cinematic.b4_sub': 'Hand-batched & sealed in glass',
      'cinematic.buy_btn': 'SHOP NOW',

      // Types
      'types.eyebrow': 'MADE FOR YOUR MOMENT',
      'types.headline': 'Curated Bartending For Every Occasion',
      'types.subtitle': 'From intimate terrace celebrations to grand wedding receptions, we tailor every cocktail, bar station, and hospitality detail to your event.',
      'types.cat_1': 'Weddings',
      'types.c1_tag': 'ELEGANT • MEMORABLE',
      'types.c1_title': 'Weddings & Receptions',
      'types.c1_desc': 'Full luxury cocktail catering featuring signature bride & groom cocktails, crystal glassware, champagne service, and dedicated master mixologists.',
      'types.cat_2': 'Gender Reveal',
      'types.c2_tag': 'MAGICAL • CELEBRATION',
      'types.c2_title': 'Gender Reveal & Baby Shower',
      'types.c2_desc': 'Magical celebrations featuring thematic mixology, bespoke zero-proof mocktails, and personalized reveal bar stations.',
      'types.cat_3': 'Business Events',
      'types.c3_tag': 'SOPHISTICATED • FLAWLESS',
      'types.c3_title': 'Corporate & Business Events',
      'types.c3_desc': 'High-volume craft cocktail catering, branded bar stations, rapid service flow, and executive-level hospitality for VIP guests.',
      'types.cat_4': 'Parties',
      'types.c4_tag': 'INTIMATE • VIBRANT',
      'types.c4_title': 'Private Parties & VIP',
      'types.c4_desc': 'Elevate milestone birthdays, anniversaries, and exclusive gatherings with private cocktail bars, craft menus, and effortless hosting.',
      'types.quote_btn': 'REQUEST A QUOTE',
      'types.view_gallery': 'VIEW PHOTO GALLERY',
      'types.gallery_modal_sub': 'Real event moments captured by Lucky Shaker',
      'types.modal_quote_btn': 'BOOK THIS EVENT',

      // Experience
      'exp.eyebrow': 'MORE THAN A BAR',
      'exp.headline': 'The Lucky Shaker Experience',
      'exp.subtitle': 'We manage every aspect of bar logistics, mixology choreography, and guest hospitality so you can be fully present with your guests.',
      'exp.s1_title': '01 • PLAN',
      'exp.s1_desc': 'Personalized menu consultation. We design bespoke craft cocktails tailored to your event theme, guest profile, and venue aesthetic.',
      'exp.s2_title': '02 • PREP',
      'exp.s2_desc': 'Handcrafted botanical syrups, fresh-pressed citrus, crystal craft ice, bespoke garnishes, and immaculate bar setup before guests arrive.',
      'exp.s3_title': '03 • SHAKE',
      'exp.s3_desc': 'Master mixology flair and top-tier hospitality. Every drink is shaken live to order with energetic pacing, precision, and flawless presentation.',
      'exp.s4_title': '04 • CELEBRATE',
      'exp.s4_desc': 'Zero host stress. Enjoy seamless bar service, delighted guests, and a sparkling-clean bar breakdown when the celebration concludes.',
      'exp.book_btn': 'BOOK YOUR EVENT',

      // Services
      'services.eyebrow': 'SERVICES & PACKAGES',
      'services.headline': 'Turnkey Cocktail Catering',
      'services.subtitle': 'Everything needed to deliver a world-class cocktail lounge experience at your private venue, home, or event space.',
      'services.srv1_title': 'Illuminated Mobile Bars',
      'services.srv1_desc': 'Modular designer bar stations with architectural lighting, brushed brass finishes, complete bar toolsets, and self-contained ice wells.',
      'services.srv1_f1': 'Custom bar styling & ambient illumination',
      'services.srv1_f2': 'Licensed & insured master mixologists',
      'services.srv1_f3': 'Self-contained ice stations & premium tools',
      'services.srv2_title': 'Signature Cocktail Menus',
      'services.srv2_desc': 'Tailored recipe curation with custom printed bar menus, farm-fresh botanical garnishes, aromatic wood smoking, and elevated zero-proof mocktails.',
      'services.srv2_f1': 'House-made infusions, syrups & bitters',
      'services.srv2_f2': 'Crystal glassware & artisan clear ice spheres',
      'services.srv2_f3': 'Curated non-alcoholic mocktail programs',
      'services.srv3_title': 'Interactive Masterclasses',
      'services.srv3_desc': 'Hands-on bartending workshops for corporate team building, bachelorette gatherings, and private dinners led by expert mixologists.',
      'services.srv3_f1': 'Individual shaker & jigger stations',
      'services.srv3_f2': 'Spirit history, balance & pairing guide',
      'services.srv3_f3': 'Take-home recipe keepsake cards',

      // Gallery
      'gallery.eyebrow': 'THE ATMOSPHERE',
      'gallery.headline': 'Moments We’ve Crafted',
      'gallery.subtitle': 'A glimpse into the energy, craftsmanship, and sophisticated cocktail atmospheres we deliver across private events.',
      'gallery.p1': 'WEDDINGS',
      'gallery.t1': 'Sunset Reception Bar Setup',
      'gallery.p2': 'THE CRAFT',
      'gallery.t2': 'Shaker Action & Live Pouring',
      'gallery.p3': 'PRIVATE EVENTS',
      'gallery.t3': 'Rooftop Evening Celebrations',
      'gallery.p4': 'CORPORATE GALAS',
      'gallery.t4': 'VIP Corporate Hospitality Station',
      'gallery.p5': 'RESERVE COLLECTION',
      'gallery.t5': 'Hand-Batched Elegance',

      // Testimonials
      'reviews.eyebrow': 'CLIENT REVIEWS',
      'reviews.headline': 'Loved by Hosts & Guests',
      'reviews.badge_text': '5.0 Star Rated Event Bartending Experience',
      'reviews.r1_quote': '“Lucky Shaker completely elevated our wedding reception. The custom bride & groom cocktails were the highlight of the night, and the bartenders were exceptionally fast and warm.”',
      'reviews.r1_author': 'Sofia & Lucas M.',
      'reviews.r1_event': 'Wedding Reception • Coral Gables, FL',
      'reviews.r2_quote': '“We hired Lucky Shaker for our annual corporate gala of 180 guests. Flawless execution, zero lines at the bar, and the smoked Old Fashioned was unforgettable.”',
      'reviews.r2_author': 'David R., Executive Director',
      'reviews.r2_event': 'Corporate Gala • Brickell, Miami',
      'reviews.r3_quote': '“The cocktail masterclass for my 40th birthday was the most fun party we’ve ever hosted. Katherin and her team made everyone feel like a pro mixologist!”',
      'reviews.r3_author': 'Camila T.',
      'reviews.r3_event': 'Birthday Celebration • Miami Beach',

      // Booking Form
      'booking.eyebrow': 'BOOK YOUR EVENT',
      'booking.headline': 'Request a Personalized Quote',
      'booking.subtitle': 'Tell us about your upcoming celebration. Our hospitality concierge will tailor a custom bar package and confirm availability within 24 hours.',
      'booking.success_title': 'Thank you! Your inquiry has been received.',
      'booking.success_desc': 'Our event director will review your details and send a personalized proposal within 24 hours.',
      'booking.lbl_name': 'Full Name *',
      'booking.lbl_email': 'Email Address *',
      'booking.lbl_phone': 'Phone Number *',
      'booking.lbl_type': 'Event Type *',
      'booking.opt_select': 'Select event type',
      'booking.opt_wedding': 'Wedding & Reception',
      'booking.opt_gender_reveal': 'Gender Reveal / Baby Shower',
      'booking.opt_corp': 'Corporate Gala / Business Event',
      'booking.opt_private': 'Private Party / VIP Celebration',
      'booking.opt_masterclass': 'Cocktail Masterclass / Workshop',
      'booking.opt_other': 'Other Special Celebration',
      'booking.lbl_date': 'Estimated Event Date *',
      'booking.lbl_guests': 'Estimated Guest Count *',
      'booking.opt_guest_select': 'Select guest range',
      'booking.opt_g1': '10–25 Guests (Intimate)',
      'booking.opt_g2': '26–50 Guests (Medium)',
      'booking.opt_g3': '51–100 Guests (Large)',
      'booking.opt_g4': '101–200+ Guests (Gala / Wedding)',
      'booking.lbl_location': 'Event Location / Venue & City *',
      'booking.lbl_notes': 'Special Requests / Cocktail Preferences',
      'booking.btn_submit': 'SUBMIT QUOTE REQUEST',
      'booking.guarantee': 'No upfront payment required • Personalized response within 24 hours',

      // Shop Preview
      'shop_preview.eyebrow': 'BRING LUCKY SHAKER HOME',
      'shop_preview.headline': 'The Bottled Reserve Collection',
      'shop_preview.subtitle': 'Love our cocktails? Order our hand-batched, shelf-stable ready-to-pour craft bottles delivered directly to your doorstep.',
      'shop_preview.add_bag': 'ADD TO BAG',

      // FAQs
      'faq.eyebrow': 'FREQUENTLY ASKED QUESTIONS',
      'faq.headline': 'Event Bartending Details',
      'faq.subtitle': 'Everything you need to know about booking Lucky Shaker for your celebration.',
      'faq.q1': 'What is included with Lucky Shaker event bartending?',
      'faq.a1': 'Every package includes our mobile bar stations, licensed & insured mixologists, custom printed cocktail menus, house-made craft syrups, fresh-pressed citrus, artisan garnishes, premium glassware, and complete ice wells.',
      'faq.q2': 'How far in advance should I reserve our date?',
      'faq.a2': 'We recommend booking 3 to 8 weeks in advance for private events and 3 to 6 months for weddings and peak holiday corporate galas. However, we always accommodate short-notice requests based on calendar availability.',
      'faq.q3': 'Do you provide the alcohol or does the host provide it?',
      'faq.a3': 'We offer flexible models. We can coordinate the entire spirit inventory through our licensed delivery partners, or provide you with an exact shopping list if you prefer to furnish spirits yourself.',
      'faq.q4': 'Can we customize signature cocktail names and ingredients?',
      'faq.a4': 'Absolutely! That is our signature specialty. We craft custom-named cocktail menus celebrating the bride & groom, corporate brand identity, or host preferences.',
      'faq.q5': 'Do you offer non-alcoholic mocktail programs?',
      'faq.a5': 'Yes! We formulate elevated zero-proof craft mocktails using fresh botanical infusions, sparkling spritzes, and fresh citrus so all guests enjoy a luxury bar experience.',
      'faq.cta_text': 'Have a specific question about your event?',
      'faq.cta_btn': 'SPEAK WITH OUR CONCIERGE',

      // Shop & PDP
      'shop.bestseller': 'BEST SELLER',
      'shop.craft_cocktail': 'CRAFT COCKTAIL',
      'shop.default_notes': 'Hand-batched luxury ready-to-pour cocktail',
      'shop.add_bag': 'ADD TO BAG',
      'shop.sold_out': 'SOLD OUT',
      'pdp.crumb_home': 'Home',
      'pdp.crumb_collection': 'Reserve Collection',
      'pdp.reserve_badge': 'RESERVE BOTTLE',
      'pdp.eyebrow': 'PRIVATE RESERVE // MASTER MIXOLOGIST BATCH',
      'pdp.subtitle': 'Formulated by Katherin • Ready to Pour Craft Cocktail',
      'pdp.reviews_count': '(+180 Verified Reviews)',
      'pdp.free_shipping': 'Free 21+ Express Delivery on orders $80+',
      'pdp.select_format': 'SELECT PRESENTATION:',
      'pdp.add_to_bag': 'ADD TO BAG',
      'pdp.trust_pkg': 'Insulated Climate Packaging with Breakage Protection Guarantee',
      'pdp.trust_id': 'Mandatory 21+ Adult ID Signature Verification Upon Delivery',
      'pdp.tab1_title': 'TASTING PROFILE & PALATE NOTES',
      'pdp.aroma_label': 'Aroma:',
      'pdp.aroma_val': 'Fresh aromatic botanical infusion, layered oak undertones, citrus zests.',
      'pdp.palate_label': 'Palate:',
      'pdp.palate_val': 'Silky and rich texture with upfront craft distillate depth, harmonized by authentic cane sugars and cold-pressed citrus.',
      'pdp.finish_label': 'Finish:',
      'pdp.finish_val': 'Exceptionally smooth, lasting lounge-quality finish with crisp, clean palate clearance.',
      'pdp.tab2_title': 'THE SERVING RITUAL',
      'pdp.ritual_1': '1. Chill the bottle thoroughly to 4°C / 40°F before serving.',
      'pdp.ritual_2': '2. Give the bottle 3 vigorous shakes to homogenize all natural botanical oils.',
      'pdp.ritual_3': '3. Pour 3.5oz to 4.0oz over a large clear crystal ice sphere or rocks.',
      'pdp.ritual_4': '4. Garnish with a fresh citrus twist or aromatic peel and enjoy.',
      'pdp.tab3_title': 'STORAGE, SHELF LIFE & ALLERGENS',
      'pdp.shelf_label': 'Shelf Life:',
      'pdp.shelf_val': '12 months unopened at ambient room temperature away from direct sunlight. Refrigerate upon opening and consume within 6 months.',
      'pdp.volume_label': 'Volume:',
      'pdp.volume_val': '750 ML glass bottle (Yields 6–8 full-sized luxury pours).',
      'pdp.formulation_label': 'Formulation:',
      'pdp.formulation_val': '100% Gluten-Free ingredients, natural spirits, no synthetic chemical stabilizers.',

      // Cart
      'cart.title': 'Your Bar',
      'cart.item_single': '1 ITEM',
      'cart.item_plural': 'ITEMS',
      'cart.empty_title': 'YOUR BAR IS EMPTY',
      'cart.empty_desc': 'Explore our signature ready-to-pour craft cocktails to curate your collection.',
      'cart.explore_btn': 'EXPLORE COCKTAILS',
      'cart.subtotal': 'SUBTOTAL',
      'cart.taxes_note': 'Taxes and shipping calculated at checkout.',
      'cart.checkout': 'PROCEED TO CHECKOUT',
      'cart.continue': 'Continue Exploring →',
      'cart.shipping_empty': 'Spend <strong>$80.00</strong> for <strong>Free Express Shipping</strong>',
      'cart.shipping_progress': 'Add <strong>${remaining}</strong> more for <strong>Free Express Shipping</strong> 🍸',
      'cart.shipping_unlocked': '🎉 <strong>Complimentary Express Shipping Unlocked!</strong>',

      // Footer
      'footer.brand_desc': 'Ultra-premium mobile bartending and craft cocktail catering for private events, weddings, and celebrations. Shaken with passion, poured with intention.',
      'footer.badge_21': '21+ Certified & Fully Insured Bar Service',
      'footer.col1_title': 'EVENTS & SERVICES',
      'footer.weddings': 'Weddings & Receptions',
      'footer.private_parties': 'Private Parties',
      'footer.corporate': 'Corporate Galas',
      'footer.masterclasses': 'Masterclasses & Workshops',
      'footer.request_quote': 'Request an Event Quote',
      'footer.col2_title': 'SHOP & BRAND',
      'footer.shop_bottles': 'Bottled Reserve Shop',
      'footer.our_story': 'Our Story',
      'footer.faqs': 'Frequently Asked Questions',
      'footer.col3_title': 'POLICIES & LEGAL',
      'footer.shipping': 'Shipping & Delivery',
      'footer.refunds': 'Refunds & Cancellations',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.copyright': '© 2026 LUCKY SHAKER LLC. ALL RIGHTS RESERVED.',
      'footer.notice': 'Please drink responsibly. Sale and service of alcoholic beverages is strictly 21+.'
    }
  },

  get: function(key) {
    var lang = this.currentLang || 'es';
    if (this.dict[lang] && this.dict[lang][key] !== undefined) {
      return this.dict[lang][key];
    }
    return (this.dict.es && this.dict.es[key]) || key;
  },

  setLang: function(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    this.currentLang = lang;
    if (window.SafeStorage) {
      window.SafeStorage.setItem('lucky_shaker_lang', lang);
    }

    document.documentElement.lang = lang;

    // Update buttons
    var btnEs = document.getElementById('lang-btn-es');
    var btnEn = document.getElementById('lang-btn-en');
    if (btnEs && btnEn) {
      if (lang === 'es') {
        btnEs.classList.add('active');
        btnEn.classList.remove('active');
      } else {
        btnEn.classList.add('active');
        btnEs.classList.remove('active');
      }
    }

    // Update all data-i18n elements
    var self = this;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (key && self.dict[lang] && self.dict[lang][key] !== undefined) {
        el.innerHTML = self.dict[lang][key];
      }
    });

    // Update placeholders
    var nameInp = document.getElementById('inquiry-name');
    if (nameInp) nameInp.placeholder = lang === 'es' ? 'Ej. Alejandra Valdés' : 'e.g. Alexander Vance';

    var locInp = document.getElementById('inquiry-location');
    if (locInp) locInp.placeholder = lang === 'es' ? 'Ej. Residencia Privada en Coral Gables / Salón Biltmore' : 'e.g. Private Residence in Coral Gables / Biltmore Ballroom';

    var msgInp = document.getElementById('inquiry-message');
    if (msgInp) msgInp.placeholder = lang === 'es' ? 'Cuéntanos sobre tus licores favoritos, temática del evento o ideas especiales de cócteles...' : 'Tell us about your favorite spirits, event theme, or special cocktail ideas...';

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('luckyshaker:langchange', { detail: { lang: lang } }));
  },

  init: function() {
    var stored = 'es';
    if (window.SafeStorage) {
      stored = window.SafeStorage.getItem('lucky_shaker_lang') || 'es';
    }
    this.setLang(stored);
  }
};

/* ==========================================================================
   1. AJAX CART DRAWER ENGINE
   ========================================================================== */
window.LuckyShakerCart = {
  drawer: null,
  backdrop: null,
  badge: null,
  itemsList: null,
  subtotalEl: null,
  toast: null,
  toastTimer: null,

  init: function() {
    this.drawer = document.getElementById('cart-drawer');
    this.backdrop = document.getElementById('cart-backdrop');
    this.badge = document.getElementById('cart-badge-count');
    this.itemsList = document.getElementById('cart-items-list');
    this.subtotalEl = document.getElementById('drawer-subtotal');
    this.toast = document.getElementById('cart-toast');

    var self = this;

    // Attach open triggers
    document.querySelectorAll('.open-cart-btn, .cart-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        self.open();
      });
    });

    // Attach close triggers
    var closeBtn = document.getElementById('close-cart-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        self.close();
      });
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', function() {
        self.close();
      });
    }

    // Intercept native product form submission for Ajax
    var productForm = document.getElementById('pdp-product-form');
    if (productForm) {
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var variantId = document.getElementById('selected-variant-id').value;
        var qty = parseInt(document.getElementById('pdp-qty-input').value) || 1;
        self.addItem(variantId, qty);
      });
    }

    // Checkout triggers: use cart permalink bridging if in local development
    document.addEventListener('click', function(e) {
      var checkoutTrigger = e.target.closest('#checkout-btn, .btn-drawer-checkout, .summary-checkout-btn, [name="checkout"]');
      if (checkoutTrigger) {
        e.preventDefault();
        self.proceedToCheckout();
      }
    });

    var cartForm = document.getElementById('cart-form');
    if (cartForm) {
      cartForm.addEventListener('submit', function(e) {
        e.preventDefault();
        self.proceedToCheckout();
      });
    }
  },

  proceedToCheckout: function() {
    var self = this;
    fetch(window.LuckyShaker?.routes?.cart_url + '.js' || '/cart.js')
      .then(function(res) { return res.json(); })
      .then(function(cart) {
        if (!cart.items || cart.items.length === 0) {
          self.showToast(window.LuckyShakerLang?.currentLang === 'es' ? 'Tu bolsa está vacía. ¡Agrega un cóctel!' : 'Your bar is empty. Add a cocktail first!');
          return;
        }

        var isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

        if (isLocal) {
          var permalinkParts = cart.items.map(function(item) {
            return item.variant_id + ':' + item.quantity;
          }).join(',');

          var shopDomain = (window.LuckyShaker && (window.LuckyShaker.permanentDomain || window.LuckyShaker.shopDomain)) || 'lucky-shaker-bgzxnanx.myshopify.com';
          var targetUrl = 'https://' + shopDomain + '/cart/' + permalinkParts;
          window.location.href = targetUrl;
        } else {
          window.location.href = '/checkout';
        }
      })
      .catch(function(err) {
        console.error('Checkout dispatch error:', err);
        window.location.href = '/checkout';
      });
  },

  open: function() {
    if (this.drawer) this.drawer.classList.add('open');
    if (this.backdrop) this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close: function() {
    if (this.drawer) this.drawer.classList.remove('open');
    if (this.backdrop) this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  },

  showToast: function(msg) {
    if (!this.toast) return;
    var textEl = document.getElementById('toast-text');
    if (textEl && msg) textEl.textContent = msg;

    this.toast.classList.add('active');
    clearTimeout(this.toastTimer);
    var self = this;
    this.toastTimer = setTimeout(function() {
      self.toast.classList.remove('active');
    }, 2800);
  },

  addItem: function(variantId, quantity, title, price) {
    var self = this;
    quantity = quantity || 1;

    fetch(window.LuckyShaker?.routes?.cart_add_url || '/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(item) {
      self.refreshCart(true);
      var lang = window.LuckyShakerLang?.currentLang || 'es';
      var addedText = lang === 'es' ? 'Agregado a la bolsa' : 'Added to bag';
      self.showToast((title || item.title || 'Cóctel') + ' • ' + addedText);
    })
    .catch(function(err) {
      console.warn('Shopify Cart Add Fallback:', err);
      self.showToast('Agregado a la bolsa');
      self.open();
    });
  },

  addItemByHandle: function(handle, qty, fallbackTitle, fallbackPrice) {
    var self = this;
    fetch('/products/' + handle + '.js')
      .then(function(res) { return res.json(); })
      .then(function(product) {
        var variantId = product.variants[0].id;
        self.addItem(variantId, qty || 1, product.title);
      })
      .catch(function() {
        self.showToast('Agregado ' + fallbackTitle + ' a la bolsa');
        self.open();
      });
  },

  changeQuantity: function(lineItemKey, newQty) {
    var self = this;
    fetch(window.LuckyShaker?.routes?.cart_change_url || '/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: lineItemKey,
        quantity: newQty
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(cart) {
      self.renderCart(cart);
      if (window.location.pathname.includes('/cart')) {
        window.location.reload();
      }
    })
    .catch(function(err) {
      console.error('Cart quantity change failed:', err);
    });
  },

  refreshCart: function(openAfter) {
    var self = this;
    fetch(window.LuckyShaker?.routes?.cart_url + '.js' || '/cart.js')
      .then(function(res) { return res.json(); })
      .then(function(cart) {
        self.renderCart(cart);
        if (openAfter) self.open();
      })
      .catch(function(err) {
        console.error('Failed to refresh cart:', err);
      });
  },

  renderCart: function(cart) {
    var lang = window.LuckyShakerLang?.currentLang || 'es';
    if (this.badge) this.badge.textContent = cart.item_count;

    var countBadge = document.getElementById('drawer-count-badge');
    if (countBadge) {
      if (lang === 'es') {
        countBadge.textContent = cart.item_count === 1 ? '1 PRODUCTO' : cart.item_count + ' PRODUCTOS';
      } else {
        countBadge.textContent = cart.item_count === 1 ? '1 ITEM' : cart.item_count + ' ITEMS';
      }
    }

    if (this.subtotalEl) {
      this.subtotalEl.textContent = this.formatMoney(cart.total_price);
    }

    var shippingText = document.getElementById('shipping-progress-text');
    var shippingPercent = document.getElementById('shipping-progress-percent');
    var shippingFill = document.getElementById('shipping-progress-fill');
    var thresholdCents = 8000;

    if (shippingText && shippingFill) {
      if (cart.total_price === 0) {
        shippingText.innerHTML = lang === 'es'
          ? 'Agrega <strong>$80.00</strong> para <strong>Envío Express Gratis</strong>'
          : 'Spend <strong>$80.00</strong> for <strong>Free Express Shipping</strong>';
        if (shippingPercent) shippingPercent.textContent = '0%';
        shippingFill.style.width = '0%';
      } else if (cart.total_price < thresholdCents) {
        var remaining = (thresholdCents - cart.total_price) / 100;
        var pct = Math.min(100, Math.round((cart.total_price / thresholdCents) * 100));
        shippingText.innerHTML = lang === 'es'
          ? 'Agrega <strong>$' + remaining.toFixed(2) + '</strong> más para <strong>Envío Express Gratis</strong> 🍸'
          : 'Add <strong>$' + remaining.toFixed(2) + '</strong> more for <strong>Free Express Shipping</strong> 🍸';
        if (shippingPercent) shippingPercent.textContent = pct + '%';
        shippingFill.style.width = pct + '%';
      } else {
        shippingText.innerHTML = lang === 'es'
          ? '🎉 <strong>¡Envío Express de Cortesía Desbloqueado!</strong>'
          : '🎉 <strong>Complimentary Express Shipping Unlocked!</strong>';
        if (shippingPercent) shippingPercent.textContent = '100%';
        shippingFill.style.width = '100%';
      }
    }

    // GWP (Gift with Purchase) 100ml Crema Promo Logic
    var gwpText = document.getElementById('gwp-progress-text');
    var gwpPercent = document.getElementById('gwp-progress-percent');
    var gwpFill = document.getElementById('gwp-progress-fill');
    var gwpBanner = document.getElementById('cart-gwp-banner');
    
    var totalItemsCount = cart.items ? cart.items.reduce(function(sum, it) { return sum + it.quantity; }, 0) : 0;

    if (gwpText && gwpFill) {
      if (totalItemsCount >= 2) {
        if (gwpBanner) gwpBanner.classList.add('unlocked');
        gwpText.innerHTML = lang === 'es'
          ? '🎉 <strong>¡Regalo Desbloqueado!</strong> 1x <strong>Crema de Whiskey 100ml GRATIS</strong> añadida a tu orden.'
          : '🎉 <strong>Gift Unlocked!</strong> 1x <strong>Whiskey Cream 100ml FREE</strong> added to your bar.';
        if (gwpPercent) gwpPercent.innerHTML = '<span class="gwp-unlocked-tag">✓ DESBLOQUEADO</span>';
        gwpFill.style.width = '100%';
      } else if (totalItemsCount === 1) {
        if (gwpBanner) gwpBanner.classList.remove('unlocked');
        gwpText.innerHTML = lang === 'es'
          ? 'Agrega <strong>1 producto más</strong> para recibir <strong>1 Crema de Whiskey 100ml GRATIS</strong> 🎁'
          : 'Add <strong>1 more item</strong> to unlock your <strong>FREE Whiskey Cream 100ml Bottle</strong> 🎁';
        if (gwpPercent) gwpPercent.textContent = '1/2';
        gwpFill.style.width = '50%';
      } else {
        if (gwpBanner) gwpBanner.classList.remove('unlocked');
        gwpText.innerHTML = lang === 'es'
          ? 'Agrega <strong>2 productos</strong> para recibir <strong>1 Crema de Whiskey 100ml GRATIS</strong>'
          : 'Buy any <strong>2 items</strong> & get <strong>1 FREE Whiskey Cream 100ml Bottle</strong>';
        if (gwpPercent) gwpPercent.textContent = '0/2';
        gwpFill.style.width = '0%';
      }
    }

    if (!this.itemsList) return;

    if (cart.item_count === 0) {
      var emptyTitle = lang === 'es' ? 'TU BARRA ESTÁ VACÍA' : 'YOUR BAR IS EMPTY';
      var emptyDesc = lang === 'es' ? 'Explora nuestra colección de botellas para comenzar.' : 'Explore our signature ready-to-pour craft cocktails to curate your collection.';
      var exploreBtn = lang === 'es' ? 'EXPLORAR CÓCTELES' : 'EXPLORE COCKTAILS';

      this.itemsList.innerHTML = 
        '<div class="cart-empty-message">' +
          '<div class="empty-cart-icon-wrap">' +
            '<img src="{{ "favicon.svg" | asset_url }}" alt="Lucky Shaker" width="42" height="42">' +
          '</div>' +
          '<h4 class="empty-cart-title">' + emptyTitle + '</h4>' +
          '<p class="empty-cart-desc">' + emptyDesc + '</p>' +
          '<a href="/collections/all" class="empty-cart-cta">' +
            '<span>' + exploreBtn + '</span>' +
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h12M8 2l5 5-5 5"/></svg>' +
          '</a>' +
        '</div>';
      return;
    }

    var html = '';
    var self = this;
    var defaultVol = lang === 'es' ? '750ml • Listo para Servir' : '750ml • Ready to Pour';

    cart.items.forEach(function(item) {
      var imgHtml = item.image 
        ? '<img src="' + item.image + '" alt="' + item.title + '" class="cart-item-img" width="68" height="80">'
        : '<div class="cart-item-img" style="background: rgba(0,0,0,0.03);"></div>';

      html += 
        '<div class="cart-item-row" data-line-item-key="' + item.key + '">' +
          '<div class="cart-item-img-wrap">' +
            imgHtml +
          '</div>' +
          '<div class="cart-item-info">' +
            '<h5>' + item.product_title + '</h5>' +
            '<div class="item-vol">' + (item.variant_title || defaultVol) + '</div>' +
            '<div class="cart-item-actions">' +
              '<div class="cart-item-qty">' +
                '<button type="button" class="qty-btn" onclick="LuckyShakerCart.changeQuantity(\'' + item.key + '\', ' + (item.quantity - 1) + ')" aria-label="Decrease quantity">&minus;</button>' +
                '<span class="qty-count">' + item.quantity + '</span>' +
                '<button type="button" class="qty-btn" onclick="LuckyShakerCart.changeQuantity(\'' + item.key + '\', ' + (item.quantity + 1) + ')" aria-label="Increase quantity">&plus;</button>' +
              '</div>' +
              '<button type="button" class="cart-item-remove-btn" onclick="LuckyShakerCart.changeQuantity(\'' + item.key + '\', 0)" aria-label="Remove item" title="Remove">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>' +
                '</svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-right">' +
            '<div class="cart-item-price">' + self.formatMoney(item.final_line_price) + '</div>' +
          '</div>' +
        '</div>';
    });

    // If unlocked GWP, inject Free 100ml Crema Gift Item
    if (totalItemsCount >= 2) {
      var giftTitle = lang === 'es' ? 'Crema de Whiskey de Autor' : 'Signature Whiskey Cream';
      var giftSub = lang === 'es' ? 'Miniatura 100ml • Botella de Cristal' : '100ml Miniature Glass Bottle';
      var giftStatus = lang === 'es' ? '✓ Desbloqueado por comprar 2+ productos' : '✓ Unlocked with purchase of 2+ items';
      var freeBadge = lang === 'es' ? 'GRATIS' : 'FREE';

      html += 
        '<div class="cart-item-row cart-gwp-gift-row">' +
          '<div class="cart-item-img-wrap">' +
            '<img src="/cdn/shop/t/4/assets/prod-whiskey-cream.png?v=1" alt="Regalo Crema de Whiskey" class="cart-item-img" onerror="this.onerror=null; this.src=\'/cdn/shop/t/4/assets/lucky_shaker_glass_icon.png\';" width="68" height="80">' +
            '<span class="gwp-gift-badge">' + freeBadge + '</span>' +
          '</div>' +
          '<div class="cart-item-info">' +
            '<div class="gwp-item-tag">🎁 ' + (lang === 'es' ? 'REGALO DE CORTESÍA' : 'COMPLIMENTARY GIFT') + '</div>' +
            '<h5>' + giftTitle + '</h5>' +
            '<div class="item-vol">' + giftSub + '</div>' +
            '<div class="gwp-item-status">' + giftStatus + '</div>' +
          '</div>' +
          '<div class="cart-item-right">' +
            '<div class="cart-item-price free-price">' +
              '<span class="gwp-original-price">$12.00</span> ' +
              '<span class="gwp-free-label">' + freeBadge + ' ($0.00)</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    this.itemsList.innerHTML = html;
  },

  formatMoney: function(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
};

/* ==========================================================================
   2. PDP VARIANT & ADVANCED CONFIGURATOR CONTROLLER
   ========================================================================== */
window.LuckyShakerPDP = {
  state: {
    drinkType: 'cocktail',   // 'cocktail' | 'mocktail'
    packSize: 6,             // 6 | 12
    flavorMode: 'single',    // 'single' | 'mixed'
    wcSize: '750',           // '750' | '375'
    wcEdition: 'stock',      // 'stock' | 'custom'
    customLabel: '',
    isCream: false,
    isFruit: false,
    isCan: true
  },

  init: function() {
    var titleEl = document.querySelector('.pdp-title');
    var title = titleEl ? titleEl.textContent.toLowerCase() : '';
    if (title.indexOf('crema') !== -1 || title.indexOf('whiskey cream') !== -1) {
      this.state.isCream = true;
      this.state.isCan = false;
    } else if (title.indexOf('fruta') !== -1 || title.indexOf('dry') !== -1 || title.indexOf('manzana') !== -1 || title.indexOf('piña') !== -1) {
      this.state.isFruit = true;
      this.state.isCan = false;
    }
    this.recalculate();
  },

  selectDrinkType: function(type, el) {
    this.state.drinkType = type;
    document.querySelectorAll('[data-drink-type]').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');

    // Update pack prices in buttons
    var pack6Price = document.getElementById('pdp-pack6-price');
    var pack12Price = document.getElementById('pdp-pack12-price');
    if (type === 'mocktail') {
      if (pack6Price) pack6Price.textContent = '$29.99';
      if (pack12Price) pack12Price.textContent = '$57.99';
    } else {
      if (pack6Price) pack6Price.textContent = '$35.99';
      if (pack12Price) pack12Price.textContent = '$69.99';
    }
    this.recalculate();
  },

  selectPackSize: function(size, el) {
    this.state.packSize = parseInt(size, 10) || 6;
    document.querySelectorAll('[data-pack-size]').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');
    this.recalculate();
  },

  selectFlavorMode: function(mode, el) {
    this.state.flavorMode = mode;
    document.querySelectorAll('[data-flavor-mode]').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');
    this.recalculate();
  },

  selectWcSize: function(size, el) {
    this.state.wcSize = String(size);
    document.querySelectorAll('[data-wc-size]').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');

    // Update custom label price badge
    var customBadge = document.getElementById('wc-custom-price-badge');
    if (customBadge) {
      customBadge.textContent = this.state.wcSize === '750' ? '+$10.00 ($45.00)' : '+$6.00 ($24.99)';
    }
    this.recalculate();
  },

  selectWcEdition: function(edition, el) {
    this.state.wcEdition = edition;
    document.querySelectorAll('[data-wc-edition]').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');

    var customWrap = document.getElementById('pdp-custom-label-wrap');
    if (customWrap) {
      customWrap.style.display = edition === 'custom' ? 'block' : 'none';
      if (edition === 'custom') {
        var input = document.getElementById('pdp-custom-label-input');
        if (input) input.focus();
      }
    }
    this.recalculate();
  },

  updateCustomLabel: function(val) {
    this.state.customLabel = val || '';
    var hidden = document.getElementById('pdp-custom-label-prop');
    if (hidden) hidden.value = this.state.customLabel;
  },

  recalculate: function() {
    var priceDisplay = document.getElementById('pdp-price-display');
    var sublabelDisplay = document.getElementById('pdp-price-sublabel');
    var btnLabel = document.getElementById('pdp-btn-label');
    var formatProp = document.getElementById('pdp-selected-format');
    var typeProp = document.getElementById('pdp-selected-type');

    var price = '$35.99';
    var sublabel = '(Pack de 6 Latas • 355ml c/u)';
    var btnText = 'AGREGAR PACK DE 6 • $35.99';

    if (this.state.isCream) {
      if (this.state.wcSize === '750') {
        price = this.state.wcEdition === 'custom' ? '$45.00' : '$35.00';
        sublabel = this.state.wcEdition === 'custom' ? '(Botella 750ml • Etiqueta Personalizada)' : '(Botella 750ml • Etiqueta Estándar)';
      } else {
        price = this.state.wcEdition === 'custom' ? '$24.99' : '$18.99';
        sublabel = this.state.wcEdition === 'custom' ? '(Botella 375ml • Etiqueta Personalizada)' : '(Botella 375ml • Etiqueta Estándar)';
      }
      btnText = 'AGREGAR A LA BOLSA • ' + price;
      if (formatProp) formatProp.value = 'Botella ' + this.state.wcSize + 'ml (' + (this.state.wcEdition === 'custom' ? 'Personalizada' : 'Estándar') + ')';
      if (typeProp) typeProp.value = 'Crema de Whiskey de Autor (17% ABV)';
    } else if (this.state.isFruit) {
      price = '$8.75';
      sublabel = '(Paquete 60g)';
      btnText = 'AGREGAR A LA BOLSA • $8.75';
      if (formatProp) formatProp.value = 'Paquete Individual 60g';
      if (typeProp) typeProp.value = 'Frutas Deshidratadas Botánicas';
    } else {
      // Cans (Cocktail / Mocktail)
      var isMocktail = this.state.drinkType === 'mocktail';
      if (this.state.packSize === 12) {
        price = isMocktail ? '$57.99' : '$69.99';
        sublabel = isMocktail ? '(Combo 12 Mocktails • 355ml c/u • $4.83 / lata)' : '(Combo 12 Latas • 355ml c/u • $5.83 / lata)';
        btnText = 'AGREGAR COMBO 12 • ' + price;
        if (formatProp) formatProp.value = 'Combo de 12 Latas (355ml c/u) • ' + (this.state.flavorMode === 'mixed' ? 'Surtido Mixto' : 'Sabor Único');
      } else {
        price = isMocktail ? '$29.99' : '$35.99';
        sublabel = isMocktail ? '(Pack de 6 Mocktails • 355ml c/u • $5.00 / lata)' : '(Pack de 6 Latas • 355ml c/u • $6.00 / lata)';
        btnText = 'AGREGAR PACK DE 6 • ' + price;
        if (formatProp) formatProp.value = 'Pack de 6 Latas (355ml c/u) • ' + (this.state.flavorMode === 'mixed' ? 'Surtido Mixto' : 'Sabor Único');
      }
      if (typeProp) typeProp.value = isMocktail ? 'Mocktail Sin Alcohol (0.0% ABV)' : 'Cóctel con Alcohol (16% ABV)';
    }

    if (priceDisplay) priceDisplay.textContent = price;
    if (sublabelDisplay) sublabelDisplay.textContent = sublabel;
    if (btnLabel) btnLabel.textContent = btnText;
  },

  handleAddToCart: function() {
    var variantInput = document.getElementById('selected-variant-id');
    var variantId = variantInput ? variantInput.value : '';
    var qtyInput = document.getElementById('pdp-qty-input');
    var qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
    var titleEl = document.querySelector('.pdp-title');
    var baseTitle = titleEl ? titleEl.textContent.trim() : 'Cóctel Lucky Shaker';
    var priceEl = document.getElementById('pdp-price-display');
    var currentPrice = priceEl ? priceEl.textContent.trim() : '$35.99';

    var finalTitle = baseTitle;
    if (this.state.isCream) {
      finalTitle += ' (' + this.state.wcSize + 'ml - ' + (this.state.wcEdition === 'custom' ? 'Personalizada' : 'Estándar') + ')';
    } else if (this.state.isFruit) {
      finalTitle += ' (60g)';
    } else {
      var drinkLabel = this.state.drinkType === 'mocktail' ? 'Mocktail Sin Alcohol' : 'Cóctel';
      var packLabel = this.state.packSize === 12 ? 'Combo 12 Latas' : 'Pack 6 Latas';
      var flavorLabel = this.state.flavorMode === 'mixed' ? 'Mixto' : 'Sabor Único';
      finalTitle += ' (' + packLabel + ' • ' + drinkLabel + ' • ' + flavorLabel + ')';
    }

    LuckyShakerCart.addItem(variantId, qty, finalTitle, currentPrice);
  },

  selectVariant: function(variantId, priceFormatted, el) {
    var input = document.getElementById('selected-variant-id');
    if (input) input.value = variantId;
    var priceDisplay = document.getElementById('pdp-price-display');
    if (priceDisplay) priceDisplay.textContent = priceFormatted;
    var btnLabel = document.getElementById('pdp-btn-label');
    if (btnLabel) btnLabel.textContent = 'AGREGAR A LA BOLSA \u2022 ' + priceFormatted;

    document.querySelectorAll('.variant-option-card, .pdp-format-card').forEach(function(c) {
      c.classList.remove('active');
    });
    if (el) el.classList.add('active');
  },

  adjustQty: function(delta) {
    var input = document.getElementById('pdp-qty-input');
    if (!input) return;
    var val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 12) val = 12;
    input.value = val;
  }
};

/* ==========================================================================
   3. CONTINUOUS SCROLL-DRIVEN 3-ACT CANVAS SEQUENCE ENGINE (60FPS ZERO-LATENCY)
   ========================================================================== */
function initPrimeStoneCinematicEngine() {
  var sequenceSection = document.getElementById("cinematic-sequence");
  var viewport = document.getElementById("cinematic-viewport");

  if (!sequenceSection || !viewport) return;

  var sceneMojito = document.getElementById("scene-mojito");
  var sceneOF = document.getElementById("scene-old-fashioned");
  var sceneWC = document.getElementById("scene-whiskey-cream");

  var wcCanvas = document.getElementById("wc-sequence-canvas");
  var ofCanvas = document.getElementById("of-sequence-canvas");
  var mojitoCanvas = document.getElementById("mojito-sequence-canvas");

  var cardMojito = document.getElementById("card-mojito");
  var cardOF = document.getElementById("card-old-fashioned");
  var cardWC = document.getElementById("card-whiskey-cream");

  var fillBar = document.getElementById("timeline-fill-bar");
  var scrollCue = document.getElementById("scroll-cue");

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  var cocktails = {
    wc: {
      canvas: wcCanvas,
      totalFrames: 120,
      prefix: "wc",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    },
    of: {
      canvas: ofCanvas,
      totalFrames: 48,
      prefix: "of",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    },
    mojito: {
      canvas: mojitoCanvas,
      totalFrames: 48,
      prefix: "mojito",
      mobileCache: new Map(),
      desktopCache: new Map(),
      mobileLoading: new Set(),
      desktopLoading: new Set(),
      displayedFrame: -1
    }
  };

  function getFrameUrl(itemKey, idx, isMobile) {
    var prefix = isMobile ? (cocktails[itemKey].prefix + "-m-") : (cocktails[itemKey].prefix + "-");
    var padded = String(idx).padStart(4, "0");
    var filename = "frame-" + prefix + padded;

    // Production Shopify CDN with asset URL template
    if (window.LuckyShaker && window.LuckyShaker.assetUrlTemplate) {
      var tmpl = window.LuckyShaker.assetUrlTemplate;
      if (tmpl.indexOf("frame-PLACEHOLDER") !== -1) {
        return tmpl.replace("frame-PLACEHOLDER", filename);
      }
      return tmpl.replace(/frame-[a-zA-Z0-9_-]+(?=\.webp)/, filename);
    }

    return "/assets/" + filename + ".webp";
  }

  function drawFrameToCanvas(canvas, img) {
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    var ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    var cw = canvas.width;
    var ch = canvas.height;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    if (cw === 0 || ch === 0 || iw === 0 || ih === 0) return;

    var imgAspect = iw / ih;
    var canvasAspect = cw / ch;

    var dw, dh;
    if (canvasAspect > imgAspect) {
      dw = cw;
      dh = cw / imgAspect;
    } else {
      dh = ch;
      dw = ch * imgAspect;
    }

    var offsetX = (cw - dw) / 2;
    var offsetY = (ch - dh) / 2;
    ctx.drawImage(img, offsetX, offsetY, dw, dh);
  }

  function preloadFrame(itemKey, idx, priority) {
    var item = cocktails[itemKey];
    if (!item || idx < 1 || idx > item.totalFrames) return;
    var isMobile = isMobileView();
    var cache = isMobile ? item.mobileCache : item.desktopCache;
    var loading = isMobile ? item.mobileLoading : item.desktopLoading;
    if (cache.has(idx) || loading.has(idx)) return;

    loading.add(idx);
    var img = new Image();
    img.src = getFrameUrl(itemKey, idx, isMobile);
    img.decoding = "async";
    if (priority) img.fetchPriority = "high";

    function onReady() {
      loading.delete(idx);
      cache.set(idx, img);
      if (item.displayedFrame === -1 && idx === 1) {
        drawFrameToCanvas(item.canvas, img);
        item.displayedFrame = 1;
      }
    }

    if ("decode" in img) {
      img.decode().then(onReady).catch(function() {
        img.onload = onReady;
        img.onerror = function() { loading.delete(idx); };
      });
    } else {
      img.onload = onReady;
      img.onerror = function() { loading.delete(idx); };
    }
  }

  function loadNearbyFrames(itemKey, center) {
    var item = cocktails[itemKey];
    if (!item) return;
    var minF = Math.max(1, center - 4);
    var maxF = Math.min(item.totalFrames, center + 12);
    for (var f = minF; f <= maxF; f++) {
      preloadFrame(itemKey, f, false);
    }
  }

  function renderCocktailFrame(itemKey, targetFrame) {
    var item = cocktails[itemKey];
    if (!item || !item.canvas) return;
    var isMobile = isMobileView();
    var cache = isMobile ? item.mobileCache : item.desktopCache;

    if (item.displayedFrame !== targetFrame) {
      var img = cache.get(targetFrame);
      if (!img) {
        var closestDist = Infinity;
        cache.forEach(function(fImg, fIdx) {
          var d = Math.abs(fIdx - targetFrame);
          if (d < closestDist && fImg.complete && fImg.naturalWidth > 0) {
            closestDist = d;
            img = fImg;
          }
        });
      }
      if (img && img.complete && img.naturalWidth > 0) {
        drawFrameToCanvas(item.canvas, img);
        item.displayedFrame = targetFrame;
      }
      loadNearbyFrames(itemKey, targetFrame);
    }
  }

  function startBackgroundPrefetch() {
    preloadFrame("wc", 1, true);
    preloadFrame("of", 1, true);
    preloadFrame("mojito", 1, true);

    for (var i = 1; i <= 24; i++) preloadFrame("wc", i, false);
    for (var j = 1; j <= 12; j++) preloadFrame("of", j, false);
    for (var k = 1; k <= 12; k++) preloadFrame("mojito", k, false);

    var seq = ["wc", "of", "mojito"];
    var seqIdx = 0;
    var f = 1;
    var timer = setInterval(function() {
      if (seqIdx >= seq.length) {
        clearInterval(timer);
        return;
      }
      var key = seq[seqIdx];
      preloadFrame(key, f, false);
      f++;
      if (f > cocktails[key].totalFrames) {
        seqIdx++;
        f = 1;
      }
    }, 20);
  }

  var lastMobileRecorded = isMobileView();
  function resizeAllCanvases() {
    var isMobile = isMobileView();
    var mobileChanged = isMobile !== lastMobileRecorded;
    if (mobileChanged) {
      lastMobileRecorded = isMobile;
      Object.keys(cocktails).forEach(function(k) {
        cocktails[k].displayedFrame = -1;
      });
      startBackgroundPrefetch();
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var targetW = Math.max(1, Math.round(vw * dpr));
    var targetH = Math.max(1, Math.round(vh * dpr));

    Object.keys(cocktails).forEach(function(k) {
      var item = cocktails[k];
      if (!item.canvas) return;
      if (item.canvas.width !== targetW || item.canvas.height !== targetH || mobileChanged) {
        item.canvas.width = targetW;
        item.canvas.height = targetH;
        var cache = isMobile ? item.mobileCache : item.desktopCache;
        var curF = item.displayedFrame > 0 ? item.displayedFrame : 1;
        if (cache.has(curF)) {
          drawFrameToCanvas(item.canvas, cache.get(curF));
          item.displayedFrame = curF;
        }
      }
    });
  }

  window.addEventListener("resize", resizeAllCanvases);
  window.addEventListener("orientationchange", resizeAllCanvases);
  resizeAllCanvases();
  startBackgroundPrefetch();

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  var targetProgress = 0;
  var currentProgress = 0;
  var isLoopActive = false;
  var SMOOTHING_FACTOR = 0.09;

  function computeScrollProgress() {
    var rect = sequenceSection.getBoundingClientRect();
    var scrollDistance = sequenceSection.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return 0;
    var raw = -rect.top / scrollDistance;
    return clamp(raw, 0, 1);
  }

  function onScrollOrResize() {
    var newTarget = computeScrollProgress();
    if (newTarget !== targetProgress) {
      targetProgress = newTarget;
      if (!isLoopActive) {
        isLoopActive = true;
        requestAnimationFrame(renderLoop);
      }
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  function renderLoop() {
    var diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * SMOOTHING_FACTOR;
      applyCinematicTransformation(currentProgress);
      requestAnimationFrame(renderLoop);
    } else {
      currentProgress = targetProgress;
      applyCinematicTransformation(currentProgress);
      isLoopActive = false;
    }
  }

  function applyCinematicTransformation(p) {
    // -----------------------------------------------------------------------
    // A. ACT 1: WHISKEY CREAM (p: 0.00 -> 0.32)
    // -----------------------------------------------------------------------
    var targetFrameWC = 1;
    if (p <= 0.02) {
      targetFrameWC = 1;
    } else if (p >= 0.22) {
      targetFrameWC = 120;
    } else {
      var normWC = (p - 0.02) / 0.20;
      targetFrameWC = Math.min(120, Math.max(1, Math.round(normWC * 119) + 1));
    }
    renderCocktailFrame("wc", targetFrameWC);

    // -----------------------------------------------------------------------
    // B. TRANSITION 1 -> 2: OLD FASHIONED SLIDES IN FROM RIGHT (p: 0.28 -> 0.33)
    // -----------------------------------------------------------------------
    var t1 = clamp((p - 0.28) / 0.05, 0, 1);
    var e1 = easeInOutCubic(t1);

    if (sceneWC) {
      if (p < 0.28) {
        sceneWC.style.display = "block";
        sceneWC.style.transform = "translateX(0%) scale(" + (1.0 + p * 0.02).toFixed(4) + ")";
        sceneWC.style.opacity = "1";
      } else if (p <= 0.34) {
        sceneWC.style.display = "block";
        var xOffsetWC = -e1 * 25;
        sceneWC.style.transform = "translateX(" + xOffsetWC.toFixed(2) + "%) scale(1.0)";
        sceneWC.style.opacity = (1 - e1 * 0.4).toFixed(3);
      } else {
        sceneWC.style.display = "none";
      }
    }

    if (sceneOF) {
      if (p < 0.28) {
        sceneOF.style.display = "none";
        sceneOF.style.transform = "translateX(100%)";
      } else if (p < 0.60) {
        sceneOF.style.display = "block";
        var xOffsetOF = (1 - e1) * 100;
        sceneOF.style.transform = "translateX(" + xOffsetOF.toFixed(2) + "%)";
        sceneOF.style.opacity = "1";
      }
    }

    // -----------------------------------------------------------------------
    // C. ACT 2: OLD FASHIONED SCRUB (p: 0.33 -> 0.64)
    // -----------------------------------------------------------------------
    var targetFrameOF = 1;
    if (p <= 0.35) {
      targetFrameOF = 1;
    } else if (p >= 0.53) {
      targetFrameOF = 48;
    } else {
      var normOF = (p - 0.35) / 0.18;
      targetFrameOF = Math.min(48, Math.max(1, Math.round(normOF * 47) + 1));
    }
    renderCocktailFrame("of", targetFrameOF);

    // -----------------------------------------------------------------------
    // D. TRANSITION 2 -> 3: MOJITO SLIDES IN FROM RIGHT (p: 0.60 -> 0.65)
    // -----------------------------------------------------------------------
    var t2 = clamp((p - 0.60) / 0.05, 0, 1);
    var e2 = easeInOutCubic(t2);

    if (sceneOF && p >= 0.60) {
      if (p <= 0.66) {
        sceneOF.style.display = "block";
        var xOffsetOF2 = -e2 * 25;
        sceneOF.style.transform = "translateX(" + xOffsetOF2.toFixed(2) + "%) scale(1.0)";
        sceneOF.style.opacity = (1 - e2 * 0.4).toFixed(3);
      } else {
        sceneOF.style.display = "none";
      }
    }

    if (sceneMojito) {
      if (p < 0.60) {
        sceneMojito.style.display = "none";
        sceneMojito.style.transform = "translateX(100%)";
      } else {
        sceneMojito.style.display = "block";
        var xOffsetMojito = (1 - e2) * 100;
        sceneMojito.style.transform = "translateX(" + xOffsetMojito.toFixed(2) + "%)";
        sceneMojito.style.opacity = "1";
      }
    }

    // -----------------------------------------------------------------------
    // E. ACT 3: MOJITO SCRUB (p: 0.65 -> 0.98)
    // -----------------------------------------------------------------------
    var targetFrameMojito = 1;
    if (p <= 0.67) {
      targetFrameMojito = 1;
    } else if (p >= 0.85) {
      targetFrameMojito = 48;
    } else {
      var normMojito = (p - 0.67) / 0.18;
      targetFrameMojito = Math.min(48, Math.max(1, Math.round(normMojito * 47) + 1));
    }
    renderCocktailFrame("mojito", targetFrameMojito);

    // -----------------------------------------------------------------------
    // F. EDITORIAL CARDS REVEALS & ACTIVE STATES
    // -----------------------------------------------------------------------
    if (cardWC) {
      if (p <= 0.28) {
        cardWC.classList.add("active");
      } else {
        cardWC.classList.remove("active");
      }
    }

    if (cardOF) {
      if (p > 0.28 && p <= 0.60) {
        cardOF.classList.add("active");
      } else {
        cardOF.classList.remove("active");
      }
    }

    if (cardMojito) {
      if (p > 0.60) {
        cardMojito.classList.add("active");
      } else {
        cardMojito.classList.remove("active");
      }
    }

    // -----------------------------------------------------------------------
    // G. SCRUBBER & CUES
    // -----------------------------------------------------------------------
    if (fillBar) fillBar.style.width = (p * 100).toFixed(1) + "%";
    if (scrollCue) scrollCue.style.opacity = p > 0.03 ? "0" : "1";
  }

  // Initial immediate frame 0 render
  applyCinematicTransformation(0);
}

/* ==========================================================================
   3.5 HERO SCROLL-DRIVEN CINEMATIC VIDEO ENGINE (4K Desktop & Mobile 9:16)
   ========================================================================== */
function initHeroCinematicScroll() {
  var heroSection = document.getElementById('hero');
  var stickyViewport = document.getElementById('event-hero-sticky-viewport');
  var videoDesktop = document.getElementById('hero-landing-video-desktop');
  var videoMobile = document.getElementById('hero-landing-video-mobile');
  var heroTitleStage = document.getElementById('hero-title-stage');
  var heroActionsStage = document.getElementById('hero-actions-stage');
  var heroLogoStage = document.getElementById('hero-logo-stage');
  var heroFinalStamp = document.getElementById('hero-final-stamp');
  var heroContentFallback = document.getElementById('hero-content-container');
  var scrollCue = document.getElementById('hero-scroll-cue');
  var progressFill = document.getElementById('hero-progress-line-fill');

  if (!heroSection || !stickyViewport) return;

  var allHeroVideos = [];
  if (videoDesktop) allHeroVideos.push(videoDesktop);
  if (videoMobile) allHeroVideos.push(videoMobile);

  allHeroVideos.forEach(function(v) {
    v.muted = true;
    v.playsInline = true;
    v.pause();
    v.preload = 'auto';
    // NOTE: do not seek here. Seeking while the file is still loading can leave
    // the element with seekable = [0,0], which makes every later scrub a no-op.
    v.__healTries = 0;
  });

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getActiveVideo() {
    return isMobile() ? (videoMobile || videoDesktop) : (videoDesktop || videoMobile);
  }

  function isVideoSeekable(video) {
    try {
      return video.seekable && video.seekable.length > 0 &&
        video.seekable.end(video.seekable.length - 1) > video.duration * 0.5;
    } catch (e) {
      return false;
    }
  }

  // Self-heal: if the browser left the video in an unseekable state, reload it once
  // and re-apply the pending target time as soon as data is available.
  function healVideo(video) {
    if (video.__healing || video.__healTries >= 4) return;
    video.__healing = true;
    video.__healTries++;
    video.load();
    var done = function() {
      video.__healing = false;
      video.pause();
      if (typeof video.__pendingTime === 'number') {
        try { video.currentTime = video.__pendingTime; } catch (e) {}
      }
    };
    video.addEventListener('loadeddata', done, { once: true });
    setTimeout(function() { video.__healing = false; }, 6000);
  }

  function performSeek(video, time) {
    video.__isSeeking = true;
    if ('fastSeek' in video) {
      try {
        video.fastSeek(time);
        return;
      } catch (e) {}
    }
    try {
      video.currentTime = time;
    } catch (e) {
      video.__isSeeking = false;
    }
  }

  function scrubVideo(video, targetSeconds) {
    if (!video || !video.duration || isNaN(video.duration)) return;
    var maxSafe = Math.max(0, video.duration - 0.02);
    var clamped = Math.max(0, Math.min(maxSafe, targetSeconds));
    video.__pendingTime = clamped;
    if (video.__healing) return;
    if (!isVideoSeekable(video)) {
      healVideo(video);
      return;
    }

    if (!video.__hasSeekListener) {
      video.__hasSeekListener = true;
      video.addEventListener('seeked', function() {
        video.__isSeeking = false;
        if (typeof video.__pendingTime === 'number' && Math.abs(video.currentTime - video.__pendingTime) > 0.015) {
          performSeek(video, video.__pendingTime);
        }
      });
    }

    if (Math.abs(video.currentTime - clamped) > 0.015) {
      if (!video.__isSeeking) {
        performSeek(video, clamped);
      }
    }
  }

  var targetProgress = 0;
  var currentProgress = 0;
  var isLoopActive = false;
  var HERO_SMOOTHING_FACTOR = 0.09;

  function computeHeroScrollProgress() {
    var rect = heroSection.getBoundingClientRect();
    var scrollDistance = heroSection.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return 0;
    var raw = -rect.top / scrollDistance;
    return Math.max(0, Math.min(1, raw));
  }

  function onScrollOrResize() {
    var newTarget = computeHeroScrollProgress();
    if (Math.abs(newTarget - targetProgress) > 0.0001) {
      targetProgress = newTarget;
      if (!isLoopActive) {
        isLoopActive = true;
        requestAnimationFrame(renderHeroLoop);
      }
    }
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });

  function renderHeroLoop() {
    var diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * HERO_SMOOTHING_FACTOR;
      applyHeroCinematicTransformation(currentProgress);
      requestAnimationFrame(renderHeroLoop);
    } else {
      currentProgress = targetProgress;
      applyHeroCinematicTransformation(currentProgress);
      isLoopActive = false;
    }
  }

  var heroOverlay = document.querySelector('.event-hero-overlay');

  function applyHeroCinematicTransformation(p) {
    // 1. Scrub video: develops smoothly almost to the very end of the scroll (p = 0.97)
    // Allows full slow-motion ingredients, shaking, pouring, ice, shaker bounce, and bloom to play out!
    var VIDEO_END = 0.97;
    var video = getActiveVideo();
    if (video && video.duration) {
      var maxTime = Math.max(0, video.duration - 0.02);
      var videoNorm = Math.min(1, p / VIDEO_END);
      var targetTime = videoNorm * maxTime;
      scrubVideo(video, targetTime);
    }

    // 2. Subtle camera zoom on video layer & final stamp (1.02 -> 1.08)
    var zoomP = Math.min(1, p / VIDEO_END);
    var scale = (1.02 + zoomP * 0.06).toFixed(4);
    allHeroVideos.forEach(function(v) {
      if (v) v.style.transform = 'scale(' + scale + ')';
    });
    if (heroFinalStamp) {
      heroFinalStamp.style.transform = 'scale(' + scale + ')';
    }

    // 3. EDITORIAL TITLE CHOREOGRAPHY (Solo early mid-scroll, completely gone before mixology pour)
    // - Phase 1 (0.00 -> 0.06): Pure clean video. Title hidden.
    // - Phase 2 (0.06 -> 0.16): Title fades in solo ("HAZ QUE TU EVENTO SEA MÁS LUCKY.")
    // - Phase 3 (0.16 -> 0.36): Title stays fully visible alone in center.
    // - Phase 4 (0.36 -> 0.46): Title dissolves / fades out cleanly.
    // - Phase 5 (0.46 -> 0.93): Title completely gone. Video plays completely uninterrupted!
    if (heroTitleStage) {
      if (p < 0.06) {
        heroTitleStage.style.opacity = '0';
        heroTitleStage.style.transform = 'translate(-50%, calc(-50% + 35px)) scale(0.96)';
        heroTitleStage.style.pointerEvents = 'none';
      } else if (p < 0.16) {
        var inNorm = (p - 0.06) / 0.10; // 0 -> 1
        var yIn = (1 - inNorm) * 35;
        var sIn = 0.96 + inNorm * 0.04;
        heroTitleStage.style.opacity = inNorm.toFixed(3);
        heroTitleStage.style.transform = 'translate(-50%, calc(-50% + ' + yIn.toFixed(1) + 'px)) scale(' + sIn.toFixed(3) + ')';
        heroTitleStage.style.pointerEvents = 'none';
      } else if (p <= 0.36) {
        heroTitleStage.style.opacity = '1';
        heroTitleStage.style.transform = 'translate(-50%, -50%) scale(1)';
        heroTitleStage.style.pointerEvents = 'none';
      } else if (p <= 0.46) {
        var outNorm = (p - 0.36) / 0.10; // 0 -> 1
        var yOut = -outNorm * 35;
        var sOut = 1.0 - outNorm * 0.04;
        var opOut = (1 - outNorm).toFixed(3);
        heroTitleStage.style.opacity = opOut;
        heroTitleStage.style.transform = 'translate(-50%, calc(-50% + ' + yOut.toFixed(1) + 'px)) scale(' + sOut.toFixed(3) + ')';
        heroTitleStage.style.pointerEvents = 'none';
      } else {
        heroTitleStage.style.opacity = '0';
        heroTitleStage.style.transform = 'translate(-50%, calc(-50% - 35px)) scale(0.96)';
        heroTitleStage.style.pointerEvents = 'none';
      }
    }

    // 4. ACTIONS & CONVERSION GROUP CHOREOGRAPHY (Buttons, Subtitle, Trust Bar)
    // - Phase 1 to 3 (0.00 -> 0.93): STRICTLY HIDDEN! Full video animation plays out.
    // - Phase 4 (0.93 -> 0.97): Smooth entrance as video reaches its final climax.
    // - Phase 5 (0.97 -> 1.00): REST & INTERACTION HOLD ZONE. Fully visible, interactive.
    if (heroActionsStage) {
      if (p < 0.93) {
        heroActionsStage.style.opacity = '0';
        heroActionsStage.style.transform = 'translateX(-50%) translateY(35px)';
        heroActionsStage.style.pointerEvents = 'none';
      } else if (p < 0.97) {
        var actNorm = (p - 0.93) / 0.04; // 0 -> 1
        var actY = (1 - actNorm) * 35;
        heroActionsStage.style.opacity = actNorm.toFixed(3);
        heroActionsStage.style.transform = 'translateX(-50%) translateY(' + actY.toFixed(1) + 'px)';
        heroActionsStage.style.pointerEvents = actNorm > 0.5 ? 'auto' : 'none';
      } else {
        heroActionsStage.style.opacity = '1';
        heroActionsStage.style.transform = 'translateX(-50%) translateY(0px)';
        heroActionsStage.style.pointerEvents = 'auto';
      }
    }

    // 4a. Final-frame choreography hooks (CSS staggers children when .is-in is present)
    var finalIn = p >= 0.93;
    if (heroActionsStage) heroActionsStage.classList.toggle('is-in', finalIn);
    if (heroLogoStage) heroLogoStage.classList.toggle('is-in', finalIn);

    // 4b. Vector SVG Logo Stage (Crisp brand seal over clean background at very end)
    if (heroLogoStage) {
      if (p < 0.93) {
        heroLogoStage.style.opacity = '0';
        heroLogoStage.style.transform = 'translate(-50%, calc(-50% + 22px)) scale(0.95)';
        heroLogoStage.style.pointerEvents = 'none';
      } else if (p < 0.97) {
        var logoNorm = (p - 0.93) / 0.04; // 0 -> 1
        var logoY = (1 - logoNorm) * 22;
        var logoScale = 0.95 + logoNorm * 0.05;
        heroLogoStage.style.opacity = logoNorm.toFixed(3);
        heroLogoStage.style.transform = 'translate(-50%, calc(-50% + ' + logoY.toFixed(1) + 'px)) scale(' + logoScale.toFixed(3) + ')';
        heroLogoStage.style.pointerEvents = 'none';
      } else {
        heroLogoStage.style.opacity = '1';
        heroLogoStage.style.transform = 'translate(-50%, -50%) scale(1)';
        heroLogoStage.style.pointerEvents = 'none';
      }
    }

    // 4c. Master Final Frame Hero Stamp (Locks crystal-clear clean photo as permanent Hero)
    if (heroFinalStamp) {
      if (p < 0.93) {
        heroFinalStamp.style.opacity = '0';
      } else if (p < 0.97) {
        var stampNorm = (p - 0.93) / 0.04; // 0 -> 1 cross-fade
        heroFinalStamp.style.opacity = stampNorm.toFixed(3);
      } else {
        heroFinalStamp.style.opacity = '1';
      }
    }

    // Fallback if older markup is ever present
    if (heroContentFallback && !heroTitleStage) {
      if (p >= 0.10 && p <= 0.55) {
        heroContentFallback.style.opacity = '1';
        heroContentFallback.style.pointerEvents = 'auto';
      } else {
        heroContentFallback.style.opacity = '0';
        heroContentFallback.style.pointerEvents = 'none';
      }
    }

    // 5. Dynamic Overlay Modulation
    if (heroOverlay) {
      if (p < 0.08) {
        heroOverlay.style.opacity = '0.15';
      } else if (p < 0.20) {
        var ovIn = 0.15 + ((p - 0.08) / 0.12) * 0.38;
        heroOverlay.style.opacity = ovIn.toFixed(3);
      } else if (p <= 0.44) {
        heroOverlay.style.opacity = '0.53';
      } else if (p <= 0.56) {
        var ovOut = 0.53 - ((p - 0.44) / 0.12) * 0.38;
        heroOverlay.style.opacity = ovOut.toFixed(3);
      } else if (p <= 0.82) {
        heroOverlay.style.opacity = '0.15';
      } else {
        var ovLogo = 0.15 + Math.min(1, (p - 0.82) / 0.06) * 0.10;
        heroOverlay.style.opacity = ovLogo.toFixed(3);
      }
    }

    // 6. Scroll cue fadeout (disappears immediately as scroll begins)
    if (scrollCue) {
      if (p <= 0.04) {
        scrollCue.style.opacity = (1 - p / 0.04).toFixed(3);
        scrollCue.style.transform = 'translateX(-50%) translateY(' + (p * 30).toFixed(1) + 'px)';
      } else {
        scrollCue.style.opacity = '0';
      }
    }

    // 7. Timeline Progress line
    if (progressFill) {
      progressFill.style.width = (p * 100).toFixed(1) + '%';
    }
  }

  // Initial prime
  onScrollOrResize();
  applyHeroCinematicTransformation(0);
}

/* ==========================================================================
   4. STICKY LUXURY NAVBAR CONTROLLER
   ========================================================================== */
function initStickyNavbar() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNavbar() {
    var hero = document.getElementById('hero') || document.querySelector('.event-hero-section') || document.querySelector('.hero-section');
    if (hero) {
      var heroBottom = hero.offsetTop + hero.offsetHeight - 80;
      if (window.scrollY >= heroBottom) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    } else {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  window.addEventListener('resize', updateNavbar, { passive: true });
  updateNavbar();
}

/* ==========================================================================
   4b. MOBILE NAVIGATION DRAWER CONTROLLER
   ========================================================================== */
function initMobileMenu() {
  var menuBtn = document.getElementById('mobile-menu-btn');
  var drawer = document.getElementById('mobile-nav-drawer');
  var backdrop = document.getElementById('mobile-nav-backdrop');
  var closeBtn = document.getElementById('mobile-nav-close');
  var navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.documentElement.classList.add('menu-locked');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.documentElement.classList.remove('menu-locked');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function() {
      closeMenu();
    });
  }

  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   5. DOM INITIALIZATION
   ========================================================================== */
function initCatalogFilters() {
  var filterButtons = document.querySelectorAll('.filter-pills .filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var filter = this.getAttribute('data-filter');
      filterButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      var cards = document.querySelectorAll('#catalog-grid .luxury-glass-card, #catalog-grid .product-item');
      cards.forEach(function(card) {
        if (filter === 'all') {
          card.style.display = '';
          return;
        }
        var text = card.textContent.toLowerCase();
        var isFruit = text.indexOf('fruta') !== -1 || text.indexOf('60 gram') !== -1 || text.indexOf('manzana') !== -1 || text.indexOf('piña') !== -1 || text.indexOf('disecad') !== -1;
        var isCream = text.indexOf('crema') !== -1 || text.indexOf('whiskey cream') !== -1;
        var isCocktail = !isFruit && !isCream;

        if (filter === 'fruits' && isFruit) {
          card.style.display = '';
        } else if (filter === 'creams' && isCream) {
          card.style.display = '';
        } else if (filter === 'cocktails' && isCocktail) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initAllLuckyShaker() {
  if (window.LuckyShakerLang && typeof window.LuckyShakerLang.init === 'function') {
    window.LuckyShakerLang.init();
  }
  if (window.LuckyShakerCart && typeof window.LuckyShakerCart.init === 'function') {
    window.LuckyShakerCart.init();
  }
  if (window.LuckyShakerPDP && typeof window.LuckyShakerPDP.init === 'function') {
    window.LuckyShakerPDP.init();
  }
  initCatalogFilters();
  initPrimeStoneCinematicEngine();
  initHeroCinematicScroll();
  initStickyNavbar();
  initMobileMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllLuckyShaker);
} else {
  initAllLuckyShaker();
}

// ==========================================================================
// SILICON VALLEY MICROANIMATIONS ENGINE (Intersection Observer & Sparkles)
// ==========================================================================
function initMicroAnimations() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elementsToAnimate = document.querySelectorAll('.section-title, .section-subtitle, .event-type-card, .experience-card, .package-card, .luxury-glass-card');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Apply initial state class and per-group stagger (index within siblings, not global)
    elementsToAnimate.forEach((el) => {
      el.classList.add('animate-on-scroll');
      if (el.classList.contains('event-type-card') || el.classList.contains('experience-card') || el.classList.contains('package-card') || el.classList.contains('luxury-glass-card')) {
        const cardType = ['event-type-card', 'experience-card', 'package-card', 'luxury-glass-card'].find((c) => el.classList.contains(c));
        const siblings = Array.prototype.filter.call(el.parentElement ? el.parentElement.children : [], (c) => c.classList.contains(cardType));
        const i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${(i % 4) * 0.09}s`;
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el); // Trigger only once
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
          // Release the reveal state once finished so hover/transform styles work again
          const delay = parseFloat(el.style.transitionDelay) || 0;
          setTimeout(() => {
            el.classList.remove('animate-on-scroll', 'is-visible');
            el.style.transitionDelay = '';
          }, (delay + 1.1) * 1000);
        });
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -15% 0px" });

    elementsToAnimate.forEach(el => observer.observe(el));
  }

  // Init Sparkles Effect
  initSparkles();
  initMotionPolish();
}

// Magnetic pull on primary CTAs (fine pointers only, uses individual `translate` so hover transforms stay intact)
function initMotionPolish() {
  if (!window.matchMedia) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var targets = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .hero-primary-cta, .hero-secondary-cta, .btn-liquid-glass');

  // Subtle 3D tilt + glare tracking on product cards (CSS reads --rx/--ry/--gx/--gy)
  document.querySelectorAll('.product-item.luxury-glass-card').forEach(function (card) {
    if (card.dataset.tilt) return;
    card.dataset.tilt = '1';
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 5).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', function () {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
  targets.forEach(function (btn) {
    if (btn.dataset.magnetic) return;
    btn.dataset.magnetic = '1';
    btn.classList.add('is-magnetic');
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      btn.style.translate = (dx * 10).toFixed(1) + 'px ' + (dy * 8).toFixed(1) + 'px';
    });
    btn.addEventListener('pointerleave', function () {
      btn.style.translate = '';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMicroAnimations);
} else {
  initMicroAnimations();
}

function initSparkles() {
  // 1. Guaranteed in-memory animation styles (completely bypasses CSS cache issues)
  if (!document.getElementById('lucky-sparkle-injected-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'lucky-sparkle-injected-style';
    styleEl.textContent = `
      .sparkle-word-lucky {
        position: relative !important;
        display: inline-block !important;
      }
      .sparkle-container {
        position: absolute !important;
        top: -10px !important;
        left: -8px !important;
        right: -8px !important;
        bottom: -10px !important;
        width: calc(100% + 16px) !important;
        height: calc(100% + 20px) !important;
        pointer-events: none !important;
        z-index: 50 !important;
        overflow: visible !important;
      }
      .sparkle-svg {
        position: absolute !important;
        pointer-events: none !important;
        transform: translate(-50%, -50%) scale(0);
        transform-origin: center center !important;
        z-index: 50 !important;
        will-change: transform, opacity !important;
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 8px #FE8BBB) !important;
      }
      @keyframes sparkle-twinkle {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) rotate(0deg);
        }
        45% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.2) rotate(90deg);
        }
        75% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(0.95) rotate(140deg);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) rotate(180deg);
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 2. Find or target the word "LUCKY"
  const heroTitle = document.querySelector('.event-hero-title');
  if (!heroTitle) {
    setTimeout(initSparkles, 200);
    return;
  }

  let target = heroTitle.querySelector('.sparkle-word-lucky');
  if (!target) {
    const pinkSpan = heroTitle.querySelector('.highlight-pink') || heroTitle;
    if (pinkSpan && /LUCKY/i.test(pinkSpan.innerHTML)) {
      pinkSpan.innerHTML = pinkSpan.innerHTML.replace(/(LUCKY\.?)/i, '<span class="sparkle-word-lucky">$1</span>');
      target = heroTitle.querySelector('.sparkle-word-lucky');
    } else {
      target = pinkSpan;
    }
  }

  if (!target) return;

  // Force strict relative and inline-block positioning directly
  target.style.position = 'relative';
  target.style.display = 'inline-block';
  target.style.verticalAlign = 'baseline';

  // 3. Reset any prior containers
  target.querySelectorAll('.sparkle-container').forEach(c => c.remove());

  const container = document.createElement('div');
  container.className = 'sparkle-container';
  container.style.position = 'absolute';
  container.style.top = '-10px';
  container.style.left = '-8px';
  container.style.width = 'calc(100% + 16px)';
  container.style.height = 'calc(100% + 20px)';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '50';
  container.style.overflow = 'visible';
  target.appendChild(container);

  const colors = ['#FE8BBB', '#FFFFFF', '#FFD700', '#C4B5FD', '#FF85C0', '#FDE68A'];
  const svgPath = "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";

  // 8 autonomous stars staggered continuously
  const starCount = 8;

  function runStar(star) {
    if (!container || !container.parentElement) return;

    // Random coordinates tightly on the word LUCKY
    const x = (Math.random() * 96 + 2).toFixed(1); // 2% to 98%
    const y = (Math.random() * 80 + 10).toFixed(1); // 10% to 90%
    const size = Math.floor(Math.random() * 12) + 20; // 20px to 32px (clearly visible!)
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = (Math.random() * 0.7 + 1.1).toFixed(2); // 1.1s to 1.8s

    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = x + '%';
    star.style.top = y + '%';
    star.querySelector('path').setAttribute('fill', color);

    // Retrigger animation
    star.style.animation = 'none';
    void star.offsetWidth; // force reflow
    star.style.animation = `sparkle-twinkle ${duration}s ease-in-out forwards`;

    // When this star cycle completes, wait a moment and pop up in a new random spot!
    const nextTime = Math.round(parseFloat(duration) * 1000) + Math.floor(Math.random() * 300 + 100);
    setTimeout(() => runStar(star), nextTime);
  }

  for (let i = 0; i < starCount; i++) {
    const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    star.setAttribute("viewBox", "0 0 21 21");
    star.classList.add("sparkle-svg");
    star.style.position = 'absolute';
    star.style.width = '24px';
    star.style.height = '24px';
    star.style.transform = 'translate(-50%, -50%) scale(0)';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '50';

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", svgPath);
    path.setAttribute("fill", colors[i % colors.length]);
    star.appendChild(path);

    container.appendChild(star);

    // Stagger initial appearances so they twinkle out of sync
    setTimeout(() => runStar(star), i * 180);
  }

  console.log('✨ Lucky Shaker Sparkles Engine Active on word LUCKY (8 stars)');
}



