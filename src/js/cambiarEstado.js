

(function() {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    cambiarEstadoBotones.forEach( boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad);
    })

    async function cambiarEstadoPropiedad(event) {
        const { propiedadId: id} = event.target.dataset;
        
        const url = `/propiedades/${id}`;
        try {
            const resp = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            });

            const result = await resp.json();
            result.respuesta 
        } catch (error) {
            console.log(error);
        }
        


    }

})()