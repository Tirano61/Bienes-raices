
import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, //! Quita el subir los archivos en automatico
    addRemoveLinks: true, //! Agrega el link para quitar el archivo
    dictRemoveFile: 'Quitar Archivo',
    dictMaxFilesExceeded: 'La cantidad es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this;
        const botonPublicar = document.querySelector('#publicar');

        botonPublicar.addEventListener('click', function(){
            dropzone.processQueue();
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-propiedades';
            }
        })
    }
}