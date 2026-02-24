<?php
/**
 * ELB Help Bot — Config File v3.16.0
 *
 * COPY THIS FILE to your application folder. EDIT ONLY THESE VALUES.
 * No other changes needed.
 *
 * ALL v3.16 features (query-isolated product-priority search, sticky starred sections,
 * direct link to topics/create, product Quick Start Guides with tag badges,
 * built-in content index, zero-config, flicker-free rendering, spell
 * correction, TF-IDF semantic search, paragraph anchoring, differentiated
 * highlighting, inline content, reinforcement learning, result validation,
 * debug pipeline) are built into elb-help-bot.js.
 *
 * NO INDEX CONFIGURATION NEEDED: The content index is built into the
 * chatbot script. It works immediately with zero configuration.
 * Optionally set $elb_help_bot_index_url to override with a custom index.
 */

$elb_help_bot_product    = 'general';   // Your product: lectora, cenariovr, training-arcade, microbuilder, rockstar, rehearsal, coursemill, reviewlink, learning-creation-studio, general
$elb_help_bot_script_url = '/scripts/elb-help-bot.js';   // URL or path to elb-help-bot.js (relative or absolute)

// Optional — set ONLY if you have custom overrides:
$elb_help_bot_config_url    = '';    // Theme & product overrides JSON
$elb_help_bot_index_url     = '';    // Leave empty to use built-in index, or set a custom index URL
$elb_help_bot_analytics_url = '';    // POST endpoint for query analytics
$elb_help_bot_debug         = false; // Set to true for debug pipeline logging
