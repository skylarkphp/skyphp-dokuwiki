/**
 * skylark-devices-keyboard - The keyboard  utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./keyboard"],function(a){for(var e={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,"pause/break":19,"caps lock":20,esc:27,space:32,"page up":33,"page down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,delete:46,command:91,"left command":91,"right command":93,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"num lock":144,"scroll lock":145,"my computer":182,"my calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222},o=97;o<123;o++)e[String.fromCharCode(o)]=o-32;for(o=48;o<58;o++)e[o-48]=o;for(o=1;o<13;o++)e["f"+o]=o+111;for(o=0;o<10;o++)e["numpad "+o]=o+96;return a.codes=e});
//# sourceMappingURL=sourcemaps/codes.js.map
