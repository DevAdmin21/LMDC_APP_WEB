document.addEventListener("DOMContentLoaded", function(){

const ofertas = document.querySelectorAll(".oferta");

const modal = document.getElementById("modalOferta");
const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescripcion = document.getElementById("modalDescripcion");
const modalPrecio = document.getElementById("modalPrecio");
const cerrar = document.getElementById("cerrarModal");

const datosOfertas = {

agua:{
img:"Imágenes/Galeria/Ofertas/AGUA2X1.jpg",
titulo:"Tarro de agua fresca",
descripcion:`
<p>Acaba con tu sed de una vez por todas.</p>
<p>Tarro de agua fresca de <strong>350ml</strong> hecho con fruta natural.</p>
<p><strong>¡Compra 1 y llévate 2!</strong></p>
<p>No hay sed que se resista.</p>
`,
precio:"$40.00 C/U"
},

tacos:{
img:"Imágenes/Galeria/Ofertas/TACOS3X2.jpg",
titulo:"Tacos clásicos",
descripcion:`
<p>Nuestros icónicos tacos de asada y chicharrón.</p>
<p>Los tacos con el mejor sabor de todo Neza.</p>
<p><strong>¡Compra 2 y llévate 3!</strong></p>
<p>No hay apetito que se resista.</p>
`,
precio:"$30.00 C/U"
},

tabla:{
img:"Imágenes/Galeria/Ofertas/tabla.jpg",
titulo:"Tabla para compartir",
descripcion:`
<p>Tabla de carnes para <strong>3 personas</strong>.</p>
<p>La mejor selección de carnes y guarniciones.</p>
<p><strong>SOLO POR TIEMPO LIMITADO</strong></p>
<p>No hay apetito que se resista.</p>
`,
precio:"-25% de descuento<br><span style='text-decoration:line-through'>$100</span> → <strong>$75</strong>"
}

};

ofertas.forEach(oferta =>{

oferta.addEventListener("click", function(e){

e.preventDefault();

let tipo = this.dataset.oferta;

let datos = datosOfertas[tipo];

modalImg.src = datos.img;
modalTitulo.textContent = datos.titulo;
modalDescripcion.innerHTML = datos.descripcion;
modalPrecio.innerHTML = datos.precio;

modal.style.display="flex";

});

});

cerrar.onclick=function(){
modal.style.display="none";
}

window.onclick=function(e){
if(e.target==modal){
modal.style.display="none";
}
}

});