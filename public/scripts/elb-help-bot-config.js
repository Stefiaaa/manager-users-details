/**
 * ELB Assistant — Config File v4.9.0
 *
 * HOW TO USE:
 * 1. Copy this file + elb-help-bot.js to your website folder.
 * 2. Set your product slug below (line 18).
 * 3. Add before </body>:  <script src="elb-help-bot-config.js"></script>
 *
 * Product slugs:  lectora | cenariovr | training-arcade | microbuilder
 *                 rockstar | rehearsal | coursemill | reviewlink
 *                 learning-creation-studio | general
 */
(function() {
  'use strict';

  // ==================== EDIT THESE VALUES ====================

  var product   = 'general';           // Your product slug (see list above)
  var scriptUrl = '/scripts/elb-help-bot.js';   // Path to elb-help-bot.js

  // ============================================================

  // ==================== OPTIONAL ====================

  var indexUrl     = '';    // Custom content-index.json path (leave empty for built-in)
  var configUrl    = '';    // Theme/product overrides JSON URL
  var analyticsUrl = '';    // POST endpoint for query analytics
  var debugMode    = false; // true = show debug logs in Console

  // ==================================================

  var version = '4.9.0';
  window.productContext = { product: product };
  if (configUrl)    window.elbHelpBotConfigUrl = configUrl;
  if (indexUrl)     window.elbHelpBotIndexUrl = indexUrl;
  if (analyticsUrl) window.elbHelpBotAnalyticsUrl = analyticsUrl;
  if (debugMode)    window.elbHelpBotDebug = true;

  var s = document.createElement('script');
  s.src = scriptUrl + '?v=' + version;
  s.async = false;
  (document.body || document.documentElement).appendChild(s);
})();
