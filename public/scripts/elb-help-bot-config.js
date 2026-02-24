/**
 * ELB Help Bot — Config File (HTML / JavaScript) v3.8.0
 *
 * COPY THIS FILE to your application. EDIT ONLY THESE VALUES.
 * No other changes needed.
 *
 * Add this line before </body> in your HTML:
 *   <script src="path/to/elb-help-bot-config.js"></script>
 *
 * ALL v3.8 features (flicker-free synchronous rendering, panel stability fix,
 * display:none CSS animation, matchedTerms safety net for TF-IDF matches,
 * Community 404 fix /topics/new → /topics?category=,
 * keyboard-proximity spell correction, broader fuzzy matching, expanded community index,
 * tag-derived scoring, lower MIN_RENDER_THRESHOLD, correct Text Fragment deep links,
 * community-aware link generation, transposition-aware spell correction,
 * plus visibility-based auto-refresh, 2-min polling, auto-synonym learning,
 * full-phrase matching, sentence-aware snippets, one-time integration guarantee,
 * 12-point precision enforcement, spell correction, "Did you mean?" banner,
 * reload button, clear search, error/retry, keyboard shortcut Ctrl+Shift+H,
 * offline detection, panel state persistence, TF-IDF semantic search, paragraph
 * anchoring, differentiated highlighting, inline content, reinforcement learning,
 * result validation, debug pipeline) are built into elb-help-bot.js. Set indexUrl to enable them.
 */
(function() {
  'use strict';

  // ==================== EDIT THESE VALUES ====================
  var product   = 'general';   // Your product: lectora, cenariovr, training-arcade, microbuilder, rockstar, rehearsal, coursemill, reviewlink, learning-creation-studio, general
  var scriptUrl = 'http://localhost/Manager_users_details/scripts/elb-help-bot.js';   // Full URL where you uploaded elb-help-bot.js
  // ============================================================

  // Optional — set if Admin gave you these URLs (leave empty if not):
  var configUrl    = '';   // Theme & product overrides JSON
  var indexUrl     = '';   // Content index JSON — REQUIRED for precision retrieval (TF-IDF, paragraph anchoring, highlighting, RL, result validation)
  var analyticsUrl = '';   // POST endpoint for query analytics
  var debugMode    = false;   // Set to true to enable debug pipeline logging in browser console

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
