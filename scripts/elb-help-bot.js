/**
 * ELB Help Bot — Floating In-Product Help Assistant
 * Floating button (bottom-right) + panel. Search-based: customer types query → links to guides & discussions.
 * No HubSpot. No backend. ELB Learning branding.
 *
 * Security: Input validation, XSS prevention, allowlisted product slugs, HTTPS-only config.
 * Integration: window.productContext = { product: "lectora" }; + script tag
 *
 * @version 1.2.0
 * @see docs/GETTING-STARTED.md
 */
(function () {
  'use strict';

  var VERSION = '1.2.0';
  var MAX_QUERY_LENGTH = 200;
  var ALLOWED_PRODUCTS = ['lectora','cenariovr','training-arcade','microbuilder','rockstar','rehearsal','coursemill','reviewlink','learning-creation-studio','general'];

  var KB_BASE = 'https://knowledgebase.elblearning.com';
  var COMMUNITY_BASE = 'https://community.elblearning.com';
  var SUBMIT_TICKET = KB_BASE + '/submit-a-case-to-customer-solutions?hsLang=en';

  var builtIn = {
    lectora: { label: 'Lectora®', kb: '/lectora', community: 'lectora' },
    cenariovr: { label: 'CenarioVR®', kb: '/cenariovr', community: 'cenariovr' },
    'training-arcade': { label: 'The Training Arcade®', kb: '/the-training-arcade', community: 'the-training-arcade' },
    microbuilder: { label: 'MicroBuilder®', kb: '/microbuilder', community: 'microbuilder' },
    rockstar: { label: 'Rockstar Learning Platform', kb: '/rockstar-learning-platform', community: 'rockstar-learning-platform' },
    rehearsal: { label: 'Rehearsal', kb: '/rehearsal', community: 'rehearsal' },
    coursemill: { label: 'CourseMill®', kb: '/coursemill', community: 'coursemill' },
    reviewlink: { label: 'ReviewLink®', kb: '/reviewlink', community: 'reviewlink' },
    'learning-creation-studio': { label: 'The Learning Creation Studio', kb: '/the-learning-creation-studio', community: 'the-learning-creation-studio' },
    general: { label: 'General Topics', kb: '/general-topics', community: 'all-things-elearning' }
  };

  var STOP_WORDS = ['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','shall','can','need','dare','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','i','me','my','we','our','you','your','it','its','they','them','their','what','which','who','how','when','where','why'];

  function getContext() {
    var ctx = window.productContext;
    if (!ctx || typeof ctx !== 'object') return {};
    return ctx;
  }

  function validateProduct(product) {
    if (!product || typeof product !== 'string') return 'general';
    var slug = String(product).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (slug.length > 50) slug = slug.substring(0, 50);
    if (ALLOWED_PRODUCTS.indexOf(slug) >= 0) return slug;
    if (/^[a-z0-9-]+$/.test(slug)) return slug;
    return 'general';
  }

  function sanitizeQuery(query) {
    if (!query || typeof query !== 'string') return '';
    var s = String(query).trim();
    if (s.length > MAX_QUERY_LENGTH) s = s.substring(0, MAX_QUERY_LENGTH);
    return s.replace(/[<>"']/g, '');
  }

  function isValidConfigUrl(url) {
    if (!url || typeof url !== 'string') return false;
    var u = url.trim();
    return u.indexOf('https://') === 0 && u.length < 500;
  }

  function mergeProducts(custom) {
    var out = {};
    Object.keys(builtIn).forEach(function (k) { out[k] = builtIn[k]; });
    if (custom && custom.customProducts) {
      Object.keys(custom.customProducts).forEach(function (k) { out[k] = custom.customProducts[k]; });
    }
    return out;
  }

  function getProductConfig(product, config) {
    var products = mergeProducts(config);
    var base = products[product] || products.general;
    var overrides = (config && config.adminOverrides && config.adminOverrides[product]) || {};
    return {
      label: base ? base.label : product,
      kb: base ? base.kb : '/general-topics',
      community: base ? base.community : 'all-things-elearning',
      welcomeMessage: overrides.welcomeMessage || "What can we help you find? Ask anything — we'll point you to the right resources."
    };
  }

  function extractKeywords(query) {
    var safe = sanitizeQuery(query);
    if (!safe) return '';
    var words = safe.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
    var meaningful = words.filter(function (w) {
      return w.length > 1 && STOP_WORDS.indexOf(w) === -1;
    });
    return meaningful.length ? meaningful.join(' ') : safe.toLowerCase();
  }

  function buildSearchLinks(product, query, config) {
    var p = getProductConfig(product, config);
    var keywords = extractKeywords(query);
    var searchTerm = keywords || query.trim() || 'help';
    var encoded = encodeURIComponent(searchTerm);
    var kbSearchUrl = KB_BASE + p.kb + '?hsLang=en&search=' + encoded;
    var communitySearchUrl = COMMUNITY_BASE + '/topics?category=' + p.community + '&q=' + encoded + '&hsLang=en';
    var kbBrowseUrl = KB_BASE + p.kb + '?hsLang=en';
    var communityBrowseUrl = COMMUNITY_BASE + '/topics?category=' + p.community + '&hsLang=en';
    return {
      kbSearch: kbSearchUrl,
      communitySearch: communitySearchUrl,
      kbBrowse: kbBrowseUrl,
      communityBrowse: communityBrowseUrl,
      searchTerm: searchTerm
    };
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function loadConfig(cb) {
    var inline = window.zikbConfig || window.elbHelpBotConfig;
    if (inline && typeof inline === 'object' && (inline.adminOverrides || inline.products)) {
      cb(inline);
      return;
    }
    var url = window.zikbConfigUrl || window.elbHelpBotConfigUrl;
    if (isValidConfigUrl(url)) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.onload = function () {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && typeof data === 'object') cb(data);
          else cb(null);
        } catch (e) { cb(null); }
      };
      xhr.onerror = function () { cb(null); };
      xhr.ontimeout = function () { cb(null); };
      xhr.open('GET', url);
      xhr.send();
    } else {
      cb(null);
    }
  }

  function injectStyles(config) {
    if (document.getElementById('zikb-widget-styles')) return;
    var theme = (config && config.theme) || {};
    var btnColor = theme.buttonColor || '#e85d04';
    var headerColor = theme.headerColor || '#e85d04';
    var pos = theme.position || 'bottom-right';
    var isLeft = pos === 'bottom-left';
    var togglePos = 'bottom:24px;' + (isLeft ? 'left:24px' : 'right:24px');
    var panelPos = 'bottom:90px;' + (isLeft ? 'left:24px' : 'right:24px');
    var style = document.createElement('style');
    style.id = 'zikb-widget-styles';
    style.textContent = [
      '#zikb-toggle{position:fixed;' + togglePos + ';width:56px;height:56px;border-radius:50%;background:' + btnColor + ';border:none;color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:2147483646;transition:transform .2s}',
      '#zikb-toggle:hover{transform:scale(1.08)}',
      '#zikb-panel{position:fixed;' + panelPos + ';width:380px;max-height:520px;background:#ffffff;border:1px solid #e8e4df;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:2147483645;display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
      '#zikb-panel.open{display:flex}',
      '#zikb-header{padding:1rem 1.25rem;background:' + headerColor + ';color:#fff;font-weight:600;display:flex;align-items:center;justify-content:space-between;font-size:1rem}',
      '#zikb-close{background:0;border:0;color:rgba(255,255,255,.95);cursor:pointer;font-size:1.4rem;padding:.2rem;line-height:1}',
      '#zikb-close:hover{color:#fff}',
      '#zikb-body{padding:1.25rem;overflow-y:auto;flex:1;background:#faf8f5;color:#333}',
      '#zikb-msg{font-size:.9rem;color:#5a5a5a;margin-bottom:1rem;line-height:1.5}',
      '#zikb-search-wrap{display:flex;gap:.5rem;margin-bottom:1rem}',
      '#zikb-search-input{flex:1;padding:.75rem 1rem;border:1px solid #e0ddd8;border-radius:6px;font-size:.95rem;font-family:inherit;background:#fff}',
      '#zikb-search-input:focus{outline:0;border-color:#e85d04;box-shadow:0 0 0 2px rgba(232,93,4,.15)}',
      '#zikb-search-btn{padding:.75rem 1rem;background:#e85d04;color:#fff;border:none;border-radius:6px;font-weight:500;cursor:pointer;font-size:.9rem}',
      '#zikb-search-btn:hover{background:#d35400}',
      '#zikb-results{display:flex;flex-direction:column;gap:.5rem}',
      '.zikb-link{display:block;padding:.75rem 1rem;background:#fff;border:1px solid #e8e4df;border-radius:6px;color:#c24a00;font-size:.9rem;text-decoration:none;transition:all .2s}',
      '.zikb-link:hover{background:#fff8f5;border-color:#e85d04;color:#d35400}',
      '.zikb-link.kb{border-left:4px solid #e85d04}',
      '.zikb-link.community{border-left:4px solid #f26322}',
      '.zikb-link.ticket{border-left:4px solid #d35400}',
      '.zikb-fallback{font-size:.85rem;color:#777;margin-top:.75rem;padding-top:.75rem;border-top:1px solid #e8e4df}'
    ].join('');
    document.head.appendChild(style);
  }

  function render() {
    var ctx = getContext();
    var product = validateProduct(ctx && ctx.product);

    loadConfig(function (config) {
      var p = getProductConfig(product, config);
      injectStyles(config);

      var panel = document.getElementById('zikb-panel');
      var toggle = document.getElementById('zikb-toggle');
      if (!panel) {
        toggle = document.createElement('button');
        toggle.id = 'zikb-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Open help');
        toggle.setAttribute('title', 'Help');
        toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
        panel = document.createElement('div');
        panel.id = 'zikb-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Knowledge Base & Community Help');
        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        toggle.addEventListener('click', function () { panel.classList.toggle('open'); });
        document.addEventListener('click', function (e) {
          if (panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('open');
          }
        });
      }

      function showResults(query) {
        var links = buildSearchLinks(product, query, config);
        var hasQuery = query && query.trim().length > 0;
        var resultsHtml = '';

        if (hasQuery) {
          resultsHtml +=
            '<a class="zikb-link kb" href="' + links.kbSearch.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">Find answers about "' + esc(links.searchTerm) + '"</a>' +
            '<a class="zikb-link community" href="' + links.communitySearch.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">See what others share about "' + esc(links.searchTerm) + '"</a>' +
            '<div class="zikb-fallback">Explore more resources:</div>';
        }
        resultsHtml +=
          '<a class="zikb-link kb" href="' + links.kbBrowse.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">Explore ' + esc(p.label) + ' guides</a>' +
          '<a class="zikb-link community" href="' + links.communityBrowse.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">Connect with ' + esc(p.label) + ' peers</a>' +
          '<a class="zikb-link ticket" href="' + SUBMIT_TICKET.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">Get personalized support</a>';

        panel.querySelector('#zikb-results').innerHTML = resultsHtml;
      }

      panel.innerHTML =
        '<div id="zikb-header">' +
        '  <span>How can we help?</span>' +
        '  <button id="zikb-close" type="button" aria-label="Close">×</button>' +
        '</div>' +
        '<div id="zikb-body">' +
        '  <div id="zikb-msg">' + esc(p.welcomeMessage) + '</div>' +
        '  <div id="zikb-search-wrap">' +
        '    <input id="zikb-search-input" type="text" placeholder="What would you like to know?" autocomplete="off">' +
        '    <button id="zikb-search-btn" type="button">Find</button>' +
        '  </div>' +
        '  <div id="zikb-results"></div>' +
        '</div>';

      showResults('');

      var input = panel.querySelector('#zikb-search-input');
      var btn = panel.querySelector('#zikb-search-btn');

      function doSearch() {
        var q = sanitizeQuery(input.value);
        input.value = q;
        showResults(q);
        var analyticsUrl = window.elbHelpBotAnalyticsUrl || window.zikbAnalyticsUrl;
        if (q && analyticsUrl && typeof analyticsUrl === 'string' && analyticsUrl.indexOf('https://') === 0) {
          try {
            var payload = JSON.stringify({ product: product, query: q, timestamp: new Date().toISOString() });
            var xhr = new XMLHttpRequest();
            xhr.open('POST', analyticsUrl);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.timeout = 3000;
            xhr.send(payload);
          } catch (e) {}
        }
      }

      btn.addEventListener('click', doSearch);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doSearch();
      });

      panel.querySelector('#zikb-close').addEventListener('click', function () {
        panel.classList.remove('open');
      });
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  }

  init();
})();
