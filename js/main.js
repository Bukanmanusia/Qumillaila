// Global AudioContext cache for synthetic tactile click

  var audioCtx = null;

  function playTactileClickSound() {

    try {

      var AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioCtx) {

        audioCtx = new AudioContextClass();

      }

      if (audioCtx.state === 'suspended') {

        audioCtx.resume();

      }

      var now = audioCtx.currentTime;

      // 1. Primary mechanical switch pop: fast frequency drop from ~850Hz to ~120Hz

      var osc1 = audioCtx.createOscillator();

      var gain1 = audioCtx.createGain();

      osc1.type = 'triangle';

      osc1.frequency.setValueAtTime(850, now);

      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.042);

      gain1.gain.setValueAtTime(0.24, now);

      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

      osc1.connect(gain1);

      gain1.connect(audioCtx.destination);

      osc1.start(now);

      osc1.stop(now + 0.045);

      // 2. Secondary subtle latch resonance click ~14ms later for tactile physical feel

      var osc2 = audioCtx.createOscillator();

      var gain2 = audioCtx.createGain();

      osc2.type = 'sine';

      osc2.frequency.setValueAtTime(1400, now + 0.014);

      osc2.frequency.exponentialRampToValueAtTime(320, now + 0.038);

      gain2.gain.setValueAtTime(0.0001, now);

      gain2.gain.setValueAtTime(0.12, now + 0.014);

      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

      osc2.connect(gain2);

      gain2.connect(audioCtx.destination);

      osc2.start(now + 0.014);

      osc2.stop(now + 0.045);

    } catch (e) {

      // AudioContext unavailable or restricted

    }

  }

  function triggerThemeHaptics() {

    try {

      if (navigator.vibrate) {

        // Crisp tactile double-pulse mechanical vibration

        navigator.vibrate([15, 30, 20]);

      }

    } catch (e) {

      // Vibration not supported

    }

  }

  // Theme Toggle Logic

  var isDarkMode = false;

  function updateThemeUI() {
    document.documentElement.classList.toggle('dark', isDarkMode);

    var icon = document.getElementById('themeToggleIcon');
    var text = document.getElementById('themeToggleText');

    if (icon) {
      icon.classList.remove('animate-[spin_350ms_cubic-bezier(0.34,1.56,0.64,1)]');
      void icon.offsetWidth;
      icon.classList.add('animate-[spin_350ms_cubic-bezier(0.34,1.56,0.64,1)]');
      icon.innerText = isDarkMode ? 'dark_mode' : 'light_mode';
    }

    if (text) text.innerText = isDarkMode ? 'DARK' : 'LIGHT';
  }
  function toggleTheme() {

    // 1. Play tactile mechanical click sound via Web Audio API

    playTactileClickSound();

    // 2. Trigger mobile tactile vibration

    triggerThemeHaptics();

    // 3. Switch theme state and update UI

    isDarkMode = !isDarkMode;

    updateThemeUI();

  }

  function openPreviewModal() {

    var modal = document.getElementById('previewModal');

    if (modal) {

      modal.classList.remove('hidden');

      document.body.classList.add('overflow-hidden');

    }

  }

  function closePreviewModal() {

    var modal = document.getElementById('previewModal');

    if (modal) {

      modal.classList.add('hidden');

      var orderModal = document.getElementById('orderModal');

      if (!orderModal || orderModal.classList.contains('hidden')) {

        document.body.classList.remove('overflow-hidden');

      }

    }

  }

  function openOrderModal() {

    var modal = document.getElementById('orderModal');

    if (modal) {

      modal.classList.remove('hidden');

      document.body.classList.add('overflow-hidden');

    }

  }

  function closeOrderModal() {

    var modal = document.getElementById('orderModal');

    if (modal) {

      modal.classList.add('hidden');

      var previewModal = document.getElementById('previewModal');

      if (!previewModal || previewModal.classList.contains('hidden')) {

        document.body.classList.remove('overflow-hidden');

      }

    }

  }

  document.addEventListener('click', function (event) {
    var actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    switch (actionTarget.dataset.action) {
      case 'toggleTheme': toggleTheme(); break;
      case 'openOrderModal': openOrderModal(); break;
      case 'openPreviewModal': openPreviewModal(); break;
      case 'closeOrderModal': closeOrderModal(); break;
      case 'closePreviewModal': closePreviewModal(); break;
      case 'orderFromPreview': closePreviewModal(); openOrderModal(); break;
    }
  });

  // Keyboard navigation: Escape to close modals

  document.addEventListener('keydown', function(e) {

    if (e.key === 'Escape') {

      closeOrderModal();

      closePreviewModal();

    }

  });
