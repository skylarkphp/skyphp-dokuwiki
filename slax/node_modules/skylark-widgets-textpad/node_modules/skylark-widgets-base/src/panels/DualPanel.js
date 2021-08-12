define([
	"../base",
	"./Panel"
],function( base, Panel){
	"use strict";


	var DualPanel = Panel.inherit({
		"klassName" : "DualPanel",

		"_construct" : function (parent) {
			Panel.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			this._elm.style.overflow = "hidden";
			//this._elm.style.backgroundColor = Editor.theme.panelColor;		
			this._elm.style.backgroundColor = skin.panelColor;

			//Division A
			this.divA = new Panel(this);
			//this.divA.element.style.backgroundColor = Editor.theme.panelColor;
			this.divA.element.style.backgroundColor = skin.panelColor;

			//Division B
			this.divB = new Panel(this);
			//this.divB.element.style.backgroundColor = Editor.theme.panelColor;
			this.divB.element.style.backgroundColor = skin.panelColor;
			
			//Resize tab
			this.resizeTab = document.createWidget("div");
			this.resizeTab.style.position = "absolute";
			this.resizeTab.style.cursor = "e-resize";
			//this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
			this.resizeTab.style.backgroundColor = skin.resizeTabColor;
			this._elm.appendChild(this.resizeTab);

			//Resize Tab
			this.tabPosition = 0.5;
			this.tabPositionMax = 1;
			this.tabPositionMin = 0;
			this.tabSize = 5;
			this.orientation = DualPanel.HORIZONTAL;

			var self = this;

			//Tab mouse down
			//this.resizeTab.onmousedown = function(event){
			//	self.manager.create();
			//};

			//Tab resize event manager
			//this.manager = new EventManager();
			this.connect(window, "mousemove", function(event){
				if(self.orientation === DualPanel.HORIZONTAL){	
					self.tabPosition += event.movementX / self.size.x;
				} else if(self.orientation === DualPanel.VERTICAL) {
					self.tabPosition += event.movementY / self.size.y;
				}

				//Limit tab position
				if(self.tabPosition > self.tabPositionMax) {
					self.tabPosition = self.tabPositionMax;
				} else if(self.tabPosition < self.tabPositionMin) {
					self.tabPosition = self.tabPositionMin;
				}

				self.updateInterface();
				self.onResize();
			});

			this.connect(window, "mouseup", function(event) {
				self.manager.destroy();
			});

			//onResize callback
			this.onResize = function() 	{
				Editor.gui.updateInterface();
			};
		},

		setOnResize : function(callback) {
			this.onResize = callback;
		},

		updateSize : function() {
			Widget.prototype.updateSize.call(this);

			if(this.orientation === DualPanel.HORIZONTAL) {
				var tabPositionAbs = this.tabPosition * this.size.x;
				
				this.divA.position.set(0, 0);
				this.divA.size.set(tabPositionAbs, this.size.y);
				this.divA.updateInterface();

				this.divB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
				this.divB.position.set(this.divA.size.x + this.tabSize, 0);
				this.divB.updateInterface();

				this.resizeTab.style.cursor = "e-resize";
				this.resizeTab.style.top = "0px";
				this.resizeTab.style.left = this.divA.size.x + "px";
				this.resizeTab.style.width = this.tabSize + "px";
				this.resizeTab.style.height = this.size.y + "px";
			} else if(this.orientation === DualPanel.VERTICAL) {
				var tabPositionAbs = this.tabPosition * this.size.y;

				this.divA.position.set(0, 0);
				this.divA.size.set(this.size.x, tabPositionAbs);
				this.divA.updateInterface();

				this.divB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
				this.divB.position.set(0, this.divA.size.y + this.tabSize);
				this.divB.updateInterface();

				this.resizeTab.style.cursor = "n-resize";
				this.resizeTab.style.top = this.divA.size.y + "px";
				this.resizeTab.style.left = "0px";
				this.resizeTab.style.width = this.size.x + "px";
				this.resizeTab.style.height = this.tabSize + "px";
			}
		},

		elementA : {
			get : function() {
				return this._elmA;
			}
		},

		elementB : {
			get : function() {
				return this._elmB;
			}
		}
	});


	DualPanel.HORIZONTAL = 0;
	DualPanel.VERTICAL = 1;

	return base.panels.DualPanel = DualPanel;
});
