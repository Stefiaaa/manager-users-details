/**
 * ELB Help Bot — Config File (HTML / JavaScript) v3.13.0
 *
 * COPY THIS FILE to your application. EDIT ONLY THESE VALUES.
 * No other changes needed.
 *
 * Add this line before </body> in your HTML:
 *   <script src="path/to/elb-help-bot-config.js"></script>
 *
 * ALL v3.13 features (redesigned Quick Actions card UI with Community
 * "New Post" direct link to topics/create, product Quick Start Guides
 * with tag badges, built-in content index, zero-config auto-discovery,
 * flicker-free rendering, spell correction, TF-IDF semantic search,
 * paragraph anchoring, differentiated highlighting, inline content,
 * reinforcement learning, result validation, debug pipeline, and all
 * prior v3.x features) are built into elb-help-bot.js.
 *
 * NO INDEX CONFIGURATION NEEDED: The content index is built into the
 * chatbot script. It works immediately with zero configuration.
 * Optionally set indexUrl to override with your own custom index.
 */
(function() {
  'use strict';

  // ==================== EDIT THESE VALUES ====================
  var product   = 'general';   // Your product: lectora, cenariovr, training-arcade, microbuilder, rockstar, rehearsal, coursemill, reviewlink, learning-creation-studio, general
  var scriptUrl = 'http://localhost/Manager_users_details/scripts/elb-help-bot.js';   // URL or path to elb-help-bot.js (relative or absolute)
  // ============================================================

  // Optional — set ONLY if you have custom overrides:
  var configUrl    = '';   // Theme & product overrides JSON
  var indexUrl     = '';   // Leave empty to use built-in index, or set a custom index URL
  var analyticsUrl = '';   // POST endpoint for query analytics
  var debugMode    = false; // Set to true for debug pipeline logging

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
