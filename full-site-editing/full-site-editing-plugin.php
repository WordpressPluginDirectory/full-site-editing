<?php
/**
 * Plugin Name: WordPress.com Editing Toolkit
 * Description: Enhances your page creation workflow within the Block Editor.
 * Version: 4.27418
 * Author: Automattic
 * Author URI: https://automattic.com/wordpress-plugins/
 * License: GPLv2 or later
 * Text Domain: full-site-editing
 *
 * @package A8C\FSE
 */

namespace A8C\FSE;

/**
 * This file should only be used to load files needed for each subfeature.
 *
 * For example, if you are adding a new feature to this plugin called "Foo",
 * you would create a directory `./foo` to contain all code needed by your
 * feature. Then, in this file, you would add a `load_foo()` function which
 * includes your feature's files via the 'plugins_loaded' action.
 *
 * Please take care to _not_ load your feature's files if there are situations
 * which could cause bugs. For example, dotcom FSE files are only loaded if dotcom
 * FSE isactive on the site.
 *
 * Finally, don't forget to use the A8C\FSE namespace for your code. :)
 */

/**
 * Plugin version.
 *
 * Can be used in cache keys to invalidate caches on plugin update.
 *
 * Note: this constant is updated via TeamCity continuous integration. That
 * change is not copied back to VCS, so we use "dev" here to indicate that the
 * version in wp-calypso is for development.
 *
 * On WordPress.com, the version here should show up in the "info" section of
 * the "more options" menu in Gutenberg.
 *
 * @var string
 */
define( 'A8C_ETK_PLUGIN_VERSION', '4.27418' );

// Always include these helper files for dotcom FSE.
require_once __DIR__ . '/dotcom-fse/helpers.php';

// Enqueues the shared JS data stores and defines shared helper functions.
require_once __DIR__ . '/common/index.php';

/**
 * Load dotcom-FSE.
 */
function load_full_site_editing() {
	// Bail if FSE should not be active on the site. We do not
	// want to load FSE functionality on non-supported sites!
	if ( ! is_full_site_editing_active() ) {
		return;
	}
	// Not dangerous here since we have already checked for eligibility.
	dangerously_load_full_site_editing_files();
	Full_Site_Editing::get_instance();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_full_site_editing' );

/**
 * Load Posts List Block.
 */
function load_posts_list_block() {
	if ( class_exists( 'Posts_List_Block' ) ) {
		return;
	}

	/**
	 * Can be used to disable the Post List Block.
	 *
	 * @since 0.2
	 *
	 * @param bool true if Post List Block should be disabled, false otherwise.
	 */
	if ( apply_filters( 'a8c_disable_post_list_block', false ) ) {
		return;
	}

	require_once __DIR__ . '/posts-list-block/utils.php';
	require_once __DIR__ . '/posts-list-block/class-posts-list-block.php';

	Posts_List_Block::get_instance();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_posts_list_block' );

/**
 * Load Starter_Page_Templates.
 */
function load_starter_page_templates() {
	// We don't want the user to choose a template when copying a post.
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( isset( $_GET['jetpack-copy'] ) ) {
		return;
	}

	/**
	 * Can be used to disable the Starter Page Templates.
	 *
	 * @since 0.2
	 *
	 * @param bool true if Starter Page Templates should be disabled, false otherwise.
	 */
	if ( apply_filters( 'a8c_disable_starter_page_templates', false ) ) {
		return;
	}

	require_once __DIR__ . '/starter-page-templates/class-starter-page-templates.php';

	Starter_Page_Templates::get_instance();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_starter_page_templates' );

/**
 * Load Global Styles plugin.
 */
function load_global_styles() {
	require_once __DIR__ . '/global-styles/class-global-styles.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_global_styles' );

/**
 * Load Event Countdown Block.
 */
function load_countdown_block() {
	require_once __DIR__ . '/event-countdown-block/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_countdown_block' );

/**
 * Load Timeline Block.
 */
function load_timeline_block() {
	require_once __DIR__ . '/jetpack-timeline/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_timeline_block' );

/**
 * Add front-end CoBlocks gallery block scripts.
 *
 * This function performs the same enqueueing duties as `CoBlocks_Block_Assets::frontend_scripts`,
 * but for dotcom FSE header and footer content. `frontend_scripts` uses
 * `has_block` to determine if gallery blocks are present, and `has_block` is
 * not aware of content sections outside of post_content yet.
 */
function enqueue_coblocks_gallery_scripts() {
	if ( ! function_exists( 'CoBlocks' ) || ! is_full_site_editing_active() ) {
		return;
	}

	// This happens in the Customizer because we try very hard not to load things and we get a fatal
	// https://github.com/Automattic/wp-calypso/issues/36680.
	if ( ! class_exists( '\A8C\FSE\WP_Template' ) ) {
		require_once __DIR__ . '/dotcom-fse/templates/class-wp-template.php';
	}
	$template = new WP_Template();
	$header   = $template->get_template_content( 'header' );
	$footer   = $template->get_template_content( 'footer' );

	// Define where the asset is loaded from.
	$dir = CoBlocks()->asset_source( 'js' );

	// Define where the vendor asset is loaded from.
	$vendors_dir = CoBlocks()->asset_source( 'js', 'vendors' );

	// Masonry block.
	if ( has_block( 'coblocks/gallery-masonry', $header . $footer ) ) {
		wp_enqueue_script(
			'coblocks-masonry',
			$dir . 'coblocks-masonry' . COBLOCKS_ASSET_SUFFIX . '.js',
			array( 'jquery', 'masonry', 'imagesloaded' ),
			COBLOCKS_VERSION,
			true
		);
	}

	// Carousel block.
	if ( has_block( 'coblocks/gallery-carousel', $header . $footer ) ) {
		wp_enqueue_script(
			'coblocks-flickity',
			$vendors_dir . '/flickity' . COBLOCKS_ASSET_SUFFIX . '.js',
			array( 'jquery' ),
			COBLOCKS_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_coblocks_gallery_scripts' );

/**
 * Load Blog Posts block.
 */
function load_blog_posts_block() {
	// Use regex instead of static slug in order to match plugin installation also from github, where slug may contain (HASH|branch-name).
	$slug_regex    = '/newspack-blocks(-[A-Za-z0-9-]+)?\/newspack-blocks\.php/';
	$disable_block = (
		( defined( 'WP_CLI' ) && WP_CLI ) ||
		/* phpcs:ignore WordPress.Security.NonceVerification */
		( isset( $_GET['action'] ) && isset( $_GET['plugin'] ) && 'activate' === $_GET['action'] && preg_match( $slug_regex, sanitize_text_field( wp_unslash( $_GET['plugin'] ) ) ) ) ||
		preg_grep( $slug_regex, (array) get_option( 'active_plugins' ) ) ||
		preg_grep( $slug_regex, (array) get_site_option( 'active_sitewide_plugins' ) )
	);

	/**
	 * Can be used to disable the Blog Posts block.
	 *
	 * @since 0.15.1
	 *
	 * @param bool $disable_block True if Blog Posts block should be enabled, false otherwise.
	 */
	if ( apply_filters( 'a8c_disable_blog_posts_block', $disable_block ) ) {
		return;
	}

	require_once __DIR__ . '/newspack-blocks/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_blog_posts_block' );

/**
 * Load WPCOM Block Editor NUX.
 */
function load_wpcom_block_editor_nux() {
	require_once __DIR__ . '/wpcom-block-editor-nux/class-wpcom-block-editor-nux.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_wpcom_block_editor_nux' );

/**
 * Load Block Inserter Modifications module.
 */
function load_block_inserter_modifications() {
	require_once __DIR__ . '/block-inserter-modifications/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_block_inserter_modifications' );

/**
 * Load Mailerlite module.
 */
function load_mailerlite() {
	require_once __DIR__ . '/mailerlite/subscriber-popup.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_mailerlite' );

/**
 * Load WPCOM block editor nav sidebar.
 */
function load_wpcom_block_editor_sidebar() {
	if (
		( defined( 'WPCOM_BLOCK_EDITOR_SIDEBAR' ) && WPCOM_BLOCK_EDITOR_SIDEBAR ) ||
		apply_filters( 'a8c_enable_nav_sidebar', false )
	) {
		require_once __DIR__ . '/wpcom-block-editor-nav-sidebar/class-wpcom-block-editor-nav-sidebar.php';
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_wpcom_block_editor_sidebar' );

/**
 * What's New section of the Tools menu.
 */
function load_whats_new() {
	require_once __DIR__ . '/whats-new/class-whats-new.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_whats_new' );

/**
 * Error reporting for wp-admin / Gutenberg.
 */
function load_error_reporting() {
	require_once __DIR__ . '/error-reporting/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_error_reporting' );

/**
 * Tags Education
 */
function load_tags_education() {
	require_once __DIR__ . '/tags-education/class-tags-education.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_tags_education' );

/**
 * Help center
 */
function load_help_center() {
	// Only load the help center if it hasn't been loaded already by Jetpack.
	if ( class_exists( 'A8C\FSE\Help_Center' ) ) {
		return;
	}

	// disable help center in P2s.
	if (
		defined( 'IS_WPCOM' )
		&& IS_WPCOM
		&& \WPForTeams\is_wpforteams_site( get_current_blog_id() )
	) {
		return false;
	}

	// disable help center if Jetpack isn't active.
	if ( ! defined( 'IS_WPCOM' ) ) {
		// Make sure the function have been loaded.
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// This should still work if Jetpack is an mu-plugin.
		// Since this isn't running in WPCOM this shouldn't matter.
		if ( ! defined( 'JETPACK__VERSION' ) ) {
			return false;
		}
	}

	require_once __DIR__ . '/help-center/class-help-center.php';
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\load_help_center', 100 );

/**
 * Load paragraph block
 */
function load_paragraph_block() {
	require_once __DIR__ . '/paragraph-block/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_paragraph_block' );

/**
 * Override org documentation links.
 */
function load_wpcom_documentation_links() {
	require_once __DIR__ . '/wpcom-documentation-links/class-wpcom-documentation-links.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_wpcom_documentation_links' );

/**
 * Add support links to block description.
 */
function load_block_description_links() {
	require_once __DIR__ . '/wpcom-block-description-links/class-wpcom-block-description-links.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_block_description_links' );

/**
 * Load WP.com Global Styles.
 */
function load_wpcom_global_styles() {
	require_once __DIR__ . '/wpcom-global-styles/index.php';
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\load_wpcom_global_styles' );
