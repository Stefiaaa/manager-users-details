/**
 * ELB Help Bot — Config File (HTML / JavaScript)
 *
 * COPY THIS FILE to your application. EDIT ONLY THESE 2 VALUES.
 * No other changes needed.
 *
 * Add this line before </body> in your HTML:
 *   <script src="path/to/elb-help-bot-config.js"></script>
 *   e.g. <script src="scripts/elb-help-bot-config.js"></script>
 *
 * Product slugs: lectora, cenariovr, training-arcade, microbuilder, rockstar,
 * rehearsal, coursemill, reviewlink, learning-creation-studio, general
 */
(function() {
  'use strict';

  // ==================== EDIT THESE 2 VALUES ====================
  var product = 'general';   // Your product slug (see table in integration guide)
  // Full URL where you uploaded elb-help-bot.js. If same origin, use origin + path:
  var scriptUrl = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? (window.location.origin + '/scripts/elb-help-bot.js')
    : 'https://your-site.com/scripts/elb-help-bot.js';
  // ============================================================

  // Optional — set if Admin gave you these URLs (leave empty if not):
  var configUrl = '';
  var analyticsUrl = '';

  window.productContext = { product: product };
  if (configUrl) window.elbHelpBotConfigUrl = configUrl;
  if (analyticsUrl) window.elbHelpBotAnalyticsUrl = analyticsUrl;

  var s = document.createElement('script');
  s.src = scriptUrl;
  s.async = false;
  (document.body || document.documentElement).appendChild(s);
})();
