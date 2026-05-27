(function () {
      // ===== Drawer Menu =====
      var hamburger = document.querySelector('.hamburger');
      var menu = document.getElementById('main-menu');
      var overlay = document.getElementById('menu-overlay');

      function setMenu(open) {
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.setAttribute('data-open', open ? 'true' : 'false');
        if (open) {
          overlay.hidden = false;
          requestAnimationFrame(function () { overlay.setAttribute('data-open', 'true'); });
        } else {
          overlay.setAttribute('data-open', 'false');
          setTimeout(function () { overlay.hidden = true; }, 250);
        }
      }

      hamburger.addEventListener('click', function () {
        var open = hamburger.getAttribute('aria-expanded') !== 'true';
        setMenu(open);
      });
      overlay.addEventListener('click', function () { setMenu(false); });
      document.querySelectorAll('[data-menu-close]').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });

      // ===== Modals =====
      function openModal(id) {
        var m = document.getElementById('modal-' + id);
        if (m) m.setAttribute('data-open', 'true');
      }
      function closeModal(m) {
        m.removeAttribute('data-open');
      }

      document.querySelectorAll('[data-modal]').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal(btn.dataset.modal); });
      });
      document.querySelectorAll('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', function () {
          var m = el.closest('.modal');
          if (m) closeModal(m);
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal[data-open="true"]').forEach(closeModal);
          if (menu.getAttribute('data-open') === 'true') setMenu(false);
        }
      });
    })();
