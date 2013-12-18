/*!
 * j-progress-bar.js
 *
 * Copyright 2013 Hilson Shrestha
 * Released under the MIT license
 * https://github.com/hilsonshrestha/j-progress-bar/blob/master/LICENSE
 */

var $jpb = {
	currentTasks: {},
	nextId : 1,
	createProgressBar: function(a, b) {
		var p = new this.ProgressBar();
		var elem = p.setup(a, b);
		delete p.setup;
		return {elem: elem, pb: p};
	},
	animate: function(elem, css, val, time) {
		var frame_rate = 25;
		if (!parseFloat(elem.style[css])) {
			elem.style[css] = 0;
		}
		var inc = (parseFloat(val) - parseFloat(elem.style[css])) / (time / frame_rate);
		var str_unit = '';
		for (i in val) {
			if (!parseInt(val[i]) && parseInt(val[i]) != 0) {
				str_unit += val[i];
			}
		}
		var tmr_css = parseFloat(elem.style[css]);
		var animId = this.nextId;
		this.nextId += 1;
		var tasks = this.currentTasks;
		for (i in tasks) {
			if (tasks[i] == elem) {
				tasks[i] = null;
			}
		}
		this.currentTasks[animId] = elem;				
		var tmr = setInterval(function() {
			if ($i.currentTasks[animId] == null) {
				clearInterval(tmr);
				return;
			}
			var v = parseFloat(tmr_css) + inc;
			tmr_css = v + str_unit;
			elem.style[css] = tmr_css;
			if (parseInt(tmr_css) >= parseInt(val)) {
				tmr_css = val + str_unit;
				elem.style[css] = tmr_css;
				$i.currentTasks[animId] = null;
				clearInterval(tmr);
			}
		}, frame_rate);
	},
	ProgressBar: function() {
		this.animating = false;
		this.animationStatus = false;
		this.loaded = 0;
		this.element = null;
		this.deleted = false;
		this.setup = function(a, b) { 
			/*
			 * a = static or dynamic,
			 * b = width
			 */
			var p = document.createElement('div');
			p.className = 'jprogressBarHolder';
			p.style.width = b + 'px';
			var q = document.createElement('div');
			q.className = 'jprogressAnimationHolder';
			p.appendChild(q);
			var r = document.createElement('div');
			r.className = 'jprogressGradient';
			p.appendChild(r);
			this.element = p;				
			var pa = '<div class="jloadingArrow1" style="left:-16px;"></div><div class="jloadingArrow2 jloadingbg1" style="left:16px;"></div><div class="jloadingArrow1 jloadingbg2" style="left:0px;"></div>';
			var elem = this.element.childNodes[0];
			elem.innerHTML = '';
			var pt =  b / 32 + 5;
			ph = document.createElement('div');
			ph.style.position = 'relative';
			ph.style.width = (pt - 1) * 32 + 'px';
			for (var i = 0; i < pt; i++) {
				var pb = document.createElement('div');
				pb.style.position = 'absolute';
				pb.style.left = 32 * i + 'px';
				ph.appendChild(pb);
				pb.innerHTML = pa;
			}
			elem.appendChild(ph);
			if (a == 'static') {
				this.loaded = 100;
				elem.style.width = '100%';
			} else {
				this.loaded = 0;
			}
			return p;
		};
		this.showProgressBar = function() {
			this.element.show();
			return this;
		};
		this.hide = function() {
			this.element.hide();
			return this;
		}
		var animate = function(th) {
			if (th.animationStatus == false) return;
			var ml = 0;
			if (th.deleted == true) {
				th.stopAnimation();
				return;
			}
			var anim_interval = setInterval(function() {
				try {
					if (ml < 32) {
						th.element.childNodes[0].childNodes[0].style.marginLeft = -ml + 'px';
						ml += 1;
					} else {
						clearInterval(anim_interval);
						animate(th);
					}
				} catch(e) {
					clearInterval(anim_interval);
					th.remove();
				}
			}, 30);
		};
		this.startAnimation= function() {
			this.animationStatus = true;
			if (this.animating == true) {return}
			this.animating = true;
			this.percentage();
			animate(this);
			return this;
		};
		this.stopAnimation= function() {
			this.animationStatus = false;
			var th = this;
			setTimeout(function() {th.animating = false;}, 1000);
			return this;
		};
		this.percentage= function(a) {
			(a > 100) && (a = 100);
			(a < 0) && (a = 0);
			this.loaded = a;
			var b = this.element.childNodes[0];
			b.style.width = this.loaded + '%';
			return this;
		};
		this.remove = function() {
			this.deleted = true;
			delete this;
		}
	}
}