/**
 * ELB Assistant — Config File (HTML / JavaScript) v4.4.0
 *
 * HOW TO USE THIS FILE:
 * 1. Copy this file along with elb-help-bot.js to your website folder.
 * 2. Edit ONLY the two values in the "EDIT THESE VALUES" section below.
 * 3. Add this line before </body> in your HTML page:
 *      <script src="elb-help-bot-config.js"></script>
 *
 * That's it — the ELB Assistant will appear on your page.
 *
 * The content index (article database) is already built into elb-help-bot.js.
 * No additional index file is needed unless you want to use your own custom articles.
 */
(function() {
  'use strict';

  // ==================== EDIT THESE VALUES ====================

  var product   = 'general';           // Your product slug (see INSTRUCTIONS.md for the full list)
  var scriptUrl = '/scripts/elb-help-bot.js';   // Path to elb-help-bot.js (change if it is in a different folder)

  // ============================================================


  // ==================== OPTIONAL — change only if needed ====================

  var indexUrl     = '';    // Path or URL to your custom content-index.json (leave empty to use the built-in index)
  var configUrl    = '';    // URL to a theme/product overrides JSON file (rarely needed)
  var analyticsUrl = '';    // POST endpoint URL for query analytics (rarely needed)
  var debugMode    = false; // Set to true to enable troubleshooting logs in the browser Console

  // =========================================================================


  window.productContext = { product: product };
  if (configUrl)    window.elbHelpBotConfigUrl = configUrl;
  if (indexUrl)     window.elbHelpBotIndexUrl = indexUrl;
  if (analyticsUrl) window.elbHelpBotAnalyticsUrl = analyticsUrl;
  if (debugMode)    window.elbHelpBotDebug = true;

  var s = document.createElement('script');
  s.src = scriptUrl;
  s.async = false;
  (document.body || document.documentElement).appendChild(s);
})();
