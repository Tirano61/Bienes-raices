

(function () {

  const lat = document.querySelector('#lat').value || -33.7459285;
  const lng = document.querySelector('#lng').value || -61.9672115;
  const mapa = L.map('mapa').setView([lat, lng], 13);
  let marker;
  //Utilizar provider y geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();


  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  // El pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan:  true
  }).addTo(mapa);
  // Detectar el movimiento del pin
  marker.on('moveend', function(event){
    marker = event.target;
    const position = marker.getLatLng();
    console.log(position);
    mapa.panTo(new L.LatLng(position.lat, position.lng));
    // obtener la información de las calles al soltar el pin
    geocodeService.reverse().latlng(position, 13).run(function(error, result){
      console.log(result);
      marker.bindPopup(result.address.LongLabel);
      // Llenar los campos
      document.querySelector('.calle').textContent = result?.address?.Address ?? '';
      document.querySelector('#calle').value = result?.address?.Address ?? '';
      document.querySelector('#lat').value = result?.latlng?.lat ?? '';
      document.querySelector('#lng').value = result?.latlng?.lng ?? '';
    })
  })

})()