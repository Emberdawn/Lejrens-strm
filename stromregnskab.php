<?php
/**
 * Plugin Name: Strømregnskab for Forening
 * Description: Håndterer strømregnskab for beboere med indberetninger, priser og beregninger.
 * Version: 0.1.0
 * Author: Foreningen
 * Requires at least: 6.0
 * Requires PHP: 8.0
 *
 * @package Stromregnskab
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SR_PLUGIN_VERSION', '0.1.0' );
define( 'SR_PLUGIN_SLUG', 'stromregnskab' );
define( 'SR_CAPABILITY_ADMIN', 'manage_stromregnskab' );
define( 'SR_CAPABILITY_RESIDENT', 'submit_energy_reports' );
define( 'SR_PLUGIN_FILE', __FILE__ );
define( 'SR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once SR_PLUGIN_DIR . 'includes/stromregnskab-plugin.php';
