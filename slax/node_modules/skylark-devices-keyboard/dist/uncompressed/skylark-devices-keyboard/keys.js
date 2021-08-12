define([
	"./keyboard"
],function(keyboard){
	var keys = {};
	/**
	 * TAB key
	 * @attribute TAB
	 * @type {Number}
	 */
	keys.TAB = 9;

	/**
	 * ENTER key
	 * @attribute ENTER
	 * @type {Number}
	 */
	keys.ENTER = 13;

	/**
	 * SHIFT key
	 * @attribute SHIFT
	 * @type {Number}
	 */
	keys.SHIFT = 16;

	/**
	 * CTRL key
	 * @attribute CTRL
	 * @type {Number}
	 */
	keys.CTRL = 17;

	/**
	 * ALT key
	 * @attribute ALT
	 * @type {Number}
	 */
	keys.ALT = 18;

	/**
	 * CAPS_LOCK key
	 * @attribute CAPS_LOCK
	 * @type {Number}
	 */
	keys.CAPS_LOCK = 20;

	/**
	 * ESC key
	 * @attribute ESC
	 * @type {Number}
	 */
	keys.ESC = 27;

	/**
	 * SPACEBAR key
	 * @attribute SPACEBAR
	 * @type {Number}
	 */
	keys.SPACEBAR = 32;

	/**
	 * PAGE_UP key
	 * @attribute PAGE_UP
	 * @type {Number}
	 */
	keys.PAGE_UP = 33;

	/**
	 * PAGE_DOWN key
	 * @attribute PAGE_DOWN
	 * @type {Number}
	 */
	keys.PAGE_DOWN = 34;

	/**
	 * END key
	 * @attribute END
	 * @type {Number}
	 */
	keys.END = 35;

	/**
	 * HOME key
	 * @attribute HOME
	 * @type {Number}
	 */
	keys.HOME = 36;

	/**
	 * INSERT key
	 * @attribute INSERT
	 * @type {Number}
	 */
	keys.INSERT = 45;

	/**
	 * DEL key
	 * @attribute DEL
	 * @type {Number}
	 */
	keys.DEL = 46;

	/**
	 * LEFT key
	 * @attribute LEFT
	 * @type {Number}
	 */
	keys.LEFT = 37;

	/**
	 * RIGHT key
	 * @attribute RIGHT
	 * @type {Number}
	 */
	keys.RIGHT = 39;

	/**
	 * UP key
	 * @attribute UP
	 * @type {Number}
	 */
	keys.UP = 38;

	/**
	 * DOWN key
	 * @attribute DOWN
	 * @type {Number}
	 */
	keys.DOWN = 40;

	/**
	 * NUM0 key
	 * @attribute NUM0
	 * @type {Number}
	 */
	keys.NUM0 = 48;

	/**
	 * NUM1 key
	 * @attribute NUM1
	 * @type {Number}
	 */
	keys.NUM1 = 49;

	/**
	 * NUM2 key
	 * @attribute NUM2
	 * @type {Number}
	 */
	keys.NUM2 = 50;

	/**
	 * NUM3 key
	 * @attribute NUM3
	 * @type {Number}
	 */
	keys.NUM3 = 51;

	/**
	 * NUM4 key
	 * @attribute NUM4
	 * @type {Number}
	 */
	keys.NUM4 = 52;

	/**
	 * NUM5 key
	 * @attribute NUM5
	 * @type {Number}
	 */
	keys.NUM5 = 53;

	/**
	 * NUM6 key
	 * @attribute NUM6
	 * @type {Number}
	 */
	keys.NUM6 = 54;

	/**
	 * NUM7 key
	 * @attribute NUM7
	 * @type {Number}
	 */
	keys.NUM7 = 55;

	/**
	 * NUM8 key
	 * @attribute NUM8
	 * @type {Number}
	 */
	keys.NUM8 = 56;

	/**
	 * NUM9 key
	 * @attribute NUM9
	 * @type {Number}
	 */
	keys.NUM9 = 57;

	/**
	 * A key
	 * @attribute A
	 * @type {Number}
	 */
	keys.A = 65;

	/**
	 * B key
	 * @attribute B
	 * @type {Number}
	 */
	keys.B = 66;

	/**
	 * C key
	 * @attribute C
	 * @type {Number}
	 */
	keys.C = 67;

	/**
	 * D key
	 * @attribute D
	 * @type {Number}
	 */
	keys.D = 68;

	/**
	 * E key
	 * @attribute E
	 * @type {Number}
	 */
	keys.E = 69;

	/**
	 * F key
	 * @attribute F
	 * @type {Number}
	 */
	keys.F = 70;

	/**
	 * G key
	 * @attribute G
	 * @type {Number}
	 */
	keys.G = 71;

	/**
	 * H key
	 * @attribute H
	 * @type {Number}
	 */
	keys.H = 72;

	/**
	 * I key
	 * @attribute I
	 * @type {Number}
	 */
	keys.I = 73;

	/**
	 * J key
	 * @attribute J
	 * @type {Number}
	 */
	keys.J = 74;

	/**
	 * K key
	 * @attribute K
	 * @type {Number}
	 */
	keys.K = 75;

	/**
	 * L key
	 * @attribute L
	 * @type {Number}
	 */
	keys.L = 76;

	/**
	 * M key
	 * @attribute M
	 * @type {Number}
	 */
	keys.M = 77;

	/**
	 * N key
	 * @attribute N
	 * @type {Number}
	 */
	keys.N = 78;

	/**
	 * O key
	 * @attribute O
	 * @type {Number}
	 */
	keys.O = 79;

	/**
	 * P key
	 * @attribute P
	 * @type {Number}
	 */
	keys.P = 80;

	/**
	 * Q key
	 * @attribute Q
	 * @type {Number}
	 */
	keys.Q = 81;

	/**
	 * R key
	 * @attribute R
	 * @type {Number}
	 */
	keys.R = 82;

	/**
	 * S key
	 * @attribute S
	 * @type {Number}
	 */
	keys.S = 83;

	/**
	 * T key
	 * @attribute T
	 * @type {Number}
	 */
	keys.T = 84;

	/**
	 * U key
	 * @attribute U
	 * @type {Number}
	 */
	keys.U = 85;

	/**
	 * V key
	 * @attribute V
	 * @type {Number}
	 */
	keys.V = 86;

	/**
	 * W key
	 * @attribute W
	 * @type {Number}
	 */
	keys.W = 87;

	/**
	 * X key
	 * @attribute X
	 * @type {Number}
	 */
	keys.X = 88;

	/**
	 * Y key
	 * @attribute Y
	 * @type {Number}
	 */
	keys.Y = 89;

	/**
	 * Z key
	 * @attribute Z
	 * @type {Number}
	 */
	keys.Z = 90;

	/**
	 * F1 key
	 * @attribute F1
	 * @type {Number}
	 */
	keys.F1 = 112;

	/**
	 * F2 key
	 * @attribute F2
	 * @type {Number}
	 */
	keys.F2 = 113;

	/**
	 * F3 key
	 * @attribute F3
	 * @type {Number}
	 */
	keys.F3 = 114;

	/**
	 * F4 key
	 * @attribute F4
	 * @type {Number}
	 */
	keys.F4 = 115;

	/**
	 * F5 key
	 * @attribute F5
	 * @type {Number}
	 */
	keys.F5 = 116;

	/**
	 * F6 key
	 * @attribute F6
	 * @type {Number}
	 */
	keys.F6 = 117;

	/**
	 * F7 key
	 * @attribute F7
	 * @type {Number}
	 */
	keys.F7 = 118;

	/**
	 * F8 key
	 * @attribute F8
	 * @type {Number}
	 */
	keys.F8 = 119;

	/**
	 * F9 key
	 * @attribute F9
	 * @type {Number}
	 */
	keys.F9 = 120;

	/**
	 * F10 key
	 * @attribute F10
	 * @type {Number}
	 */
	keys.F10 = 121;

	/**
	 * F11 key
	 * @attribute F11
	 * @type {Number}
	 */
	keys.F11 = 122;

	/**
	 * F12 key
	 * @attribute F12
	 * @type {Number}
	 */
	keys.F12 = 123;

	return keyboard.keys = keys;
	
});