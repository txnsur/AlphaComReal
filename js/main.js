(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc; // Almacena la URL del video
        
        // Cuando se haga clic en el botón para reproducir el video
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src"); // Obtén la URL desde el atributo data-src
        });

        // Cuando el modal se muestra (abre)
        $('#videoModal').on('shown.bs.modal', function (e) {
            // Inserta la URL del video en el iframe y agrega parámetros para autoplay
            $("#video").attr('src', $videoSrc + "?autoplay=1&modestbranding=1&showinfo=0");
        });

        // Cuando el modal se oculta (cierra)
        $('#videoModal').on('hide.bs.modal', function (e) {
            // Limpia la URL del iframe para detener el video
            $("#video").attr('src', '');
        });
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        center: true,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);


    // Function para Leer más
    document.addEventListener("DOMContentLoaded", function () {
        // Área de Servicios
        const btnMoreServices = document.getElementById("btn-more-services");
        const additionalServices = document.getElementById("additional-services");

        btnMoreServices.addEventListener("click", function () {
            toggleContent(additionalServices, btnMoreServices);
        });

        // Área de Soluciones
        const btnMoreSolutions = document.getElementById("btn-more-solutions");
        const additionalSolutions = document.getElementById("additional-solutions");

        btnMoreSolutions.addEventListener("click", function () {
            toggleContent(additionalSolutions, btnMoreSolutions);
        });

        // Áreas Diversas
        const btnMoreDiverse = document.getElementById("btn-more-diverse");
        const additionalDiverse = document.getElementById("additional-diverse");

        btnMoreDiverse.addEventListener("click", function () {
            toggleContent(additionalDiverse, btnMoreDiverse);
        });

        // Área de cobertura
        const btnMoreCoverage = document.getElementById("btn-more-coverage");
        const additionalCoverage = document.getElementById("additional-coverage");

        btnMoreCoverage.addEventListener("click", function () {
            toggleContent(additionalCoverage, btnMoreCoverage);
        });

        // Función para alternar la visibilidad del contenido adicional
        function toggleContent(contentElement, buttonElement) {
            if (contentElement.style.display === "none" || contentElement.style.display === "") {
                contentElement.style.display = "block";
                buttonElement.textContent = "Leer menos";
            } else {
                contentElement.style.display = "none";
                buttonElement.textContent = "Leer más";
            }
        }
    });

    

    // Function para el enviar los datos al formulario en correo
    document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();
    
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
    
        const mailtoLink = `mailto:alphacomtj@gmail.com?subject=Mensaje de ${name}&body=Nombre: ${name}%0AEmail: ${email}%0AMensaje: ${message}`;
    
        window.location.href = mailtoLink;
    });
    


   

    
    