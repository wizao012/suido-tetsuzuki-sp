/* ---------- 設定 ---------- */
var CONFIG = {
  ZAPIER_WEBHOOK_URL: 'https://hooks.zapier.com/hooks/catch/12525485/4b448fr/',
  THANKS_PAGE: 'thanks.html',
  PARAM_KEYS: [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'placement', 'keyword', 'matchtype',
    'gclid', 'fbclid',
    'lpv'
  ]
};

/* ---------- GTM dataLayer 初期化 ---------- */
window.dataLayer = window.dataLayer || [];

/* ---------- URLパラメータをhidden inputへ ---------- */
(function captureUrlParams() {
  try {
    var params = new URLSearchParams(location.search);
    CONFIG.PARAM_KEYS.forEach(function (key) {
      var el = document.getElementById('trk-' + key);
      if (el) el.value = params.get(key) || '';
    });
    // LPパスを自動取得
    var lpPathEl = document.getElementById('trk-lp_path');
    if (lpPathEl) lpPathEl.value = location.pathname || '';
    // リファラ取得
    var referrerEl = document.getElementById('trk-referrer');
    if (referrerEl) referrerEl.value = document.referrer || '';
  } catch (e) {}
})();

/* ---------- フォーム送信（Zapier送信 + GTMイベント発火） ---------- */
(function () {
  var form = document.getElementById('lead-form');
  if (!form) return;
  var submitBtn = document.getElementById('submit-btn');
  var defaultLabel = submitBtn ? submitBtn.textContent : '送信';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
    }

    // FormDataで全項目（hidden含む）取得
    var formData = new FormData(form);
    formData.append('submitted_at', new Date().toISOString());
    formData.append('source_url', window.location.href);

    try {
      // ★重要：no-corsモード + FormData（CORSプリフライト回避）
      await fetch(CONFIG.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      // GTMへCVイベント送信
      window.dataLayer.push({ event: 'form_submit_cv' });

      // サンクスページへ
      window.location.href = CONFIG.THANKS_PAGE;
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  });
})();

/* ---------- メニュー・モーダル制御 ---------- */
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
