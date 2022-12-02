const db = new PouchDB('ofertas');
var remoteCouch = false;

db.changes({
    since: 'now',
    live: true,
}).on('change', verOfertas);

function guardarOfertas(oferta){
    db.post(oferta);
}

db.info().then(function (result) {
    console.log(result)
    if(result.doc_count == 0){
        db.bulkDocs([
            {lat: 16.9126959, lng: -92.0984754, mensaje: 'Las manzanas estan muy baratas, les recomiendo ir a comprarlas', tienda: 'soriana', foto: 'img/producto1.jpeg', fecha: '2/12/2022'},
            {lat: 16.9126959, lng: -92.0984754, mensaje: 'Encontré esta crema para cafe en polvo al 2x1', tienda: 'aurrera', foto: 'img/producto4.jpeg', fecha: '2/12/2022'},
            {lat: 16.9126959, lng: -92.0984754, mensaje: 'Mayonesa la costeña con 10% de descuento, ya quedan pocas', tienda: 'oxxo', foto: 'img/producto3.jpeg', fecha: '2/12/2022'},
            {lat: 16.9126959, lng: -92.0984754, mensaje: 'Salsa valentina a solo 9 pesos, rapido que se acaban', tienda: 'eleven', foto: 'img/producto2.jpeg', fecha: '2/12/2022'}
        ])
    }
})

function verOfertas(){
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        repintarOfertas(doc.rows);
    });
}
verOfertas()

function repintarOfertas(ofertas){
    var listaOfertas = $('.lista-productos');
    listaOfertas.html('');
    ofertas.forEach(function(oferta){
        console.log(oferta.doc);
        let {doc: {tienda, mensaje, foto, lat, lng, fecha}} = oferta
        crearProductoCard(tienda, mensaje, foto, lat, lng, fecha);
    })
}

function repintarFiltros(ofertas){
    var listaOfertas = $('.lista-productos');
    listaOfertas.html('');
    ofertas.forEach(function (oferta){
        let {tienda, mensaje, foto, lat, lng, fecha} = oferta;
        crearProductoCard(tienda, mensaje, foto, lat, lng, fecha);
    })
}

function filtrarOfertar(tienda){
    db.find({
        selector: {tienda: tienda},
        fields: ['_id','tienda', 'mensaje', 'foto', 'lat', 'lng', 'fecha'],
    }).then(function (result) {
        repintarFiltros(result.docs)
    }).catch(function (err) {
        console.log(err);
    });
}