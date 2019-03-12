<?php
/**
 * Interactive Plugin
 *
 * Enables/disables interactive features based on config settings.
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Esther Brunner <wikidesign@gmail.com>
 * @author  Dave Lawson <dlawson@masterytech.com>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

require_once(dirname(__FILE__).'/replies.php');

/**
 * All DokuWiki plugins to extend the parser/rendering mechanism
 * need to inherit from this class
 */
class syntax_plugin_interactive_anwsers extends syntax_plugin_interactive_replies {

    /**
     * Connect pattern to lexer
     */
    function connectTo($mode) {
        if ($mode == 'base') {
            $this->Lexer->addSpecialPattern('~~ANSWER[^\r\n]*?~~', $mode, 'plugin_interactive_anwsers');
        }
    }

}
// vim:ts=4:sw=4:et:enc=utf-8:
