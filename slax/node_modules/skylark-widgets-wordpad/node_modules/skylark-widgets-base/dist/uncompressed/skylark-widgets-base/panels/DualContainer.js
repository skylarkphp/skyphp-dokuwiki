define([
	"../base",
	"./Panel",
],function( base, Panel){
	"use strict";

	var DualContainer = Panel.inherit({
		"klassName" : "DualContainer",

		"_construct" : function (parent) {
			Panel.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			this._elm.style.overflow = "hidden";
			//this._elm.style.backgroundColor = Editor.theme.panelColor;
			this._elm.style.backgroundColor = skin.panelColor;

			//Container A
			this._elmA = null

			//Container B
			this._elmB = null

			//Resize tab
			this.resizeTab = document.createElement("div");
			this.resizeTab.style.position = "absolute";
			this.resizeTab.style.cursor = "e-resize";


			//this.resizeTab.style.backgroundColor = Editor.theme.resizeTabColor;
			this.resizeTab.style.backgroundColor = skin.resizeTabColor;
			this._elm.appendChild(this.resizeTab);

			//Resize Tab
			this.tabPosition = 0.5;
			this.tabPositionMax = 0.95;
			this.tabPositionMin = 0.05;
			this.tabSize = 5;
			this.orientation = DualContainer.HORIZONTAL;

			var self = this;

			function resizing(event) {
				if(self.orientation === DualContainer.HORIZONTAL)
				{	
					self.tabPosition += event.movementX / self.size.x;
				}
				else if(self.orientation === DualContainer.VERTICAL)
				{
					self.tabPosition += event.movementY / self.size.y;
				}

				//Limit tab position
				if(self.tabPosition > self.tabPositionMax)
				{
					self.tabPosition = self.tabPositionMax;
				}
				else if(self.tabPosition < self.tabPositionMin)
				{
					self.tabPosition = self.tabPositionMin;
				}

				self.updateInterface();

			}
			//Tab mouse down
			this.resizeTab.onmousedown = function(event)
			{
			//	self.manager.create();
				self.$(window).on("mousemove",resizing);
				self.$(window).one("mouseup",function(){
					self.$(window).off("mousemove",resizing);
				});
			};

			//Tab resize event manager
			//this.manager = new EventManager();

			//this.listenTo(this.$(window), "mousemove", function(event){
			//});

			//this.connect(window, "mouseup", function(event)
			//{
			//	self.manager.destroy();
			//});
		},

		attach : function(element) 	{
			if(this._elmA === null)
			{
				this.attachA(element);
				return;
			}
			
			if(this._elmB === null) {
				this.attachB(element);
				return;
			}
			
			console.warn("nunuStudio: Cannot attach more elements.");
		},

		attachA : function(element) {
			this._elmA = element;
			this._elmA.setParent(this);
		},

		attachB : function(element) {
			this._elmB = element;
			this._elmB.setParent(this);
		},

		updateSize : function() {
			Panel.prototype.updateSize.call(this);

			if(this._elmA === null || this._elmB === null) 	{
				console.log("nunuStudio: Dual container elements are null", this, this._elmA, this._elmB);
				return;
			}

			if(this.orientation === DualContainer.HORIZONTAL) {
				var tabPositionAbs = this.tabPosition * this.size.x;

				this._elmA.position.set(0, 0);
				this._elmA.size.set(tabPositionAbs, this.size.y);
				this._elmA.updateInterface();

				this._elmB.size.set(this.size.x - tabPositionAbs - this.tabSize, this.size.y);
				this._elmB.position.set(this._elmA.size.x + this.tabSize, 0);
				this._elmB.updateInterface();

				this.resizeTab.style.cursor = "e-resize";
				this.resizeTab.style.top = "0px";
				this.resizeTab.style.left = this._elmA.size.x + "px";
				this.resizeTab.style.width = this.tabSize + "px";
				this.resizeTab.style.height = this.size.y + "px";
			} else if(this.orientation === DualContainer.VERTICAL) 	{
				var tabPositionAbs = this.tabPosition * this.size.y;
				
				this._elmA.position.set(0, 0);
				this._elmA.size.set(this.size.x, tabPositionAbs);
				this._elmA.updateInterface();
				
				this._elmB.size.set(this.size.x, this.size.y - tabPositionAbs - this.tabSize);
				this._elmB.position.set(0, this._elmA.size.y + this.tabSize);
				this._elmB.updateInterface();

				this.resizeTab.style.cursor = "n-resize";
				this.resizeTab.style.top = this._elmA.size.y + "px";
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

	DualContainer.HORIZONTAL = 0;
	DualContainer.VERTICAL = 1;


	return base.panels.DualContainer = DualContainer;
});