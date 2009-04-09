/*
Licencováno pod MIT Licencí

© 2008 Seznam.cz, a.s.

Tímto se uděluje bezúplatná nevýhradní licence k oprávnění užívat Software,
časově i místně neomezená, v souladu s příslušnými ustanoveními autorského zákona.

Nabyvatel/uživatel, který obdržel kopii tohoto softwaru a další přidružené 
soubory (dále jen „software“) je oprávněn k nakládání se softwarem bez 
jakýchkoli omezení, včetně bez omezení práva software užívat, pořizovat si 
z něj kopie, měnit, sloučit, šířit, poskytovat zcela nebo zčásti třetí osobě 
(podlicence) či prodávat jeho kopie, za následujících podmínek:

- výše uvedené licenční ujednání musí být uvedeno na všech kopiích nebo 
podstatných součástech Softwaru.

- software je poskytován tak jak stojí a leží, tzn. autor neodpovídá 
za jeho vady, jakož i možné následky, ledaže věc nemá vlastnost, o níž autor 
prohlásí, že ji má, nebo kterou si nabyvatel/uživatel výslovně vymínil.



Licenced under the MIT License

Copyright (c) 2008 Seznam.cz, a.s.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
 * @class Vektorova grafika
 * @group jak-utils
 * @static
 */ 
SZN.Vector = SZN.ClassMaker.makeClass({
	NAME:"Vector",
	CLASS:"static",
	VERSION:"1.0",
	DEPEND:[{
		sClass:SZN.Vec2d,
		ver:"1.0"
	}]
});

/**
 * @static 
 * vrati instanci canvasu
 */   
SZN.Vector.getCanvas = function(w,h) {	
	if (SZN.Browser.client == "ie") {
		return new SZN.VML(w,h);
	} else {
		return new SZN.SVG(w,h);
	}
}

/**
 * @class Vektorovy canvas
 * @group jak-utils
 */ 
SZN.Vector.Canvas = SZN.ClassMaker.makeClass({
	NAME:"Canvas",
	VERSION:"1.0",
	CLASS:"class"
});

/**
 * @param {number} width sirka canvasu v pixelech
 * @param {number} height vyska canvasu v pixelech
 */
SZN.Vector.Canvas.prototype.$constructor = function(width, height) {}

/**
 * smaze canvas
 */   
SZN.Vector.Canvas.prototype.clear = function() {}

/**
 * zmeni rozmery canvasu; nijak neovlivni velikost prvku v nem (pretekajici se oriznou)
 * @param {number} width sirka canvasu
 * @param {number} height vyska canvasu
 */   
SZN.Vector.Canvas.prototype.resize = function(width, height) {}

/**
 * nastavi meritko (proporcionalne) prvkum v canvasu
 * @param {number} scale koeficient velikosti (1 = puvodni velikost)
 */   
SZN.Vector.Canvas.prototype.setScale = function(scale) {}

/**
 * vrati vnejsi obal
 */   
SZN.Vector.Canvas.prototype.getContainer = function() {}

/**
 * vrati vnitrni canvas
 */   
SZN.Vector.Canvas.prototype.getContent = function() {}

/**
 * nakresli kruh do canvasu
 */   
SZN.Vector.Canvas.prototype.circle = function() {}

/**
 * nakresli lomenou caru do canvasu
 */   
SZN.Vector.Canvas.prototype.polyline = function() {}

/**
 * nakresli mnohouhelnik do canvasu
 */   
SZN.Vector.Canvas.prototype.polygon = function() {}

/**
 * nakresli obecnou caru
 */   
SZN.Vector.Canvas.prototype.path = function() {}

/**
 * zmeni vlastnosti cary prvku
 * @param {element} prvek
 * @param {object} options objekt s povolenymi vlastnostmi color, width, opacity
 */   
SZN.Vector.Canvas.prototype.setStroke = function(element, options) {}

/**
 * zmeni vlastnosti vyplne prvku
 * @param {element} prvek
 * @param {object} options objekt s povolenymi vlastnostmi color, opacity
 */   
SZN.Vector.Canvas.prototype.setFill = function(element, options) {}

/**
 * zmeni stred a polomer kruhu
 * @param {element} prvek
 * @param {vec2d} center novy stred
 * @param {vec2d} radius novy polomer
 */   
SZN.Vector.Canvas.prototype.setCenterRadius = function(element, center, radius) {}

/**
 * zmeni body pro lomenou caru / mnohouhelnik
 * @param {element} prvek
 * @param {array} points pole novych bodu
 * @param {bool} closed ma byt utvar uzavreny? jen hack pro debilni vml
 */   
SZN.Vector.Canvas.prototype.setPoints = function(element, points, closed) {}

/**
 * zmeni formatovaci retezec pro path
 * @param {element} prvek
 * @param {string} format novy format
 */   
SZN.Vector.Canvas.prototype.setFormat = function(element, format) {}

/**
 * zmeni title prvku
 * @param {element} prvek
 * @param {string} title novy title
 */   
SZN.Vector.Canvas.prototype.setTitle = function(element, title) {
	element.setAttribute("title", title);
}

/**
 * spocte kontrolni body
 * @param {array} points souradnice bodu
 * @param {object} options volitelne veci, polozky: flat, curvature, join
 */   
SZN.Vector.Canvas.prototype.computeControlPointsSymmetric = function(points, options) {
	var o = {
		flat:true,
		curvature:20,
		join:false
	}
	for (var p in options) { o[p] = options[p]; }
	
	/* pro tohle nelze spocitat kontrolni body */
	if (points.length < 2 || (points.length == 2 && !o.join)) { return false; }
	
	var result = [];
	var X = false;
	var Y = false;
	var limit = (o.join ? points.length : points.length-1);
	
	for (var i=0;i<limit;i++) {
		var A = points[i];
		if (o.join) { /* continuous -> wrap around */
			var B = (i+1 == points.length ? points[0] : points[i+1]);
			var C = (i+2 >= points.length ? points[i+2 - points.length]: points[i+2]);
		} else {
			var B = points[i+1];
			var C = (i+2 == points.length ? false : points[i+2]);
		}

		if (!C) { /* compute #2 point for last segment */
			var AB = B.minus(A);
			if (o.flat) {
				Y = A.plus(AB.multiply(0.5));
			} else {
				var vAX = X.minus(A);
				var vYB = vAX.symmetry(AB);
				Y = B.minus(vYB);
			}
		} else { /* compute #2 point for normal segment */
			var vAC = C.minus(A);
			var l = vAC.norm();
			var frac = l / o.curvature;
			if (!frac) { frac = Infinity; }
			var vYB = vAC.multiply(1/frac);
			Y = B.minus(vYB);
		}
		
		if (!X) { /* first segment */
			var AB = B.minus(A);
			if (o.join) { /* step back for continuous first segment */
				var D = points[points.length-1];
				var vBD = D.minus(B);
				var l = vBD.norm();
				var frac = l / o.curvature;
				if (!frac) { frac = Infinity; }
				var vXA = vBD.multiply(1/frac);
				X = A.minus(vXA);
			} else if (o.flat) { /* first segment, flat scenario */
				X = A.plus(AB.multiply(0.5));
			} else {
				var vAX = vYB.symmetry(AB);
				X = A.plus(vAX);
			}
		} 

		result.push([X,Y]);
		
		//new SZN.Vector.Circle(this,X,3,{color:"#0ff"});
		//new SZN.Vector.Circle(this,Y,3,{color:"#0ff"});

		X = B.plus(vYB); /* generate next #1 point */
	}
	return result;
}

/**
 * spocte kontrolni body
 * @param {array} points souradnice bodu
 * @param {object} options volitelne veci, polozky: flat, curvature, join
 */   
SZN.Vector.Canvas.prototype.computeControlPoints = function(points, options) {
	var o = {
		flat:true,
		curvature:20,
		join:false
	}
	for (var p in options) { o[p] = options[p]; }
	o.curvature = o.curvature / 100;
	
	/* pro tohle nelze spocitat kontrolni body */
	if (points.length < 2 || (points.length == 2 && !o.join)) { return false; }
	
	var result = [];
	var X = false;
	var Y = false;
	var limit = (o.join ? points.length : points.length-1);
	
	for (var i=0;i<limit;i++) {
		var A = points[i];

		if (o.join) { /* continuous -> wrap around */
			var B = (i+1 == points.length ? points[0] : points[i+1]);
			var C = (i+2 >= points.length ? points[i+2 - points.length]: points[i+2]);
			var D = (i ? points[i-1] : points[points.length-1]);
		} else {
			var B = points[i+1];
			var C = (i+2 == points.length ? false : points[i+2]);
			var D = (i ? points[i-1] : false);
		}

		var AB = B.minus(A);
		if (!C) { /* compute #2 point for last segment */
			if (o.flat) {
				Y = A.plus(AB.multiply(0.5));
			} else {
				var vAX = X.minus(A);
				var vYB = vAX.symmetry(AB);
				Y = B.minus(vYB);
			}
		} else { /* compute #2 point for normal segment */
			var vAC = C.minus(A);
			var dist = AB.norm() * o.curvature;
			var norm = vAC.norm();
			var vYB = vAC.multiply(dist / norm || 0);
			Y = B.minus(vYB);
		}
		
		if (D) { /* first point for non-first segment */
			var vBD = D.minus(B);
			var vBA = B.minus(A);
			var dist = vBA.norm() * o.curvature;
			var norm = vBD.norm();
			var vXA = vBD.multiply(dist / norm || 0);
			X = A.minus(vXA);
		} else if (o.flat) { /* first segment, flat scenario */
			X = A.plus(AB.multiply(0.5));
		} else {
			var vAX = vYB.symmetry(AB);
			X = A.plus(vAX);
		}
		
		
		result.push([X,Y]);
		
		//new SZN.Vector.Circle(this,X,3,{color:"#0ff"});
		//new SZN.Vector.Circle(this,Y,3,{color:"#0ff"});
	}
	return result;
}

/**
 * @class Vektorove primitivum
 * @group jak-utils
 */ 
SZN.Vector.Primitive = SZN.ClassMaker.makeClass({
	NAME:"Primitive",
	VERSION:"1.0",
	CLASS:"class"
});

/**
 * @param {object} canvas Canvas pro vykresleni
 */
SZN.Vector.Primitive.prototype.$constructor = function(canvas) {
	this.canvas = canvas;
	this.elm = false;
}

SZN.Vector.Primitive.prototype.$destructor = function() {
	if (this.elm && this.elm.parentNode && this.elm.parentNode.nodeType == 1) { this.elm.parentNode.removeChild(this.elm); }
}

/**
 * @class Cara
 * @augments SZN.Vector.Primitive
 */ 
SZN.Vector.Line = SZN.ClassMaker.makeClass({
	NAME:"Line",
	VERSION:"1.0",
	CLASS:"class",
	EXTEND:SZN.Vector.Primitive
});

/**
 * @param {object} canvas canvas pro vykresleni
 * @param {array} points body cary
 * @param {object} options objekt s povolenymi hodnotami color, width, curvature, opacity, outlineColor, outlineOpacity, outlineWidth, title
 */
SZN.Vector.Line.prototype.$constructor = function(canvas, points, options) {
	this.canvas = canvas;
	this.elm2 = false;
	this.options = {
		color:"#000",
		width:1,
		curvature:0,
		opacity:1,
		outlineColor:"#fff",
		outlineOpacity:1,
		outlineWidth:0,
		title:"",
		symmetricCP:true
	}
	for (var p in options) { this.options[p] = options[p]; }

	this._build(points);
}

SZN.Vector.Line.prototype._build = function(points) {
	var o1 = {
		color:this.options.color,
		width:this.options.width,
		opacity:this.options.opacity
	}
	
	if (this.options.outlineWidth) {
		var o2 = {
			color:this.options.outlineColor,
			width:2*this.options.outlineWidth + this.options.width,
			opacity:this.options.outlineOpacity
		}
	}
	
	if (this.elm) { this.elm.parentNode.removeChild(this.elm); }
	if (this.elm2) { this.elm2.parentNode.removeChild(this.elm2); }
	
	if (this.options.curvature) { /* zakulacena */
		this.elm = this.canvas.path();		
		if (this.options.outlineWidth) { this.elm2 = this.canvas.path(); }
	} else { /* rovna */
		this.elm = this.canvas.polyline();
		if (this.options.outlineWidth) { this.elm2 = this.canvas.polyline(); }
	}
	
	this.canvas.setTitle(this.elm, this.options.title);
	this.canvas.setStroke(this.elm, o1);
	if (this.options.outlineWidth) { 
		this.canvas.setStroke(this.elm2, o2);
		this.canvas.setTitle(this.elm2, this.options.title);
		this.canvas.getContent().appendChild(this.elm2); 
	}
	this.canvas.getContent().appendChild(this.elm);	
	this.setPoints(points);
}

SZN.Vector.Line.prototype.setCurvature = function(c) {
	if (!!this.options.curvature != !!c) {
		this.options.curvature = c;
		this._build(this.points);
	} else {
		this.options.curvature = c;
		this.setPoints(this.points);
	}
}

SZN.Vector.Line.prototype.$destructor = function() {
	if (this.elm.parentNode && this.elm.parentNode.nodeType == 1) { this.elm.parentNode.removeChild(this.elm); }
	if (this.elm2 && this.elm2.parentNode && this.elm2.parentNode.nodeType == 1) { this.elm2.parentNode.removeChild(this.elm2); }
}

SZN.Vector.Line.prototype.setPoints = function(points) {
	this.points = points;
	
	if (this.options.curvature) {
		var d = "M "+this.points[0].join(" ");
		var len = this.points.length;
		if (len > 2) {
			if (this.options.symmetricCP) {
				var control = this.canvas.computeControlPointsSymmetric(this.points, {join:false, curvature:this.options.curvature});
			} else {
				var control = this.canvas.computeControlPoints(this.points, {join:false, curvature:this.options.curvature});
			}
			for (var i=1;i<len;i++) {
				var c = control[i-1];
				var x = c[0];
				var y = c[1];
				var point = this.points[i];
				d += "C "+x.join(" ")+", "+y.join(" ")+", "+point.join(" ")+" ";
			}
		} else {
			for (var i=1;i<len;i++) {
				var point = this.points[i];
				d += "L  "+point.join(" ")+" ";
			}
		}

		this.canvas.setFormat(this.elm, d);
		if (this.elm2) { this.canvas.setFormat(this.elm2, d); }
	} else {
		this.canvas.setPoints(this.elm, points);
		if (this.elm2) { this.canvas.setPoints(this.elm2, points); }
	}
}

SZN.Vector.Line.prototype.setOptions = function(options) {
	var o = {};
	if ("width" in options) { o.width = options.width; this.options.width = options.width; }
	if ("opacity" in options) { o.opacity = options.opacity; }
	if ("color" in options) { o.color = options.color; }
	this.canvas.setStroke(this.elm, o);
	
	if (this.elm2) {
		o = {};
		if ("outlineWidth" in options) { o.width = 2*options.outlineWidth + this.options.width; }
		if ("outlineOpacity" in options) { o.opacity = options.outlineOpacity; }
		if ("outlineColor" in options) { o.color = options.outlineColor; }
		this.canvas.setStroke(this.elm2, o);
	}
}

/**
 * @class Mnohouhelnik
 * @augments SZN.Vector.Primitive
 */ 
SZN.Vector.Polygon = SZN.ClassMaker.makeClass({
	NAME:"Polygon",
	VERSION:"1.0",
	CLASS:"class",
	EXTEND:SZN.Vector.Primitive
});

/**
 * @param {object} canvas canvas pro vykresleni
 * @param {array} points body mnohouhelniku
 * @param {object} options objekt s povolenymi hodnotami curvature, color, opacity, outlineColor, outlineOpacity, outlineWidth, title
 */
SZN.Vector.Polygon.prototype.$constructor = function(canvas, points, options) {
	this.canvas = canvas;

	this.options = {
		color:"#000",
		curvature:0,
		opacity:1,
		outlineColor:"#fff",
		outlineOpacity:1,
		outlineWidth:0,
		title:"",
		symmetricCP:true
	}
	for (var p in options) { this.options[p] = options[p]; }

	this._build(points);
}

SZN.Vector.Polygon.prototype._build = function(points) {
	var stroke = {
		color:this.options.outlineColor,
		width:this.options.outlineWidth,
		opacity:this.options.outlineOpacity
	}
	
	var fill = {
		color:this.options.color,
		opacity:this.options.opacity
	}
	
	if (this.elm) { this.elm.parentNode.removeChild(this.elm); }

	if (this.options.curvature) { /* zakulacena */
		this.elm = this.canvas.path();		
	} else { /* rovna */
		this.elm = this.canvas.polygon();
	}
	this.canvas.setStroke(this.elm, stroke);
	this.canvas.setFill(this.elm, fill);
	this.canvas.setTitle(this.elm, this.options.title);
	
	this.canvas.getContent().appendChild(this.elm);	
	this.setPoints(points);
}

SZN.Vector.Polygon.prototype.setPoints = function(points) {
	this.points = points;
	if (this.options.curvature) {
		if (this.options.symmetricCP) {
			var control = this.canvas.computeControlPointsSymmetric(this.points, {join:true, curvature:this.options.curvature});
		} else {
			var control = this.canvas.computeControlPoints(this.points, {join:true, curvature:this.options.curvature});
		}
		var d = "M "+this.points[0].join(" ");
		var len = this.points.length;
		for (var i=1;i<len+1;i++) {
			var c = control[i-1];
			var x = c[0];
			var y = c[1];
			var point = (i >= len ? this.points[0] : this.points[i]);
			d += "C "+x.join(" ")+", "+y.join(" ")+", "+point.join(" ")+" ";
		}
		d += "Z";

		this.canvas.setFormat(this.elm, d);
	} else {
		this.canvas.setPoints(this.elm, points, true);
	}
}

SZN.Vector.Polygon.prototype.setCurvature = function(c) {
	if (!!this.options.curvature != !!c) {
		this.options.curvature = c;
		this._build(this.points);
	} else {
		this.options.curvature = c;
		this.setPoints(this.points);
	}
}

/**
 * @class Kruh
 * @augments SZN.Vector.Primitive
 */ 
SZN.Vector.Circle = SZN.ClassMaker.makeClass({
	NAME:"Circle",
	VERSION:"1.0",
	CLASS:"class",
	EXTEND:SZN.Vector.Primitive
});

/**
 * @param {object} canvas canvas pro vykresleni
 * @param {vec2d} center stred
 * @param {number} radius polomer
 * @param {object} options objekt s povolenymi hodnotami color, opacity, outlineColor, outlineOpacity, outlineWidth, title
 */
SZN.Vector.Circle.prototype.$constructor = function(canvas, center, radius, options) {
	this.canvas = canvas;
	this.center = new SZN.Vec2d(0,0);
	this.radius = 0;
	this.options = {
		color:"",
		opacity:1,
		outlineColor:"#000",
		outlineOpacity:1,
		outlineWidth:1,
		title:""
	}
	for (var p in options) { this.options[p] = options[p]; }

	var stroke = {
		color:this.options.outlineColor,
		width:this.options.outlineWidth,
		opacity:this.options.outlineOpacity
	}
	
	var fill = {
		color:this.options.color,
		opacity:this.options.opacity
	}
	this.elm = this.canvas.circle(this.center, this.radius);		
	this.setCenter(center);
	this.setRadius(radius);
	this.canvas.setStroke(this.elm, stroke);
	this.canvas.setFill(this.elm, fill);
	this.canvas.setTitle(this.elm, this.options.title);
	this.canvas.getContent().appendChild(this.elm);	
}

SZN.Vector.Circle.prototype.setCenter = function(center) {
	this.center = center;
	this.canvas.setCenterRadius(this.elm, this.center, this.radius);
}

SZN.Vector.Circle.prototype.setRadius = function(radius) {
	this.radius = radius;
	this.canvas.setCenterRadius(this.elm, this.center, this.radius);
}

/**
 * @class Path
 * @augments SZN.Vector.Primitive
 */ 
SZN.Vector.Path = SZN.ClassMaker.makeClass({
	NAME:"Path",
	VERSION:"1.0",
	CLASS:"class",
	EXTEND:SZN.Vector.Primitive
});

/**
 * @param {object} canvas canvas pro vykresleni
 * @param {string} format formatovaci retezec
 * @param {object} options objekt s povolenymi hodnotami color, opacity, width, outlineColor, outlineOpacity, outlineWidth, title
 */
SZN.Vector.Path.prototype.$constructor = function(canvas, format, options) {
	this.canvas = canvas;
	this.elm2 = false;
	this.options = {
		color:"none",
		opacity:1,
		width:0,
		outlineColor:"#fff",
		outlineOpacity:1,
		outlineWidth:1,
		title:""
	}
	for (var p in options) { this.options[p] = options[p]; }

	var stroke = {
		color:this.options.outlineColor,
		width:this.options.outlineWidth,
		opacity:this.options.outlineOpacity
	}
	
	var fill = {
		width:this.options.width,
		color:this.options.color,
		opacity:this.options.opacity
	}

	var two = this.options.width && !format.match(/z/i); /* dva prvky jen pokud je to neuzavrene a oramovane */
	
	this.elm = this.canvas.path();
	this.setFormat(format);

	if (two) {
		this.elm2 = this.canvas.path(); 
		this.setFormat(format);
		if (stroke.width) { stroke.width = fill.width + 2*stroke.width; }
		this.canvas.setStroke(this.elm, fill);
		this.canvas.setStroke(this.elm2, stroke);
		this.canvas.setTitle(this.elm2, this.options.title);
		
	} else {
		this.canvas.setStroke(this.elm, stroke);
		this.canvas.setFill(this.elm, fill);
	}
	
	this.canvas.setTitle(this.elm, this.options.title);
	if (this.elm2) { this.canvas.getContent().appendChild(this.elm2); }
	this.canvas.getContent().appendChild(this.elm);	
}

SZN.Vector.Path.prototype.$destructor = function() {
	if (this.elm.parentNode && this.elm.parentNode.nodeType == 1) { this.elm.parentNode.removeChild(this.elm); }
	if (this.elm2 && this.elm2.parentNode && this.elm2.parentNode.nodeType == 1) { this.elm2.parentNode.removeChild(this.elm2); }
}

SZN.Vector.Path.prototype.setFormat = function(format) {
	this.canvas.setFormat(this.elm, format);
	if (this.elm2) { this.canvas.setFormat(this.elm2, format); }
}
