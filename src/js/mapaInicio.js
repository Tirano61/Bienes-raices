

(function(){
    const lat =  -33.7459285;
    const lng =  -61.9672115;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);

    //! Filtros
    const filtros ={
        categoria: '',
        precio: ''
    }
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = [];
    
    //! Filtrados de categorias y precios
    categoriasSelect.addEventListener('change', e =>{
        filtros.categoria = + e.target.value;
        filtrarPropiedades();
    })
    preciosSelect.addEventListener('change', e =>{
        filtros.precio = + e.target.value;
        filtrarPropiedades();
    })


    



    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () =>{
        try {
            const url = '/api/propiedades';
            const resp = await fetch(url);
            propiedades = await resp.json();
            mostrarPropiedades(propiedades);
           
        } catch (error) {
            console.log(error);
        }
    }
    const mostrarPropiedades =  propiedades => {
        //! Limpiar markers previos
        markers.clearLayers();

        propiedades.forEach(element => {
            //! Agregar los pines
            const marker = new L.marker([element?.lat, element?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <h1 class="text-xl font-extrabold uppercase my-2">${element?.titulo}</h1>
                <img src="/uploads/${element?.imagen}" alt="Imagen de la propiedad" > 
                <p class="text-gray-600 font-bold">${element?.precio.nombre}</p>
                <p class="text-indigo-600 font-bold">${element?.categoria.nombre}</p>
                <a href="/propiedades/${element?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase  text-white">Ver Popiedad</a>

            `)

            markers.addLayer(marker);
        });
    }

    const filtrarPropiedades = async() => {
        const result = propiedades.filter( filtrarCategorias ).filter( filtrarPrecios );

        mostrarPropiedades(result);

    }
    const filtrarCategorias = (propiedad) =>{
        return filtros.categoria ? propiedad.categoriaId  === filtros.categoria : propiedades;
    }
    const filtrarPrecios  = ( propiedad ) => {
        return filtros.precio ? propiedad.precioId  === filtros.precio : propiedades;
    }
    
    
    obtenerPropiedades();
})()