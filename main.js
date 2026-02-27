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

  /*======================================================
    MENU MOBILE PREMIUM (CORRIGIDO)
  ======================================================*/
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Abrir Menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // 2. Fechar Menu no Botão X
  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // 3. Fechar Menu ao clicar em qualquer Link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });

  /*======================================================
    MODAL DE PROJETOS PREMIUM
  ======================================================*/
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
      // iOS Safari fix: overflow:hidden sozinho não funciona; usar position:fixed
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      modal.dataset.scrollY = scrollY;

      // Pega os dados do card
      const title = card.dataset.title;
      const description = card.dataset.description;
      const gallery = card.dataset.gallery ? card.dataset.gallery.split(',') : [];
      const tech = card.dataset.tech ? card.dataset.tech.split(',') : [];
      const githubLink = card.dataset.github;
      const liveLink = card.dataset.live;

      // Preenche o título
      modalTitle.textContent = title;

      // Background do hero com a primeira imagem
      if (modalHeroBg && gallery.length > 0) {
        modalHeroBg.style.backgroundImage = `url(${gallery[0]})`;
      }

      // Processa a descrição como lista de features
      if (description && description.includes('|')) {
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
      } else if (description) {
        modalDescription.innerHTML = `<p style="color: var(--text-secondary); line-height: 1.7;">${description}</p>`;
      }

      // Imagem principal
      if (gallery.length > 0) {
        modalImg.src = gallery[0];
      }

      // Links
      if (modalGithubLink && githubLink) modalGithubLink.href = githubLink;

      if (modalLiveLink) {
        if (liveLink) {
          modalLiveLink.href = liveLink;
          modalLiveLink.style.display = 'inline-flex';
        } else {
          modalLiveLink.style.display = 'none';
        }
      }

      // Lista de tecnologias (no hero)
      if (modalTechList) {
        modalTechList.innerHTML = '';
        tech.forEach(t => {
          const li = document.createElement('li');
          li.textContent = t.trim();
          modalTechList.appendChild(li);
        });
      }

      // Thumbnails da galeria
      if (modalThumbnails && gallery.length > 0) {
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
      }
    };

    const closeModal = () => {
      modal.classList.remove('active');
      // Restaura a posição de scroll exata antes de abrir o modal
      const scrollY = parseInt(modal.dataset.scrollY || '0');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };

    // Event listeners
    projectCards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /*======================================================
    CARROSSEL DE PROJETOS
  ======================================================*/
  const projectsGrid = document.getElementById('projects-grid');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (projectsGrid && prevBtn && nextBtn) {
    const scrollAmount = 320 + 24; // Largura do card + gap

    const updateCarouselButtons = () => {
      const maxScrollLeft = projectsGrid.scrollWidth - projectsGrid.clientWidth;
      prevBtn.disabled = projectsGrid.scrollLeft < 10;
      nextBtn.disabled = projectsGrid.scrollLeft > maxScrollLeft - 10;
    };

    prevBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    projectsGrid.addEventListener('scroll', updateCarouselButtons);
    window.addEventListener('load', updateCarouselButtons);
  }

  /*======================================================
    EFEITO DE DIGITAÇÃO (TYPEWRITER)
  ======================================================*/
  function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const heroEducation = document.querySelector('.hero-education');

    if (!heroTitle || !heroEducation) return;

    // Remove qualquer cursor antigo antes de começar
    const oldCursor = heroTitle.querySelector('.hero-cursor');
    if (oldCursor) oldCursor.remove();

    const titleText = heroTitle.textContent.trim() || "Leonardo de Souza";
    const educationText = heroEducation.textContent.trim() || "Desenvolvedor Full Stack";
    
    const typeSpeed = 120;
    const subtitleSpeed = 75;
    const initialDelay = 800;

    heroTitle.textContent = '';
    heroEducation.textContent = '';
    heroTitle.style.opacity = 1;
    heroEducation.style.opacity = 1;

    const type = (element, text, speed, callback) => {
      let i = 0;
      element.innerHTML = '<span class="hero-cursor"></span>';

      const typingInterval = setInterval(() => {
        if (i < text.length) {
          const cursor = element.querySelector('.hero-cursor');
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
        const cursor = heroTitle.querySelector('.hero-cursor');
        if(cursor) cursor.remove(); 
        type(heroEducation, educationText, subtitleSpeed, null);
      });
    }, initialDelay);
  }
  
  // Impede que o Typewriter rode duas vezes
  if(!window.typeWriterRodou) {
      typeWriterEffect();
      window.typeWriterRodou = true;
  }

  /*======================================================
    ANIMAÇÃO DOS NÚMEROS DAS ESTATÍSTICAS
  ======================================================*/
  const statsSection = document.querySelector('.stats');

  if (statsSection) {
    const animateCounter = (element) => {
      const target = +element.getAttribute('data-target');
      const hasPlus = element.getAttribute('data-plus') === 'true';
      const duration = 2000;
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * target);
        
        element.textContent = currentValue;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          element.textContent = target;
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
              numberEl.dataset.animated = 'true';
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
  }

  /*======================================================
    ANIMAÇÃO DE SCROLL (REVEAL)
  ======================================================*/
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  /*======================================================
    ANO DINÂMICO NO FOOTER
  ======================================================*/
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  console.log("JS carregado com sucesso! Menu Mobile e Modal funcionando.");

  /*======================================================
    SCROLL SPY — ACTIVE NAV LINK
  ======================================================*/
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const activateNavLink = () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach(l => l.classList.remove('active'));
        if (matchingLink) matchingLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });
  activateNavLink();

  /*======================================================
    HEADER SCROLL EFFECT
  ======================================================*/
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 80) {
      header && header.classList.add('scroll-header');
    } else {
      header && header.classList.remove('scroll-header');
    }
  }, { passive: true });

  /*======================================================
    BACK TO TOP BUTTON
  ======================================================*/
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /*======================================================
    CURSOR SPOTLIGHT
  ======================================================*/
  const spotlight = document.getElementById('cursor-spotlight');

  if (spotlight) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateSpotlight = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      spotlight.style.left = currentX + 'px';
      spotlight.style.top = currentY + 'px';
      requestAnimationFrame(animateSpotlight);
    };

    animateSpotlight();
  }

  /*======================================================
    MODAL DE CONTATO
  ======================================================*/
  const contactModal = document.getElementById('contact-modal');
  const openContactModalBtn = document.getElementById('open-contact-modal');
  const closeContactModalBtn = document.getElementById('close-contact-modal');
  const contactModalOverlay = document.getElementById('contact-modal-overlay');

  const openContactModal = () => {
    if (contactModal) {
      contactModal.classList.add('active');
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      contactModal.dataset.scrollY = scrollY;
    }
  };

  const closeContactModal = () => {
    if (contactModal) {
      contactModal.classList.remove('active');
      const scrollY = parseInt(contactModal.dataset.scrollY || '0');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
  };

  if (openContactModalBtn) openContactModalBtn.addEventListener('click', openContactModal);
  if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', closeContactModal);
  if (contactModalOverlay) contactModalOverlay.addEventListener('click', closeContactModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
      closeContactModal();
    }
  });

  /*======================================================
    CONTACT FORM (FORMSPREE)
  ======================================================*/
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enviando...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          formSuccess.classList.add('visible');
          setTimeout(() => {
            formSuccess.classList.remove('visible');
            closeContactModal();
          }, 3000);
        } else {
          alert('Erro ao enviar. Tente pelo email diretamente: leosouzadevs@gmail.com');
        }
      } catch {
        alert('Sem conexão. Tente pelo email: leosouzadevs@gmail.com');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});