(function () {
    var ALG = {};     
    var arr = [];     
    var S = [];        
    var pos = 0;      
    var timer = null;  
    var cur = "lin";   
    var $ = function (i) {
        return document.getElementById(i);
    };

    function Rec(a) {
        var r = {
            S: [], c: 0, s: 0, a: a
        };
        r.P = function (l, m, h, k, e) {
            r.S.push({ a: r.a.slice(), h: h || {}, m: k || {}, line: l, msg: m, c: r.c, s: r.s, ex: e });
        };
        r.sw = function (i, j) {
            var t = r.a[i];
            r.a[i] = r.a[j];
            r.a[j] = t;
            r.s++;
        };
        return r;
    }

    function M() {
        var m = {};
        for (var k = 0; k < arguments.length; k += 2) {
            var i = arguments[k];
            if (i >= 0)
                m[i] = m[i] ? m[i] + "/" + arguments[k + 1] : arguments[k + 1];
        }
        return m;
    }

    function X(o, e) {
        return Object.assign({}, o, e || {});
    }

    ALG.lin = {
        name: "Linear Search",
        search: 1,
        code: [
            "for (int i = 0; i < size; i++) {",
            "    if (array[i] == key) {",
            "        return i;",
            "    }",
            "}",
            "return -1;"
        ],

        build: function (a, key) {
            var r = Rec(a.slice()), d = {};
            r.P(-1, "Press Play to search for " + key);
            for (var i = 0; i < a.length; i++) {
                r.P(0, "i = " + i, X(d, { [i]: "cmp" }), M(i, "i"));
                r.c++;
                r.P(
                    1,
                    "array[" + i + "] = " + a[i] + " equal to " + key + "?",
                    X(d, { [i]: "cmp" }),
                    M(i, "i")
                );
                if (a[i] === key) {
                    r.P(2, "Found at index " + i + ", return " + i, X(d, { [i]: "ok" }), M(i, "i"));
                    return r.S;
                }
                d[i] = "dim";
                r.P(1, "No, move on", X(d));
            }
            r.P(5, "End of array: not found, return -1", X(d));
            return r.S;
        }
    };

    ALG.bin = {
        name: "Binary Search",
        search: 1,
        code: [
            "int low = 0, high = size - 1;",
            "while (low <= high) {",
            "    int mid = (low + high) / 2;",
            "    if (array[mid] == key) return mid;",
            "    else if (array[mid] > key) high = mid - 1;",
            "    else low = mid + 1;",
            "}",
            "return -1;"
        ],

        build: function (a, key) {
            var r = Rec(a.slice()), lo = 0, hi = a.length - 1;
            function g(x, y, e) {
                var h = {};
                for (var k = 0; k < a.length; k++)
                    if (k < x || k > y)
                        h[k] = "dim";
                return X(h, e);
            }
            r.P(-1, "Sorted array. Press Play to search for " + key);
            r.P(0, "low = 0, high = " + hi, g(lo, hi), M(lo, "low", hi, "high"));
            while (lo <= hi) {
                r.P(
                    1,
                    "low (" + lo + ") ≤ high (" + hi + ") → continue",
                    g(lo, hi),
                    M(lo, "low", hi, "high")
                );
                var mid = Math.floor((lo + hi) / 2);
                r.P(
                    2,
                    "mid = (" + lo + " + " + hi + ") / 2 = " + mid,
                    g(lo, hi, { [mid]: "cmp" }),
                    M(lo, "low", mid, "mid", hi, "high")
                );
                r.c++;
                if (a[mid] === key) {
                    r.P(
                        3,
                        "array[" + mid + "] = " + key + " → found, return " + mid,
                        g(lo, hi, { [mid]: "ok" }),
                        M(mid, "mid")
                    );
                    return r.S;
                }
                if (a[mid] > key) {
                    r.P(
                        4,
                        a[mid] + " > " + key + " → keep the left half",
                        g(lo, hi, { [mid]: "cmp" }),
                        M(mid, "mid")
                    );
                    hi = mid - 1;
                }
                else {
                    r.P(
                        5,
                        a[mid] + " < " + key + " → keep the right half",
                        g(lo, hi, { [mid]: "cmp" }),
                        M(mid, "mid")
                    );
                    lo = mid + 1;
                }
            }
            r.P(7, "low > high → not found, return -1", g(0, -1));
            return r.S;
        }
    };

    ALG.bub = {
        name: "Bubble Sort",
        code: [
            "for (int i = size - 1; i > 0; i--) {",
            "    int max = array[0];",
            "    for (int j = 1; j <= i; j++) {",
            "        if (max > array[j]) {",
            "            array[j-1] = array[j]; array[j] = max; // swap",
            "        } else max = array[j];",
            "    }",
            "}"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length, d = {};
            function h(e) {
                var o = {};
                for (var k in d)
                    o[k] = "ok";
                return X(o, e);
            }
            r.P(-1, "Press Play to start", h());
            for (var i = n - 1; i > 0; i--) {
                r.P(0, "Pass: the largest of positions 0.." + i + " moves to position " + i, h());
                r.P(1, "max = array[0] = " + r.a[0], h({ 0: "piv" }), M(0, "max"));
                for (var j = 1; j <= i; j++) {
                    r.c++;
                    r.P(
                        3,
                        "max = " + r.a[j - 1] + " > array[" + j + "] = " + r.a[j] + " ?",
                        h({ [j - 1]: "cmp", [j]: "cmp" }),
                        M(j - 1, "max", j, "j")
                    );
                    if (r.a[j - 1] > r.a[j]) {
                        r.sw(j - 1, j);
                        r.P(4, "Yes → swap", h({ [j - 1]: "swap", [j]: "swap" }), M(j, "max"));
                    }
                    else
                        r.P(5, "No → array[" + j + "] is the new max", h({ [j]: "piv" }), M(j, "max"));
                }
                d[i] = 1;
                r.P(7, r.a[i] + " is now in its final position", h());
            }
            d[0] = 1;
            r.P(-1, "Sorted!", h());
            return r.S;
        }
    };

    ALG.ins = {
        name: "Insertion Sort",
        code: [
            "for (int i = 1; i < size; i++) {",
            "    int j = i;",
            "    while (j > 0 && array[j] < array[j-1]) {",
            "        swap(array[j], array[j-1]);",
            "        j--;",
            "    }",
            "}"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length;
            function h(i, e) {
                var o = {};
                for (var k = 0; k <= i && k < n; k++)
                    o[k] = "part";
                return X(o, e);
            }
            r.P(-1, "The first element is the sorted part", h(0));
            for (var i = 1; i < n; i++) {
                var j = i;
                r.P(
                    0,
                    "i = " + i + ": insert " + r.a[i] + " into the sorted part",
                    h(i - 1, { [i]: "piv" }),
                    M(i, "i")
                );
                r.P(1, "j = i = " + j, h(i - 1, { [j]: "piv" }), M(j, "j"));
                while (j > 0) {
                    r.c++;
                    r.P(
                        2,
                        "array[" + j + "] = " + r.a[j] + " < array[" + (j - 1) + "] = " + r.a[j - 1] + " ?",
                        h(i, { [j]: "cmp", [j - 1]: "cmp" }),
                        M(j, "j")
                    );
                    if (r.a[j] < r.a[j - 1]) {
                        r.sw(j, j - 1);
                        r.P(3, "Yes → swap, then j--", h(i, { [j]: "swap", [j - 1]: "swap" }), M(j - 1, "j"));
                        j--;
                    }
                    else {
                        r.P(2, "No → " + r.a[j] + " is in place", h(i), M(j, "j"));
                        break;
                    }
                }
                if (j === 0)
                    r.P(2, "j = 0 → reached the start", h(i), M(0, "j"));
            }
            var all = {};
            for (var k = 0; k < n; k++)
                all[k] = "ok";
            r.P(-1, "Sorted!", all);
            return r.S;
        }
    };

    ALG.sel = {
        name: "Selection Sort",
        code: [
            "for (int i = 0; i < size - 1; i++) {",
            "    int small = i;",
            "    for (int j = i + 1; j < size; j++)",
            "        if (array[j] < array[small]) small = j;",
            "    swap(array[i], array[small]);",
            "}"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length, d = {};
            function h(e) {
                return X(d, e);
            }
            r.P(-1, "Press Play to start");
            for (var i = 0; i < n - 1; i++) {
                var sm = i;
                r.P(1, "small = i = " + i, h({ [i]: "piv" }), M(i, "small/i"));
                for (var j = i + 1; j < n; j++) {
                    r.c++;
                    r.P(
                        3,
                        "array[" + j + "] = " + r.a[j] + " < array[" + sm + "] = " + r.a[sm] + " ?",
                        h({ [sm]: "piv", [j]: "cmp" }),
                        M(i, "i", sm, "small", j, "j")
                    );
                    if (r.a[j] < r.a[sm]) {
                        sm = j;
                        r.P(3, "Yes → small = " + j, h({ [sm]: "piv" }), M(i, "i", sm, "small"));
                    }
                }
                if (sm !== i) {
                    r.sw(i, sm);
                    r.P(4, "Swap array[" + i + "] and array[" + sm + "]", h({ [i]: "swap", [sm]: "swap" }));
                }
                else
                    r.P(4, "Smallest is already at " + i, h({ [i]: "piv" }));
                d[i] = "ok";
                r.P(5, r.a[i] + " is in its final position", h());
            }
            d[n - 1] = "ok";
            r.P(-1, "Sorted!", h());
            return r.S;
        }
    };

    ALG.qui = {
        name: "Quick Sort",
        code: [
            "pivot = first; i = first + 1; j = last;",
            "while (i < j) {",
            "    while (i < last && array[i] <= array[pivot]) i++;",
            "    while (j > first && array[j] > array[pivot]) j--;",
            "    if (i < j) swap(array[i], array[j]);",
            "}",
            "if (array[pivot] > array[j]) swap(array[pivot], array[j]);",
            "quicksort(first, j-1); quicksort(j+1, last);"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length, ok = {};
            function h(f, l, e) {
                var o = {};
                for (var k = 0; k < n; k++) {
                    if (ok[k])
                        o[k] = "ok";
                    else if (k < f || k > l)
                        o[k] = "dim";
                }
                return X(o, e);
            }
            r.P(-1, "Press Play to start", h(0, n - 1));
            function qs(f, l) {
                if (f > l)
                    return;
                if (f === l) {
                    ok[f] = 1;
                    r.P(7, "One element → already in place", h(f, l));
                    return;
                }
                var p = f, i = f + 1, j = l;
                r.P(
                    0,
                    "pivot = array[" + f + "] = " + r.a[p] + ", i = " + i + ", j = " + j,
                    h(f, l, { [p]: "piv" }),
                    M(p, "P", i, "i", j, "j")
                );
                while (i < j) {
                    while (i < l) {
                        r.c++;
                        var g = r.a[i] <= r.a[p];
                        r.P(
                            2,
                            "array[" + i + "] = " + r.a[i] + (g ? " ≤ " : " > ") + r.a[p] + (g ? " → i++" : " → stop"),
                            h(f, l, { [p]: "piv", [i]: "cmp" }),
                            M(p, "P", i, "i", j, "j")
                        );
                        if (!g)
                            break;
                        i++;
                    }
                    while (j > f) {
                        r.c++;
                        var g2 = r.a[j] > r.a[p];
                        r.P(
                            3,
                            "array[" + j + "] = " + r.a[j] + (g2 ? " > " : " ≤ ") + r.a[p] + (g2 ? " → j--" : " → stop"),
                            h(f, l, { [p]: "piv", [j]: "cmp" }),
                            M(p, "P", i, "i", j, "j")
                        );
                        if (!g2)
                            break;
                        j--;
                    }
                    if (i < j) {
                        r.sw(i, j);
                        r.P(
                            4,
                            "i < j → swap array[" + i + "] and array[" + j + "]",
                            h(f, l, { [p]: "piv", [i]: "swap", [j]: "swap" }),
                            M(p, "P", i, "i", j, "j")
                        );
                    }
                }
                if (r.a[p] > r.a[j]) {
                    r.sw(p, j);
                    r.P(
                        6,
                        "Swap the pivot with array[" + j + "]",
                        h(f, l, { [p]: "swap", [j]: "swap" }),
                        M(j, "P")
                    );
                }
                ok[j] = 1;
                r.P(6, "Pivot " + r.a[j] + " is in its final position", h(f, l), M(j, "P"));
                qs(f, j - 1);
                qs(j + 1, l);
            }
            qs(0, n - 1);
            r.P(-1, "Sorted!", h(0, n - 1));
            return r.S;
        }
    };

    ALG.hea = {
        name: "Heap Sort",
        code: [
            "// 1) build a max-heap",
            "for (int i = n/2 - 1; i >= 0; i--) heapify(n, i);",
            "for (int i = n - 1; i > 0; i--) {",
            "    swap(array[0], array[i]);",
            "    heapify(i, 0);",
            "}",
            "void heapify(int n, int root) {",
            "    int largest = root, l = 2*root+1, r = 2*root+2;",
            "    if (l < n && array[l] > array[largest]) largest = l;",
            "    if (r < n && array[r] > array[largest]) largest = r;",
            "    if (largest != root) { swap(array[root], array[largest]); heapify(n, largest); }",
            "}"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length, sz = n;
            function h(e) {
                var o = {};
                for (var k = sz; k < n; k++)
                    o[k] = "ok";
                return X(o, e);
            }
            function hp(m, t) {
                var l = 2 * t + 1, q = 2 * t + 2, lg = t, L = l < m ? l : -1, R = q < m ? q : -1;
                r.P(
                    7,
                    "heapify(root = " + t + "): L = " + (L < 0 ? "none" : L) + ", R = " + (R < 0 ? "none" : R),
                    h({ [t]: "piv" }),
                    M(t, "root", L, "L", R, "R")
                );
                if (L >= 0) {
                    r.c++;
                    var y = r.a[l] > r.a[lg];
                    r.P(
                        8,
                        "array[" + l + "] = " + r.a[l] + (y ? " > " : " ≤ ") + r.a[lg] + (y ? " → largest = " + l : ""),
                        h({ [lg]: "piv", [l]: "cmp" }),
                        M(t, "root", l, "L")
                    );
                    if (y)
                        lg = l;
                }
                if (R >= 0) {
                    r.c++;
                    var z = r.a[q] > r.a[lg];
                    r.P(
                        9,
                        "array[" + q + "] = " + r.a[q] + (z ? " > " : " ≤ ") + r.a[lg] + (z ? " → largest = " + q : ""),
                        h({ [lg]: "piv", [q]: "cmp" }),
                        M(t, "root", q, "R")
                    );
                    if (z)
                        lg = q;
                }
                if (lg !== t) {
                    r.sw(t, lg);
                    r.P(
                        10,
                        "Swap array[" + t + "] and array[" + lg + "], continue down",
                        h({ [t]: "swap", [lg]: "swap" })
                    );
                    hp(m, lg);
                }
                else
                    r.P(10, "Heap property holds here", h({ [t]: "piv" }), M(t, "root"));
            }
            r.P(0, "Step 1: build a max-heap", h());
            for (var i = Math.floor(n / 2) - 1; i >= 0; i--) {
                r.P(1, "Build: heapify index " + i, h({ [i]: "piv" }), M(i, "i"));
                hp(n, i);
            }
            r.P(-1, "Max-heap built: the root is the largest", h());
            for (var i = n - 1; i > 0; i--) {
                r.sw(0, i);
                r.P(3, "Swap the root (max) with array[" + i + "]", h({ [0]: "swap", [i]: "swap" }));
                sz = i;
                r.P(4, "Heap size = " + i + ", heapify the new root", h({ [0]: "piv" }), M(0, "root"));
                hp(i, 0);
            }
            sz = 0;
            r.P(-1, "Sorted!", h());
            return r.S;
        }
    };

    ALG.cnt = {
        name: "Counting Sort",
        code: [
            "int max = getMax();",
            "for (i = 0; i < size; i++) count[array[i]]++;",
            "for (i = 1; i <= max; i++) count[i] += count[i-1];",
            "for (i = size - 1; i >= 0; i--) {",
            "    output[count[array[i]] - 1] = array[i];",
            "    count[array[i]]--;",
            "}",
            "copy output back to array"
        ],

        build: function (a) {
            var r = Rec(a.slice()), n = a.length, mx = Math.max.apply(null, a), c = [], o = [], k, i;
            for (k = 0; k <= mx; k++)
                c.push(0);
            for (k = 0; k < n; k++)
                o.push(null);
            function E(x, y) {
                return [{ n: "count", v: c.slice(), hl: x }, { n: "output", v: o.slice(), hl: y }];
            }
            r.P(0, "max = " + mx + " → count array of size " + (mx + 1) + " (all zeros)", {}, {}, E());
            for (i = 0; i < n; i++) {
                c[a[i]]++;
                r.P(1, "count[" + a[i] + "]++ → " + c[a[i]], { [i]: "cmp" }, {}, E(a[i]));
            }
            for (i = 1; i <= mx; i++) {
                c[i] += c[i - 1];
                r.P(2, "count[" + i + "] += count[" + (i - 1) + "] → " + c[i], {}, {}, E(i));
            }
            for (i = n - 1; i >= 0; i--) {
                var v = a[i], p = c[v] - 1;
                o[p] = v;
                r.P(4, "output[" + p + "] = " + v + " (count[" + v + "] − 1)", { [i]: "cmp" }, {}, E(v, p));
                c[v]--;
                r.P(5, "count[" + v + "]-- → " + c[v], { [i]: "cmp" }, {}, E(v, p));
            }
            r.a = o.slice();
            var all = {};
            for (k = 0; k < n; k++)
                all[k] = "ok";
            r.P(7, "Copy the output back: sorted!", all, {}, E());
            return r.S;
        }
    };

    function dflt(id) {
        return id === "cnt" ? [4, 2, 2, 8, 3, 3, 1] : [25, 60, 12, 40, 78, 33, 91, 56];
    }

    // HTML of one cell
    function mk(v, cl, ix, mkr) {
        return '<div class="c ' + (cl || "") + '"><div class="mk">' + (mkr || "") + '</div><div class="b">' + (v === null ? "" : v) + '</div><div class="ix">' + ix + '</div></div>';
    }

    function render() {
        var s = S[pos], h = "";
        s.a.forEach(function (v, i) {
            h += mk(v, s.h[i], i, s.m[i]);
        });
        $("arr").innerHTML = h;
        var e = "";
        (s.ex || []).forEach(function (x) {
            e += '<div class="ex"><span>' + x.n + '</span>';
            x.v.forEach(function (v, i) {
                e += mk(v, x.hl === i ? "cmp" : "", i, "");
            });
            e += "</div>";
        });
        $("exs").innerHTML = e;
        $("st").textContent = s.msg;
        $("cm").textContent = s.c;
        $("sw").textContent = s.s;
        $("sn").textContent = pos + " / " + (S.length - 1);
        var ls = $("code").children;
        for (var i = 0; i < ls.length; i++)
            ls[i].className = "l" + (i === s.line ? " h" : "");
        $("bk").disabled = pos === 0;
        $("nx").disabled = pos === S.length - 1;
        if (pos === S.length - 1)
            stop();
    }

    function setup() {
        stop();
        var a = ALG[cur], k = parseInt($("key").value, 10);
        if (isNaN(k))
            k = 0;
        if (cur === "bin")
            arr.sort(function (x, y) {
                return x - y;
            });
        S = a.build(arr.slice(), k);
        pos = 0;
        render();
    }

    function setAlg(id) {
        cur = id;
        var a = ALG[id];
        arr = dflt(id);
        if (id === "bin")
            arr.sort(function (x, y) {
                return x - y;
            });
        $("kl").style.display = a.search ? "flex" : "none";
        if (a.search)
            $("key").value = arr[3];
        var c = $("code");
        c.innerHTML = "";
        a.code.forEach(function (t) {
            var d = document.createElement("span");
            d.className = "l";
            d.textContent = t;
            c.appendChild(d);
        });
        setup();
    }

    function stop() {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
        $("pl").textContent = "▶ Play";
    }

    function tick() {
        if (pos < S.length - 1) {
            pos++;
            render();
        }
        if (timer !== null && pos < S.length - 1)
            timer = setTimeout(tick, 1100 - $("sp").value * 100);
    }

    $("pl").onclick = function () {
        if (timer !== null) {
            stop();
            return;
        }
        if (pos === S.length - 1) {
            pos = 0;
            render();
        }
        $("pl").textContent = "❚❚ Pause";
        timer = setTimeout(tick, 300);
    };
    $("nx").onclick = function () {
        stop();
        if (pos < S.length - 1) {
            pos++;
            render();
        }
    };
    $("bk").onclick = function () {
        stop();
        if (pos > 0) {
            pos--;
            render();
        }
    };
    $("rst").onclick = setup;
    $("key").onchange = setup;
    $("rnd").onclick = function () {
        var m = cur === "cnt" ? 9 : 90, b = cur === "cnt" ? 0 : 10;
        arr = [];
        for (var i = 0; i < (cur === "cnt" ? 7 : 8); i++)
            arr.push(Math.floor(Math.random() * m) + b);
        if (cur === "bin")
            arr.sort(function (x, y) {
                return x - y;
            });
        if (ALG[cur].search)
            $("key").value = arr[Math.floor(Math.random() * arr.length)];
        setup();
    };

    var sel = $("alg");
    Object.keys(ALG).forEach(function (id) {
        var o = document.createElement("option");
        o.value = id;
        o.textContent = ALG[id].name;
        sel.appendChild(o);
    });
    sel.onchange = function () {
        setAlg(sel.value);
    };
    setAlg("lin");
})();