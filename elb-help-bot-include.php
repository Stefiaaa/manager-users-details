<?php
/**
 * ELB Help Bot — Include File
 *
 * COPY THIS FILE AS-IS. No edits needed.
 * It reads product name and URL from elb-help-bot-config.php (edit that file only).
 *
 * Add this line before </body> in your dashboard/layout:
 *   <?php require_once __DIR__ . '/elb-help-bot-include.php'; ?>
 */

if ( file_exists( __DIR__ . '/elb-help-bot-config.php' ) ) {
	require_once __DIR__ . '/elb-help-bot-config.php';
}
if ( ! isset( $elb_help_bot_product ) )    $elb_help_bot_product    = 'general';
if ( ! isset( $elb_help_bot_script_url ) ) $elb_help_bot_script_url  = 'http://localhost/Manager_users_details/scripts/elb-help-bot.js';
if ( ! isset( $elb_help_bot_show ) )       $elb_help_bot_show       = true;   // Set to isset($_SESSION['user_id']) to show only when logged in
if ( ! isset( $elb_help_bot_config_url ) ) $elb_help_bot_config_url    = '';
if ( ! isset( $elb_help_bot_analytics_url ) ) $elb_help_bot_analytics_url = '';

if ( $elb_help_bot_show && ! empty( $elb_help_bot_script_url ) ) {
	$product = htmlspecialchars( $elb_help_bot_product, ENT_QUOTES, 'UTF-8' );
	$script_url = htmlspecialchars( $elb_help_bot_script_url, ENT_QUOTES, 'UTF-8' );
?>
<!-- ELB Help Bot -->
<script>
window.productContext = { product: "<?php echo $product; ?>" };
<?php if ( ! empty( $elb_help_bot_config_url ) ) : ?>window.elbHelpBotConfigUrl = "<?php echo htmlspecialchars( $elb_help_bot_config_url, ENT_QUOTES, 'UTF-8' ); ?>";<?php endif; ?>
<?php if ( ! empty( $elb_help_bot_analytics_url ) ) : ?>window.elbHelpBotAnalyticsUrl = "<?php echo htmlspecialchars( $elb_help_bot_analytics_url, ENT_QUOTES, 'UTF-8' ); ?>";<?php endif; ?>
</script>
<script src="<?php echo $script_url; ?>"></script>
<?php
}
