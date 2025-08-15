// Garante que a página sempre carregue no topo
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", function () {
  // Força o scroll para o topo. O setTimeout ajuda a garantir que isso
  // aconteça depois de qualquer tentativa de restauração de scroll do navegador.
  setTimeout(() => window.scrollTo(0, 0), 10);

  /*=============== MOSTRAR MENU ===============*/
  const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show-menu');
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  function linkAction() {
    if (navMenu.classList.contains('show-menu')) {
      navMenu.classList.remove('show-menu');
    }
  }
  navLinks.forEach(n => n.addEventListener('click', linkAction));

  /*=============== LIGHTBOX DE PROJETOS ===============*/
  const lightbox = document.getElementById('project-lightbox');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const projectCards = document.querySelectorAll('.project-card');

  // Verifica se todos os elementos essenciais do lightbox existem
  if (lightbox && lightboxCloseBtn && lightboxOverlay && projectCards.length > 0) {
    const lightboxImg = document.getElementById('lightbox-main-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxTechList = document.getElementById('lightbox-tech');
    const lightboxThumbnailsContainer = document.getElementById('lightbox-thumbnails');
    const lightboxGithubLink = document.getElementById('lightbox-github-link');

    const openLightbox = (card) => {
      // 1. Mostra o lightbox e o loader imediatamente
      lightbox.classList.add('active', 'loading');
      document.body.style.overflow = 'hidden';

      // 2. Popula o conteúdo. O setTimeout permite que o navegador renderize o loader primeiro.
      setTimeout(() => {
        // Pega os dados do card clicado usando os atributos data-*
        const title = card.dataset.title;
        const description = card.dataset.description;
        const gallery = card.dataset.gallery.split(',');
        const tech = card.dataset.tech.split(',');
        const githubLink = card.dataset.github;

        // Preenche o lightbox com os dados do projeto
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxImg.src = gallery[0];
        lightboxGithubLink.href = githubLink;

        // Limpa e cria a lista de tecnologias
        lightboxTechList.innerHTML = '';
        tech.forEach(t => {
          const listItem = document.createElement('li');
          listItem.textContent = t;
          lightboxTechList.appendChild(listItem);
        });

        // Limpa e cria as miniaturas (thumbnails) da galeria
        lightboxThumbnailsContainer.innerHTML = '';
        gallery.forEach((imgSrc, index) => {
          const thumb = document.createElement('img');
          thumb.src = imgSrc;
          thumb.alt = `Miniatura ${index + 1} do projeto ${title}`;
          thumb.addEventListener('click', () => {
            lightboxImg.src = imgSrc;
            const currentActive = lightboxThumbnailsContainer.querySelector('img.active');
            if (currentActive) currentActive.classList.remove('active');
            thumb.classList.add('active');
          });
          if (index === 0) thumb.classList.add('active');
          lightboxThumbnailsContainer.appendChild(thumb);
        });

        // 3. Remove o estado de loading para revelar o conteúdo
        lightbox.classList.remove('loading');
      }, 250); // Um pequeno delay para a transição
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active', 'loading'); // Garante que a classe de loading seja removida
      document.body.style.overflow = ''; // Restaura o scroll da página
    };

    projectCards.forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Adiciona a funcionalidade de fechar com a tecla 'Escape'
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /*=============== CARROSSEL ===============*/
  const projectsGrid = document.getElementById('projects-grid');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (projectsGrid && prevBtn && nextBtn) {
    const scrollAmount = 320 + 24; // Largura do card + gap

    const updateCarouselButtons = () => {
      const maxScrollLeft = projectsGrid.scrollWidth - projectsGrid.clientWidth;
      // Desativa o botão 'prev' se estiver no início (com uma pequena tolerância)
      prevBtn.disabled = projectsGrid.scrollLeft < 10;
      // Desativa o botão 'next' se estiver no fim (com uma pequena tolerância)
      nextBtn.disabled = projectsGrid.scrollLeft > maxScrollLeft - 10;
    };

    prevBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    });

    nextBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    });

    projectsGrid.addEventListener('scroll', updateCarouselButtons);
    window.addEventListener('load', updateCarouselButtons); // Verifica o estado inicial
  }

  /* ==================== EFEITO DE DIGITAÇÃO (TYPEWRITER) ==================== */
  function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const heroEducation = document.querySelector('.hero-education');

    if (!heroTitle || !heroEducation) return;

    const titleText = heroTitle.textContent.trim();
    const educationText = heroEducation.textContent.trim();
    const typeSpeed = 120;
    const subtitleSpeed = 75;
    const initialDelay = 800; // Atraso inicial para começar a digitar

    // Limpa o texto original e garante que os elementos estejam visíveis
    heroTitle.textContent = '';
    heroEducation.textContent = '';
    heroTitle.style.opacity = 1;
    heroEducation.style.opacity = 1;

    const type = (element, text, speed, callback) => {
      let i = 0;
      // Adiciona o cursor piscando no início
      element.innerHTML = '<span class="hero-cursor"></span>';

      const typingInterval = setInterval(() => {
        if (i < text.length) {
          const cursor = element.querySelector('.hero-cursor');
          // Insere o texto antes do cursor
          if (cursor) {
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
          }
          i++;
        } else {
          clearInterval(typingInterval);
          if (callback) callback();
        }
      }, speed);
    };

    setTimeout(() => {
      type(heroTitle, titleText, typeSpeed, () => {
        heroTitle.querySelector('.hero-cursor')?.remove(); // Remove o cursor do título
        type(heroEducation, educationText, subtitleSpeed, null); // Inicia a digitação do subtítulo
      });
    }, initialDelay);
  }
  typeWriterEffect();

  /* ==================== ANIMAÇÃO DOS NÚMEROS DAS ESTATÍSTICAS ==================== */
  const statsSection = document.querySelector('.stats');

  if (statsSection) {
    // Animação de contagem usando requestAnimationFrame para melhor performance e suavidade
    const animateCounter = (element) => {
      const target = +element.getAttribute('data-target');
      const hasPlus = element.getAttribute('data-plus') === 'true';
      const duration = 2000; // Duração da animação em milissegundos
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * target);
        
        element.textContent = currentValue;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          element.textContent = target; // Garante que o valor final seja exato
          if (hasPlus) {
            element.textContent += '+';
          }
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statsNumbers = entry.target.querySelectorAll('.stats-number');
          statsNumbers.forEach(numberEl => {
            if (!numberEl.dataset.animated) {
              animateCounter(numberEl);
              numberEl.dataset.animated = 'true'; // Marca como animado para não repetir
            }
          });
          observer.unobserve(entry.target); // Para de observar após animar
        }
      });
    }, { threshold: 0.4 }); // Inicia quando 40% da seção estiver visível

    observer.observe(statsSection);
  }

  /* ==================== ANIMAÇÃO DE SCROLL (REVEAL) ==================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Para de observar após a animação
      }
    });
  }, {
    threshold: 0.1 // Inicia quando 10% do elemento está visível
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Apenas para garantir que o script está sendo executado
  console.log("JS carregado com sucesso!");
});
