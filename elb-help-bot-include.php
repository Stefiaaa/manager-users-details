<?php
/**
 * ELB Help Bot — Include File v3.16.0
 *
 * COPY THIS FILE AS-IS. No edits needed.
 * It reads product name and URL from elb-help-bot-config.php (edit that file only).
 *
 * Add this line before </body> in your dashboard/layout:
 *   <?php require_once __DIR__ . '/elb-help-bot-include.php'; ?>
 *
 * ALL v3.16 features are automatically available. The content index is
 * built into elb-help-bot.js — no external index file needed.
 */

if ( file_exists( __DIR__ . '/elb-help-bot-config.php' ) ) {
	require_once __DIR__ . '/elb-help-bot-config.php';
}
if ( ! isset( $elb_help_bot_product ) )        $elb_help_bot_product        = 'general';
if ( ! isset( $elb_help_bot_script_url ) )     $elb_help_bot_script_url     = 'http://localhost/Manager_users_details/scripts/elb-help-bot.js';
if ( ! isset( $elb_help_bot_show ) )           $elb_help_bot_show           = true;
if ( ! isset( $elb_help_bot_config_url ) )     $elb_help_bot_config_url     = '';
if ( ! isset( $elb_help_bot_index_url ) )      $elb_help_bot_index_url      = '';
if ( ! isset( $elb_help_bot_analytics_url ) )  $elb_help_bot_analytics_url  = '';
if ( ! isset( $elb_help_bot_debug ) )          $elb_help_bot_debug          = false;

if ( $elb_help_bot_show && ! empty( $elb_help_bot_script_url ) ) {
	$product    = htmlspecialchars( $elb_help_bot_product, ENT_QUOTES, 'UTF-8' );
	$script_url = htmlspecialchars( $elb_help_bot_script_url, ENT_QUOTES, 'UTF-8' );
?>
<!-- ELB Help Bot v3.16 — Acronym-aware search, balanced UI, draggable panel, built-in index, precision retrieval -->
<script>
window.productContext = { product: "<?php echo $product; ?>" };
<?php if ( ! empty( $elb_help_bot_config_url ) ) : ?>window.elbHelpBotConfigUrl = "<?php echo htmlspecialchars( $elb_help_bot_config_url, ENT_QUOTES, 'UTF-8' ); ?>";<?php endif; ?>
<?php if ( ! empty( $elb_help_bot_index_url ) ) : ?>window.elbHelpBotIndexUrl = "<?php echo htmlspecialchars( $elb_help_bot_index_url, ENT_QUOTES, 'UTF-8' ); ?>";<?php endif; ?>
<?php if ( ! empty( $elb_help_bot_analytics_url ) ) : ?>window.elbHelpBotAnalyticsUrl = "<?php echo htmlspecialchars( $elb_help_bot_analytics_url, ENT_QUOTES, 'UTF-8' ); ?>";<?php endif; ?>
<?php if ( $elb_help_bot_debug ) : ?>window.elbHelpBotDebug = true;<?php endif; ?>
</script>
<script src="<?php echo $script_url; ?>"></script>
<?php
}
