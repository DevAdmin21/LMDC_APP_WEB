document.addEventListener("DOMContentLoaded", function(){
const barriles = document.querySelectorAll(".barril");
const modal = document.getElementById("modalBarril");

const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescripcion = document.getElementById("modalDescripcion");
const modalPrecio = document.getElementById("modalPrecio");

const cerrar = document.getElementById("cerrarModal");


const datosBarriles = {

jupiter:{
img:"Imágenes/Barriles/GIGANT1.png",
titulo:"BARRIL JUPITER",
descripcion:`
<p><strong>100% Acero Inoxidable</strong></p>
<p>Medidas: 60 cms de diámetro y 90 cms de altura.</p>
<p>Capacidad: Hasta 60 libras de carne.</p>
<p>Garantía de hasta 5 años en el material.</p>
<p>Perfecto para asados familiares.</p>
<p>Extras: 24 ganchos y 2 garfios de herramienta.</p>
`,
precio:"$1,379.900"
},

olympus:{
img:"Imágenes/Barriles/GRAND.png",
titulo:"BARRIL OLYMPUS",
descripcion:`
<p><strong>100% Acero Inoxidable</strong></p>
<p>Medidas: 50 cms de diámetro y 85 cms de altura.</p>
<p>Capacidad: Hasta 50 libras de carne.</p>
<p>Garantía de hasta 5 años en el material.</p>
<p>Perfecto para asados familiares.</p>
<p>Extras: 12 ganchos y 2 garfios.</p>
`,
precio:"$1,099.900"
},

marte:{
img:"Imágenes/Barriles/MEDIAN.png",
titulo:"BARRIL MARTE",
descripcion:`
<p><strong>100% Acero Inoxidable</strong></p>
<p>Medidas: 40 cms de diámetro y 75 cms de altura.</p>
<p>Capacidad: Hasta 25 libras de carne.</p>
<p>Garantía de hasta 5 años.</p>
<p>Perfecto para asados familiares.</p>
<p>Extras: 12 ganchos y 2 garfios.</p>
`,
precio:"$819.900"
},

mercury:{
img:"Imágenes/Barriles/PQÑO.png",
titulo:"BARRIL MERCURY",
descripcion:`
<p><strong>100% Acero Inoxidable</strong></p>
<p>Medidas: 30 cms de diámetro y 67 cms de altura.</p>
<p>Capacidad: hasta 15 libras de carne</p>
<p>Garantía de hasta 5 años</p>
<p>Perfecto para asados familiares</p>
<p>Extras: 12 ganchos y 2 garfios</p>
`,
precio:"$679.900"
}

};


barriles.forEach(barril =>{

barril.addEventListener("click", function(e){

e.preventDefault();

let tipo = this.dataset.barril;

let datos = datosBarriles[tipo];

modalImg.src = datos.img;
modalTitulo.textContent = datos.titulo;
modalDescripcion.innerHTML = datos.descripcion;
modalPrecio.textContent = datos.precio;

modal.style.display="flex";

});

});


cerrar.onclick = function(){
modal.style.display="none";
}


window.onclick = function(e){
if(e.target==modal){
modal.style.display="none";
}
}
});