(function (e, t) {
    if (e.editorCanvas) {
        return
    }
    var n = e.editorCanvas = {
        s: null,
        a: null,
        defaultheight: 0,
        defaultwidth: 0,
        root: null,
        stop: false,
        currenttarget: null,
        saves: {},
        changer: function () {
            this.stop = !this.stop
        },
        showfomular: function (e, t) {
            var r = /<frm>(.|\n)*?<\/frm>/gi;
            var i = this.isString(e) ? $("#" + e) : e;
            i.each(function () {
                var e = $(this);
                var i = e.html();
                var s = n.getTime() + n.cid();
                if (i != null) {
                    var o = i.match(r);
                    if (o != null) {
                        for (var u = 0, a = o.length; u < a; u++) {
                            o[u] = o[u].slice(5, -6)
                        }
                        var f = i.replace(r, '<div class="FRM_DIV"></div>');
                        e.html(f);
                        var l = $(".FRM_DIV", e);
                        for (var u = 0, a = l.length; u < a; u++) {
                            var c = document.createElement("canvas");
                            $(l[u]).replaceWith(c);
                            c.id = s + "Canvas" + u
                        }
                        if (navigator.userAgent.indexOf("MSIE") > 0 && !n.isIE9()) {
                            var h = $("canvas");
                            for (var u = 0, a = h.length; u < a; u++) {
                                if (!h[u].getContext) {
                                    excanvas.initElement(h[u])
                                }
                            }
                        }
                        var p = parseInt(e.css("font-size").slice(0, -2));
                        var d = e.find("canvas");
                        for (var u = 0, a = d.length; u < a; u++) {
                            if (!o[u]) {
                                return false
                            }
                            var v = n.showCanvas(s + "Canvas" + u, o[u].replace(/<br>/g, ""), p, t);
                            var m = $("#" + s + "Canvas" + u).css("height");
                            if (v > 50) {
                                $("#" + s + "Canvas" + u).css({
                                    "vertical-align": "middle"
                                })
                            } else {
                                $("#" + s + "Canvas" + u).css({
                                    "vertical-align": -(v + 2) + "px"
                                })
                            }
                        }
                    }
                }
            });
            if (navigator.userAgent.indexOf("MSIE") > 0 && !n.isIE9()) {
                $("canvas div").css({
                    "vertical-align": "middle"
                })
            }
        },
        showCanvas: function (e, t, n, r) {
            var i = this.a;
            var s = this.s;
            var o = this.root;
            this.s = new this.simbol(e, n, r);
            this.a = new this.Analysis(this);
            this.a.distribute(t, 0);
            var u = this.root.offset;
            this.a = i;
            this.s = s;
            this.root = o;
            return u
        },
        node: function (e) {
            this.width = 5;
            this.height = 5;
            this.child = [];
            this.father = null;
            this.type = e;
            this.value = "";
            this.level;
            this.x;
            this.y;
            this.size;
            this.kind;
            this.max_width;
            this.max_height;
            this.up = null;
            this.down = null;
            this.left = null;
            this.right = null;
            this.offset = 0;
            this.arg = [];
            this.getValue = function () {
                return this.value
            }
        },
        simbol: function (e, t, r) {
            this.canvas = document.getElementById(e);
            this.ctx = this.canvas.getContext("2d");
            this.movable = false;
            this.style = "bold";
            this.weight = "normal";
            this.font = "宋体";
            this.color = r ? r : "#222";
            this.ctx.lineWidth = 1;
            this.MINCSIZE = 12;
            this.DEFAULTCSIZE = 14;
            this.colum = 3;
            this.row = 3;
            this.csize = t && t > this.DEFAULTCSIZE ? t : this.DEFAULTCSIZE;
            this.ctx.font = this.csize + "px " + this.font;
            this.setFont = function (e) {
                var e = e || this.csize;
                this.ctx.fillStyle = this.color;
                this.ctx.strokeStyle = this.color;
                this.ctx.font = parseInt(e) + "px " + this.font
            }
            ;
            this.regroup = function (e, t) {
                if (!e || e == null) {
                    e = null;
                    e = new n.node("shuzi")
                }
                e.size = t < this.MINCSIZE ? this.MINCSIZE : t;
                for (var r = 0; r < this.options[e.type].children; r++) {
                    if (!e.child[r] || e.child[r] == null) {
                        e.child[r] = null;
                        e.child[r] = new n.node("shuzi");
                    }
                    e.child[r].kind = r;
                    e.child[r].father = e;
                }
                this.options[e.type].regroup(e, e.size);
                e.lwidth = e.width;
                e.lheight = e.height;
            }
            ;
            this.transaction = function (e, t, r) {
                if (!e || n.stop == true) {
                    return
                }
                e.x = t;
                e.y = r;
                var i = "";
                for (var s = 0; s < e.level; s++) {
                    i += "A"
                }
                this.options[e.type].draw(e, t, r);

            }
        },
        operation: function () {
            this.regroup = null;
            this.draw = null;
            this.children = 0;
            this.major = 0;
            this.defaultValue = []
        },
        replay: function () {
            this.s.ctx.clearRect(0, 0, this.s.canvas.width, this.s.canvas.height);
            this.adjust();
            this.s.setFont();
            this.s.transaction(this.root, 0, 0)
        },
        widthGetter: function (e, r) {
            if (arguments[1] != t)
                n.s.setFont(r);
            if (e == "") {
                return 1;
            }

            return this.s.ctx.measureText(e).width
        },
        adjust: function () {
            this.s.canvas.height = this.defaultheight;
            this.s.canvas.width = this.defaultwidth;
            var e = this.root ? this.root : this;
            this.s.canvas.width = e.width + 4;
            this.s.canvas.height = e.height;
            $(this.s.canvas).css("width", this.s.canvas.width);
            $(this.s.canvas).css("height", this.s.canvas.height)
        },
        clear: function (e) {
            for (var t = 0; t < e.child.length; t++) {
                if (e.child[t] && e.child[t] != null) {
                    e.child[t].father = null;
                    e.child[t] = null
                }
            }
            e.child = null;
            e.child = [];
            e.type = "undefine";
            e.value = ""
        }
    };
    n.simbol.prototype.freelist = [];
    n.simbol.prototype.options = [];
    n.simbol.prototype.options["right"] = function () {
        var e = new n.operation;
        e.regroup = function (e, t) {
            n.s.regroup(e.child[0], t);
            n.s.regroup(e.child[1], t);
            e.width = e.child[0].width + e.child[1].width;
            e.level = (e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level) + 1;
            e.size = t;
            e.value = e.child[0].getValue() + e.child[1].getValue();
            e.offset = e.child[0].offset > e.child[1].offset ? e.child[0].offset : e.child[1].offset;
            var r = e.child[0].height - e.child[0].offset;
            var i = e.child[1].height - e.child[1].offset;
            e.height = (r > i ? r : i) + e.offset
        }
        ;
        e.draw = function (e, t, r) {
            n.s.transaction(e.child[0], t, r + e.height - e.offset - (e.child[0].height - e.child[0].offset));
            n.s.transaction(e.child[1], t + e.child[0].width, r + e.height - e.offset - (e.child[1].height - e.child[1].offset))
        }
        ;
        e.children = 2;
        e.major = 0;
        return e
    }();
    n.simbol.prototype.options["shuzi"] = function () {
        var e = new n.operation;
        e.regroup = function (e, t) {
            e.level = 0;
            if (t < n.s.MINCSIZE) {
                t = n.s.MINCSIZE
            }
            e.size = t;
            n.s.setFont(e.size);
            e.width = n.widthGetter(e.value);
            e.height = t * 1.2;
            e.offset = 0;
            e.getValue = function () {
                //return e.value.replace(/(\^|\{|\}|\\|\_|\[|\]|\(|\))/g, "\\$1");
                return e.value.replace(/(\^|\{|\}|\\|\_|\[|\]|\(|\))/g, "$1");
            }
        }
        ;
        e.draw = function (e, t, r) {
            n.s.setFont(e.size);
            n.s.ctx.fillText(e.value, t, r + e.size)
        }
        ;
        e.children = 0;
        return e
    }();
    n.simbol.prototype.options["undefine"] = function () {
        var e = new n.operation;
        e.regroup = function (e, t) {
            e.height = t;
            e.level = 0;
            e.size = t;
            e.width = t;
            e.value = "";
            e.offset = 0
        }
        ;
        e.draw = function (e, t, r) {
            n.s.ctx.fillStyle = "#666";
            n.s.ctx.fillRect(t + e.width / 2 - 4, r + e.size / 8, 8, e.height - e.size / 4)
        }
        ;
        e.children = 0;
        return e
    }()
})(this);
editorCanvas.simbol.prototype.options["limit_leftright"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t / 2);
        editorCanvas.s.regroup(e.child[2], t / 2);
        e.width = e.child[1].width + e.child[2].width + 10;
        e.height = e.child[0].height + e.child[1].height;
        e.level = e.child[1].level + 1;
        e.level = e.level > e.child[2].level ? e.level : e.child[2].level + 1;
        e.size = t;
        e.offset = e.child[1].height - e.size * .55 + 3;
        e.value = "\\underset{" + e.child[1].getValue() + "\\rightarrow" + e.child[2].getValue() + "}{lim}";
    }
    ;
    e.draw = function (e, t, n) {
        var r = e.child[0].height;
        var sl = 0;
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t - sl, n + r - 5);

        var sx = t - sl - 2 + e.child[1].width;
        var sy = n + r - 3 + e.child[1].height * 0.5;
        var ex = sx + 10;
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(sx, sy);
        editorCanvas.s.ctx.lineTo(ex, sy);
        editorCanvas.s.ctx.lineTo(ex - 2, sy - 2);
        editorCanvas.s.ctx.moveTo(ex - 2, sy + 2);
        editorCanvas.s.ctx.lineTo(ex, sy);
        editorCanvas.s.ctx.stroke();
        editorCanvas.s.transaction(e.child[2], t + e.child[1].width + ex - sx, n + r - 3);
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "lim";
    e.defaultValue[1] = "n";
    e.defaultValue[2] = "∞";

    e.major = 1;
    return e;
}();



editorCanvas.simbol.prototype.options["fraction"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t);
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width += e.level * t / 2;
        e.height = e.child[0].height + e.child[1].height + t * .2;
        e.value = "{\\frac{" + e.child[0].getValue() + "}{" + e.child[1].getValue() + "}}";
        e.size = t;
        e.offset = e.child[1].height - e.size * .55;
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n + e.child[0].height + e.size * .2);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + 2, n + e.child[0].height + e.size * .2);
        editorCanvas.s.ctx.lineTo(t + e.width - 2, n + e.child[0].height + e.size * .2);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["radicent"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t * .5);
        editorCanvas.s.regroup(e.child[1], t);
        var n = e.child[0].width <= t / 4 ? t / 4 : e.child[0].width;
        e.width = n + e.child[1].width + t / 4;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "\\sqrt[" + e.child[0].getValue() + "]{" + e.child[1].getValue() + "}";
        e.offset = e.child[1].offset;
    }
    ;
    e.draw = function (e, t, n) {
        var r = e.child[0].width <= e.size / 4 ? e.size / 4 : e.child[0].width;
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + r + e.size / 4 + e.child[1].width, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 8, n + e.child[0].height - e.size * .375 + e.child[1].height - e.size / 4);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 4, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.stroke();
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["radicent2"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t * .5);
        editorCanvas.s.regroup(e.child[1], t);
        var n = e.child[0].width <= t / 4 ? t / 4 : e.child[0].width;
        e.width = n + e.child[1].width + t / 4;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "\\sqrt{" + e.child[1].getValue() + "}";
        e.offset = e.child[1].offset;
    }
    ;
    e.draw = function (e, t, n) {
        var r = e.child[0].width <= e.size / 4 ? e.size / 4 : e.child[0].width;
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + r + e.size / 4 + e.child[1].width, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 8, n + e.child[0].height - e.size * .375 + e.child[1].height - e.size / 4);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 4, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    e.defaultValue[0] = "";
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["radicent3"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t * .5);
        editorCanvas.s.regroup(e.child[1], t);
        var n = e.child[0].width <= t / 4 ? t / 4 : e.child[0].width;
        e.width = n + e.child[1].width + t / 4;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "\\sqrt[" + e.child[0].getValue() + "]{" + e.child[1].getValue() + "}";
        e.offset = e.child[1].offset
    }
    ;
    e.draw = function (e, t, n) {
        var r = e.child[0].width <= e.size / 4 ? e.size / 4 : e.child[0].width;
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + r + e.size / 4 + e.child[1].width, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r + e.size / 4, n + e.child[0].height - e.size * .375);
        editorCanvas.s.ctx.lineTo(t + r, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 8, n + e.child[0].height - e.size * .375 + e.child[1].height - e.size / 4);
        editorCanvas.s.ctx.lineTo(t + r - e.size / 4, n + e.child[0].height - e.size * .375 + e.child[1].height);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    e.defaultValue[0] = "3";
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["supsub"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        editorCanvas.s.regroup(e.child[2], t * .5);
        e.width = e.child[1].width > e.child[2].width ? e.child[1].width : e.child[2].width;
        e.width = e.child[0].width + e.width;
        e.height = e.child[0].height + e.child[1].height + e.child[2].height - t * .75;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level;
        e.level = e.child[2].level > e.level ? e.child[2].level : e.level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}_{" + e.child[2].getValue() + "}}";
        e.offset = e.child[2].height - e.size / 2 + e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.child[1].height - e.size * .375);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n);
        editorCanvas.s.transaction(e.child[2], t + e.child[0].width, n + e.child[0].height + e.child[1].height - e.size * .75)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["exponent"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width + e.child[1].width;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.child[1].height - e.size * .375);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["square"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width + e.child[1].width;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.child[1].height - e.size * .375);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n)
    }
    ;
    e.children = 2;
    e.defaultValue[1] = "2";
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["cube"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width + e.child[1].width;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.child[1].height - e.size * .375);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n)
    }
    ;
    e.children = 2;
    e.defaultValue[1] = "3";
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["sum"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        if (e == editorCanvas.root) {
            editorCanvas.s.regroup(e.child[0], t * .65);
            editorCanvas.s.regroup(e.child[1], t * .65)
        } else {
            editorCanvas.s.regroup(e.child[0], t);
            editorCanvas.s.regroup(e.child[1], t)
        }
        editorCanvas.s.regroup(e.child[2], t);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width = e.width > t ? e.width : t;
        e.width += e.child[2].width;
        var n = e.child[1].height + t / 2;
        var r = e.child[0].height + t / 2;
        n = n > e.child[2].height / 2 ? n : e.child[2].height / 2;
        r = r > e.child[2].height / 2 ? r : e.child[2].height / 2;
        e.height = n + r;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level;
        e.level = e.level > e.child[2].level ? e.level : e.child[2].level + 1;
        e.size = t;
        e.value = "{\\sum\\limits_{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}{" + e.child[2].getValue() + "}" + "}";
        e.offset = e.child[0].height > e.child[2].offset ? e.child[0].height : e.child[2].offset
    }
    ;
    e.draw = function (e, t, n) {
        var r, i;
        r = t + (e.width - e.child[2].width - e.child[1].width) / 2;
        if (e.child[1].height + e.size / 2 > e.child[2].height / 2) {
            i = n
        } else {
            i = n + e.child[2].height / 2 - (e.child[1].height + e.size / 2)
        }
        editorCanvas.s.transaction(e.child[1], r, i);
        editorCanvas.s.setFont(e.size * .88);
        editorCanvas.s.ctx.fillText("∑", t + (e.width - e.child[2].width - e.size * .8) / 2, i + e.child[1].height + e.size);
        r = t + (e.width - e.child[2].width - e.child[0].width) / 2;
        i = i + e.child[1].height + e.size;
        editorCanvas.s.transaction(e.child[0], r, i);
        r = t + e.width - e.child[2].width;
        if (e.child[2].height / 2 > e.child[1].height + e.size / 2) {
            i = n
        } else {
            i = n + e.child[1].height + e.size / 2 - e.child[2].height / 2
        }
        editorCanvas.s.transaction(e.child[2], r, i)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 2;
    return e
}();
editorCanvas.simbol.prototype.options["parentheses"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width + t;
        e.level = e.child[0].level + 1;
        if (e.level == 1) {
            e.height = e.child[0].height
        } else {
            e.height = e.child[0].height + 1.5 * t
        }
        e.size = t;
        e.value = "\\left ( {" + e.child[0].getValue() + "} \\right )";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        if (e.level == 1) {
            editorCanvas.s.setFont(e.size);
            editorCanvas.s.ctx.fillText("(", t, n + e.height);
            editorCanvas.s.transaction(e.child[0], t + e.size / 2, n + e.height / 8);
            editorCanvas.s.ctx.fillText(")", t + e.size / 2 + e.child[0].width, n + e.height)
        } else {
            editorCanvas.s.ctx.beginPath();
            editorCanvas.s.ctx.arc(t + e.size, n + e.size * .65, e.size, 1.25 * Math.PI, Math.PI, true);
            editorCanvas.s.ctx.arc(t + e.size, n + e.size * .65 + e.child[0].height, e.size, Math.PI, .75 * Math.PI, true);
            editorCanvas.s.ctx.stroke();
            editorCanvas.s.transaction(e.child[0], t + e.size / 4, n + e.size * .65);
            editorCanvas.s.ctx.beginPath();
            editorCanvas.s.ctx.arc(t + e.width - e.size, n + e.size * .65, e.size, 1.75 * Math.PI, 0, false);
            editorCanvas.s.ctx.arc(t + e.width - e.size, n + e.size * .65 + e.child[0].height, e.size, 0, .25 * Math.PI, false);
            editorCanvas.s.ctx.stroke()
        }
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["matrix"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        for (var n = 0; n < e.child.length; n++) {
            editorCanvas.s.regroup(e.child[n], t)
        }
        if (!e.arg[0]) {
            e.arg[0] = 3
        }
        if (!e.arg[1]) {
            e.arg[1] = 3
        }
        if (!e.matrixRow)
            e.matrixRow = e.arg[0];
        if (!e.max_height)
            e.max_height = e.arg[1];
        e.value = "\\begin{matrix}";
        e.level = 0;
        for (var n = 0, r = 0; n < e.matrixRow.length; n++) {
            if (n > 0) {
                e.value += "\\\\"
            }
            for (var i = 0; i < e.matrixRow[n]; i++) {
                if (i > 0) {
                    e.value += "&"
                }
                e.value += "{" + e.child[r].getValue() + "}";
                r++
            }
        }
        e.value += "\\end{matrix}";
        e.level++;
        e.width = -e.size;
        e.height = 0;
        e.MaxWidth = [];
        e.MaxHeight = [];
        for (var n = 0, r = 0; n < e.matrixRow.length; n++) {
            e.MaxHeight[n] = e.MaxHeight[n] || 0;
            for (var i = 1; i <= e.matrixRow[n]; i++) {
                e.MaxWidth[i - 1] = e.MaxWidth[i - 1] || 0;
                e.MaxWidth[i] = e.MaxWidth[i] || 0;
                e.MaxWidth[i] = e.MaxWidth[i] > e.child[r].width ? e.MaxWidth[i] : e.child[r].width;
                e.MaxHeight[n] = e.MaxHeight[n] > e.child[r].height ? e.MaxHeight[n] : e.child[r].height;
                r++
            }
        }
        for (var n in e.MaxWidth) {
            e.width += e.MaxWidth[n] + e.size
        }
        for (var n in e.MaxHeight) {
            e.height += e.MaxHeight[n] + 0
        }
        e.size = t;
        e.offset = e.size / 2
    }
    ;
    e.draw = function (e, t, n) {
        var r = n;
        var i = 0;
        var s = [];
        for (var o = 0, u = 0; o < e.matrixRow.length; o++) {
            s[o] = s[o] || 0;
            for (var a = 1; a <= e.matrixRow[o]; a++) {
                s[o] = s[o] > e.child[u].height ? s[o] : e.child[u].height;
                u++
            }
        }
        for (var o = 0, u = 0; o < e.matrixRow.length; o++) {
            var f = t - e.size;
            for (var a = 0; a < e.matrixRow[o]; a++) {
                editorCanvas.s.transaction(e.child[u], f + e.MaxWidth[a] + e.size, r + (s[o] - e.child[u].height) / 2);
                i = i < e.child[u].height ? e.child[u].height : i;
                f += e.MaxWidth[a] + e.size;
                u++
            }
            r += i;
            i = 0
        }
    }
    ;
    e.row = 3;
    e.colum = 3;
    e.children = e.row * e.colum;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["align"] = editorCanvas.simbol.prototype.options["matrix"];
editorCanvas.simbol.prototype.options["subscript"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        if (e == editorCanvas.root) {
            editorCanvas.s.regroup(e.child[1], t * .5)
        } else {
            editorCanvas.s.regroup(e.child[1], t * .75)
        }
        e.width = e.child[0].width + e.child[1].width;
        e.height = e.child[0].height + e.child[1].height - t * .5;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}_{" + e.child[1].getValue() + "}}";
        e.offset = e.child[1].height - e.size * .5
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n + e.child[0].height - e.size * .5)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["overline"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width;
        e.height = e.child[0].height + t / 8;
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "\\overline{" + e.child[0].getValue() + "}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.size / 8);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.size / 8);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width, n + e.size / 8);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["underline"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width;
        e.height = e.child[0].height + t / 4;
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "\\underline{" + e.child[0].getValue() + "}";
        e.offset = t / 4 + e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width, n + e.child[0].height);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["overbrace"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t / 2);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height + t / 4;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "\\overbrace{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.child[1].height + e.size / 4);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n);
        var r = (e.width - e.child[0].width) / 2;
        var i = e.child[0].width / 2 + r;
        editorCanvas.s.ctx.beginPath();
        if (e.child[0].width < e.size * 2) {
            editorCanvas.s.ctx.arc(t + r + e.size * .55, n + e.child[1].height + e.size * 1.15, e.size, 1.3 * Math.PI, 1.35 * Math.PI, false);
            editorCanvas.s.ctx.lineTo(t + i - 3, n + e.child[1].height + e.size / 4);
            editorCanvas.s.ctx.lineTo(t + i, n + e.child[1].height + e.size / 4 - 3);
            editorCanvas.s.ctx.lineTo(t + i + 3, n + e.child[1].height + e.size / 4);
            editorCanvas.s.ctx.arc(t + r + e.child[0].width - e.size * .55, n + e.child[1].height + e.size * 1.15, e.size, 1.65 * Math.PI, 1.7 * Math.PI, false)
        } else {
            editorCanvas.s.ctx.arc(t + r + e.size * .55, n + e.child[1].height + e.size * 1.15, e.size, 1.3 * Math.PI, 1.5 * Math.PI, false);
            editorCanvas.s.ctx.lineTo(t + i - 6, n + e.child[1].height + e.size / 4 - e.size * .1);
            editorCanvas.s.ctx.lineTo(t + i, n + e.child[1].height + e.size / 4 - 5 - e.size * .1);
            editorCanvas.s.ctx.lineTo(t + i + 6, n + e.child[1].height + e.size / 4 - e.size * .1);
            editorCanvas.s.ctx.arc(t + r + e.child[0].width - e.size * .55, n + e.child[1].height + e.size * 1.15, e.size, 1.5 * Math.PI, 1.7 * Math.PI, false)
        }
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["underbrace"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t / 2);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height + t / 4;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "\\underbrace{" + e.child[0].getValue() + "}_{" + e.child[1].getValue() + "}";
        e.offset = t / 4 + e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n + e.child[0].height + e.size / 4);
        var r = (e.width - e.child[0].width) / 2;
        var i = e.child[0].width / 2 + r;
        editorCanvas.s.ctx.beginPath();
        if (e.child[0].width < e.size * 2) {
            editorCanvas.s.ctx.arc(t + r + e.size * .55, n + e.child[0].height - e.size * .9, e.size, .7 * Math.PI, .65 * Math.PI, true);
            editorCanvas.s.ctx.lineTo(t + i - 3, n + e.child[0].height);
            editorCanvas.s.ctx.lineTo(t + i, n + e.child[0].height + 3);
            editorCanvas.s.ctx.lineTo(t + i + 3, n + e.child[0].height);
            editorCanvas.s.ctx.arc(t + r + e.child[0].width - e.size * .55, n + e.child[0].height - e.size * .9, e.size, .35 * Math.PI, .3 * Math.PI, true)
        } else {
            editorCanvas.s.ctx.arc(t + r + e.size * .55, n + e.child[0].height - e.size * .9, e.size, .7 * Math.PI, .5 * Math.PI, true);
            editorCanvas.s.ctx.lineTo(t + i - 6, n + e.child[0].height + e.size * .1);
            editorCanvas.s.ctx.lineTo(t + i, n + e.child[0].height + 5 + e.size * .1);
            editorCanvas.s.ctx.lineTo(t + i + 6, n + e.child[0].height + e.size * .1);
            editorCanvas.s.ctx.arc(t + r + e.child[0].width - e.size * .55, n + e.child[0].height - e.size * .9, e.size, .5 * Math.PI, .3 * Math.PI, true)
        }
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["widehat"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width;
        e.height = e.child[0].height + t / 8;
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "\\widehat{" + e.child[0].getValue() + "}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.size / 8);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.size / 8);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width / 2, n);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width, n + e.size / 8);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["overrightarrow"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width;
        e.height = e.child[0].height + 5;
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "\\overrightarrow{" + e.child[0].getValue() + "}";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + 5);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + 5);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width, n + 5);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width - 5, n);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["underrightarrow"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.width = e.child[0].width;
        e.height = e.child[0].height + t / 2;
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "\\underrightarrow{" + e.child[0].getValue() + "}";
        e.offset = e.child[0].offset + e.size / 2
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height + e.size / 6);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width, n + e.child[0].height + e.size / 6);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width - e.size / 3, n + e.child[0].height);
        editorCanvas.s.ctx.stroke();
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + e.child[0].width, n + e.child[0].height + e.size / 6);
        editorCanvas.s.ctx.lineTo(t + e.child[0].width - e.size / 3, n + e.child[0].height + e.size / 3);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 1;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["subsup"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        editorCanvas.s.regroup(e.child[2], t * .5);
        e.width = e.child[1].width > e.child[2].width ? e.child[0].width + e.child[1].width : e.child[0].width + e.child[2].width;
        e.height = e.child[0].height + e.child[1].height + e.child[2].height - t * .75;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.level = e.level > e.child[2].level ? e.level : e.child[2].level + 1;
        e.size = t;
        e.offset = e.child[2].height - e.size * .375 + e.child[0].offset;
        e.value = "{" + e.child[0].getValue() + "}_{" + e.child[2].getValue() + "}^{" + e.child[1].getValue() + "}"
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n + e.child[1].height - e.size * .375);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n);
        editorCanvas.s.transaction(e.child[2], t + e.child[0].width, n + e.child[1].height + e.child[0].height - e.size * .75)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["updown"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        editorCanvas.s.regroup(e.child[2], t * .5);
        e.width = Math.max(e.child[0].width, e.child[1].width, e.child[2].width);
        e.level = Math.max(e.child[0].leave + 1, e.child[1].level, e.child[2].level) + 1;
        e.height = e.child[0].height + e.child[1].height + e.child[2].height;
        e.offset = e.child[2].height;
        e.value = "\\mathop{" + e.child[0].getValue() + "}\\limits_{" + e.child[2].getValue() + "}^{" + e.child[1].getValue() + "}"
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.child[1].height);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n);
        editorCanvas.s.transaction(e.child[2], t + (e.width - e.child[2].width) / 2, n + e.child[0].height + e.child[1].height)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["up"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.offset = 0;
        e.value = "\\mathop{" + e.child[0].getValue() + "}\\limits^{" + e.child[1].getValue() + "}"
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.child[1].height);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["down"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.offset = e.child[1].height;
        e.value = "\\mathop{" + e.child[0].getValue() + "}\\limits_{" + e.child[1].getValue() + "}"
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n + e.child[0].height)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.brackets = function () {
    var e = {};
    e.regroup = function (e, t, n, r) {
        editorCanvas.s.regroup(e.child[0], t);
        e.height = e.child[0].height;
        e.width = e.child[0].width;
        if (n != "") {
            e.width += 10
        }
        if (r != "") {
            e.width += 10
        }
        e.level = e.child[0].level + 1;
        e.size = t;
        e.value = "";
        if (n == "{" || n == "}") {
            e.value = "\\left\\" + n
        } else {
            e.value = "\\left" + n
        }
        e.value += "{" + e.child[0].getValue() + "}";
        if (r == "{" || r == "}") {
            e.value += "\\right\\" + r
        } else {
            e.value += "\\right" + r
        }
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n, r, i) {
        if (r != "") {
            editorCanvas.s.transaction(e.child[0], t + 10, n);
            this.drawer(e.child[0], t + 2, n, r);
            this.drawer(e.child[0], t + 10 + e.child[0].width, n, i)
        } else {
            editorCanvas.s.transaction(e.child[0], t, n);
            this.drawer(e.child[0], t + e.child[0].width, n, i)
        }
    }
    ;
    e.drawer = function (e, t, n, r) {
        editorCanvas.s.ctx.beginPath();
        switch (r) {
            case "{":
                {
                    editorCanvas.s.ctx.arc(t + e.size * .15 + 5, n + 5, 5, 1.5 * Math.PI, 1 * Math.PI, true);
                    editorCanvas.s.ctx.lineTo(t + e.size * .15, n + e.height / 2 - 4);
                    editorCanvas.s.ctx.lineTo(t + e.size * .15 - 3, n + e.height / 2);
                    editorCanvas.s.ctx.lineTo(t + e.size * .15, n + e.height / 2 + 4);
                    editorCanvas.s.ctx.arc(t + e.size * .15 + 5, n + e.height - 5, 5, 1 * Math.PI, .5 * Math.PI, true);
                    break
                }
                ;
            case "}":
                {
                    editorCanvas.s.ctx.arc(t + e.size * .1 - 5, n + 5, 5, 1.5 * Math.PI, 2 * Math.PI, false);
                    editorCanvas.s.ctx.lineTo(t + e.size * .1, n + e.height / 2 - 6);
                    editorCanvas.s.ctx.lineTo(t + e.size * .1 + 5, n + e.height / 2);
                    editorCanvas.s.ctx.lineTo(t + e.size * .1, n + e.height / 2 + 6);
                    editorCanvas.s.ctx.arc(t + e.size * .1 - 5, n + e.height - 5, 5, 0 * Math.PI, .5 * Math.PI, false);
                    break
                }
                ;
            case "[":
                {
                    editorCanvas.s.ctx.moveTo(t + e.size / 4, n);
                    editorCanvas.s.ctx.lineTo(t, n);
                    editorCanvas.s.ctx.lineTo(t, n + e.height);
                    editorCanvas.s.ctx.lineTo(t + e.size / 4, n + e.height);
                    break
                }
                ;
            case "]":
                {
                    editorCanvas.s.ctx.moveTo(t, n);
                    editorCanvas.s.ctx.lineTo(t + e.size / 4, n);
                    editorCanvas.s.ctx.lineTo(t + e.size / 4, n + e.height);
                    editorCanvas.s.ctx.lineTo(t, n + e.height);
                    break
                }
                ;
            case "(":
                {
                    editorCanvas.s.ctx.moveTo(t + e.size / 4, n);
                    editorCanvas.s.ctx.quadraticCurveTo(t - e.size / 4, n + e.height / 2, t + e.size / 4, n + e.height);
                    break
                }
                ;
            case ")":
                {
                    editorCanvas.s.ctx.moveTo(t, n);
                    editorCanvas.s.ctx.quadraticCurveTo(t + e.size / 2, n + e.height / 2, t, n + e.height);
                    break
                }
                ;
            case "|":
                {
                    editorCanvas.s.ctx.moveTo(t + e.size / 8, n);
                    editorCanvas.s.ctx.lineTo(t + e.size / 8, n + e.height);
                    break
                }
                ;
            default:
                break
        }
        editorCanvas.s.ctx.stroke()
    }
    ;
    return e
}();
editorCanvas.simbol.prototype.options["bracket"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, e.arg[0], e.arg[1])
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, e.arg[0], e.arg[1])
    }
    ;
    e.children = 1;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["smallBracket"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, "(", ")")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, "(", ")")
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["middleBracket"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, "[", "]")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, "[", "]")
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["bigBracket"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, "{", "}")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, "{", "}")
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["lbBracket"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, "{", "")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, "{", "")
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["abs"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.brackets.regroup(e, t, "|", "|")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.brackets.draw(e, t, n, "|", "|")
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["equation"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t);
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height;
        //e.value = "\\begin{array}{l}{" + e.child[0].getValue() + "}\\\\{" + e.child[1].getValue() + "}\\end{array}";
        e.value = "\\begin{cases}{" + e.child[0].getValue() + "}\\\\{" + e.child[1].getValue() + "}\\end{cases}";
        e.size = t;
            e.offset = (e.height - t) / 2;
        }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t, n + e.child[0].height)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["equation3"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t);
        editorCanvas.s.regroup(e.child[2], t);
        e.level = Math.max(e.child[0].level, e.child[1].level, e.child[2].level) + 1;
        e.width = Math.max(e.child[0].width, e.child[1].width, e.child[2].width);
        e.height = e.child[0].height + e.child[1].height + e.child[2].height;
        e.value = "\\begin{array}{l}{" + e.child[0].getValue() + "}\\\\{" + e.child[1].getValue() + "}\\\\{" + e.child[2].getValue() + "}\\end{array}";
        e.size = t;
        e.offset = (e.height - t) / 2
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t, n + e.child[0].height);
        editorCanvas.s.transaction(e.child[2], t, n + e.child[0].height + e.child[1].height)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["equationN"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        e.value = "\\begin{array}{l}";
        e.level = 0;
        e.width = 0;
        e.height = 0;
        for (var n = 0; n < e.child.length; n++) {
            editorCanvas.s.regroup(e.child[n], t);
            e.level = Math.max(e.level, e.child[n].level);
            e.width = Math.max(e.width, e.child[n].width);
            e.height += e.child[n].height;
            e.value += "{" + e.child[n].getValue() + "}\\\\"
        }
        e.level++;
        e.value += "\\end{array}";
        e.size = t;
        e.offset = (e.height - t) / 2
    }
    ;
    e.draw = function (e, t, n) {
        var r = 0;
        for (var i = 0; i < e.child.length; i++) {
            editorCanvas.s.transaction(e.child[i], t, n + r);
            r += e.child[i].height
        }
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["em"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        e.level = e.child[0].level;
        e.width = e.child[0].width;
        e.height = e.child[0].height;
        e.value = "\\em{" + e.child[0].getValue() + "}";
        e.size = t;
        e.offset = 0
    }
    ;
    e.draw = function (e, t, n) {
        var r = editorCanvas.s.color;
        editorCanvas.s.color = "#FF0000";
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.color = r;
        editorCanvas.s.setFont()
    }
    ;
    e.children = 1;
    e.defaultValue[0] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["DownStandard"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width + e.child[1].width;
        e.height = e.child[0].height + e.child[1].height - t * .375;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.size = t;
        e.value = "{{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "}}"
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t, n);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width, n + e.child[0].height - e.size * .375)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.trifunction = function () {
    var e = {};
    e.regroup = function (e, t, n) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.width = e.child[0].width + e.child[1].width + editorCanvas.widthGetter(n);
        if (e.child[1].getValue() == "") {
            e.height = e.child[0].height
        } else {
            e.height = e.child[1].height - .5 * t + e.size > e.child[0].height ? e.child[1].height - .5 * t + e.size : e.child[0].height
        }
        e.level = (e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level) + 1;
        e.size = t;
        e.value = "";
        e.offset = e.child[0].offset
    }
    ;
    e.draw = function (e, t, n, r) {
        var i = editorCanvas.widthGetter(r);
        editorCanvas.s.setFont(e.size);
        editorCanvas.s.ctx.fillText(r, t, n + e.height - e.offset);
        editorCanvas.s.transaction(e.child[1], t + i, n + e.height - e.size * .5 - e.child[1].height - e.offset);
        editorCanvas.s.transaction(e.child[0], t + i + e.child[1].width, n + e.height - e.child[0].height)
    }
    ;
    return e
}();
editorCanvas.simbol.prototype.options["sin"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.trifunction.regroup(e, t, "sin")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.trifunction.draw(e, t, n, "sin")
    }
    ;
    e.children = 2;
    e.defaultValue[0] = null;
    e.defaultValue[1] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["cos"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.trifunction.regroup(e, t, "cos")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.trifunction.draw(e, t, n, "cos")
    }
    ;
    e.children = 2;
    e.defaultValue[0] = null;
    e.defaultValue[1] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["tan"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.trifunction.regroup(e, t, "tan")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.trifunction.draw(e, t, n, "tan")
    }
    ;
    e.children = 2;
    e.defaultValue[0] = null;
    e.defaultValue[1] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["cot"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.trifunction.regroup(e, t, "cot")
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.trifunction.draw(e, t, n, "cot")
    }
    ;
    e.children = 2;
    e.defaultValue[0] = null;
    e.defaultValue[1] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["integral"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t * .5);
        editorCanvas.s.regroup(e.child[1], t * .5);
        editorCanvas.s.regroup(e.child[2], t);
        e.height = e.child[0].height + e.child[1].height + e.child[2].height;
        e.width = t * .5;
        e.width += e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width += e.child[2].width;
        e.width += e.height * .5;
        e.level = Math.max(e.child[0].level, e.child[1].level, e.child[2].level) + 1;
        e.size = t;
        e.value = "\\int^{" + e.child[0].getValue() + "}_{" + e.child[1].getValue() + "}" + e.child[2].getValue();
        e.offset = e.child[0].height > e.child[2].offset ? e.child[0].height : e.child[2].offset
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.setFont(e.height - e.child[1].height / 2);
        editorCanvas.s.ctx.fillText("∫", t + e.height * -.2, n + e.height - e.child[1].height * .5);
        var r = Math.max(e.child[0].width, e.child[1].width);
        editorCanvas.s.transaction(e.child[0], t + e.height * .5, n);
        editorCanvas.s.transaction(e.child[1], t + e.height * .5, n + e.child[0].height + e.child[2].height);
        editorCanvas.s.transaction(e.child[2], t + r + e.height * .5, n + e.child[0].height)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 2;
    return e
}();
editorCanvas.simbol.prototype.options["int"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t * .5);
        editorCanvas.s.regroup(e.child[1], t * .5);
        e.height = e.child[0].height + e.child[1].height + e.size;
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width += e.height * .6;
        e.level = Math.max(e.child[0].level, e.child[1].level) + 1;
        e.size = t;
        e.value = "\\int^{" + e.child[0].getValue() + "}_{" + e.child[1].getValue() + "}";
        e.offset = e.child[1].height * .8
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.setFont(e.height * .8);
        editorCanvas.s.ctx.fillText("∫", t + e.height * -.2, n + e.height - e.child[1].height * .5);
        var r = Math.max(e.child[0].width, e.child[1].width);
        editorCanvas.s.transaction(e.child[0], t + e.height * .5, n);
        editorCanvas.s.transaction(e.child[1], t + e.height * .5, n + e.child[0].height + e.size)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["bigcup"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        if (e == editorCanvas.root) {
            editorCanvas.s.regroup(e.child[0], t * .65);
            editorCanvas.s.regroup(e.child[1], t * .65)
        } else {
            editorCanvas.s.regroup(e.child[0], t);
            editorCanvas.s.regroup(e.child[1], t)
        }
        editorCanvas.s.regroup(e.child[2], t);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width = e.width > t ? e.width : t;
        e.width += e.child[2].width;
        var n = e.child[1].height + t / 2;
        var r = e.child[0].height + t / 2;
        n = n > e.child[2].height / 2 ? n : e.child[2].height / 2;
        r = r > e.child[2].height / 2 ? r : e.child[2].height / 2;
        e.height = n + r;
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level;
        e.level = e.level > e.child[2].level ? e.level : e.child[2].level + 1;
        e.size = t;
        e.value = "{ \\bigcup\\limits_{" + e.child[0].getValue() + "}^{" + e.child[1].getValue() + "} {" + e.child[2].getValue() + "} " + "}";
        e.offset = e.child[0].height > e.child[2].offset ? e.child[0].height : e.child[2].offset
    }
    ;
    e.draw = function (e, t, n) {
        var r, i;
        r = t + (e.width - e.child[2].width - e.child[1].width) / 2;
        if (e.child[1].height + e.size / 2 > e.child[2].height / 2) {
            i = n
        } else {
            i = n + e.child[2].height / 2 - (e.child[1].height + e.size / 2)
        }
        editorCanvas.s.transaction(e.child[1], r, i);
        editorCanvas.s.setFont(e.size * .88);
        editorCanvas.s.ctx.fillText("∪", t + (e.width - e.child[2].width - e.size * .8) / 2, i + e.child[1].height + e.size * .8);
        r = t + (e.width - e.child[2].width - e.child[0].width) / 2;
        i = i + e.child[1].height + e.size;
        editorCanvas.s.transaction(e.child[0], r, i);
        r = t + e.width - e.child[2].width;
        if (e.child[2].height / 2 > e.child[1].height + e.size / 2) {
            i = n
        } else {
            i = n + e.child[1].height + e.size / 2 - e.child[2].height / 2
        }
        editorCanvas.s.transaction(e.child[2], r, i)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 2;
    return e
}();
editorCanvas.simbol.prototype.options["underset"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[1], t);
        editorCanvas.s.regroup(e.child[0], t * .5);
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.height = e.child[0].height + e.child[1].height;
        e.level = (e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level) + 1;
        e.size = t;
        e.value = "\\underset{" + e.child[1].getValue() + "}{" + e.child[0].getValue() + "}";
        e.offset = e.child[1].offset + e.child[0].height
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n);
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.child[1].height)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["equation2x"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        var n = new editorCanvas.node("equation");
        n.child[0] = e.child[0];
        n.child[1] = e.child[1];
        e.type = "lbBracket";
        e.child[0] = n;
        editorCanvas.s.regroup(e, t)
    }
    ;
    e.children = 2;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["equation3x"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        var n = new editorCanvas.node("equation3");
        n.child[0] = e.child[0];
        n.child[1] = e.child[1];
        n.child[2] = e.child[2];
        e.type = "lbBracket";
        e.child[0] = n;
        editorCanvas.s.regroup(e, t)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++)
        e.defaultValue[t] = null;
    e.major = 0;
    return e
}();
editorCanvas.simbol.prototype.options["log_subsup"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.s.regroup(e.child[0], t);
        editorCanvas.s.regroup(e.child[1], t);
        editorCanvas.s.regroup(e.child[2], t * .5);
        e.width = e.child[0].width + e.child[1].width + e.child[2].width;
        e.height = e.child[0].height > e.child[1].height ? e.child[0].height + e.child[2].height - t * .5 : e.child[1].height + e.child[2].height - t * .5;
        e.level = e.child[1].level + 1;
        e.level = e.level > e.child[2].level ? e.level : e.child[2].level + 1;
        e.size = t;
        e.offset = e.child[2].height - e.size * .375 + e.child[1].offset;
        e.value = "{" + e.child[0].getValue() + "}_{" + e.child[2].getValue() + "}{" + e.child[1].getValue() + "}"
    }
    ;
    e.draw = function (e, t, n) {
        var r = e.child[0].height > e.child[1].height ? e.child[0].height : e.child[1].height;
        editorCanvas.s.transaction(e.child[0], t, n + r - e.size);
        editorCanvas.s.transaction(e.child[1], t + e.child[0].width + e.child[2].width, n);
        editorCanvas.s.transaction(e.child[2], t + e.child[0].width, n + r - e.size * .5)
    }
    ;
    e.children = 3;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "log";
    e.major = 1;
    return e
}();
editorCanvas.simbol.prototype.options["GWconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "高温";
    return e
}();
editorCanvas.simbol.prototype.options["JRconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "加热";
    return e
}();
editorCanvas.simbol.prototype.options["DRconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "点燃";
    return e
}();
editorCanvas.simbol.prototype.options["TDconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "通电";
    return e
}();
editorCanvas.simbol.prototype.options["DJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "电解";
    return e
}();
editorCanvas.simbol.prototype.options["BZconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "爆炸";
    return e
}();
editorCanvas.simbol.prototype.options["FDconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "放电";
    return e
}();
editorCanvas.simbol.prototype.options["CHJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "催化剂";
    return e
}();
editorCanvas.simbol.prototype.options["JHMconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "酒化酶";
    return e
}();
editorCanvas.simbol.prototype.options["SJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "△";
    return e
}();
editorCanvas.simbol.prototype.options["MNO2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "MnO2";
    return e
}();
editorCanvas.simbol.prototype.options["JR2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "加热";
    return e
}();
editorCanvas.simbol.prototype.options["GW2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "高温";
    return e
}();
editorCanvas.simbol.prototype.options["CHJ2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "催化剂";
    return e
}();
editorCanvas.simbol.prototype.options["TD2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "通电";
    return e
}();
editorCanvas.simbol.prototype.options["MNO22conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "MnO2";
    return e
}();
editorCanvas.simbol.prototype.options["JHM2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "酒化酶";
    return e
}();
editorCanvas.simbol.prototype.options["M2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "酶";
    return e
}();
editorCanvas.simbol.prototype.options["TYN1CHJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "太阳能";
    e.defaultValue[1] = "催化剂";
    return e
}();
editorCanvas.simbol.prototype.options["CHJ1GWGYconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "催化剂";
    e.defaultValue[1] = "高温高压";
    return e
}();
editorCanvas.simbol.prototype.options["DFM2conditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 1, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 1, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "淀粉酶";
    return e
}();
editorCanvas.simbol.prototype.options["MNO21SJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 1)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "MnO2";
    e.defaultValue[1] = "△";
    return e
}();
editorCanvas.simbol.prototype.options["CHJ2SJconditions"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 2)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    e.defaultValue[0] = "催化剂";
    e.defaultValue[1] = "△";
    return e
}();
editorCanvas.simbol.prototype.options["twolinefrac"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 1)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 1)
    }
    ;
    e.children = 2;
    e.major = 1;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    return e
}();
editorCanvas.simbol.prototype.options["rowfrac"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 2)
    }
    ;
    e.children = 2;
    e.major = 1;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    return e
}();
editorCanvas.simbol.prototype.options["twoarrowfrac"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 3)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.chemistryDraw(e, t, n, 2, 3)
    }
    ;
    e.children = 2;
    e.major = 0;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    return e
}();
editorCanvas.chemistryRegroup = function (e, t, n, r) {
    editorCanvas.s.regroup(e.child[0], t * .5);
    editorCanvas.s.regroup(e.child[1], t * .5);
    if (n == 1) {
        e.level = e.child[0].level + 1;
        e.width = e.child[0].width;
        e.width += e.level * t / 4
    } else if (n == 2) {
        e.level = e.child[0].level > e.child[1].level ? e.child[0].level : e.child[1].level + 1;
        e.width = e.child[0].width > e.child[1].width ? e.child[0].width : e.child[1].width;
        e.width += e.level * t / 4
    }
    e.height = e.child[0].height + e.child[1].height + e.size * 1.2;
    if (r == 1) {
        e.value = "{\\twolinefrac{" + e.child[0].value + "}{" + e.child[1].value + "}}"
    } else if (r == 2) {
        e.value = "{\\rowfrac{" + e.child[0].value + "}{" + e.child[1].value + "}}"
    } else if (r == 3) {
        e.value = "{\\twoarrowfrac{" + e.child[0].value + "}{" + e.child[1].value + "}}"
    }
    e.size = t;
    e.offset = e.child[1].height
}
;
editorCanvas.chemistryDraw = function (e, t, n, r, i) {
    if (r == 1) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.size * .4)
    } else if (r == 2) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n + e.size * .4);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n + e.size * .4 + e.child[0].height + 10)
    }
    if (i == 1) {
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height + 3 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + 3 + e.size * .4);
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height + 8 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + 8 + e.size * .4);
        editorCanvas.s.ctx.stroke()
    } else if (i == 2) {
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height + 6 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + 6 + e.size * .4);
        editorCanvas.s.ctx.moveTo(t + e.width - 4, n + e.child[0].height + 6 - 4 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + 6 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width - 4, n + e.child[0].height + 6 + 4 + e.size * .4);
        editorCanvas.s.ctx.stroke()
    } else if (i == 3) {
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t + e.width, n + e.child[0].height + 3 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t, n + e.child[0].height + 3 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.size / 6, n + e.child[0].height - e.size / 6 + 3 + e.size * .4);
        editorCanvas.s.ctx.moveTo(t, n + e.child[0].height + e.size / 6 + 3 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + e.size / 6 + 3 + e.size * .4);
        editorCanvas.s.ctx.lineTo(t + e.width - e.size / 6, n + e.child[0].height + e.size / 3 + 3 + e.size * .4);
        editorCanvas.s.ctx.stroke()
    }
}
;
editorCanvas.simbol.prototype.options["arrowfrac"] = function () {
    var e = new editorCanvas.operation;
    e.regroup = function (e, t) {
        editorCanvas.chemistryRegroup(e, t, 2, 2)
    }
    ;
    e.draw = function (e, t, n) {
        editorCanvas.s.transaction(e.child[0], t + (e.width - e.child[0].width) / 2, n);
        editorCanvas.s.transaction(e.child[1], t + (e.width - e.child[1].width) / 2, n + e.child[0].height + e.size / 8);
        editorCanvas.s.ctx.beginPath();
        editorCanvas.s.ctx.moveTo(t - e.size / 8 + e.width, n + e.child[0].height);
        editorCanvas.s.ctx.lineTo(t + e.size / 8, n + e.child[0].height);
        editorCanvas.s.ctx.moveTo(t + e.size / 8, n + e.child[0].height + e.size / 8);
        editorCanvas.s.ctx.lineTo(t - e.size / 8 + e.width, n + e.child[0].height + e.size / 8);
        editorCanvas.s.ctx.moveTo(t + e.size / 4, n + e.child[0].height - e.size / 8);
        editorCanvas.s.ctx.lineTo(t, n + e.child[0].height + e.size / 16);
        editorCanvas.s.ctx.lineTo(t + e.size / 4, n + e.child[0].height + e.size / 4);
        editorCanvas.s.ctx.moveTo(t + e.width - e.size / 4, n + e.child[0].height - e.size / 8);
        editorCanvas.s.ctx.lineTo(t + e.width, n + e.child[0].height + e.size / 16);
        editorCanvas.s.ctx.lineTo(t + e.width - e.size / 4, n + e.child[0].height + e.size / 4);
        editorCanvas.s.ctx.stroke()
    }
    ;
    e.children = 2;
    e.major = 1;
    for (var t = 0; t < e.children; t++) {
        e.defaultValue[t] = null
    }
    return e
}();
editorCanvas.Analysis = function (e) {
    var t = this;
    t.root = e.node("undefine");
    t.latex;
    t.count = 0;
    t.distribute = function (n, r) {
        t.latex = n;
        t.checkout();
        t.root = t.analyse(t.latex);
        e.root = t.root;
        if (!e.root || e.root == null) {
            e.root = new editorCanvas.node("shuzi");
            e.root.value = ""
        }
        if (r) {
            e.root = t.addShuziNodeInBothSides(e.root);
            t.setUndefineNode(e.root)
        }
        e.s.regroup(e.root, e.s.csize || 14);
        e.replay();
        if (r) {
            e.relink()
        }
    }
}
;
editorCanvas.Analysis.prototype.unary = function (e, t) {
    var n = new editorCanvas.node(t);
    var r = 0;
    r = editorCanvas.a.getter(e, "{", "}");
    n.child[0] = editorCanvas.a.analyse(e.substring(1, r));
    if (r < e.length - 1) {
        if (e.charAt(r + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(r + 2), n)
        }
        if (e.charAt(r + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(r + 2), n)
        }
        var i = new editorCanvas.node("right");
        i.child[0] = n;
        i.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
        return i
    } else {
        return n
    }
}
;
editorCanvas.Analysis.prototype.binary = function (e, t) {
    var n = new editorCanvas.node(t);
    var r = 0;
    var i = 0;
    r = editorCanvas.a.getter(e, "{", "}");
    n.child[0] = editorCanvas.a.analyse(e.substring(1, r));
    if (e.charAt(r + 1) == "_" || e.charAt(r + 1) == "^") {
        r++
    }
    i = r;
    if (e.charAt(r + 1) == "{") {
        r = editorCanvas.a.getter(e.substring(r + 1), "{", "}") + i + 1;
        n.child[1] = editorCanvas.a.analyse(e.substring(i + 2, r))
    } else {
        n.child[1] = editorCanvas.a.analyse("")
    }
    if (r < e.length - 1) {
        if (e.charAt(r + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(r + 2), n)
        }
        if (e.charAt(r + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(r + 2), n)
        }
        var s = new editorCanvas.node("right");
        s.child[0] = n;
        s.child[1] = editorCanvas.a.analyse(e.substring(r + 1, e.length));
        return s
    } else {
        return n
    }
}
;
editorCanvas.Analysis.prototype.getter = function (e, t, n) {
    var r = 0;
    for (var i = 0; i < e.length; i++) {
        if (e.substring(i, i + t.length) == t) {
            if (i > 0 && e.substring(i - 1, i) == "\\") {
                if (e.charAt(i - 2, i - 1) == "\\") {
                    r++
                }
            } else {
                r++
            }
        }
        if (e.substring(i, i + n.length) == n) {
            if (i > 0 && e.substring(i - 1, i) == "\\") {
                if (e.substring(i - 2, i - 1) == "\\") {
                    r--
                }
            } else {
                if (--r == 0) {
                    return i
                }
            }
        }
    }
    return -1
}
;
editorCanvas.Analysis.prototype.checkout = function () {
    this.latex = this.latex.replace(/(\\[a-zA-Z]*)\s([a-zA-Z])/g, "$1{$2}").replace(/\s|\n/g, "").replace(/<em>(array|left|right|begin|end)<\/em>/gi, "$1").replace(/({)<em>(.*?)<\/em>(.)/gi, function (e, t, n, r) {
        if (r == "}") {
            return t + "\\" + "em{" + n + "}" + r
        } else {
            return e
        }
    }).replace(/^<em>(.*?)<\/em>$/gi, "\\em{$1}").replace(/<em>|<\/em>/gi, "").replace(/&nbsp;/g, "").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/(\\begin{)\\em{(.*?)}(.*?)/gi, "$1$2$3").replace(/(\\begin{.*?}{)\\em{(.*?)}(.*?)/gi, "$1$2$3").replace(/\\text/g, "").replace(/\\right\./, "\\right");
    this.latex = this.latex.replace(/(.*?)\\{\\begin(.*?)\\end{(.*?)}(.*?)$/g, function (e, t, n, r, i) {
        var s = "";
        if (t.slice(-5) != "\\left") {
            s += t + "\\left"
        } else {
            s += t
        }
        s += "\\{\\begin" + n + "\\end{" + r + "}";
        if (i.slice(0, 6) != "\\right") {
            s += "\\right" + i
        } else {
            s += i
        }
        return s
    })
}
;
editorCanvas.Analysis.prototype.analyse = function (e) {
    if (this.count > 200) {
        if (typeof console !== "undefined" && console.log) {
            console.log("too big")
        }
        return new editorCanvas.node("undefine")
    }
    this.count++;
    if (e.charAt(0) != "\\") {
        var t = 0;
        if (e.charAt(0) == "{") {
            t = this.getter(e, "{", "}");
            if (t + 1 == e.length) {
                return this.analyse(e.substring(1, t))
            }
            if (t == -1) {
                return this.options["shuzi"](e)
            }
            switch (e.charAt(t + 1)) {
                case "^":
                    return this.options["exponent"](e);
                case "_":
                    return this.options["subscript"](e);
                default:
                    return this.options["shuzi"](e.substring(1, t) + e.substring(t + 1))
            }
        } else {
            return this.options["shuzi"](e)
        }
    } else {
        var n = /[a-zA-Z]/;
        if (n.test(e.substr(1, 1))) {
            for (var r = 1; r < e.length; r++) {
                if (!n.test(e.substr(r, 1))) {
                    if (!this.options[e.substring(1, r)] || this.options[e.substring(1, r)] == null) {
                        var i = new editorCanvas.node("right");
                        i.child[0] = new editorCanvas.node("shuzi");
                        i.child[0].value = e.substring(1, r);
                        i.child[1] = this.analyse(e.substring(r + 1));
                        return i
                    }
                    return this.options[e.substring(1, r)](e.substring(r, e.length), e.substring(1, r))
                }
            }
            if (!this.options[e.substring(1)] || this.options[e.substring(1)] == null) {
                return this.analyse(e.substring(1))
            }
            return this.options[e.substring(1)]("", e.substring(1))
        } else {
            switch (e.charAt(1)) {
                case "{":
                    return this.options["translate"](e);
                case "}":
                    return this.options["translate"](e);
                case "\\":
                    return this.options["translate"](e);
                case ",":
                case "_":
                    return this.options["translate"](e);
                case "^":
                    return this.options["translate"](e);
                case "[":
                    return this.options["translate"](e);
                case "]":
                    return this.options["translate"](e);
                default:
                    break
            }
        }
    }
    return this.analyse(e.substring(1))
}
;
editorCanvas.Analysis.prototype.setUndefineNode = function (e) {
    if (e != null) {
        for (var t = 0; t < e.child.length; t++) {
            if (e.type != "right" && e.child[t].type == "shuzi" && e.child[t].value == "") {
                var n = new editorCanvas.node("undefine");
                e.child[t] = n
            }
            this.setUndefineNode(e.child[t])
        }
    }
}
;
editorCanvas.Analysis.prototype.setNodeFather = function (e, t, n) {
    if (t <= n || n == -1) {
        if (e && e.child.length > 0) {
            for (var r = 0; r < e.child.length; r++) {
                e.child[r].father = e;
                e.child[r].kind = r;
                this.setNodeFather(e.child[r], t + 1, n)
            }
        }
    }
}
;
editorCanvas.Analysis.prototype.addShuziNodeInBothSides = function (e) {
    if (e.type != "shuzi" && e.type != "right" && e.type != "undefine") {
        if (e.father == null || e.father.child.length != 0) {
            var t = new editorCanvas.node("right");
            t.child[0] = e;
            t.child[1] = new editorCanvas.node("shuzi");
            if (e.father != null)
                e.father.child[e.kind] = t;
            else
                e.father = t
        } else if (e.father.type == "right") {
            var n = e.father.child[1];
            while (rigthFirst.type == "right") {
                n = n.child[0]
            }
            if (n.type != "shuzi") {
                var t = new editorCanvas.node("right");
                t.child[0] = new editorCanvas.node("shuzi");
                t.child[1] = e.father.child[1];
                e.father.child[e.kind] = t
            }
        }
        this.setNodeFather(e.father, 0, 3);
        if (e.father.father == null || e.father.father.child.length != 0) {
            var t = new editorCanvas.node("right");
            t.child[0] = new editorCanvas.node("shuzi");
            t.child[1] = e.father;
            if (e.father.father != null)
                e.father.father.child[e.father.kind] = t;
            else
                e.father.father = t
        } else if (e.father.father.type == "right") {
            var r = e.father.father.child[0];
            while (r.type == "right") {
                r = r.child[1]
            }
            if (r.type != "shuzi") {
                var t = new editorCanvas.node("right");
                t.child[0] = new editorCanvas.node("shuzi");
                t.child[1] = e.father;
                e.father.father.child[e.father.kind] = t
            }
        }
        for (var i = 0; i < e.child.length; i++) {
            this.addShuziNodeInBothSides(e.child[i])
        }
        this.setNodeFather(e.father.father, 0, 3);
        return e.father.father
    } else if (e.type == "right") {
        this.addShuziNodeInBothSides(e.child[0]);
        this.addShuziNodeInBothSides(e.child[1]);
        return e
    } else {
        return e
    }
}
;
editorCanvas.Analysis.prototype.options = [];
editorCanvas.Analysis.prototype.options["translate"] = function (e) {
    var t = new editorCanvas.node("right");
    t.child[0] = new editorCanvas.node("shuzi");
    t.child[0].value = e.substring(1, 2);
    t.child[1] = editorCanvas.a.analyse(e.substring(2));
    return t
}
;
editorCanvas.Analysis.prototype.options["shuzi"] = function (e) {
    for (var t = 0; t < e.length; t++) {
        switch (e.charAt(t)) {
            case "\\":
                var n = new editorCanvas.node("right");
                n.child[0] = editorCanvas.a.options["shuzi"](e.substring(0, t));
                n.child[1] = editorCanvas.a.analyse(e.substring(t));
                if (n.child[1].type == "shuzi") {
                    n.child[0].value += n.child[1].value;
                    return n.child[0]
                }
                return n;
                break;
            case "^":
                return editorCanvas.a.options["exponent"](e);
                break;
            case "_":
                return editorCanvas.a.options["subscript"](e);
                break;
            case "{":
                if (editorCanvas.a.getter(e, "{", "}") != -1) {
                    var n = new editorCanvas.node("right");
                    n.child[0] = editorCanvas.a.options["shuzi"](e.substring(0, t));
                    n.child[1] = editorCanvas.a.analyse(e.substring(t));
                    return n
                }
                break;
            default:
                break
        }
    }
    var n = new editorCanvas.node("shuzi");
    n.value = e;
    return n
}
;
editorCanvas.Analysis.prototype.options["sqrt"] = function (e) {
    var t = new editorCanvas.node("radicent");
    var n = 0;
    var r = 0;
    if (e.charAt(0) != "[") {
        n = -1;
        t.child[0] = editorCanvas.a.analyse("")
    } else {
        n = editorCanvas.a.getter(e, "[", "]");
        t.child[0] = editorCanvas.a.analyse(e.substring(1, n))
    }
    r = n;
    n = editorCanvas.a.getter(e.substring(n + 1), "{", "}") + r + 1;
    t.child[1] = editorCanvas.a.analyse(e.substring(r + 2, n));
    if (n < e.length - 1) {
        if (e.charAt(n + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(n + 2), t)
        }
        if (e.charAt(n + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(n + 2), t)
        }
        var i = new editorCanvas.node("right");
        i.child[0] = t;
        i.child[1] = editorCanvas.a.analyse(e.substring(n + 1, e.length));
        return i
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.exponent = function (e, t) {
    var n = new editorCanvas.node("exponent");
    var r = null;
    n.child[0] = t;
    var i = 0;
    var s = 0;
    if (e.charAt(0) != "{" || editorCanvas.a.getter(e.substring(0), "{", "}") == -1) {
        i = 1;
        n.child[1] = editorCanvas.a.analyse(e.charAt(0))
    } else {
        i = editorCanvas.a.getter(e, "{", "}");
        n.child[1] = editorCanvas.a.analyse(e.substring(1, i))
    }
    if (e.charAt(i + 1) == "_") {
        s = i + 2;
        r = new editorCanvas.node("supsub");
        r.child[0] = n.child[0];
        r.child[1] = n.child[1];
        if (e.charAt(s) != "{" || editorCanvas.a.getter(e.substring(i), "{", "}") == -1) {
            i = s;
            r.child[2] = editorCanvas.a.analyse(e.charAt(s))
        } else {
            i = editorCanvas.a.getter(e.substring(s), "{", "}");
            r.child[2] = editorCanvas.a.analyse(e.substring(s))
        }
    }
    if (i < e.length - 1) {
        var o = new editorCanvas.node("right");
        if (r == null) {
            o.child[0] = n;
            o.child[1] = editorCanvas.a.analyse(e.substring(i + 1))
        } else {
            o.child[0] = r;
            o.child[1] = editorCanvas.a.analyse(e.substring(i + 1))
        }
        return o
    } else {
        if (r == null) {
            return n
        } else {
            return r
        }
    }
}
;
editorCanvas.Analysis.prototype.subscript = function (e, t) {
    var n = new editorCanvas.node("subscript");
    var r = null;
    n.child[0] = t;
    var i = 0;
    var s = 0;
    if (e.charAt(0) != "{" || editorCanvas.a.getter(e.substring(0), "{", "}") == -1) {
        i = 1;
        n.child[1] = editorCanvas.a.analyse(e.charAt(0))
    } else {
        i = editorCanvas.a.getter(e, "{", "}");
        n.child[1] = editorCanvas.a.analyse(e.substring(1, i))
    }
    if (e.charAt(i + 1) == "^") {
        s = i + 2;
        r = new editorCanvas.node("supsub");
        r.child[0] = n.child[0];
        r.child[2] = n.child[1];
        if (e.charAt(s) != "{" || editorCanvas.a.getter(e.substring(i), "{", "}") == -1) {
            i = s;
            r.child[1] = editorCanvas.a.analyse(e.charAt(s))
        } else {
            i = editorCanvas.a.getter(e.substring(s), "{", "}");
            r.child[1] = editorCanvas.a.analyse(e.substring(s))
        }
    }
    if (i < e.length - 1) {
        var o = new editorCanvas.node("right");
        if (r == null) {
            o.child[0] = n;
            o.child[1] = editorCanvas.a.analyse(e.substring(i + 1))
        } else {
            o.child[0] = r;
            o.child[1] = editorCanvas.a.analyse(e.substring(i + 1))
        }
        return o
    } else {
        if (r == null) {
            return n
        } else {
            return r
        }
    }
}
;
editorCanvas.Analysis.prototype.options["exponent"] = function (e) {
    var t = new editorCanvas.node("exponent");
    var n = 0;
    var r = 0;
    if (e.charAt(0) == "{") {
        n = editorCanvas.a.getter(e, "{", "}");
        t.child[0] = editorCanvas.a.analyse(e.substring(1, n))
    } else {
        while (e.charAt(n) != "^" && n < e.length) {
            n++
        }
        t.child[0] = editorCanvas.a.analyse(e.substring(0, n));
        n--
    }
    if (e.charAt(n + 1) == "^") {
        n++
    }
    if (e.charAt(n + 1) != "{") {
        r = n + 1;
        if (e.charAt(n + 1) == "\\") {
            t.child[1] = editorCanvas.a.analyse(e.substring(n + 1));
            r = n + 1 + e.substring(n + 1).length
        } else {
            t.child[1] = editorCanvas.a.analyse(e.charAt(n + 1))
        }
    } else {
        r = editorCanvas.a.getter(e.substring(n + 1), "{", "}") + n + 1;
        t.child[1] = editorCanvas.a.analyse(e.substring(n + 2, r))
    }
    if (r < e.length - 1) {
        if (e.charAt(r + 1) == "_") {
            n = r + 2;
            var i = new editorCanvas.node("supsub");
            i.child[0] = t.child[0];
            i.child[1] = t.child[1];
            r = editorCanvas.a.getter(e.substring(n), "{", "}") + n;
            i.child[2] = editorCanvas.a.analyse(e.substring(n + 1, r));
            t = null;
            if (r < e.length - 1) {
                var s = new editorCanvas.node("right");
                s.child[0] = i;
                s.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
                return s
            }
        } else {
            var i = new editorCanvas.node("right");
            i.child[0] = t;
            i.child[1] = editorCanvas.a.analyse(e.substring(r + 1))
        }
        return i
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["subscript"] = function (e) {
    var t = new editorCanvas.node("subscript");
    var n = 0;
    var r = 0;
    if (e.charAt(0) == "{") {
        n = editorCanvas.a.getter(e, "{", "}");
        t.child[0] = editorCanvas.a.analyse(e.substring(1, n))
    } else {
        while (e.charAt(n) != "_" && n < e.length) {
            n++
        }
        t.child[0] = editorCanvas.a.analyse(e.substring(0, n));
        n--
    }
    if (e.charAt(n + 1) == "_") {
        n++
    }
    if (e.charAt(n + 1) != "{") {
        r = n + 1;
        if (e.charAt(n + 1) == "\\") {
            t.child[1] = editorCanvas.a.analyse(e.substring(n + 1));
            r = n + 1 + e.substring(n + 1).length
        } else {
            t.child[1] = editorCanvas.a.analyse(e.charAt(n + 1))
        }
    } else {
        r = editorCanvas.a.getter(e.substring(n + 1), "{", "}") + n + 1;
        t.child[1] = editorCanvas.a.analyse(e.substring(n + 2, r))
    }
    if (r < e.length - 1) {
        if (e.charAt(r + 1) == "^") {
            n = r + 2;
            var i = new editorCanvas.node("supsub");
            i.child[0] = t.child[0];
            i.child[2] = t.child[1];
            r = editorCanvas.a.getter(e.substring(n), "{", "}") + n;
            i.child[1] = editorCanvas.a.analyse(e.substring(n + 1, r));
            t = null;
            if (r < e.length - 1) {
                var s = new editorCanvas.node("right");
                s.child[0] = i;
                s.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
                return s
            }
        } else {
            var i = new editorCanvas.node("right");
            i.child[0] = t;
            i.child[1] = editorCanvas.a.analyse(e.substring(r + 1))
        }
        return i
    } else {
        return t
    }
}
;
editorCanvas.bigone = function (e, t) {
    var n = new editorCanvas.node(t);
    var r = 0;
    var i = 0;
    if (e.substring(0, 7) == "\\limits") {
        e = e.substring(7)
    }
    if (e.charAt(0) == "^") {
        r = editorCanvas.a.getter(e.substring(1), "{", "}") + 1;
        n.child[1] = editorCanvas.a.analyse(e.substring(2, r))
    } else if (e.charAt(0) == "_") {
        r = editorCanvas.a.getter(e.substring(1), "{", "}") + 1;
        n.child[0] = editorCanvas.a.analyse(e.substring(2, r))
    }
    if (e.charAt(r + 1) == "^") {
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[1] = editorCanvas.a.analyse(e.substring(r + 3, i))
    } else if (e.charAt(r + 1) == "_") {
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[0] = editorCanvas.a.analyse(e.substring(r + 3, i))
    }
    if (e.charAt(i + 1) != "{") {
        r = i + 1;
        n.child[2] = editorCanvas.a.analyse(e.charAt(i + 1))
    } else {
        r = editorCanvas.a.getter(e.substring(i + 1), "{", "}") + i + 1;
        n.child[2] = editorCanvas.a.analyse(e.substring(i + 2, r))
    }
    if (e.charAt(r + 1) == "^") {
        var s = n.child[2];
        n.child[2] = new editorCanvas.node("supsub");
        n.child[2].child[0] = s;
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[2].child[1] = editorCanvas.a.analyse(e.substring(r + 3, i));
        r = i
    } else if (e.charAt(r + 1) == "_") {
        var s = n.child[2];
        n.child[2] = new editorCanvas.node("supsub");
        n.child[2].child[0] = s;
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[2].child[2] = editorCanvas.a.analyse(e.substring(r + 3, i));
        r = i
    }
    if (e.charAt(r + 1) == "^") {
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[2].child[1] = editorCanvas.a.analyse(e.substring(r + 3, i));
        r = i
    } else if (e.charAt(r + 1) == "_") {
        i = editorCanvas.a.getter(e.substring(r + 2), "{", "}") + r + 2;
        n.child[2].child[2] = editorCanvas.a.analyse(e.substring(r + 3, i));
        r = i
    }
    if (r < e.length - 1) {
        var o = new editorCanvas.node("right");
        o.child[0] = n;
        o.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
        return o
    } else {
        return n
    }
}
;
editorCanvas.Analysis.prototype.options["sum"] = function (e) {
    return editorCanvas.bigone(e, "sum")
}
;
editorCanvas.Analysis.prototype.options["bigcup"] = function (e) {
    return editorCanvas.bigone(e, "bigcup")
}
;
editorCanvas.Analysis.prototype.options["bigcap"] = function (e) {
    return editorCanvas.bigone(e, "bigcap")
}
;
editorCanvas.Analysis.prototype.options["mathop"] = function (e) {
    var t = new editorCanvas.node("updown");
    var n = 0;
    var r = 0;
    n = editorCanvas.a.getter(e, "{", "}");
    t.child[0] = editorCanvas.a.analyse(e.substring(1, n));
    if (e.substr(n + 1, 7) == "\\limits") {
        n += 7
    }
    n++;
    r = editorCanvas.a.getter(e.substring(n + 1), "{", "}") + n + 1;
    if (e.charAt(n) == "_") {
        t.child[2] = editorCanvas.a.analyse(e.substring(n + 2, r));
        if (e.charAt(r + 1) != "^") {
            t.child[1] = editorCanvas.a.analyse(e.substring(n + 2, r));
            t.type = "down";
            if (r < e.length - 1) {
                var i = new editorCanvas.node("right");
                i.child[0] = t;
                i.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
                return i
            } else {
                return t
            }
        }
    } else if (e.charAt(n) == "^") {
        t.child[1] = editorCanvas.a.analyse(e.substring(n + 2, r));
        if (e.charAt(r + 1) != "_") {
            t.type = "up";
            if (r < e.length - 1) {
                var i = new editorCanvas.node("right");
                i.child[0] = t;
                i.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
                return i
            } else {
                return t
            }
        }
    } else {
        if (n < e.length - 1) {
            var i = new editorCanvas.node("right");
            i.child[0] = t.child[0];
            i.child[1] = editorCanvas.a.analyse(e.substring(n));
            return i
        } else {
            return t.child[0]
        }
    }
    r++;
    n = editorCanvas.a.getter(e.substring(r + 1), "{", "}") + r + 1;
    if (e.charAt(r) == "^") {
        t.child[1] = editorCanvas.a.analyse(e.substring(r + 2, n))
    } else if (e.charAt(r) == "_") {
        t.child[2] = editorCanvas.a.analyse(e.substring(r + 2, n))
    }
    if (n < e.length - 1) {
        if (e.charAt(n + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(n + 2), t)
        }
        if (e.charAt(n + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(n + 2), t)
        }
        var i = new editorCanvas.node("right");
        i.child[0] = t;
        i.child[1] = editorCanvas.a.analyse(e.substring(n + 1, e.length));
        return i
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["em"] = function (e) {
    return editorCanvas.a.unary(e, "em")
}
;
editorCanvas.Analysis.prototype.options["overline"] = function (e) {
    return editorCanvas.a.unary(e, "overline")
}
;
editorCanvas.Analysis.prototype.options["underline"] = function (e) {
    return editorCanvas.a.unary(e, "underline")
}
;
editorCanvas.Analysis.prototype.options["widehat"] = function (e) {
    return editorCanvas.a.unary(e, "widehat")
}
;
editorCanvas.Analysis.prototype.options["overrightarrow"] = function (e) {
    return editorCanvas.a.unary(e, "overrightarrow")
}
;
editorCanvas.Analysis.prototype.options["underrightarrow"] = function (e) {
    return editorCanvas.a.unary(e, "underrightarrow")
}
;
editorCanvas.Analysis.prototype.options["frac"] = function (e) {
    return editorCanvas.a.binary(e, "fraction")
}
;
editorCanvas.Analysis.prototype.options["twolinefrac"] = function (e) {
    return editorCanvas.a.binary(e, "twolinefrac")
}
;
editorCanvas.Analysis.prototype.options["rowfrac"] = function (e) {
    return editorCanvas.a.binary(e, "rowfrac")
}
;
editorCanvas.Analysis.prototype.options["xrightarrow"] = function (e) {
    return editorCanvas.a.binary(e, "rowfrac")
}
;
editorCanvas.Analysis.prototype.options["underset"] = function (e) {
    return editorCanvas.a.binary(e, "underset")
}
;
editorCanvas.Analysis.prototype.options["overbrace"] = function (e) {
    return editorCanvas.a.binary(e, "overbrace")
}
;
editorCanvas.Analysis.prototype.options["underbrace"] = function (e) {
    return editorCanvas.a.binary(e, "underbrace")
}
;
editorCanvas.Analysis.prototype.options["transfer"] = function (e) {
    return editorCanvas.a.binary(e, "transfer")
}
;
editorCanvas.Analysis.prototype.options["twoarrowfrac"] = function (e) {
    return editorCanvas.a.binary(e, "twoarrowfrac")
}
;
editorCanvas.Analysis.prototype.options["arrowfrac"] = function (e) {
    return editorCanvas.a.binary(e, "arrowfrac")
}
;
editorCanvas.Analysis.prototype.options["left"] = function (e) {
    var t = new editorCanvas.node("bracket");
    var n = 0;
    n = editorCanvas.a.getter("\\left" + e, "\\left", "\\right") - 5;
    if (e.charAt(0) == "\\" && e.charAt(1) == "{") {
        t.arg[0] = "{";
        t.child[0] = editorCanvas.a.analyse(e.substring(2, n))
    } else {
        if (e.charAt(0) == ".") {
            t.arg[0] = ""
        } else {
            t.arg[0] = e.charAt(0)
        }
        t.child[0] = editorCanvas.a.analyse(e.substring(1, n))
    }
    if (e.charAt(n + 6) == "\\" && e.charAt(n + 7) == "}") {
        t.arg[1] = "}";
        n++
    } else {
        if (e.charAt(n + 6) == ".") {
            t.arg[1] = ""
        } else {
            t.arg[1] = e.charAt(n + 6)
        }
    }
    n += 6;
    if (n < e.length - 1) {
        if (e.charAt(n) == "^") {
            return editorCanvas.a.exponent(e.substring(n + 1), t)
        }
        if (e.charAt(n) == "_") {
            return editorCanvas.a.subscript(e.substring(n + 1), t)
        }
        var r = new editorCanvas.node("right");
        r.child[0] = t;
        r.child[1] = editorCanvas.a.analyse(e.substring(n + 1));
        return r
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["matrix"] = function (e) {
    var t = new editorCanvas.node("matrix");
    var n = 0;
    e = e.substring(8);
    var r = 0;
    var i = 1;
    var s = 0;
    var o = [];
    o[0] = 0;
    for (var u = 0; u < e.length; u++) {
        if (e.charAt(u) == "\\") {
            if (e.substr(u + 1, 5) == "begin") {
                i++
            }
            if (e.substr(u + 1, 3) == "end") {
                i--;
                if (i == 0) {
                    if (n + 1 < u) {
                        o[s]++;
                        t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
                        n = u;
                        s++;
                        o[s] = 0
                    }
                    break
                }
            }
            if (e.charAt(u + 1) == "\\" && i == 1) {
                o[s]++;
                t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
                n = u + 2;
                s++;
                u++;
                o[s] = 0
            }
        } else if (e.charAt(u) == "&" && i == 1) {
            o[s]++;
            t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
            n = u + 1
        }
    }
    t.arg[0] = o;
    t.arg[1] = s;
    if (r == 0) {
        t.child[1] = new editorCanvas.node("shuzi");
        t.child[1].value = ""
    }
    n += 11;
    if (n < e.length - 1) {
        if (e.charAt(n + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(n + 2), t)
        }
        if (e.charAt(n + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(n + 2), t)
        }
        var a = new editorCanvas.node("right");
        a.child[0] = t;
        a.child[1] = editorCanvas.a.analyse(e.substring(n + 1));
        return a
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["align"] = function (e) {
    var t = new editorCanvas.node("align");
    var n = 0;
    e = e.substring(7);
    var r = 0;
    var i = 1;
    var s = 0;
    var o = [];
    o[0] = 0;
    for (var u = 0; u < e.length; u++) {
        if (e.charAt(u) == "\\") {
            if (e.substr(u + 1, 5) == "begin") {
                i++
            }
            if (e.substr(u + 1, 3) == "end") {
                i--;
                if (i == 0) {
                    if (n + 1 < u) {
                        o[s]++;
                        t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
                        n = u;
                        s++;
                        o[s] = 0
                    }
                    break
                }
            }
            if (e.charAt(u + 1) == "\\" && i == 1) {
                o[s]++;
                t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
                n = u + 2;
                s++;
                u++;
                o[s] = 0
            }
        } else if (e.charAt(u) == "&" && i == 1) {
            o[s]++;
            t.child[r++] = editorCanvas.a.analyse(e.substring(n, u));
            n = u + 1
        }
    }
    t.arg[0] = o;
    t.arg[1] = s + 1;
    if (r == 0) {
        t.child[1] = new editorCanvas.node("shuzi");
        t.child[1].value = ""
    }
    n += 11;
    if (n < e.length - 1) {
        if (e.charAt(n + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(n + 2), t)
        }
        if (e.charAt(n + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(n + 2), t)
        }
        var a = new editorCanvas.node("right");
        a.child[0] = t;
        a.child[1] = editorCanvas.a.analyse(e.substring(n + 1));
        return a
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["begin"] = function (e) {
    var t = new editorCanvas.node("equation");
    e = e.replace(/matrix\}\{(.*?)\}\\\\/g, "matrix}$1\\\\").replace(/\{\}/g, "");
    e = e.replace(/(matrix\})\\n(.*?)(\\\\)/g, "$1$2$3").replace(/(\\\\)\\n(\\end{array})/g, "$1$2");
    do {
        var n = e;
        e = e.replace(/(\\\\)\\n(.*?)(\\\\)/g, "$1$2$3")
    } while (n != e); e = e.replace(/(array\})(.*?\})\\n/, "$1$2");
    var r = 0;
    var i = 0;
    var s = null;
    var o = 0;
    var u = 1;
    var a;
    if (e.charAt(0) == "{") {
        if (e.substring(0, 8) == "{matrix}") {
            return this.matrix(e)
        } else if (e.substring(0, 7) == "{align}") {
            return this.align(e)
        }
        a = editorCanvas.a.getter(e, "{", "}");
        e = e.substring(a + 1);
        if (e.charAt(0) == "{") {
            a = editorCanvas.a.getter(e, "{", "}");
            e = e.substring(a + 1)
        }
    }
    for (var f = 0; f < e.length; f++) {
        if (e.charAt(f) == "\\") {
            if (e.charAt(f + 1) == "\\" && u == 1) {
                t.child[o++] = editorCanvas.a.analyse(e.substring(r, f).replace(/\\\\\{(.*?)\}\\\\/g, "\\\\$1\\\\"));
                r = f + 2;
                f++
            } else {
                if (e.substr(f + 1, 4) == "left") {
                    var l = editorCanvas.a.getter(e.substring(f), "\\left", "\\right");
                    f = f + l
                }
                if (e.substr(f + 1, 5) == "begin") {
                    u++
                }
                if (e.substr(f + 1, 3) == "end") {
                    u--;
                    if (u == 0) {
                        if (r + 1 < f) {
                            t.child[o++] = editorCanvas.a.analyse(e.substring(r, f));
                            r = f
                        }
                        break
                    }
                }
            }
        }
    }
    if (o == 0) {
        t.child[1] = new editorCanvas.node("shuzi");
        t.child[1].value = ""
    }
    if (o == 3) {
        t.type = "equation3"
    }
    if (o > 3) {
        t.type = "equationN"
    }
    r += 4;
    r = editorCanvas.a.getter(e.substring(r), "{", "}") + r;
    if (r < e.length - 1) {
        if (e.charAt(r + 1) == "^") {
            return editorCanvas.a.exponent(e.substring(r + 2), t)
        }
        if (e.charAt(r + 1) == "_") {
            return editorCanvas.a.subscript(e.substring(r + 2), t)
        }
        var c = new editorCanvas.node("right");
        c.child[0] = t;
        c.child[1] = editorCanvas.a.analyse(e.substring(r + 1));
        return c
    } else {
        return t
    }
}
;
editorCanvas.Analysis.prototype.options["right"] = function (e) {
    return editorCanvas.a.analyse(e)
}
;
editorCanvas.Analysis.prototype.options["int"] = function (e) {
    var t = new editorCanvas.node("int");
    if (e.charAt(0) == "_" && e.charAt(1) == "{") {
        var n = editorCanvas.a.getter(e, "{", "}");
        t.child[1] = editorCanvas.a.analyse(e.substring(2, n));
        e = e.substring(n + 1)
    } else if (e.charAt(0) == "^" && e.charAt(1) == "{") {
        var n = editorCanvas.a.getter(e, "{", "}");
        t.child[0] = editorCanvas.a.analyse(e.substring(2, n));
        e = e.substring(n + 1)
    }
    if (e.charAt(0) == "_" && e.charAt(1) == "{") {
        var n = editorCanvas.a.getter(e, "{", "}");
        t.child[1] = editorCanvas.a.analyse(e.substring(2, n));
        e = e.substring(n + 1)
    } else if (e.charAt(0) == "^" && e.charAt(1) == "{") {
        var n = editorCanvas.a.getter(e, "{", "}");
        t.child[0] = editorCanvas.a.analyse(e.substring(2, n));
        e = e.substring(n + 1)
    }
    if (e.length > 0) {
        var r = new editorCanvas.node("right");
        r.child[0] = t;
        r.child[1] = editorCanvas.a.analyse(e);
        return r
    }
    return t
}
;
editorCanvas.styles = { Bold: "Bold", Itaily: "Itaily", UnderLine: "UnderLine", ThroughLine: "ThroughLine" };
editorCanvas.signs = {
    theta: "θ",
    sigma: "σ",
    alpha: "α",
    delta: "δ",
    Delta: "Δ",
    beta: "β",
    rho: "ρ",
    varnothing: "∅",
    partial: "ð",
    Phi: "Φ",
    xi: "ξ",
    bot: "⊥",
    mu: "μ",
    tau: "τ",
    neg: "¬",
    pm: "±",
    Omega: "Ω",
    eta: "η",
    varepsilon: "ε",
    lamda: "λ",
    upsilon: "υ",
    vartheta: "ϑ",
    gamma: "γ",
    pi: "π",
    notin: "∉",
    supseteq: "⊇",
    forall: "∀",
    backepsilon: "∍",
    exists: "∃",
    infty: "∞",
    omega: "ω",
    varphi: "φ",
    parallel: "∥",
    triangleq: "≜",
    measuredangle: "∡",
    Leftrightarrow: "⇔",
    rightleftharpoons: "⇌",
    "in": "∈",
    cup: "∪",
    cap: "∩",
    subset: "⊂",
    supset: "⊃",
    lim: "lim",
    to: "→",
    circ: "○",
    odot: "⊙",
    angle: "∠",
    mp: "∓",
    bullet: "•",
    centerdot: "•",
    cdot: "•",
    zeta: "ζ",
    ",": " ",
    le: "≤",
    ge: "≥",
    div: "÷",
    subseteq: "⊆",
    supseteq: "⊇",
    vartriangle: "△",
    wedge: "∧",
    vee: "∨",
    leftrightarrow: "↔",
    uparrow: "↑",
    downarrow: "↓",
    because: "∵",
    therefore: "∴",
    Rightarrow: "⇒",
    Leftarrow: "⇐",
    prec: "≺",
    succ: "≻",
    triangleleft: "⊲",
    triangleright: "⊳",
    sim: "∼",
    approx: "≈",
    simeq: "≃",
    cong: "≅",
    ne: "≠",
    equiv: "≡",
    oplus: "⊕",
    square: "□",
    smallint: "∫",
    sin: "sin",
    cos: "cos",
    tan: "tan",
    cot: "cot",
    arcsin: "arcsin",
    arccos: "arccos",
    arctan: "arctan",
    arccot: "arccot",
    times: "×",
    cdots: "…",
    otimes: "⊗"
};
for (var i in editorCanvas.signs) {
    editorCanvas.Analysis.prototype.options[i] = function (e, t) {
        return editorCanvas.a.analyse(editorCanvas.signs[t] + e)
    }
}
editorCanvas.Analysis.prototype.options["not"] = function (e) {
    if (e.substr(0, 7) == "\\subset") {
        e = e.substring(8)
    }
    return editorCanvas.a.analyse("⊄" + e)
}
;
(function (e) {
    e.position = 0;
    e.isShift = false;
    e.add_operation = function (t) {
        if (this.currenttarget == null) {
            return
        }
        var n;
        var r = this.currenttarget;
        n = new this.node(t);
        if (this.s.movable == false) { } else {
            for (var i = 0; i < this.s.options[t].children; i++) {
                if (this.s.options[t].defaultValue[i] != null) {
                    n.child[i] = new this.node("shuzi");
                    n.child[i].value = this.s.options[t].defaultValue[i]
                } else {
                    n.child[i] = new this.node("undefine");
                    n.child[i].value = ""
                }
            }
            var s = this.currenttarget.value;
            var o = this.position;
            var u = new this.node("right");
            r.value = s.substring(0, o);
            r.type = "shuzi";
            u.child[0] = r;
            if (r.father != null) {
                r.father.child[r.kind] = u
            } else if (r == this.root) {
                this.root = u
            }
            u.child[1] = new this.node("right");
            u.child[1].child[0] = n;
            u.child[1].child[1] = new this.node("shuzi");
            if (s.length > o) {
                u.child[1].child[1].value = s.substring(o, s.length)
            } else {
                u.child[1].child[1].value = ""
            }
            this.currenttarget = u.child[1].child[0].child[this.s.options[t].major];
            this.s.regroup(this.root, this.s.csize);
            this.replay();
            this.output();
            this.s.movable = false;
            e.locate(this.currenttarget.x + this.currenttarget.width / 2, this.currenttarget.y + this.currenttarget.height / 2)
        }
        this.position = 0;
        this.relink();
        this.addCursor(this.currenttarget)
    }
    ;
    e.add_sign = function (e) {
        if (this.currenttarget == null) {
            return
        }
        var t = this.currenttarget;
        var n = t.value.length;
        t.value = t.value.substring(0, this.position) + e + t.value.substring(this.position, n);
        this.position++;
        this.update();
        this.addCursor(this.currenttarget)
    }
    ;
    e.update = function (e) {
        if (e == 9) {
            return 0
        }
        var t = this.currenttarget;
        if (t.value == "") {
            if (t.father != null && t.father.type == "right") {
                t.type = "shuzi"
            } else {
                t.type = "undefine"
            }
        } else {
            t.type = "shuzi"
        }
        this.s.regroup(this.root, this.s.csize);
        this.s.transaction(this.root, 0, 0);
        this.replay();
        this.output()
    }
    ;
    e.cancel = function () {
        var t = this.currenttarget;
        if (t.type == "shuzi" && t.father != null && t.father.type == "right") {
            if (t.father.father == null || t.father.father.type != "right") { }
            if (t.kind == 1 && t.father.child[0].type != "shuzi") {
                var n = t.father.father;
                var r = new this.node("shuzi");
                this.position = n.child[0].value.length;
                r.value = n.child[0].value + t.value;
                if (n == this.root) {
                    this.root = r
                } else if (n.father != null) {
                    var i = t.father.father.father;
                    i.child[n.kind] = r
                }
                this.currenttarget = t = r;
                this.clear(n);
                n = null
            } else if (t.father != this.root && t.father.father != null && t.father.father.father != null) {
                var i = t.father.father.father;
                var n = t.father.father;
                this.position = i.child[0].value.length;
                i.child[0].value = i.child[0].value + t.value;
                i.child[1] = t.father.child[1];
                i.child[1].father = i;
                this.currenttarget = t = i.child[0];
                this.clear(n);
                n = null
            }
            if (this.root.type == "shuzi") {
                var s = e.outplane;
                var o = s.list[s.currentId];
                this.removeKeyboard();
                $("#textcell" + o).remove();
                s.list.splice(s.currentId, 1);
                var u = s.list[s.currentId - 1];
                var a = $("#textcell" + u + " > input")[0].value + this.root.value;
                var f = a.length;
                var l = s.list[s.currentId];
                a += $("#textcell" + l + " > input")[0].value;
                $("#textcell" + u + " > input")[0].value = a;
                $("#textcell" + l).remove();
                s.list.splice(s.currentId, 1);
                s.currentId--;
                $("#textcell" + u + " > input").focus();
                setTimeout(function () {
                    e.outplane.setCursorPosition($("#textcell" + u + " > input")[0], f)
                }, 0);
                s.repairOffset();
                s.saveData();
                return false
            }
            this.s.regroup(this.root, this.s.csize);
            this.s.transaction(this.root, 0, 0);
            this.replay();
            this.output();
            this.relink();
            return true
        }
    }
    ;
    e.output = function () {
        $(this.s.canvas).data("latex", this.root.value)
    }
    ;
    e.addCursor = function (t) {
        var n = t.value == "" ? t.x + 3 : t.x + e.widthGetter(t.value.substring(0, this.position), t.size) - 1;
        var r = t.y;
        this.s.ctx.fillStyle = "#666";
        this.s.ctx.fillRect(n, r, 2, t.height);
        this.s.ctx.fillStyle = "#666"
    }
    ;
    e.locate = function (e, t) {
        this.s.ctx.clearRect(0, 0, this.s.canvas.width, this.s.canvas.height);
        var n = e;
        var r = t;
        var i = this.currenttarget = this.pointout(n, r);
        if (i.type == "shuzi" || i.type == "undefine") {
            this.s.movable = true;
            if (i.value != "") {
                this.position = this.getPositon(i, n - i.x);
                if (this.position > i.value.length) {
                    this.position = i.value.length
                }
                if (this.position < 0) {
                    this.position = 0
                }
            } else {
                this.position = 0
            }
            this.addCursor(i);
            this.s.transaction(this.root, 0, 0);
            this.addKeyboard();
            this.outplane.isCanvas = true;
            return
        }
    }
    ;
    e.getPositon = function (e, t) {
        var n = 0;
        var r = t;
        var i = e.value.length;
        var s = e.value;
        for (var o = 1; o <= i; o++) {
            e.value = s.slice(0, o);
            var u = this.widthGetter(e.value);
            var a = t - u > 0 ? t - u : u - t;
            if (a <= r) {
                r = a
            } else {
                n = o - 1;
                e.value = s;
                return n
            }
        }
        n = i;
        e.value = s;
        return n
    }
    ;
    e.pointout = function (e, t) {
        var n = this.root;
        var r = false;
        while (1) {
            var i = false;
            for (var s = 0; s < n.child.length; s++) {
                if (e > n.child[s].x && e < n.child[s].x + n.child[s].width && t > n.child[s].y && t < n.child[s].y + n.child[s].height) {
                    n = n.child[s];
                    i = true;
                    r = true;
                    break
                }
            }
            if (i == true)
                continue;
            else
                break
        }
        if (r == false || n.type != "shuzi" && n.type != "undefine") {
            n = this.accurate(e, t, this.root)
        }
        return n
    }
    ;
    e.change = function (e) {
        if (this.outplane.isCanvas == false) {
            this.outplane.isCanvas = true;
            return
        }
        var t = null;
        var n = this.position;
        var r = this.currenttarget.value;
        switch (e) {
            case 37:
                if (n == 0 && this.currenttarget.left != null) {
                    this.currenttarget = this.currenttarget.left;
                    this.position = this.currenttarget.value.length
                } else if (n == 0 && this.currenttarget.left == null) {
                    this.replay();
                    this.outplane.movePre();
                    return false
                } else if (this.position > 0) {
                    this.position--
                }
                break;
            case 38:
                if (this.currenttarget.up != null) {
                    this.currenttarget = this.currenttarget.up;
                    this.position = this.position > this.currenttarget.value.length ? this.currenttarget.value.length : this.position
                }
                break;
            case 39:
                if (n == r.length && this.currenttarget.right != null) {
                    this.currenttarget = this.currenttarget.right;
                    this.position = 0
                } else if (n == r.length && this.currenttarget.right == null) {
                    this.replay();
                    this.outplane.moveNext();
                    return false
                } else if (this.position <= r.length) {
                    this.position++
                }
                break;
            case 40:
                if (this.currenttarget.down != null) {
                    this.currenttarget = this.currenttarget.down;
                    this.position = this.position > this.currenttarget.value.length ? this.currenttarget.value.length : this.position
                }
                break;
            default:
                break
        }
        this.replay();
        return true
    }
    ;
    e.relink = function () {
        while (this.s.freelist.length > 0) {
            this.s.freelist.pop()
        }
        this.pusher(this.root);
        this.sorter(this.s.freelist);
        this.linker(this.s.freelist)
    }
    ;
    e.pusher = function (e) {
        if (e.type == "undefine" || e.type == "shuzi") {
            this.s.freelist.push(e)
        } else {
            for (var t = 0; t < e.child.length; t++) {
                this.pusher(e.child[t])
            }
        }
    }
    ;
    e.sorter = function (e) {
        var t = null;
        for (var n = 0; n < e.length; n++) {
            var r = e.length - 1;
            for (var i = e.length - 1; i >= n; i--) {
                if (e[i].x + e[i].width / 2 < e[r].x + e[r].width / 2) {
                    r = i
                } else if (e[i].x + e[i].width / 2 == e[r].x + e[r].width / 2 && e[i].y + e[i].height / 2 < e[r].y + e[r].height / 2) {
                    r = i
                } else {
                    t = e[i];
                    e[i] = e[r];
                    e[r] = t;
                    r = i
                }
            }
        }
    }
    ;
    e.linker = function (e) {
        for (var t = 0; t < e.length; t++) {
            e[t].left = e[t].right = e[t].up = e[t].down
        }
        for (var t = 0, n = 0; t < e.length; t++) {
            if (t == 0) {
                continue
            }
            n = e.length - t - 1;
            if (e[t].x + 5 >= e[t - 1].x + e[t - 1].width) {
                e[t].left = e[t - 1]
            } else {
                if (e[t].y + 5 >= e[t - 1].y + e[t - 1].height) {
                    e[t].left = e[t - 1].left;
                    e[t].up = e[t - 1];
                    e[t - 1].down = e[t]
                }
            }
            if (e[n].x + e[n].width <= e[n + 1].x + 5) {
                e[n].right = e[n + 1]
            } else {
                if (e[n].y + e[n].height <= e[n + 1].y + 5) {
                    e[n].right = e[n + 1].right
                }
            }
        }
    }
    ;
    e.accurate = function (e, t, n) {
        var r = this.s.canvas.width;
        var i = n;
        var s = null;
        var o = false;
        while (1) {
            r = this.s.canvas.width;
            o = false;
            if (n.child.length == 0) {
                break
            }
            for (var u = 0; u < n.child.length; u++) {
                if (Math.abs(n.child[u].x - e + 1) <= r) {
                    r = Math.abs(n.child[u].x - e + 1);
                    i = n.child[u];
                    o = true
                }
                if (Math.abs(n.child[u].x + n.child[u].width - e - 1) <= r) {
                    r = Math.abs(n.child[u].x + n.child[u].width - e - 1);
                    i = n.child[u];
                    o = true
                }
            }
            if (o == false) {
                break
            }
            n = i
        }
        if (i.type != "shuzi" && i.type != "undefine") {
            return s
        } else {
            return i
        }
    }
    ;
    var t = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "`", "-", "=", ";", "'", ",", ".", "/", "\\", "[", "]"];
    var n = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s*", "s+", "s-", "s/", "s."];
    var r = ["shift 1", "shift 2", "shift 3", "shift 4", "shift 5", "shift 7", "shift 8", "shift 9", "shift 0", "shift a", "shift b", "shift c", "shift d", "shift e", "shift f", "shift g", "shift h", "shift i", "shift j", "shift k", "shift l", "shift m", "shift n", "shift o", "shift p", "shift q", "shift r", "shift s", "shift t", "shift u", "shift v", "shift w", "shift x", "shift y", "shift z", "shift `", "shift =", "shift ;", "shift '", "shift \\", "shift , ", "shift .", "shift /", "shift [", "shift ]", "shift 6", "shift -", "caps_lock a"];
    var i = {
        1: "!",
        2: "@",
        3: "#",
        4: "$",
        5: "%",
        6: "^",
        7: "&",
        8: "*",
        9: "(",
        0: ")",
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        e: "E",
        f: "F",
        g: "G",
        h: "H",
        i: "I",
        j: "J",
        k: "K",
        l: "L",
        m: "M",
        n: "N",
        o: "O",
        p: "P",
        q: "Q",
        r: "R",
        s: "S",
        t: "T",
        u: "U",
        v: "V",
        w: "W",
        x: "X",
        y: "Y",
        z: "Z",
        "`": "~",
        "-": "_",
        "=": "+",
        "[": "{",
        "]": "}",
        ";": ":",
        "'": '"',
        "\\": "|",
        ",": "<",
        ".": ">",
        "/": "?"
    };
    var s = {
        s0: "0",
        s1: "1",
        s2: "2",
        s3: "3",
        s4: "4",
        s5: "5",
        s6: "6",
        s7: "7",
        s8: "8",
        s9: "9",
        "s*": "*",
        "s+": "+",
        "s-": "-",
        "s/": "/",
        "s.": "."
    };
    e.addKeyboard = function () {
        var i = this;
        if (e.keyboard) {
            return
        }
        this.insertor.editCheck = true;
        e.keyboard = new Kibo;
        e.keyboard.down(["up", "down", "left", "right"], function (e) {
            var t = e.keyCode;
            if (i.change(t)) {
                i.update(t);
                i.addCursor(i.currenttarget)
            }
            e.returnValue = false;
            return false
        });
        e.keyboard.down("shift", function (t) {
            e.isShift = true
        });
        e.keyboard.down(r, function (t) {
            i.handler(t.keyCode, 1);
            e.outplane.saveData()
        });
        e.keyboard.down(t, function (t) {
            if (e.isShift) {
                e.isShift = false
            } else {
                i.handler(t.keyCode);
                e.outplane.saveData()
            }
        });
        e.keyboard.down(n, function (t) {
            if (e.isShift) {
                e.isShift = false
            } else {
                i.handler(t.keyCode, 2);
                e.outplane.saveData()
            }
        });
        e.keyboard.down("backspace", function (t) {
            i.handler(t.keyCode);
            e.outplane.saveData();
            t.returnValue = false;
            return false
        });
        e.keyboard.down("delete", function (t) {
            i.handler(t.keyCode);
            e.outplane.saveData();
            return false
        })
    }
    ;
    e.handler = function (e, t) {
        if (e == 9) {
            return 0
        }
        var n = this.currenttarget;
        if (!n) {
            return
        }
        var r = n.value.length;
        if (e == 8) {
            if (this.position == 0) {
                if (this.cancel()) {
                    this.addCursor(this.currenttarget)
                }
                return
            }
            n.value = n.value.substring(0, this.position - 1) + n.value.substring(this.position, r);
            this.position--
        } else if (e == 46) {
            if (n.value.length > 0 && this.position < r) {
                n.value = n.value.substring(0, this.position) + n.value.substring(this.position + 1, r)
            }
        } else if (t == 1) {
            var o;
            o = i[this.keyboard.lastKey()];
            n.value = n.value.substring(0, this.position) + o + n.value.substring(this.position, r);
            this.position++
        } else if (t == 2) {
            var o = s[this.keyboard.lastKey()];
            n.value = n.value.substring(0, this.position) + o + n.value.substring(this.position, r);
            this.position++
        } else {
            var o = this.keyboard.lastKey();
            o == "\\" && (o = "╲");
            n.value = n.value.substring(0, this.position) + o + n.value.substring(this.position, r);
            this.position++
        }
        if (n.value == "") {
            if (n.father != null && n.father.type == "right") {
                n.type = "shuzi"
            } else {
                n.type = "undefine"
            }
        } else {
            n.type = "shuzi"
        }
        this.s.regroup(this.root, this.s.csize);
        this.s.transaction(this.root, 0, 0);
        this.replay();
        this.addCursor(this.currenttarget);
        this.output()
    }
    ;
    e.removeKeyboard = function () {
        if (e.keyboard) {
            e.keyboard.clearHandler();
            e.keyboard = null;
            this.insertor.editCheck = false
        }
    }
})(editorCanvas);
(function (e) {
    function t(e) {
        if (e) {
            return e.replace(/\t/gi, " ").split("\n")
        }
        return ""
    }
    e.insertor = {};
    e.insertor.insertCheck = false;
    e.insertor.editCheck = false;
    e.resetCanvas = function (t) {
        if (e.s.canvas.id == t) { } else {
            var n = e.s.canvas.id;
            e.saves[n].s = e.s;
            e.saves[n].a = e.a;
            e.saves[n].root = e.root;
            e.s = e.saves[t].s;
            e.a = e.saves[t].a;
            e.root = e.saves[t].root
        }
    }
    ;
    e.outplane = {
        id: 0,
        rowID: 0,
        currentId: 0,
        list: [],
        rowList: [],
        isCanvas: false,
        ispaste: false,
        addList: function (t) {
            var n = e;
            if (n.insertor.editCheck) {
                n.add_operation(t);
                this.repairOffset();
                n.addCursor(n.currenttarget);
                this.saveData();
                p = $("#textcell" + this.list[this.currentId]);
                var r = p.closest(".editorTables").offset().left;
                var i = p.closest(".editorTables").offset().top;
                var s = p.offset().left;
                var o = p.offset().top;
                var u = s - r - 100;
                var a = o - i;
                p.closest(".formulaOutplane").scrollLeft(u);
                p.closest(".formulaOutplane").scrollTop(a);
                return
            }
            if (document.activeElement != $("#textcell" + this.list[this.currentId] + " > input")[0]) {
                return
            }
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var f = new Date;
            var l = f.getTime() + Math.floor(Math.random() * 1e4);
            var c = this.id;
            var h = '<td id="textcell' + c + '" edittype="Canvas" nowrap="nowrap" editstate="true" style="vertical-align: bottom;" style="vertical-align: bottom;">' + "<canvas id= " + l + '  width="20px" height="20px"></canvas>' + "</td>";
            $(h).insertAfter($("#textcell" + this.list[this.currentId]));
            this.currentId++;
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var p = $('<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>");
            p.insertAfter($("#textcell" + this.list[this.currentId]));
            var d = $("#textcell" + this.list[this.currentId - 1] + " > input");
            var v = $("#textcell" + this.list[this.currentId + 1] + " > input");
            d.focus();
            var m = e.outplane.getPositionForInput(d[0]);
            var g = d[0].value.substring(0, m);
            v[0].value = d[0].value.substring(m, d[0].value.length);
            d[0].value = g;
            this.repairInput(d);
            this.repairInput(v);
            d.blur();
            var y = $("#" + l);
            if (navigator.userAgent.indexOf("MSIE") > 0 && !e.isIE9()) {
                excanvas.initElement(y[0])
            }
            var b = 16;
            var w = n.saves[y.attr("id")] = {
                a: null,
                s: null,
                root: null
            };
            n.s = new n.simbol(y.attr("id"), b);
            n.root = new n.node("undefine");
            n.a = new n.Analysis(n);
            n.root.value = "";
            n.root.size = b;
            n.root.kind = 0;
            n.root.x = 0;
            n.root.y = 0;
            n.s.regroup(n.root, n.s.csize);
            n.currenttarget = n.root;
            n.s.movable = true;
            n.add_operation(t);
            w.a = n.a;
            w.s = n.s;
            w.root = n.root;
            y.mouseup(function (t) {
                e.replay();
                n.resetCanvas(this.id);
                var r = t.pageX - $(this).offset().left;
                var i = t.pageY - $(this).offset().top;
                n.locate(r, i);
                n.outplane.currentId = n.outplane.getListId(c)
            });
            this.repairOffset();
            n.addCursor(n.currenttarget);
            this.saveData();
            var r = p.closest(".editorTables").offset().left;
            var i = p.closest(".editorTables").offset().top;
            var s = p.offset().left;
            var o = p.offset().top;
            var u = s - r - 100;
            var a = o - i;
            p.closest(".formulaOutplane").scrollLeft(u);
            p.closest(".formulaOutplane").scrollTop(a);
            p.closest(".formulaOutplane").trigger("focusCanvas")
        },
        popList: function (t) {
            var n = e;
            if (this.currentId > 0) {
                var r = $("#textcell" + this.list[this.currentId]).parent();
                // if(!r.attr("id")){
                //     $(t).remove();
                //     return;
                // }
                var i = r.attr("id").substring(14);
                var s = $("#editortablerow" + i + " > td:eq(0)").attr("id").substring(8);
                s = this.getListId(s);
                if (s == this.currentId) {
                    if (r.closest(".latex-outplane").find("tr:first")[0] == r[0]) {
                        return
                    }
                    var o = $("#textcell" + this.list[this.currentId] + " > input");
                    var u = $("#textcell" + this.list[this.currentId - 1] + " > input");
                    var a = u.closest(".editortablerow").attr("id").substring(14);
                    a = this.getRowListId(a);
                    o[0].value = u[0].value + o[0].value;
                    e.outplane.repairInput(o);
                    var f = u[0].value.length;
                    u.parent().remove();
                    this.list.splice(this.currentId - 1, 1);
                    this.currentId--;
                    $("#editortablerow" + this.rowList[a] + " > td:last").remove();
                    for (var l = this.currentId; l < 100; l++) {
                        if ($("#editortablerow" + i).find("#textcell" + this.list[l])[0]) {
                            $("#editortablerow" + this.rowList[a]).append($("#textcell" + this.list[l]))
                        } else {
                            var c = '<td class="lastcell" style="padding-bottom:7px; width: 100%; vertical-align: middle;"></td>';
                            $("#editortablerow" + this.rowList[a]).append($(c));
                            break
                        }
                    }
                    $("#editortablerow" + i).closest("table").remove();
                    this.rowList.splice(s, 1);
                    setTimeout(function () {
                        e.outplane.setCursorPosition(o[0], f)
                    }, 0)
                } else {
                    var h = this.list[this.currentId - 1];
                    $("#textcell" + h).remove();
                    this.list.splice(this.currentId - 1, 1);
                    this.currentId--;
                    var p = this.list[this.currentId - 1];
                    var d = $("#textcell" + p + " > input")[0].value;
                    var f = $("#textcell" + p + " > input")[0].value.length;
                    var v = this.list[this.currentId];
                    d += $("#textcell" + v + " > input")[0].value;
                    $("#textcell" + p + " > input")[0].value = d;
                    $("#textcell" + v).remove();
                    this.list.splice(this.currentId, 1);
                    this.currentId--;
                    $("#textcell" + p + " > input").focus();
                    setTimeout(function () {
                        e.outplane.setCursorPosition($("#textcell" + p + " > input")[0], f)
                    }, 0);
                    n.removeKeyboard();
                    $("#textcell" + p + " > input").trigger("keyup")
                }
                this.repairOffset();
                this.saveData()
            }

        },
        clear: function (t) {
            if (t.hasClass("formulaOutplane")) {
                e.activeFormulaZone("", t)
            } else {
                t.empty()
            }
        },
        remove: function (e) {
            if (e.hasClass("formulaOutplane")) {
                e.removeClass("formulaOutplane")
            }
            e.empty()
        },
        moveNext: function () {
            var t = e;
            var n = this.list.length - 1;
            if (this.currentId < n) {
                var r = this.currentId;
                var i = this.list[this.currentId + 1];
                var s = $("#textcell" + i);
                if (s.closest(".formulaOutplane").html() == $("#textcell" + this.list[this.currentId]).closest(".formulaOutplane").html()) {
                    if (s.attr("edittype") == "Text") {
                        $("#textcell" + i + " > input").focus();
                        setTimeout(function () {
                            e.outplane.setCursorPosition($("#textcell" + i + " > input")[0], 0)
                        }, 0);
                        t.removeKeyboard();
                        this.isCanvas = false
                    } else if (s.attr("edittype") == "Canvas") {
                        $("#textcell" + this.list[this.currentId] + " > input").blur();
                        var o = $("#textcell" + i + "> canvas");
                        t.resetCanvas(o.attr("id"));
                        t.locate(0, 0);
                        this.isCanvas = true;
                        s.closest(".formulaOutplane").trigger("focusCanvas")
                    }
                    this.currentId = r + 1
                }
            }
        },
        movePre: function () {
            var t = e;
            if (this.currentId > 0) {
                var n = this.currentId;
                var r = this.list[this.currentId - 1];
                var i = $("#textcell" + r);
                if (i.closest(".formulaOutplane").html() == $("#textcell" + this.list[this.currentId]).closest(".formulaOutplane").html()) {
                    if (i.attr("edittype") == "Text") {
                        $("#textcell" + r + "> input").focus();
                        setTimeout(function () {
                            var t = $("#textcell" + r + " > input")[0].value.length;
                            e.outplane.setCursorPosition($("#textcell" + r + " > input")[0], t)
                        }, 0);
                        t.removeKeyboard();
                        this.isCanvas = false
                    } else if (i.attr("edittype") == "Canvas") {
                        $("#textcell" + this.list[this.currentId] + " > input").blur();
                        var s = $("#textcell" + r + "> canvas");
                        t.resetCanvas(s.attr("id"));
                        t.locate(s.width(), 0);
                        this.isCanvas = true;
                        i.closest(".formulaOutplane").trigger("focusCanvas")
                    }
                    this.currentId = n - 1
                }
            }
        },
        addSign: function (t) {
            var n = e;
            if (n.insertor.editCheck) {
                n.add_sign(t);
                this.saveData();
                return
            } else {
                if (document.activeElement != $("#textcell" + this.list[this.currentId] + " > input")[0]) {
                    return
                }
                var r = this.list[this.currentId];
                var i = $("#textcell" + r + "> input")[0];
                var s = this.getPositionForInput(i);
                var o = i.value.substring(0, s) + t;
                if (i.value.length > s) {
                    o += i.value.substring(s, i.value.length)
                }
                i.value = o;
                setTimeout(function () {
                    e.outplane.setCursorPosition($("#textcell" + e.outplane.list[e.outplane.currentId] + " > input")[0], s + t.length)
                }, 0);
                this.repairInput($("#textcell" + r + "> input"));
                this.saveData()
            }
        },
        addStyle: function (t) {
            if (document.activeElement != $("#textcell" + this.list[this.currentId] + " > input")[0]) {
                return
            }
            if ($("#textcell" + this.list[this.currentId]).attr("edittype") == "Canvas") {
                return;
            }
            var a = $("#textcell" + this.list[this.currentId] + " > input");
            var cinput;
            //鼠标滑动长度
            var mouselength = e.outplane.getPositionEndForInput(a[0]);
            if (mouselength == 0) {
                return;
            }
            if (mouselength == a[0].value.length) {
                cinput = a;
            } else {
                var n = t || "";
                this.id++;
                this.list.splice(this.currentId + 1, 0, this.id);
                var r = new Date;
                //var i = r.getTime();
                var s = this.id;
                var o = '<td id="textcell' + s + '" edittype="Text" nowrap="nowrap" content="" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>";
                $(o).insertAfter($("#textcell" + this.list[this.currentId]));
                this.currentId++;
                this.id++;
                this.list.splice(this.currentId + 1, 0, this.id);
                var u = $('<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>");
                u.insertAfter($("#textcell" + this.list[this.currentId]));
                var a = $("#textcell" + this.list[this.currentId - 1] + " > input");
                cinput = $("#textcell" + this.list[this.currentId] + " > input");
                var f = $("#textcell" + this.list[this.currentId + 1] + " > input");
                a.focus();
                var l = e.outplane.getPositionForInput(a[0]);
                //1 向前 0 向后
                var foward = e.outplane.getselectionDirectionForInput(a[0]);



                var c = a[0].value.substring(0, l);
                cinput[0].value = a[0].value.substring(l, l + mouselength);
                f[0].value = a[0].value.substring(l + mouselength, a[0].value.length);
                a[0].value = c;
                //复制样式
                f.attr("styleContent", a.attr("styleContent"));

                this.repairInput(a);
                this.repairInput(cinput);
                this.repairInput(f);

                a.blur();
                this.repairOffset();
                this.reWriteCssInput(f);
            }

            cinput.attr("styleContent", (a.attr("styleContent") || "") + t + ",");
            this.reWriteCssInput(a);
            this.reWriteCssInput(cinput);

            this.saveData();
        },
        addImg: function (t) {
            if ($("#textcell" + this.list[this.currentId]).attr("edittype") == "Canvas") {
                return
            }
            var n = t || "";
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var r = new Date;
            var i = r.getTime();
            var s = this.id;
            var o = '<td id="textcell' + s + '" edittype="Image" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + "<img id= " + i + ' src="' + n + '"></img>' + "</td>";
            $(o).insertAfter($("#textcell" + this.list[this.currentId]));
            this.currentId++;
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var u = $('<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>");
            u.insertAfter($("#textcell" + this.list[this.currentId]));
            var a = $("#textcell" + this.list[this.currentId - 1] + " > input");
            var f = $("#textcell" + this.list[this.currentId + 1] + " > input");
            a.focus();
            var l = e.outplane.getPositionForInput(a[0]);
            var c = a[0].value.substring(0, l);
            f[0].value = a[0].value.substring(l, a[0].value.length);
            //复制样式
            f.attr("styleContent", a.attr("styleContent"));
            a[0].value = c;
            this.reWriteCssInput(a);
            this.reWriteCssInput(f);
            this.repairInput(a);
            this.repairInput(f);
            a.blur();
            this.repairOffset();
            this.saveData();
            this.resizeImg();
        },
        addTable: function (r, cl, style) {
            //if (document.activeElement != $("#textcell" + this.list[this.currentId] + " > input")[0]) {
            //    return
            //}
            if ($("#textcell" + this.list[this.currentId]).attr("edittype") == "Canvas") {
                return;
            }
            if (!(r > 0 && cl > 0)) {
                return;
            }

            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var s = this.id;
            var o = '<td id="textcell' + s + '" edittype="Table" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + "" + "</td>";
            $(o).insertAfter($("#textcell" + this.list[this.currentId]));
            this.currentId++;
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var u = $('<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>");
            u.insertAfter($("#textcell" + this.list[this.currentId]));
            var a = $("#textcell" + this.list[this.currentId - 1] + " > input");
            var f = $("#textcell" + this.list[this.currentId + 1] + " > input");
            var ctd = $("#textcell" + this.list[this.currentId]);
            a.focus();
            var l = e.outplane.getPositionForInput(a[0]);
            var c = a[0].value.substring(0, l);
            f[0].value = a[0].value.substring(l, a[0].value.length);
            var tHtml = '<table class="editorTable ">';
            var tdnum = 0;
            for (var m = 0; m < r; m++) {
                tHtml += '<tr class="editortablerow ">';
                for (var h = 0; h < cl; h++) {
                    tdnum++;
                    this.id++;
                    this.list.splice(this.currentId + tdnum, 0, this.id);
                    this.rowID++;
                    var tp = $("#textcell" + this.list[this.currentId]).parent();
                    this.rowList.splice(this.getRowListId(tp[0].id.substring(14)) + 1, 0, this.rowID);
                    //tHtml += '<td id="textcell' + this.id + '" editstate="true" style="border:solid 1px gray">';
                    tHtml += '<td  editstate="true" style="border:solid 1px gray">';
                    tHtml += '<table class="editorTable insertTable"><tr class="editortablerow inserttablerow" id="editortablerow' + this.rowID + '"><td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap">';
                    tHtml += '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">';
                    tHtml += '</td></tr></table>';
                    tHtml += '</td>';
                }
                tHtml += '</tr>';
            }

            tHtml += '</table>';
            ctd.append(tHtml);
            a[0].value = c;
            //复制样式
            f.attr("styleContent", a.attr("styleContent"));
            a[0].value = c;
            this.reWriteCssInput(a);
            this.reWriteCssInput(f);
            this.repairInput(a);
            this.repairInput(f);
            a.blur();
            this.repairOffset();
            this.saveData();
        },
        repairInput: function (e) {
            var t = this.widthGetter(e[0]);
            //e.width(t + 8);
            e.width(t);
            if (!e[0].value) {
                e.width(10);
            }
        },
        //根据styleContent 描绘input样式
        reWriteCssInput: function (e) {
            var styleContent = e.attr("styleContent");
            if (!styleContent) {
                return;
            }
            var styleArr = styleContent.split(',');
            styleArr.forEach(function (item, index) {
                switch (item) {
                    case editorCanvas.styles.Bold:
                        e.css("font-weight", "bold");
                        break;
                    case editorCanvas.styles.Itaily:
                        e.css("font-style", "italic");
                        break;
                    case editorCanvas.styles.UnderLine:
                        e.css("text-decoration", "underline");
                        break;
                    case editorCanvas.styles.ThroughLine:
                        e.css("text-decoration", "line-through");
                        break;
                    case editorCanvas.styles.Table:
                        break;
                    default:
                        break;
                }
            });
        },

        widthGetter: function (e) {
            var t = $("body");
            var n = document.createElement("span");
            n.style.fontFamily = $(e).css("font-family");
            n.style.fontSize = $(e).css("font-size");
            $(n).css({
                "word-wrap": "normal",
                "word-break": "keep-all",
                "white-space": "nowrap"
            });
            if (!e.value) {
                e.value = "";
            }
            var r = e.value.replace(/&/g, "$");
            //n.innerHTML = r.replace(/\s/gi, "&nbsp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
            //n.innerHTML = r.replace(/\s/gi, "&ensp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
            n.innerHTML = r.replace(/[\u3000]/gi, "&nbsp;").replace(/\s/gi, "&ensp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");

            n.id = "latex-toget";
            n.setAttribute("class", "match");
            n.style.width = "";
            t.append(n);
            var i = $(n).width();
            $(n).remove();
            return i;
        },
        setCursorPosition: function (e, t) {
            try {
                if (e.setSelectionRange) {
                    e.focus();
                    e.setSelectionRange(t, t)
                } else if (e.createTextRange) {
                    var n = e.createTextRange();
                    n.collapse(true);
                    n.moveEnd("character", t);
                    n.moveStart("character", t);
                    n.select()
                }
            } catch (r) { }
        },
        getPositionForInput: function (e) {
            try {
                var t = 0;
                if (document.selection) {
                    e.focus();
                    var n = document.selection.createRange();
                    n.moveStart("character", -e.value.length);
                    t = n.text.length
                } else if (e.selectionStart || e.selectionStart == "0") {
                    t = e.selectionStart
                }
                return t
            } catch (r) { }
        },
        getPositionEndForInput: function (e) {
            try {
                var t = 0;
                if (document.selection) {
                    console.log("getPositionEndForInput");
                } else if (e.selectionStart || e.selectionStart == "0") {
                    t = e.selectionEnd - e.selectionStart;
                }
                return t
            } catch (r) { }
        },
        getselectionDirectionForInput: function (e) {
            try {
                var t = 0;
                if (document.selection) {
                    console.log("getselectionDirectionForInput");
                } else if (e.selectionStart || e.selectionStart == "0") {
                    return e.selectionDirection == "forward" ? 1 : 0;
                }
                return t
            } catch (r) { }
        },
        resetScrollPosition: function (e, t, n) {
            $formulaOutplane = e.closest(".formulaOutplane");
            var r = $('<input id="temp2236"></input>');
            r.css("font-family", e.css("font-family"));
            r.css("font-size", e.css("font-size"));
            var i = $formulaOutplane.width();
            var s = $formulaOutplane.offset().left;
            r.val(n);
            var o = this.widthGetter(r[0]);
            var u;
            if (t != "") {
                r.val(t);
                u = this.widthGetter(r[0]) + e.closest("td").offset().left - e.closest(".editorTables").offset().left
            } else {
                u = 0
            }
            var a;
            if (t != "") {
                a = $("#2236").data("offsetLeft")
            } else {
                a = $formulaOutplane.offset().left + 11
            }
            r.remove();
            if (i + s - a < o + u) {
                setTimeout(function () {
                    $formulaOutplane.scrollLeft(s + 30 - (s + i - o - u))
                }, 0)
            } else {
                setTimeout(function () {
                    $formulaOutplane.scrollLeft(s - a + 11)
                }, 0)
            }
        },
        repairOffset: function () {
            var t = e;
            var n = $("#textcell" + t.outplane.list[this.currentId]).closest(".editorTables");
            n.find(".editorTable").each(function () {
                var e = 0;
                var n = $(this);
                n.find("td").each(function (n) {
                    if ($(this).attr("edittype") == "Canvas") {
                        var r = $(this).find("canvas").attr("id");
                        e = e > t.saves[r].root.offset ? e : t.saves[r].root.offset
                    }
                });
                n.find("td").each(function (n) {
                    if ($(this).attr("edittype") == "Canvas") {
                        var r = $(this).find("canvas").attr("id");
                        var i = e - t.saves[r].root.offset - 6;
                        i = i > 0 ? i : 0;
                        $(this).css("padding-bottom", i + "px")
                    } else {
                        var i = e - 6;
                        i = i > 0 ? i : 0;
                        $(this).css("padding-bottom", i + "px")
                    }
                })
            });
            var r = n.closest(".formulaOutplane");
            if (r.attr("search") == "true") {
                if (n.height() > r.attr("minheight")) {
                    r.css("overflow-y", "auto");
                    r.css("height", "auto");
                    if (n.height() > r.attr("maxheight")) {
                        r.height(r.attr("maxheight"))
                    }
                } else {
                    r.css("overflow-y", "hidden");
                    r.css("height", "auto")
                }
            }
            this.reRenderAll()
        },
        newLine: function (t) {
            var n = $("#textcell" + this.list[this.currentId]).parent().attr("id").substring(14);
            this.insertRow(n);
            this.id++;
            this.list.splice(this.currentId + 1, 0, this.id);
            var r = '<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>";
            $("#editortablerow" + this.rowID).html($(r));
            var i = $("#textcell" + this.list[this.currentId] + " > input");
            var s = $("#textcell" + this.list[this.currentId + 1] + " > input");
            i.focus();
            var o = this.getPositionForInput(i[0]);
            var u = i[0].value.substring(0, o);
            s[0].value = i[0].value.substring(o, i[0].value.length);
            i[0].value = u;
            this.repairInput(i);
            this.repairInput(s);
            for (var a = this.currentId + 2; a < 100; a++) {
                if ($("#editortablerow" + n).find("#textcell" + this.list[a])[0]) {
                    $("#editortablerow" + parseInt(this.rowID)).append($("#textcell" + this.list[a]));
                    if ($("#textcell" + this.list[a]).attr("edittype") == "Canvas") {
                        var f = $("#textcell" + this.list[a]).find("canvas").attr("id");
                        e.resetCanvas(f);
                        e.replay()
                    }
                } else {
                    break
                }
            }
            this.currentId++;
            s.focus();
            setTimeout(function () {
                e.outplane.setCursorPosition(s[0], 0)
            }, 0);
            var l = '<td class="lastcell" style="padding-bottom:7px; width: 100%; vertical-align: middle;"></td>';
            $("#editortablerow" + this.rowID).append($(l));
            this.repairOffset();
            this.saveData()
        },
        getRowListId: function (e) {
            for (var t = 0; t < this.rowList.length; t++) {
                if (this.rowList[t] == e) {
                    return t
                }
            }
        },
        getListId: function (e) {
            for (var t = 0; t < this.list.length; t++) {
                if (this.list[t] == e) {
                    return t
                }
            }
        },
        insertRow: function (e) {
            this.rowID++;
            this.rowList.splice(this.getRowListId(e) + 1, 0, this.rowID);
            var t = '<table class="editorTable">' + "<tbody>" + '<tr id="editortablerow' + this.rowID + '" class="editortablerow"></tr>' + "</tbody>" + "</table>";
            $(t).insertAfter($("#editortablerow" + e).closest("table"))
        },
        saveData: function () {
            var t = e;
            var n = $("#textcell" + t.outplane.list[this.currentId]).closest(".formulaOutplane");
            n.data("latexData", e.getFormulaOutput(n));
            n.trigger("formulaOutPlaneUpdate")
        },
        reRenderAll: function () {
            var t = e;
            if (t.s) {
                var n = t.s.canvas.id
            }
            var r = $("#textcell" + t.outplane.list[this.currentId]).closest(".editorTables");
            r.find(".editorTable").each(function () {
                var t = $(this);
                t.find("td").each(function (t) {
                    if ($(this).attr("edittype") == "Canvas") {
                        var n = $(this).find("canvas").attr("id");
                        e.resetCanvas(n);
                        e.replay()
                    }
                })
            });
            if (n) {
                e.resetCanvas(n)
            }
        },
        resizeImg: function () {
            $(".editorTables img").die("click");
            $(".editorTables img").live("click", function () {


                if ($("#resizediv").length > 0) {
                    $("#resizediv").hide();
                } else {
                    var rdiv = '<div class="edui-scale" id="resizediv" controlimg="' + this.id + '" unselectable="on" style="z-index: 999; position: absolute; display: block;">' +
                   '<span class="edui-scale-hand0"></span>' +
                   '<span class="edui-scale-hand1"></span>' +
                   '<span class="edui-scale-hand2"></span>' +
                   '<span class="edui-scale-hand3"></span>' +
                   '<span class="edui-scale-hand4"></span>' +
                   '<span class="edui-scale-hand5"></span>' +
                   '<span class="edui-scale-hand6"></span>' +
                   '<span class="edui-scale-hand7"></span>' +
                   '</div>';

                    $($(".editorTables")[0]).append(rdiv);
                    var drag = false;
                    var w = $("#resizediv").width();
                    var h = $("#resizediv").height();
                    var cx = 0;
                    var cy = 0;
                    var spanclick = "t1";
                    $(".edui-scale span").mousedown(function (e) {
                        drag = true;
                        w = $("#resizediv").width();
                        h = $("#resizediv").height();
                        cx = e.clientX;
                        cy = e.clientY;
                        switch ($(this).attr("class")) {
                            case "edui-scale-hand0":
                                spanclick = "tl0";
                                break;
                            case "edui-scale-hand1":
                                spanclick = "t1";
                                break;
                            case "edui-scale-hand2":
                                spanclick = "tr2";
                                break;
                            case "edui-scale-hand3":
                                spanclick = "l0";
                                break;
                            case "edui-scale-hand4":
                                spanclick = "r0";
                                break;
                            case "edui-scale-hand5":
                                spanclick = "bl0";
                                break;
                            case "edui-scale-hand6":
                                spanclick = "b1";
                                break;
                            case "edui-scale-hand7":
                                spanclick = "br2";
                                break;
                            default:
                        }

                    }).mouseup(function (e) {
                        drag = false;
                    });

                    $(document).mouseup(function () { drag = false; $("#resizediv").hide(); }).mousemove(function (e) {
                        if (drag) {
                            var rw = 0;
                            var rh = 0;
                            rw = w;
                            rh = h;
                            var ud = e.clientY > cy;
                            if (spanclick.indexOf("t") > -1) {
                                rh = h - (e.clientY - cy);
                            }
                            if (spanclick.indexOf("b") > -1) {
                                rh = h + (e.clientY - cy);
                            }
                            if (spanclick.indexOf("l") > -1) {
                                rw = w - (e.clientX - cx);
                            }
                            if (spanclick.indexOf("r") > -1) {
                                rw = w + (e.clientX - cx);
                            }

                            //if (e.clientY > cy) {
                            //    rh = h + (e.clientY - cy);
                            //} else {
                            //    rh=h-()
                            //    }

                            $("#resizediv").css({ "width": rw + "px", "height": rh + "px" });
                            var cimg = $("#" + $("#resizediv").attr("controlimg"));
                            cimg.css({ "width": rw + "px", "height": rh + "px" });
                            //console.log(e);
                        }
                    });
                    //$("body").click(function () { $("#resizediv").hide(); });
                }
                $("#resizediv").show();
                $("#resizediv").attr("controlimg", this.id);
                //$("#resizediv").css({ "top": $(this).position().top, "left": $(this).position().left, "width": $(this).width() + "px", "height": $(this).height() + "px" });
                $("#resizediv").css({ "bottom": $(this).offsetParent().height() - $(this).position().top - $(this).height(), "left": $(this).position().left, "width": $(this).width() + "px", "height": $(this).height() + "px" });
            });

        }
    };
    $(".editortablerow > td").live("keydown", function (t) {
        if (e.outplane.ispaste) {
            return
        }
        var n = $(this).find(".celltext");
        if ($(this).attr("edittype") == "Text") {
            e.outplane.repairInput(n);
            e.outplane.saveData()
        }
    });
    $(".editortablerow > td").live("keyup", function (t) {
        if (e.outplane.ispaste) {
            e.outplane.ispaste = false;
            return
        }
        var n = $(this).find(".celltext");
        if ($(this).attr("edittype") == "Text") {
            e.outplane.repairInput(n);
            e.outplane.saveData();
            if ($(this).closest(".formulaOutplane").attr("search") != "true") {
                if (t.keyCode == 13) {
                    e.outplane.newLine($(this))
                }
            }
        }
    });
    e.paste = function () {
        var t = e.outplane.currentId;
        var n = e.outplane.list[t];
        if (e.outplane.isCanvas)
            return;
        if ($("#textcell" + n).closest(".formulaOutplane").attr("search") == "true") {
            return false
        }
        if (!e.outplane.ispaste) {
            e.outplane.ispaste = true;
            var r = $("#textcell" + n).closest(".editorTables");
            var i = $("#textcell" + n).closest(".formulaOutplane");
            var s = $('<textarea id="2236" class="cS" style="width:1px;position:absolute;left:' + i[0].scrollLeft + "px;top:" + i[0].scrollTop + 'px;"></textarea>');
            s.data("offsetLeft", r.offset().left);
            i.append(s);
            if (document.selection) {
                document.getElementById("2236").value = window.clipboardData.getData("Text")
            } else {
                $("#2236").focus();
                $("#2236").select()
            }
        }
        var o = $("#textcell" + n + " > input");
        e.outplane.pasted(o);
        return false
    }
    ;
    e.outplane.valueToCell = function (n, r, i) {
        var s = e;
        var o = [];
        if (i) {
            o = t(n)
        } else {
            o.push(n)
        }
        for (var u = 0; u < o.length; u++) {
            if (u > 0) {
                s.outplane.insertRow(s.outplane.rowID);
                r = $("#editortablerow" + s.outplane.rowID)
            }
            n = o[u];
            var a = r;
            if (!a[0]) {
                return false
            }
            a.html("");
            this.list.splice(this.currentId, 1);
            this.currentId = 0;
            var f = /<frm>(.*?)<\/frm>/g;
            var l = /(?:^|<\/frm>)((.|\n)*?)(?:<frm>|$)/g;
            var c = [];
            n.replace(f, function (e, t, n) {
                c.push(t);
                return t
            });
            var h = [];
            n.replace(l, function (e, t, n) {
                h.push(t);
                return t
            });
            for (var p = 0; p < h.length; p++) {
                this.id++;
                this.list.push(this.id);
                var d = '<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>";
                a.append(d);
                $("#textcell" + this.id).find("input")[0].value += h[p];
                this.repairInput($("#textcell" + this.id).find("input"));
                this.currentId++;
                if (c[p]) {
                    this.id++;
                    this.list.push(this.id);
                    var v = new Date;
                    var m = v.getTime();
                    var d = '<td id="textcell' + this.id + '" edittype="Canvas" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + "<canvas id= " + m + '  width="20px" height="20px"></canvas>' + "</td>";
                    a.append(d);
                    var g = $("#" + m);
                    if (navigator.userAgent.indexOf("MSIE") > 0 && !e.isIE9()) {
                        excanvas.initElement(g[0])
                    }
                    var y = 16;
                    var b = s.saves[m] = {
                        a: null,
                        s: null,
                        root: null
                    };
                    s.s = new s.simbol(m, y);
                    s.root = new s.node("undefine");
                    s.a = new s.Analysis(s);
                    s.root.value = "";
                    s.root.size = y;
                    s.root.kind = 0;
                    s.root.x = 0;
                    s.root.y = 0;
                    s.s.regroup(s.root, s.s.csize);
                    s.currenttarget = s.root;
                    s.s.movable = true;
                    s.a.distribute(c[p], 1);
                    b.a = s.a;
                    b.s = s.s;
                    b.root = s.root;
                    s.output();
                    (function (e) {
                        g.mouseup(function (t) {
                            s.replay();
                            s.resetCanvas(e);
                            var n = t.pageX - $(this).offset().left;
                            var r = t.pageY - $(this).offset().top;
                            s.locate(n, r)
                        })
                    })(m);
                    this.currentId++
                }
            }
            var w = '<td class="lastcell" style="padding-bottom:7px; width: 100%; vertical-align: middle;"></td>';
            $("#editortablerow" + this.rowID).append($(w));
            this.repairOffset();
            this.saveData()
        }
    }
    ;
    e.outplane.pasteToCell = function (n, r) {
        var i = t(n);
        if (i.length == 1) {
            var s = this.getPositionForInput(r[0]);
            var o = r[0].value.substring(0, s);
            var u = r[0].value.substring(s, r[0].value.length);
            setTimeout(function () {
                r[0].value = o + i[0] + u;
                e.outplane.repairInput(r);
                e.outplane.saveData();
                e.outplane.setCursorPosition(r[0], o.length + i[0].length)
            }, 0);
            e.outplane.resetScrollPosition(r, i[0], o)
        }
        if (i.length > 1) {
            var s = this.getPositionForInput(r[0]);
            var o = r[0].value.substring(0, s);
            var u = r[0].value.substring(s, r[0].value.length);
            setTimeout(function () {
                r[0].value = o + i[0];
                e.outplane.repairInput(r)
            }, 0);
            var a = this.list[this.currentId + 1];
            var f = $("#textcell" + this.list[this.currentId]).parent().attr("id").substring(14);
            for (var l = 1; l < i.length; l++) {
                var c = $("#textcell" + this.list[this.currentId]).parent().attr("id").substring(14);
                this.insertRow(c);
                this.id++;
                this.list.splice(this.currentId + 1, 0, this.id);
                var h = '<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>";
                $("#editortablerow" + this.rowID).html($(h));
                $("#textcell" + this.id).find("input")[0].value = i[l];
                if (l == i.length - 1) {
                    var p = $("#textcell" + this.id).find("input");
                    var d = p[0].value.length;
                    setTimeout(function () {
                        e.outplane.setCursorPosition(p[0], d)
                    }, 0);
                    p[0].value += u;
                    for (var v = this.getListId(a) ; v < 100; v++) {
                        if ($("#editortablerow" + f).find("#textcell" + this.list[v])[0]) {
                            $("#editortablerow" + this.rowID).append($("#textcell" + this.list[v]));
                            if ($("#textcell" + this.list[v]).attr("edittype") == "Canvas") {
                                var m = $("#textcell" + this.list[v]).find("canvas").attr("id");
                                e.resetCanvas(m);
                                e.replay()
                            }
                        } else {
                            break
                        }
                    }
                }
                this.repairInput($("#textcell" + this.id).find("input"));
                this.repairOffset();
                this.saveData();
                var g = '<td class="lastcell" style="padding-bottom:7px; width: 100%; vertical-align: middle;"></td>';
                $("#editortablerow" + this.rowID).append($(g));
                this.currentId++;
                if (l == i.length - 1) {
                    var p = $("#textcell" + this.id).find("input");
                    e.outplane.resetScrollPosition(p, "", i[l])
                }
            }
        }
    }
    ;
    e.outplane.pasted = function (t) {
        function r() {
            if (n.value) {
                e.outplane.pasteToCell(n.value, t);
                $(n).focus();
                $("#2236").remove();
                e.outplane.ispaste = false
            }
        }
        var n = document.getElementById("2236");
        if (document.selection) {
            n.onpropertychange = r
        } else {
            n.addEventListener("input", r, false)
        }
    }
    ;
    $(".editortablerow > td").live("keydown", function (t) {
        var n = t.keyCode;
        var r = $(this).find("input")[0];
        switch (n) {
            case 8:
                var i = e.outplane.getPositionForInput(r);
                if (i == 0) {
                    e.outplane.popList($(this));
                    return false
                }
                break;
            case 37:
                var i = e.outplane.getPositionForInput(r);
                if (i == 0) {
                    e.outplane.movePre();
                    return false
                }
                break;
            case 39:
                var i = e.outplane.getPositionForInput(r);
                if (r == undefined) {
                    return false
                }
                var s = r.value.length;
                if (i == s) {
                    e.outplane.moveNext();
                    return false
                }
                break;
            default:
                break
        }
    });
    $(".editortablerow > td").live("click", function (t) {
        var n = e;
        var r = null;
        if (this.className == "lastcell") {
            r = $(this).parent().find("td:eq(-2)");
            r.find("input").focus();
            r.find("input"),
            r.find("input").putCursorAtEnd();
            var i = r.attr("id").slice(8);
            n.outplane.currentId = n.outplane.getListId(i);
        } else {
            r = $(this);
            var i = this.id.slice(8);
            n.outplane.currentId = n.outplane.getListId(i)
        }
        if (r.attr("edittype") == "Canvas") {
            n.removeKeyboard();
            n.addKeyboard();
            n.outplane.isCanvas = true
        } else if (r.attr("edittype") == "Text") {
            n.onBlurEvent();
        }
        else if (r.attr("edittype") == "Table") {
            n.onBlurEvent();

        }
        t.stopPropagation();
    });
    e.onBlurEvent = function () {
        e.removeKeyboard();
        if (e.s) {
            if ($("#" + e.s.canvas.id)[0]) {
                e.replay()
            }
        }
        e.outplane.isCanvas = false;
    }
    ;
    e.creatFormulaOutplane = function (t) {
        e.outplane.id++;
        e.outplane.rowID++;
        var n = '<div class="editorTables">' + '<table class="editorTable">' + "<tbody>" + '<tr id="editortablerow' + e.outplane.rowID + '" class="editortablerow">' + '<td id="textcell' + e.outplane.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>" + '<td class="lastcell" style="width: 100%;">' + "</td>" + "</tr>" + "</tbody>" + "</table>" + "</div>" + '<div class="editorTablesEx"></div>';
        $(n).appendTo(t);
        t.addClass("formulaOutplane");
        e.outplane.list.push(e.outplane.id);
        e.outplane.rowList = [];
        e.outplane.rowList.push(e.outplane.rowID);
        e.outplane.currentId = e.outplane.list.length - 1;
        t.scroll(function () {
            t.find(".editorTablesEx").width(t.find(".editorTables").width())
        })
    }
    ;
    e.reRender = function (e) {
        if (e) {
            return e.replace(/[\u3000]/gi, "&nbsp;").replace(/\s/gi, "&ensp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
            //return e.replace(/\s/gi, "&nbsp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
        } else {
            return "";
        }
    }
    ;
    //根据input 样式 描绘html
    e.reWriteHtmlByCssInput = function (e) {
        var styleContent = e.attr("styleContent");
        if (!styleContent) {
            return this.reRender(e.val());
        }
        var styleArr = styleContent.split(',');
        var html = "";
        var wrap = "<span>";
        // if (styleContent.indexOf(editorCanvas.styles.Bold) > -1) {
        //     html += "<b>";
        //     if (styleContent.indexOf(editorCanvas.styles.Itaily) > -1) {
        //         html += "<em>";
        //         if (styleContent.indexOf(editorCanvas.styles.ThroughLine) > -1) {
        //             html += "<del>";
        //             html += this.reRender(e.val());
        //             html += "</del>";
        //         } else {
        //             html += this.reRender(e.val());
        //         }
        //         html += "</em>";
        //     } else {
        //         html += this.reRender(e.val());
        //     }
        //     html += "</b>";
        // } else {
        //     html += this.reRender(e.val());
        // }
        if (styleContent.indexOf(editorCanvas.styles.Bold) > -1) {
            html += "<b>";
        }
        if (styleContent.indexOf(editorCanvas.styles.Itaily) > -1) {
            html += "<em>";
        }
        if (styleContent.indexOf(editorCanvas.styles.ThroughLine) > -1) {
            html += "<del>";
        }
        html += this.reRender(e.val());
        if (styleContent.indexOf(editorCanvas.styles.ThroughLine) > -1) {
            html += "</del>";
        }
        if (styleContent.indexOf(editorCanvas.styles.Itaily) > -1) {
            html += "</em>";
        }
        if (styleContent.indexOf(editorCanvas.styles.Bold) > -1) {
            html += "</b>";
        }


        if (styleContent.indexOf(editorCanvas.styles.UnderLine) > -1) {
            wrap = '<span style="text-decoration:underline">';
        }
        wrap += html;
        wrap += "</span>";
        return wrap;
    },
    //e.getFormulaOutput = function (t,h) {
    //    var n = "";
    //    t.find(".editortablerow").each(function (t, r) {
    //        var i = "";
    //        $(r).find("td").each(function (t, n) {
    //            if ($(n).parents(".insertTable").length == 0||h) {
    //                if ($(n).attr("edittype") == "Text") {
    //                    //i += e.reRender($(n).find(".celltext").val())
    //                    i += e.reWriteHtmlByCssInput($(n).find(".celltext"));
    //                } else if ($(n).attr("edittype") == "Canvas") {
    //                    i += "<frm>" + e.reRender($(n).find("canvas").data("latex")) + "</frm>";
    //                } else if ($(n).attr("edittype") == "Image") {
    //                    i += $(n).html();
    //                }
    //                else if ($(n).attr("edittype") == "Table") {
    //                    i += $(n).html();
    //                    i += e.getFormulaOutput($(n).find(".insertTable"), 1);
    //                }
    //            }


    //        });
    //        n += (t == 0 ? "" : "\n") + i;
    //    });
    //    return n
    //};
    e.getFormulaOutput = function (t, h) {
        var n = "";
        var hread = 0;
        t.find(".editortablerow").each(function (t, r) {
            var i = "";
            $(r).find("td").each(function (t, n) {
                if ($(n).hasClass("hread")) {
                    hread = 1;
                    return;
                }
                hread = 0;
                $(n).addClass("hread");
                if ($(n).attr("edittype") == "Text") {
                    //i += e.reRender($(n).find(".celltext").val())
                    i += e.reWriteHtmlByCssInput($(n).find(".celltext"));
                } else if ($(n).attr("edittype") == "Canvas") {
                    // i += "<frm>" + e.reRender($(n).find("canvas").data("latex")) + "</frm>";
                    i += "\\(" + e.reRender($(n).find("canvas").data("latex")) + "\\)";
                } else if ($(n).attr("edittype") == "Image") {
                    i += $(n).html();
                }
                else if ($(n).attr("edittype") == "Table") {
                    if ($(n).parents(".inserttablerow").length == 0) {
                        //克隆td
                        var h = $($(n).clone());
                        $(n).find("td").each(function (index, item) {
                            if (item.id) {
                                var v = e.getValueFromTd(item);
                                h.find("#" + item.id).append(v);
                            }
                        });
                        h.find("input").remove();
                        i += h.html();

                    }
                }
            });
            if (!hread) {
                n += (t == 0 ? "" : "<br/>") + i;
            }
        });
        $(".hread").removeClass("hread");

        return n;
    };
    e.getValueFromTd = function (n) {
        if ($(n).hasClass("hread")) {
            return;
        }
        var s = "";
        $(n).addClass("hread");
        if ($(n).attr("edittype") == "Text") {
            //i += e.reRender($(n).find(".celltext").val())
            s += e.reWriteHtmlByCssInput($(n).find(".celltext"));
        } else if ($(n).attr("edittype") == "Canvas") {
            s += "<frm>" + e.reRender($(n).find("canvas").data("latex")) + "</frm>";
        } else if ($(n).attr("edittype") == "Image") {
            s += $(n).html();
        }
        return s;


    };
    e.outplane.valueToCellPro = function (n, r, i) {
        var s = e;
        var o = /<frm>(.*?)<\/frm>/gi;
        var u = /<femt>(.*?)<\/femt>/gi;
        var a = /<ftxt>(.*?)<\/ftxt>/gi;
        var f = /<ftxt>(.*?)<\/ftxt>|<frm>(.*?)<\/frm>|<femt>(.*?)<\/femt>/gi;
        var l = /(<img.*?(?:>|\/>))/gi;
        var c = /(^|<\/frm>|<\/femt>)((.|\n)*?)(?=<frm>|<femt>|$)/gi;
        var h = [];
        if (i) {
            h = t(n)
        } else {
            h.push(n.replace(/\n/g, " "))
        }
        this.list.splice(this.currentId, 1);
        this.currentId = 0;
        for (var p = 0; p < h.length; p++) {
            if (p > 0) {
                s.outplane.insertRow(s.outplane.rowID);
                r = $("#editortablerow" + s.outplane.rowID)
            }
            n = h[p];
            var d = n.replace(l, "<femt>$1</femt>");
            n = d.replace(c, function (e, t, n) {
                return t + "<ftxt>" + n + "</ftxt>"
            });
            var v = r;
            if (!v[0]) {
                return false
            }
            v.html("");
            var m = n.match(f);
            for (var g = 0; g < m.length; g++) {
                if (a.test(m[g])) {
                    a.lastIndex = 0;
                    this.id++;
                    this.list.push(this.id);
                    var y = '<td id="textcell' + this.id + '" edittype="Text" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + '<input type="text" class="celltext" style="width: 10px;" onpaste="editorCanvas.paste()">' + "</td>";
                    v.append(y);
                    var b = m[g].replace(a, "$1");
                    $("#textcell" + this.id).find("input")[0].value += b;
                    this.repairInput($("#textcell" + this.id).find("input"));
                    this.currentId++
                } else if (u.test(m[g])) {
                    u.lastIndex = 0;
                    this.id++;
                    this.list.push(this.id);
                    var y = '<td id="textcell' + this.id + '" edittype="Image" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + m[g].replace(u, "$1");
                    +"</td>";
                    v.append(y);
                    this.currentId++
                } else if (o.test(m[g])) {
                    o.lastIndex = 0;
                    this.id++;
                    this.list.push(this.id);
                    var w = new Date;
                    var E = w.getTime() + Math.floor(Math.random() * 1e4);
                    var y = '<td id="textcell' + this.id + '" edittype="Canvas" nowrap="nowrap" editstate="true" style="vertical-align: bottom;">' + "<canvas id= " + E + '  width="20px" height="20px"></canvas>' + "</td>";
                    v.append(y);
                    var S = $("#" + E);
                    if (navigator.userAgent.indexOf("MSIE") > 0 && !e.isIE9()) {
                        excanvas.initElement(S[0])
                    }
                    var x = 16;
                    var T = s.saves[E] = {
                        a: null,
                        s: null,
                        root: null
                    };
                    s.s = new s.simbol(E, x);
                    s.root = new s.node("undefine");
                    s.a = new s.Analysis(s);
                    s.root.value = "";
                    s.root.size = x;
                    s.root.kind = 0;
                    s.root.x = 0;
                    s.root.y = 0;
                    s.s.regroup(s.root, s.s.csize);
                    s.currenttarget = s.root;
                    s.s.movable = true;
                    s.a.distribute(m[g].replace(o, "$1"), 1);
                    T.a = s.a;
                    T.s = s.s;
                    T.root = s.root;
                    s.output();
                    (function (e) {
                        S.mouseup(function (t) {
                            s.replay();
                            s.resetCanvas(e);
                            var n = t.pageX - $(this).offset().left;
                            var r = t.pageY - $(this).offset().top;
                            s.locate(n, r)
                        })
                    })(E);
                    this.currentId++
                }
            }
            var N = '<td class="lastcell" style="padding-bottom:7px; width: 100%; vertical-align: middle;"></td>';
            $("#editortablerow" + this.rowID).append($(N));
            this.repairOffset();
            this.saveData()
        }
    }
    ;
    e.filter = function (e) {
        if (!e)
            return " ";
        else
            return e
    }
    ;
    e.activeFormulaZone = function (t, n) {
        t = e.filter(t);
        e.creatFormulaOutplane(n.empty());
        if (n.hasClass("feSearchText")) {
            e.outplane.valueToCellPro(t, n.find(".editortablerow").first(), 0)
        } else {
            e.outplane.valueToCellPro(t, n.find(".editortablerow").first(), 1)
        }
        n.find(".celltext").first().trigger("keydown").trigger("click")
    }
})(editorCanvas);
var Kibo = function (e) {
    this.element = e || window.document;
    this.initialize()
};
Kibo.KEY_NAMES_BY_CODE = {
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    20: "caps_lock",
    27: "esc",
    32: "space",
    33: "page_up",
    34: "page_down",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "num_lock",
    192: "`",
    189: "-",
    187: "=",
    219: "[",
    221: "]",
    186: ";",
    222: "'",
    220: "\\",
    188: ",",
    190: ".",
    191: "/",
    96: "s0",
    97: "s1",
    98: "s2",
    99: "s3",
    100: "s4",
    101: "s5",
    102: "s6",
    103: "s7",
    104: "s8",
    105: "s9",
    106: "s*",
    107: "s+",
    109: "s-",
    110: "s.",
    111: "s/"
};
Kibo.KEY_CODES_BY_NAME = {};
(function () {
    for (var e in Kibo.KEY_NAMES_BY_CODE)
        if (Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE, e))
            Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[e]] = +e
})();
Kibo.MODIFIERS = ["shift", "ctrl", "alt"];
Kibo.WILDCARD_TYPES = ["arrow", "number", "letter", "f"];
Kibo.WILDCARDS = {
    arrow: [37, 38, 39, 40],
    number: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    letter: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    f: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
};
Kibo.assert = function (e, t) {
    t = t || {};
    t.name = t.name || "Exception raised";
    t.message = t.message || "an error has occurred.";
    try {
        if (!e)
            throw t
    } catch (n) {
        if (typeof console !== "undefined" && console.log)
            console.log(n.name + ": " + n.message);
        else
            window.alert(n.name + ": " + n.message)
    }
}
;
Kibo.registerEvent = function () {
    if (document.addEventListener) {
        return function (e, t, n) {
            e.addEventListener(t, n, false)
        }
    } else if (document.attachEvent) {
        return function (e, t, n) {
            e.attachEvent("on" + t, n)
        }
    }
}();
Kibo.unregisterEvent = function () {
    if (document.removeEventListener) {
        return function (e, t, n) {
            e.removeEventListener(t, n, false)
        }
    } else if (document.detachEvent) {
        return function (e, t, n) {
            e.detachEvent("on" + t, n)
        }
    }
}();
Kibo.isArray = function (e) {
    return !!(e && e.splice)
}
;
Kibo.isString = function (e) {
    return typeof e === "string"
}
;
Kibo.arrayIncludes = function () {
    if (Array.prototype.indexOf) {
        return function (e, t) {
            return e.indexOf(t) !== -1
        }
    } else {
        return function (e, t) {
            for (var n = 0; n < e.length; n++)
                if (e[n] === t)
                    return true;
            return false
        }
    }
}();
Kibo.trimString = function (e) {
    return e.replace(/^\s+|\s+$/g, "")
}
;
Kibo.neatString = function (e) {
    return Kibo.trimString(e).replace(/\s+/g, " ")
}
;
Kibo.capitalize = function (e) {
    return e.toLowerCase().replace(/^./, function (e) {
        return e.toUpperCase()
    })
}
;
Kibo.isModifier = function (e) {
    return Kibo.arrayIncludes(Kibo.MODIFIERS, e)
}
;
Kibo.prototype.initialize = function () {
    var e, t = this;
    this.lastKeyCode = -1;
    this.lastModifiers = {};
    for (e = 0; e < Kibo.MODIFIERS.length; e++)
        this.lastModifiers[Kibo.MODIFIERS[e]] = false;
    this.keysDown = {
        any: []
    };
    this.keysUp = {
        any: []
    };
    for (e = 0; e < Kibo.WILDCARD_TYPES.length; e++) {
        this.keysDown["any " + Kibo.WILDCARD_TYPES[e]] = [];
        this.keysUp["any " + Kibo.WILDCARD_TYPES[e]] = []
    }
    this.downHandler = this.handler("down");
    this.upHandler = this.handler("up");
    this.clearHandler = function () {
        Kibo.unregisterEvent(t.element, "keydown", t.downHandler);
        Kibo.unregisterEvent(t.element, "keyup", t.upHandler)
    }
    ;
    Kibo.registerEvent(this.element, "keydown", this.downHandler);
    Kibo.registerEvent(this.element, "keyup", this.upHandler);
    Kibo.registerEvent(window, "unload", function n() {
        Kibo.unregisterEvent(t.element, "keydown", t.downHandler);
        Kibo.unregisterEvent(t.element, "keyup", t.upHandler);
        Kibo.unregisterEvent(window, "unload", n)
    })
}
;
Kibo.prototype.matchingKeys = function (e) {
    var t, n, r, i, s = [];
    for (var o in e) {
        if (Object.prototype.hasOwnProperty.call(e, o)) {
            r = Kibo.trimString(o).split(" ");
            if (r.length && r[0] !== "any") {
                i = true;
                for (n = 0; n < r.length; n++)
                    i = i && (Kibo.isModifier(r[n]) ? this.lastKey(r[n]) : this.lastKey() === r[n]);
                if (i)
                    s.push(o)
            }
        }
    }
    return s
}
;
Kibo.prototype.handler = function (e) {
    var t = this;
    return function (n) {
        var r, i, s, o;
        n = n || window.event;
        t.lastKeyCode = n.keyCode;
        for (r = 0; r < Kibo.MODIFIERS.length; r++)
            t.lastModifiers[Kibo.MODIFIERS[r]] = n[Kibo.MODIFIERS[r] + "Key"];
        if (Kibo.arrayIncludes(Kibo.MODIFIERS, Kibo.keyName(t.lastKeyCode)))
            t.lastModifiers[Kibo.keyName(t.lastKeyCode)] = true;
        o = t["keys" + Kibo.capitalize(e)];
        s = t.matchingKeys(o);
        for (r = 0; r < o.any.length; r++)
            if (o.any[r](n) === false && n.preventDefault)
                n.preventDefault();
        for (r = 0; r < Kibo.WILDCARD_TYPES.length; r++)
            if (Kibo.arrayIncludes(Kibo.WILDCARDS[Kibo.WILDCARD_TYPES[r]], t.lastKeyCode))
                for (i = 0; i < o["any " + Kibo.WILDCARD_TYPES[r]].length; i++)
                    if (o["any " + Kibo.WILDCARD_TYPES[r]][i](n) === false && n.preventDefault)
                        n.preventDefault();
        for (r = 0; r < s.length; r++)
            for (i = 0; i < o[s[r]].length; i++)
                if (o[s[r]][i](n) === false && n.preventDefault)
                    n.preventDefault()
    }
}
;
Kibo.prototype.registerKeys = function (e, t, n) {
    var r, i = this["keys" + Kibo.capitalize(e)];
    if (!Kibo.isArray(t))
        t = [t];
    for (r = 0; r < t.length; r++) {
        Kibo.assert(Kibo.isString(t[r]), {
            name: "Type error",
            message: "expected string or array of strings."
        });
        t[r] = Kibo.neatString(t[r]);
        if (Kibo.isArray(i[t[r]]))
            i[t[r]].push(n);
        else
            i[t[r]] = [n]
    }
    return this
}
;
Kibo.prototype.unregisterKeys = function (e, t, n) {
    var r, i, s = this["keys" + Kibo.capitalize(e)];
    if (!Kibo.isArray(t))
        t = [t];
    for (r = 0; r < t.length; r++) {
        Kibo.assert(Kibo.isString(t[r]), {
            name: "Type error",
            message: "expected string or array of strings."
        });
        t[r] = Kibo.neatString(t[r]);
        if (n === null)
            delete s[t[r]];
        else {
            if (Kibo.isArray(s[t[r]])) {
                for (i = 0; i < s[t[r]].length; i++) {
                    if (String(s[t[r]][i]) === String(n)) {
                        s[t[r]].splice(i, 1);
                        break
                    }
                }
            }
        }
    }
    return this
}
;
Kibo.prototype.delegate = function (e, t, n) {
    return n !== null ? this.registerKeys(e, t, n) : this.unregisterKeys(e, t, n)
}
;
Kibo.prototype.down = function (e, t) {
    return this.delegate("down", e, t)
}
;
Kibo.prototype.up = function (e, t) {
    return this.delegate("up", e, t)
}
;
Kibo.keyName = function (e) {
    return Kibo.KEY_NAMES_BY_CODE[e + ""]
}
;
Kibo.keyCode = function (e) {
    return +Kibo.KEY_CODES_BY_NAME[e]
}
;
Kibo.prototype.lastKey = function (e) {
    if (!e)
        return Kibo.keyName(this.lastKeyCode);
    Kibo.assert(Kibo.arrayIncludes(Kibo.MODIFIERS, e), {
        name: "Modifier error",
        message: "invalid modifier " + e + " (valid modifiers are: " + Kibo.MODIFIERS.join(", ") + ")."
    });
    return this.lastModifiers[e]
}
;
(function (e) {
    function t(e) {
        return function (t) {
            return Object.prototype.toString.call(t) === "[object " + e + "]"
        }
    }
    e.getCallStack = function () {
        var e = [];
        var t = this.getCallStack;
        for (var n = 0; n < 5 && t; n++) {
            t = t.caller;
            e.push(t)
        }
        var r = "";
        while (e.length != 0) {
            r += e.pop()
        }
        return r
    }
    ;
    e.setSelect = function (e, t) {
        var n = document.getElementById("latex-input");
        if (e == 1) {
            $(n).blur();
            setTimeout(function () {
                $(n).focus()
            }, 0)
        }
        if (document.selection) {
            var r = document.selection.createRange();
            r.moveStart("character", t);
            r.collapse(true);
            r.select()
        } else if (n.selectionStart) {
            n.selectionStart = t
        } else if (window.getSelection) {
            var i = window.getSelection();
            var s = document.createRange();
            if (n.firstChild) {
                s.setStart(n.firstChild, t);
                i.removeAllRanges();
                i.addRange(s)
            }
        }
    }
    ;
    e.isIE9 = function () {
        var e = navigator.appVersion;
        var t = e.split(";");
        var n = t[1].replace(/[ ]/g, "");
        return n == "MSIE9.0" || n == "MSIE10.0" || n == "MSIE11.0"
    }
    ;
    e.isIE = function () {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            return true
        }
        return false
    }
    ;
    e.isString = t("String");
    var n = 0;
    e.cid = function () {
        return n++
    }
    ;
    e.getTime = Date.now || function () {
        return (new Date).getTime()
    }
})(editorCanvas);
(function (e) {
    jQuery.fn.putCursorAtEnd = function () {
        return this.each(function () {
            e(this).focus();
            if (this.setSelectionRange) {
                var t = e(this).val().length * 2;
                this.setSelectionRange(t, t)
            } else {
                e(this).val(e(this).val())
            }
            this.scrollTop = 999999
        })
    }
    ;
    jQuery.fn.setCursorPosition = function (t) {
        return this.each(function () {
            e(this).focus();
            if (this.setSelectionRange) {
                this.setSelectionRange(t, t)
            } else {
                e(this).val(e(this).val())
            }
            this.scrollTop = 999999
        })
    }
})(jQuery)
