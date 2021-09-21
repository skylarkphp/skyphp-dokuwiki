define( [
	"./ddmanager",
	"./Draggable",
	"./Droppable",
	"./Mouse",
	"./Resizable",
	"./Selectable",
	"./Sortable",
],function(ddmanager,Draggable,Droppable,Mouse,Resizable,Selectable,Sortable){
	return {
		ddmanager : ddmanager,
		Draggable : Draggable,
		Droppable : Droppable,
		Mouse : Mouse,
		Resizable : Resizable,
		Selectable : Selectable,
		Sortable : Sortable
	};
});