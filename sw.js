importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    'index.html',
    'css/style.css',
    'css/font-awesome/css/font-awesome.css',
    'css/font-awesome/css/font-awesome.min.css',
    'img/tiendas/aurrera.jpg',
    'img/tiendas/eleven.jpg',
    'img/tiendas/oxxo.png',
    'img/tiendas/soriana.png',
    'img/producto1.jpeg',
    'img/producto2.jpeg',
    'img/producto3.jpeg',
    'img/producto4.jpeg',
    'img/icons/putyouroffer.png',
    'js/libs/vanillatoasts.js',
    'css/vanillatoasts.css',
    'js/camara-class.js',
    'js/app.js',
    'js/sw-db.js',
    'js/sidebar.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/tether@2.0.0-beta.5/dist/js/tether.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.find.js'
];

self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache =>
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable])  );

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(resp => {
        if(resp){
            return resp;
        }else{
            // console.log(e.request.url);
            return fetch(e.request).then(newResp => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            })
        }
    })
    e.respondWith(respuesta);
})