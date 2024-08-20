/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\n(function(){\r\n    const lat =  -33.7459285;\r\n    const lng =  -61.9672115;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);\r\n\r\n    //! Filtros\r\n    const filtros ={\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n    let propiedades = [];\r\n    \r\n    //! Filtrados de categorias y precios\r\n    categoriasSelect.addEventListener('change', e =>{\r\n        filtros.categoria = + e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n    preciosSelect.addEventListener('change', e =>{\r\n        filtros.precio = + e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n\r\n    \r\n\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    const obtenerPropiedades = async () =>{\r\n        try {\r\n            const url = '/api/propiedades';\r\n            const resp = await fetch(url);\r\n            propiedades = await resp.json();\r\n            mostrarPropiedades(propiedades);\r\n           \r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n    const mostrarPropiedades =  propiedades => {\r\n        //! Limpiar markers previos\r\n        markers.clearLayers();\r\n\r\n        propiedades.forEach(element => {\r\n            //! Agregar los pines\r\n            const marker = new L.marker([element?.lat, element?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${element?.titulo}</h1>\r\n                <img src=\"/uploads/${element?.imagen}\" alt=\"Imagen de la propiedad\" > \r\n                <p class=\"text-gray-600 font-bold\">${element?.precio.nombre}</p>\r\n                <p class=\"text-indigo-600 font-bold\">${element?.categoria.nombre}</p>\r\n                <a href=\"/propiedades/${element?.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase  text-white\">Ver Popiedad</a>\r\n\r\n            `)\r\n\r\n            markers.addLayer(marker);\r\n        });\r\n    }\r\n\r\n    const filtrarPropiedades = async() => {\r\n        const result = propiedades.filter( filtrarCategorias ).filter( filtrarPrecios );\r\n\r\n        mostrarPropiedades(result);\r\n\r\n    }\r\n    const filtrarCategorias = (propiedad) =>{\r\n        return filtros.categoria ? propiedad.categoriaId  === filtros.categoria : propiedades;\r\n    }\r\n    const filtrarPrecios  = ( propiedad ) => {\r\n        return filtros.precio ? propiedad.precioId  === filtros.precio : propiedades;\r\n    }\r\n    \r\n    \r\n    obtenerPropiedades();\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;