

(function(){
    const lat =  -33.7459285;
    const lng =  -61.9672115;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);

    let markers = new L.FeatureGroup().addTo(mapa);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () =>{
        try {
            const url = '/api/propiedades';
            const resp = await fetch(url);
            const propiedades = await resp.json();
            mostrarPropiedades(propiedades);
           

        } catch (error) {
            console.log(error);
        }
    }
    const mostrarPropiedades =  propiedades => {
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

    obtenerPropiedades();
})()