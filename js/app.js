var url = window.location.href;
var swLocation = '/PutYourOffer/sw.js';

if ( navigator.serviceWorker ) {

    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    navigator.serviceWorker.register( swLocation);
}

var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';

var listaProductos = $('.lista-productos');
var loaderLocation = $('.loader-location');

var contenedorCamara = $('.camara-contenedor');
var contenedorMapa = $('.mapa-view');

var postOffer = $('#btn-post-offer');

var botonTomarFoto = $('#btn-tomar-foto');
var fotoForm = $('#btnPhoto');
var locationForm = $('#btnLocation');

var btnCloseModal = $('#btn-modal-publicar');
var btnSidebar = $('#btn-sidebar');

// filtros
var btnFiltro = $('.btn-filtro');

var lat = null
var lng = null
var foto = null

// Inputs formulario
var tiendaInput = $('#tiendas-select');
var mensajeInput = $('#mensaje');

const camara = new Camara($('#player')[0]);

function tipoDispositivo() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
};

function seleccionarTienda(value){
    let tiendas = {
        soriana: {
            name: 'Soriana',
            logo: 'soriana.png',
        },
        aurrera: {
            name: 'Bodega Aurrera',
            logo: 'aurrera.jpg'
        },
        oxxo: {
            name: 'Oxxo',
            logo: 'oxxo.png'
        },
        eleven: {
            name: '7-Eleven',
            logo: 'eleven.jpg'
        }
    }

    return tiendas[value];
}

function crearProductoCard(tienda, mensaje, fotoDB, latItem, lngItem, fecha){

    let tiendaSelect = seleccionarTienda(tienda)
    
    let contenido = `
    <div class="col-sm-1 col-md-6 col-lg-4 mt-4">
        <div class="card">
            <img src="${fotoDB}" class="card__image" alt="" />
            <div class="card__overlay">
            <div class="card__header">
                <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
                <!-- <img class="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" /> -->
                <img class="card__thumb" src="img/tiendas/${tiendaSelect.logo}" alt="" />
                <div class="card__header-text">
                <h3 class="card__title">${tiendaSelect.name}</h3>            
                <span class="card__status">${fecha}</span>
            </div>
            <i class="icon_down_card fa fa-arrow-down" aria-hidden="true"></i>
            </div>
            <p class="card__description">${mensaje}</p>
            <button type="button" class="btn btn-danger w-100" onclick="showLocation(${latItem}, ${lngItem})" data-toggle="modal" data-target="#locationModal" data-whatever="@mdo">Ver ubicación</button>
            </div>
        </div>   
    </div>
    `
    btnShowLocation = $('.btn-show-location');
    listaProductos.append(contenido);
}

function formMostrarMapa(lat, lng){
    contenedorMapa.html('');

    let contenido = `
        <iframe
        width="100%"
        height="250"
        frameborder="0"
        src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
        </iframe>
    `;
    contenedorMapa.append(contenido)
    locationForm.addClass('field-success')
}

function showLocation(latLocation, lngLocation) {
    let location = $('#location-view');
    location.html('');
    let contenido = `
        <iframe
        width="100%"<
        height="250"
        frameborder="0"
        src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ latLocation },${ lngLocation }&zoom=17" allowfullscreen>
        </iframe>
    `;
    location.append(contenido)
}

fotoForm.click(function () {
    botonTomarFoto.removeClass('btn-oculto');
    contenedorCamara.removeClass('btn-oculto');
    let device = tipoDispositivo();
    camara.encender(device);
})

locationForm.click(function () {
    loaderLocation.addClass('lds-ripple')
    navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos);
        loaderLocation.removeClass('lds-ripple')
        formMostrarMapa(pos.coords.latitude, pos.coords.longitude);

        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
    })
})

botonTomarFoto.click(function () {
    foto = camara.tomarFoto();

    camara.apagar();
    botonTomarFoto.addClass('btn-oculto');
    fotoForm.addClass('field-success')

    console.log(foto);
})

postOffer.click(function (){
    if(mensajeInput.val() == ''){
        alert('Debes escribir un mensaje')
        return;
    }
    if(fotoForm.hasClass('field-success') /*&& locationForm.hasClass('field-success')*/){
        let date = new Date(Date.now())
        let fecha = date.toLocaleDateString()
        crearProductoCard(tiendaInput.val(), mensajeInput.val(), foto, lat, lng, fecha);
        let oferta = {
            tienda: tiendaInput.val(),
            mensaje: mensajeInput.val(),
            foto: foto,
            lat: lat,
            lng: lng,
            fecha: fecha
        }
        guardarOfertas(oferta)
        foto = null;
        lat = null;
        lng = null;
        mensajeInput.val('')
        btnCloseModal.click()
        contenedorCamara.addClass('btn-oculto')
        contenedorMapa.html('')
        fotoForm.removeClass('field-success');
        locationForm.removeClass('field-success');
        return;
    }
    alert('Falta foto y ubicación')
})


btnFiltro.click(function (e) {
    let tienda = $(this).attr('filtro-val')
    filtrarOfertar(tienda)
    btnSidebar.click();
})

function isOnline(){
    if(navigator.onLine){
        VanillaToasts.create({
            title: 'Online',
            text: 'Ya tienes internet, ahora puedes publicar',
            icon: '../img/icons/putyouroffer.png',
            type: 'success',
            timeout: 3000,
        });
    }else{
        console.log('offline');
        VanillaToasts.create({
            title: 'Offline',
            text: 'Por el momento no puedes publicar ofertas, solo verlas',
            icon: '../img/icons/putyouroffer.png',
            type: 'error', 
            timeout: 3000,
        });
    }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

// isOnline();//Para que siempre se dispare