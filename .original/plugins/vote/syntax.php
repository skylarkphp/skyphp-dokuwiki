<?php
/**
 * Vote Plugin: allows to create simple votes
 *
 * @license	GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author	Esther Brunner <wikidesign@gmail.com>
 * @author	Gina Häußge, Michael Klier
 * @author	Norihiro Tobo
 */
 
if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'syntax.php');
 
 
class syntax_plugin_vote extends DokuWiki_Syntax_Plugin {
 
 
function getInfo(){
	return confToHash(dirname(__FILE__).'/INFO');
}
function getType(){ return 'substition'; }
function getPType(){ return 'block'; }
function getSort(){ return 168; }
function connectTo( $mode ) {
	$this->Lexer->addSpecialPattern( '<vote.*?>.+?</vote>',  $mode, 'plugin_vote' );
}
 
 
 
function handle( $match, $state, $pos, &$handler ){
 
	$data = $match; 
	//$this->_debug_out( 'vote_debug', $data );
 
	// Extract Title and Param
	preg_match( '/<vote\s+(.*?)[\s>]/s', $data, $regx_result );
	$title = htmlspecialchars( $regx_result[1] );
	if( ! isset( $title ) ) { return NULL; }

	preg_match( '/<vote\s+.*?\s+(.*?)>/s', $data, $regx_result );
	$param = htmlspecialchars( $regx_result[1] );

	preg_match( '/<vote.*?>\n(.*?)\n\*/s', $data, $regx_result );
	$question = htmlspecialchars( $regx_result[1] );

	//$this->_debug_out( 'vote_debug1', "\n:$title:$param:$question:\n" );


	// Extract options
	$data = strip_tags( $data );
	preg_match_all( '/^\*\s*(.*?)\n/m', $data, $regex_result );
	foreach( $regex_result[1] as $option ) {
		$options[] = htmlspecialchars( trim( $option ) );
	}
 
	$this->_create_vote_log_file( $title, $options );
 
	return array( $title, $param, $question, $options );
}
 
 
 
function render( $mode, &$renderer, $data ) {
 
 
	$ouotput = "";
	if ( $mode != 'xhtml' ){ return FALSE; }
 
	// Parse data
	list( $title, $param, $question, $options ) = $data;
	$renderer->info['cache'] = false;
	$vote_log =  $this->_read_vote_log( $title );
 
	//Print header parts
	$output .= '<fieldset class="vote">'.'<legend>'.$title.'</legend>';
	$output .= "\n";
	if ( $question ) {
		$output .= '<div>'.$question.'</div>';
	}
 	$output .= "\n";
	
	//Update vote log
	if ( $_REQUEST['vote'] &&
		$this->_user_check( $vote_log, $param ) ){
				
		$vote = $_REQUEST['vote'];
	
   		foreach( $options as $option ) {
						
			if ( $vote == $option ) { 
				$vote_log[ 'results' ][ $option ] += 1;
				$vote_log[ 'votes' ] += 1;
				$vote_log[ 'ips' ][] = clientIP( true );
				global $USERINFO; 				
				$vote_log[ 'users' ][] = $USERINFO['name'];				
			}
		}
 
		$this->_write_vote_log( $title, $vote_log );
	}
 
	// display vote form
	$output .= $this->_print_vote_form( $vote_log );
	$output .= '</fieldset>';
	$output .= "\n";

	$renderer->doc .= $output;
	return true;
 
}
 
 
 
function _user_check( $vote_log, $param ) {
 
	if( preg_match( '/check=(\w+)/s', $param, $regex_result )  > 0 ) {
		$check = $regex_result[1];	
	} else {
		return TRUE;
	}

	switch( $check ) {

		case "ip":		
			$ip = clientIP( true );
			if ( isset( $vote_log['ips'] ) && in_array( $ip, $vote_log['ips'] ) ) {
				return FALSE;
			}
		break;
	
		case "user":
			global $USERINFO; 
			$user = $USERINFO['name'];	
			if ( isset( $vote_log['users'] ) && in_array( $user, $vote_log['users'] ) ) {
				return FALSE;
			}
		break;
	}

	return TRUE;
 
}
 
 
 
function _create_vote_log_file( $title, $options ) {
 
	$vote_log_file = metaFN( md5( $title ), '.vote' );
 
	if( file_exists( $vote_log_file ) ){ return TRUE; }
 
	foreach( $options as $option ) {
		$vote_skelton[ 'results' ][ $option ] = 0;
	}
	$vote_skelton[ 'votes' ] = 0; 
 
	$fh = fopen( $vote_log_file, 'w' );
	fwrite( $fh, serialize( $vote_skelton ) );
	fclose( $fh );
 
	return TRUE;
 
}
 

function _debug_out( $title, $data ) {
 
	$file = metaFN( $title, '.dbg' );
	$fh = fopen( $file, 'a' );
	fwrite( $fh, $data );
	fclose( $fh );
 
	return TRUE;
 
}
 
 
function _read_vote_log( $title ) {
 
	$vote_log = NULL;
 
	$vote_log_file = metaFN( md5( $title ), '.vote' );
	$vote_log  = unserialize( @file_get_contents( $vote_log_file ) );
 
	return $vote_log;
}
 
 
 
function _write_vote_log( $title, $vote_log ) {
 
	$vote_log_file = metaFN( md5( $title ), '.vote' );
 
	$fh = fopen( $vote_log_file, 'w' );
	fwrite( $fh, serialize( $vote_log ) );
	fclose( $fh);
 
	return TRUE;
}
 
 
 
function _print_vote_form( $vote_log ){
 
	global $lang;
	global $ID;

	$total = $vote_log['votes'];
	if ( $total < 0 ) { return ''; }

	$option_count = count( $vote_log['results'] );
	$options = array_keys( (array)( $vote_log[ 'results' ] ) );
	$votes   = array_values( (array)( $vote_log[ 'results' ] ) );
	
	$ret = '<form id="vote__form" method="post" action="'.script().
		'" accept-charset="'.$lang[ 'encoding' ].'"><div align="center" class="no">'.
		'<input type="hidden" name="do" value="show" />'.
		'<input type="hidden" name="id" value="'.$ID.'" />';
	$ret .= "\n";

	$ret .= '<table class="blind" align="center">';
	$ret .= "\n";


	for ( $i = 0; $i < $option_count; $i++ ) {

		$absolute = $votes[ $i ];
		if( $total == 0 ) {
			$percent = 0;
		} else {
			$percent  = round( ( $absolute * 100 ) / $total );
		}
		
		$ret .= "\t";
		$ret .= '<tr><td align="left" colspan="3">'.$options[$i].'</td></tr>';
		$ret .= '<tr><td><div class="vote_bar">';

		if ( $percent ) {
			$ret .= '<div class="vote_full" style="width:'.( $percent * 2 ).'px">&nbsp;</div>';
		}
		//Result
		$ret .= '</div></td>'.
			'<td class="rightalign">'.$percent.'%</td>'.
			'<td class="rightalign">('.$absolute.')</td>';
		//Form
		$ret .= '<td class="rightalign"><label class="simple" for="vote__option'.$i.'">'.
			'<input type="radio" name="vote" id="vote__option'.$i.'" '.
			'value="'.$options[$i].'" /></label></td>';
		$ret .= '</tr>';
		$ret .= "\n";

	}
 
	$ret .= "</table>\n"; 
	$ret .= '<input class="button" type="submit" '.
		'value="'.$this->getLang( 'btn_vote' ).'" />';
	
	$ret .= "</div>\n</form>\n";

 
	return $ret;
}
 
} // Class Definition
 
//Setup VIM: ex: et ts=4 enc=utf-8 :