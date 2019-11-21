define([
  "skylark-langx/Evented",
],function(Evented){
  // These objects are used to represent the visible (currently drawn)
  // part of the document. A LineView may correspond to multiple
  // logical lines, if those are connected by collapsed ranges.
  var LineView = Evented.iherit({
  	klassName : "LineView",
  	
    _construct : function(doc, line, lineN) {
      // The starting line
      this.line = line;
      // Continuing lines, if any
      this.rest = visualLineContinued(line);
      // Number of logical lines in this visual line
      this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
      this.node = this.text = null;
      this.hidden = lineIsHidden(doc, line);      
    }
  });
});