

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

            const { resultado } = await resp.json();
            if(resultado){
                if(event.target.classList.contains('bg-yellow-100')){
                    event.target.classList.add('bg-green-100', 'text-green-800');
                    event.target.classList.remove('bg-yellow-100', 'text-yellow-800');
                    event.target.textContent = 'Publicado';
                }else{
                    event.target.classList.remove('bg-green-100', 'text-green-800');
                    event.target.classList.add('bg-yellow-100', 'text-yellow-800');
                    event.target.textContent = 'No Publicado';
                }
            }
        } catch (error) {
            console.log(error);
        }
        


    }

})()