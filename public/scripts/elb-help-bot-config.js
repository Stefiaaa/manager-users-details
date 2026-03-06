/**
 * ELB Assistant — Config File v4.17.0
 *
 * HOW TO USE:
 * 1. Copy this file + elb-help-bot.js to your website folder.
 * 2. Set your product slug below (line 20).
 * 3. Add before </body>:  <script src="elb-help-bot-config.js"></script>
 *
 * Product slugs:  lectora | cenariovr | training-arcade | microbuilder
 *                 rockstar | rehearsal | coursemill | reviewlink
 *                 learning-creation-studio | general
 *
 * Position values: bottom-right | bottom-left | top-right | top-left
 *   Or custom: { top: 20, right: 30 }  (pixel offsets from edges)
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

  // ==================== THEME / PLACEMENT ====================
  // Set position to one of: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  // Or provide a custom config URL with theme.position set.
  var position    = 'bottom-right';

  // ==================================================

  var version = '4.17.0';
  window.productContext = { product: product };
  window.elbHelpBotConfig = window.elbHelpBotConfig || {};
  window.elbHelpBotConfig.theme = window.elbHelpBotConfig.theme || {};
  if (position) window.elbHelpBotConfig.theme.position = position;
  if (configUrl)    window.elbHelpBotConfigUrl = configUrl;
  if (indexUrl)     window.elbHelpBotIndexUrl = indexUrl;
  if (analyticsUrl) window.elbHelpBotAnalyticsUrl = analyticsUrl;
  if (debugMode)    window.elbHelpBotDebug = true;

  var s = document.createElement('script');
  s.src = scriptUrl + '?v=' + version;
  s.async = false;
  (document.body || document.documentElement).appendChild(s);
})();
