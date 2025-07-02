
document.addEventListener('DOMContentLoaded', () => {
    console.log('¡La página del blog de moda se ha cargado completamente!');


    const images = document.querySelectorAll('.carousel-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let current = 0;
    let interval;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    function nextImage() {
        current = (current + 1) % images.length;
        showImage(current);
    }

    function prevImage() {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    }

    function startCarousel() {
        interval = setInterval(nextImage, 4000);
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    if (prevBtn && nextBtn && images.length > 0) {
        prevBtn.addEventListener('click', () => {
            stopCarousel();
            prevImage();
            startCarousel();
        });

        nextBtn.addEventListener('click', () => {
            stopCarousel();
            nextImage();
            startCarousel();
        });

        showImage(current);
        startCarousel();
    }

    const articleTitles = document.querySelectorAll('.card h3 a');
    articleTitles.forEach(titleLink => {
        titleLink.addEventListener('mouseenter', () => {
            titleLink.style.color = '#b794f4';
        });
        titleLink.addEventListener('mouseleave', () => {
            titleLink.style.color = ''; 
        });
    });

    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('sticky-header');
        } else {
            header.classList.remove('sticky-header');
        }
    });
});


