// Garante que a página sempre carregue no topo
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Remove hash da URL ao carregar
if (window.location.hash) {
  history.replaceState(null, null, window.location.pathname);
}

// Força scroll para o topo imediatamente
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", function () {
  // Força o scroll para o topo novamente após o DOM carregar
  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 50);
  setTimeout(() => window.scrollTo(0, 0), 150);

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

  /*=============== MODAL DE PROJETOS PREMIUM ===============*/
  const modal = document.getElementById('project-lightbox');
  const modalCloseBtn = document.getElementById('lightbox-close');
  const modalOverlay = document.getElementById('lightbox-overlay');
  const projectCards = document.querySelectorAll('.project-card');

  if (modal && modalCloseBtn && modalOverlay && projectCards.length > 0) {
    const modalImg = document.getElementById('lightbox-main-image');
    const modalTitle = document.getElementById('lightbox-title');
    const modalDescription = document.getElementById('lightbox-description');
    const modalTechList = document.getElementById('lightbox-tech');
    const modalThumbnails = document.getElementById('lightbox-thumbnails');
    const modalGithubLink = document.getElementById('lightbox-github-link');
    const modalLiveLink = document.getElementById('lightbox-live-link');
    const modalHeroBg = document.getElementById('modal-hero-bg');

    const openModal = (card) => {
      // Ativa o modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Pega os dados do card
      const title = card.dataset.title;
      const description = card.dataset.description;
      const gallery = card.dataset.gallery.split(',');
      const tech = card.dataset.tech.split(',');
      const githubLink = card.dataset.github;
      const liveLink = card.dataset.live;

      // Preenche o título
      modalTitle.textContent = title;

      // Background do hero com a primeira imagem
      if (modalHeroBg) {
        modalHeroBg.style.backgroundImage = `url(${gallery[0]})`;
      }

      // Processa a descrição como lista de features
      if (description.includes('|')) {
        const topics = description.split('|').map(topic => topic.trim());
        const maxInitialTopics = 4;
        const hasMoreTopics = topics.length > maxInitialTopics;

        const visibleTopics = topics.slice(0, maxInitialTopics);
        const hiddenTopics = topics.slice(maxInitialTopics);

        let topicsHTML = '<ul class="project-topics">';
        topicsHTML += visibleTopics.map(topic => `<li class="topic-visible">${topic}</li>`).join('');

        if (hasMoreTopics) {
          topicsHTML += hiddenTopics.map(topic => `<li class="topic-hidden">${topic}</li>`).join('');
          topicsHTML += '</ul>';
          topicsHTML += `<button class="show-more-btn" id="show-more-topics">
            <span>Ver todas as ${topics.length} funcionalidades</span>
            <i class="bx bx-chevron-down"></i>
          </button>`;
        } else {
          topicsHTML += '</ul>';
        }

        modalDescription.innerHTML = topicsHTML;

        // Evento do botão "Ver mais"
        if (hasMoreTopics) {
          setTimeout(() => {
            const showMoreBtn = document.getElementById('show-more-topics');
            if (showMoreBtn) {
              showMoreBtn.addEventListener('click', () => {
                const hiddenItems = modalDescription.querySelectorAll('.topic-hidden');
                hiddenItems.forEach(item => {
                  item.classList.remove('topic-hidden');
                  item.classList.add('topic-visible');
                });
                showMoreBtn.style.display = 'none';
              });
            }
          }, 0);
        }
      } else {
        modalDescription.innerHTML = `<p style="color: var(--text-secondary); line-height: 1.7;">${description}</p>`;
      }

      // Imagem principal
      modalImg.src = gallery[0];

      // Links
      modalGithubLink.href = githubLink;

      if (liveLink) {
        modalLiveLink.href = liveLink;
        modalLiveLink.style.display = 'inline-flex';
      } else {
        modalLiveLink.style.display = 'none';
      }

      // Lista de tecnologias (no hero)
      modalTechList.innerHTML = '';
      tech.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.trim();
        modalTechList.appendChild(li);
      });

      // Thumbnails da galeria
      modalThumbnails.innerHTML = '';
      gallery.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `Screenshot ${index + 1}`;
        thumb.addEventListener('click', () => {
          modalImg.src = imgSrc;
          if (modalHeroBg) {
            modalHeroBg.style.backgroundImage = `url(${imgSrc})`;
          }
          modalThumbnails.querySelectorAll('img').forEach(img => img.classList.remove('active'));
          thumb.classList.add('active');
        });
        if (index === 0) thumb.classList.add('active');
        modalThumbnails.appendChild(thumb);
      });
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Event listeners
    projectCards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
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

  /* ==================== ANO DINÂMICO NO FOOTER ==================== */
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Apenas para garantir que o script está sendo executado
  console.log("JS carregado com sucesso!");
});
