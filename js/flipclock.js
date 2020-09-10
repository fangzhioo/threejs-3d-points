// https://github.com/objectivehtml/FlipClock/blob/master/compiled/flipclock.js

var FlipClock;
!(function (e) {
  "use strict";
  (FlipClock = function (e, t, n) {
    return (
      t instanceof Object && t instanceof Date == 0 && ((n = t), (t = 0)),
      new FlipClock.Factory(e, t, n)
    );
  }),
    (FlipClock.Lang = {}),
    (FlipClock.Base = Base.extend({
      buildDate: "2014-12-12",
      version: "0.7.7",
      constructor: function (t, n) {
        "object" != typeof t && (t = {}),
          "object" != typeof n && (n = {}),
          this.setOptions(e.extend(!0, {}, t, n));
      },
      callback: function (e) {
        if ("function" == typeof e) {
          for (var t = [], n = 1; n <= arguments.length; n++)
            arguments[n] && t.push(arguments[n]);
          e.apply(this, t);
        }
      },
      log: function (e) {
        window.console && console.log && console.log(e);
      },
      getOption: function (e) {
        return this[e] ? this[e] : !1;
      },
      getOptions: function () {
        return this;
      },
      setOption: function (e, t) {
        this[e] = t;
      },
      setOptions: function (e) {
        for (var t in e) "undefined" != typeof e[t] && this.setOption(t, e[t]);
      },
    }));
})(jQuery),
  (function (e) {
    "use strict";
    FlipClock.Face = FlipClock.Base.extend({
      autoStart: !0,
      dividers: [],
      factory: !1,
      lists: [],
      constructor: function (e, t) {
        (this.dividers = []),
          (this.lists = []),
          this.base(t),
          (this.factory = e);
      },
      build: function () {
        this.autoStart && this.start();
      },
      createDivider: function (t, n, i) {
        ("boolean" != typeof n && n) || ((i = n), (n = t));
        var o = [
          '<span class="' + this.factory.classes.dot + ' top"></span>',
          '<span class="' + this.factory.classes.dot + ' bottom"></span>',
        ].join("");
        i && (o = ""), (t = this.factory.localize(t));
        var s = [
            '<span class="' +
              this.factory.classes.divider +
              " " +
              (n ? n : "").toLowerCase() +
              '">',
            '<span class="' +
              this.factory.classes.label +
              '">' +
              (t ? t : "") +
              "</span>",
            o,
            "</span>",
          ],
          a = e(s.join(""));
        return this.dividers.push(a), a;
      },
      createList: function (e, t) {
        "object" == typeof e && ((t = e), (e = 0));
        var n = new FlipClock.List(this.factory, e, t);
        return this.lists.push(n), n;
      },
      reset: function () {
        (this.factory.time = new FlipClock.Time(
          this.factory,
          this.factory.original ? Math.round(this.factory.original) : 0,
          { minimumDigits: this.factory.minimumDigits }
        )),
          this.flip(this.factory.original, !1);
      },
      appendDigitToClock: function (e) {
        e.$el.append(!1);
      },
      addDigit: function (e) {
        var t = this.createList(e, {
          classes: {
            active: this.factory.classes.active,
            before: this.factory.classes.before,
            flip: this.factory.classes.flip,
          },
        });
        this.appendDigitToClock(t);
      },
      start: function () {},
      stop: function () {},
      autoIncrement: function () {
        this.factory.countdown ? this.decrement() : this.increment();
      },
      increment: function () {
        this.factory.time.addSecond();
      },
      decrement: function () {
        0 == this.factory.time.getTimeSeconds()
          ? this.factory.stop()
          : this.factory.time.subSecond();
      },
      flip: function (t, n) {
        var i = this;
        e.each(t, function (e, t) {
          var o = i.lists[e];
          o ? (n || t == o.digit || o.play(), o.select(t)) : i.addDigit(t);
        });
      },
    });
  })(jQuery),
  (function (e) {
    "use strict";
    FlipClock.Factory = FlipClock.Base.extend({
      animationRate: 1e3,
      autoStart: !0,
      callbacks: {
        destroy: !1,
        create: !1,
        init: !1,
        interval: !1,
        start: !1,
        stop: !1,
        reset: !1,
      },
      classes: {
        active: "flip-clock-active",
        before: "flip-clock-before",
        divider: "flip-clock-divider",
        dot: "flip-clock-dot",
        label: "flip-clock-label",
        flip: "flip",
        play: "play",
        wrapper: "flip-clock-wrapper",
      },
      clockFace: "HourlyCounter",
      countdown: !1,
      defaultClockFace: "HourlyCounter",
      defaultLanguage: "english",
      $el: !1,
      face: !0,
      lang: !1,
      language: "english",
      minimumDigits: 0,
      original: !1,
      running: !1,
      time: !1,
      timer: !1,
      $wrapper: !1,
      constructor: function (t, n, i) {
        i || (i = {}),
          (this.lists = []),
          (this.running = !1),
          this.base(i),
          (this.$el = e(t).addClass(this.classes.wrapper)),
          (this.$wrapper = this.$el),
          (this.original = n instanceof Date ? n : n ? Math.round(n) : 0),
          (this.time = new FlipClock.Time(this, this.original, {
            minimumDigits: this.minimumDigits,
            animationRate: this.animationRate,
          })),
          (this.timer = new FlipClock.Timer(this, i)),
          this.loadLanguage(this.language),
          this.loadClockFace(this.clockFace, i),
          this.autoStart && this.start();
      },
      loadClockFace: function (e, t) {
        var n,
          i = "Face",
          o = !1;
        return (
          (e = e.ucfirst() + i),
          this.face.stop && (this.stop(), (o = !0)),
          this.$el.html(""),
          (this.time.minimumDigits = this.minimumDigits),
          (n = FlipClock[e]
            ? new FlipClock[e](this, t)
            : new FlipClock[this.defaultClockFace + i](this, t)),
          n.build(),
          (this.face = n),
          o && this.start(),
          this.face
        );
      },
      loadLanguage: function (e) {
        var t;
        return (
          (t = FlipClock.Lang[e.ucfirst()]
            ? FlipClock.Lang[e.ucfirst()]
            : FlipClock.Lang[e]
            ? FlipClock.Lang[e]
            : FlipClock.Lang[this.defaultLanguage]),
          (this.lang = t)
        );
      },
      localize: function (e, t) {
        var n = this.lang;
        if (!e) return null;
        var i = e.toLowerCase();
        return "object" == typeof t && (n = t), n && n[i] ? n[i] : e;
      },
      start: function (e) {
        var t = this;
        t.running || (t.countdown && !(t.countdown && t.time.time > 0))
          ? t.log("Trying to start timer when countdown already at 0")
          : (t.face.start(t.time),
            t.timer.start(function () {
              t.flip(), "function" == typeof e && e();
            }));
      },
      stop: function (e) {
        this.face.stop(), this.timer.stop(e);
        for (var t in this.lists)
          this.lists.hasOwnProperty(t) && this.lists[t].stop();
      },
      reset: function (e) {
        this.timer.reset(e), this.face.reset();
      },
      setTime: function (e) {
        (this.time.time = e), this.flip(!0);
      },
      getTime: function () {
        return this.time;
      },
      setCountdown: function (e) {
        var t = this.running;
        (this.countdown = e ? !0 : !1), t && (this.stop(), this.start());
      },
      flip: function (e) {
        this.face.flip(!1, e);
      },
    });
  })(jQuery),
  (function (e) {
    "use strict";
    FlipClock.List = FlipClock.Base.extend({
      digit: 0,
      classes: {
        active: "flip-clock-active",
        before: "flip-clock-before",
        flip: "flip",
      },
      factory: !1,
      $el: !1,
      $obj: !1,
      items: [],
      lastDigit: 0,
      constructor: function (e, t) {
        (this.factory = e),
          (this.digit = t),
          (this.lastDigit = t),
          (this.$el = this.createList()),
          (this.$obj = this.$el),
          t > 0 && this.select(t),
          this.factory.$el.append(this.$el);
      },
      select: function (e) {
        if (
          ("undefined" == typeof e ? (e = this.digit) : (this.digit = e),
          this.digit != this.lastDigit)
        ) {
          var t = this.$el
            .find("." + this.classes.before)
            .removeClass(this.classes.before);
          this.$el
            .find("." + this.classes.active)
            .removeClass(this.classes.active)
            .addClass(this.classes.before),
            this.appendListItem(this.classes.active, this.digit),
            t.remove(),
            (this.lastDigit = this.digit);
        }
      },
      play: function () {
        this.$el.addClass(this.factory.classes.play);
      },
      stop: function () {
        var e = this;
        setTimeout(function () {
          e.$el.removeClass(e.factory.classes.play);
        }, this.factory.timer.interval);
      },
      createListItem: function (e, t) {
        return [
          '<li class="' + (e ? e : "") + '">',
          '<a href="#">',
          '<div class="up">',
          '<div class="shadow"></div>',
          '<div class="inn">' + (t ? t : "") + "</div>",
          "</div>",
          '<div class="down">',
          '<div class="shadow"></div>',
          '<div class="inn">' + (t ? t : "") + "</div>",
          "</div>",
          "</a>",
          "</li>",
        ].join("");
      },
      appendListItem: function (e, t) {
        var n = this.createListItem(e, t);
        this.$el.append(n);
      },
      createList: function () {
        var t = this.getPrevDigit() ? this.getPrevDigit() : this.digit,
          n = e(
            [
              '<ul class="' +
                this.classes.flip +
                " " +
                (this.factory.running ? this.factory.classes.play : "") +
                '">',
              this.createListItem(this.classes.before, t),
              this.createListItem(this.classes.active, this.digit),
              "</ul>",
            ].join("")
          );
        return n;
      },
      getNextDigit: function () {
        return 9 == this.digit ? 0 : this.digit + 1;
      },
      getPrevDigit: function () {
        return 0 == this.digit ? 9 : this.digit - 1;
      },
    });
  })(jQuery),
  (function (e) {
    "use strict";
    (String.prototype.ucfirst = function () {
      return this.substr(0, 1).toUpperCase() + this.substr(1);
    }),
      (e.fn.FlipClock = function (t, n) {
        return new FlipClock(e(this), t, n);
      }),
      (e.fn.flipClock = function (t, n) {
        return e.fn.FlipClock(t, n);
      });
  })(jQuery),
  (function (e) {
    "use strict";
    FlipClock.Time = FlipClock.Base.extend({
      time: 0,
      factory: !1,
      minimumDigits: 0,
      constructor: function (e, t, n) {
        "object" != typeof n && (n = {}),
          n.minimumDigits || (n.minimumDigits = e.minimumDigits),
          this.base(n),
          (this.factory = e),
          t && (this.time = t);
      },
      convertDigitsToArray: function (e) {
        var t = [];
        e = e.toString();
        for (var n = 0; n < e.length; n++) e[n].match(/^\d*$/g) && t.push(e[n]);
        return t;
      },
      digit: function (e) {
        var t = this.toString(),
          n = t.length;
        return t[n - e] ? t[n - e] : !1;
      },
      digitize: function (t) {
        var n = [];
        if (
          (e.each(t, function (e, t) {
            (t = t.toString()), 1 == t.length && (t = "0" + t);
            for (var i = 0; i < t.length; i++) n.push(t.charAt(i));
          }),
          n.length > this.minimumDigits && (this.minimumDigits = n.length),
          this.minimumDigits > n.length)
        )
          for (var i = n.length; i < this.minimumDigits; i++) n.unshift("0");
        return n;
      },
      getDateObject: function () {
        return this.time instanceof Date
          ? this.time
          : new Date(new Date().getTime() + 1e3 * this.getTimeSeconds());
      },
      getDayCounter: function (e) {
        var t = [this.getDays(), this.getHours(!0), this.getMinutes(!0)];
        return e && t.push(this.getSeconds(!0)), this.digitize(t);
      },
      getDays: function (e) {
        var t = this.getTimeSeconds() / 60 / 60 / 24;
        return e && (t %= 7), Math.floor(t);
      },
      getHourCounter: function () {
        var e = this.digitize([
          this.getHours(),
          this.getMinutes(!0),
          this.getSeconds(!0),
        ]);
        return e;
      },
      getHourly: function () {
        return this.getHourCounter();
      },
      getHours: function (e) {
        var t = this.getTimeSeconds() / 60 / 60;
        return e && (t %= 24), Math.floor(t);
      },
      getMilitaryTime: function (e, t) {
        "undefined" == typeof t && (t = !0), e || (e = this.getDateObject());
        var n = [e.getHours(), e.getMinutes()];
        return t === !0 && n.push(e.getSeconds()), this.digitize(n);
      },
      getMinutes: function (e) {
        var t = this.getTimeSeconds() / 60;
        return e && (t %= 60), Math.floor(t);
      },
      getMinuteCounter: function () {
        var e = this.digitize([this.getMinutes(), this.getSeconds(!0)]);
        return e;
      },
      getTimeSeconds: function (e) {
        return (
          e || (e = new Date()),
          this.time instanceof Date
            ? this.factory.countdown
              ? Math.max(this.time.getTime() / 1e3 - e.getTime() / 1e3, 0)
              : e.getTime() / 1e3 - this.time.getTime() / 1e3
            : this.time
        );
      },
      getTime: function (e, t) {
        "undefined" == typeof t && (t = !0),
          e || (e = this.getDateObject()),
          console.log(e);
        var n = e.getHours(),
          i = [n > 12 ? n - 12 : 0 === n ? 12 : n, e.getMinutes()];
        return t === !0 && i.push(e.getSeconds()), this.digitize(i);
      },
      getSeconds: function (e) {
        var t = this.getTimeSeconds();
        return e && (60 == t ? (t = 0) : (t %= 60)), Math.ceil(t);
      },
      getWeeks: function (e) {
        var t = this.getTimeSeconds() / 60 / 60 / 24 / 7;
        return e && (t %= 52), Math.floor(t);
      },
      removeLeadingZeros: function (t, n) {
        var i = 0,
          o = [];
        return (
          e.each(n, function (e) {
            t > e ? (i += parseInt(n[e], 10)) : o.push(n[e]);
          }),
          0 === i ? o : n
        );
      },
      addSeconds: function (e) {
        this.time instanceof Date
          ? this.time.setSeconds(this.time.getSeconds() + e)
          : (this.time += e);
      },
      addSecond: function () {
        this.addSeconds(1);
      },
      subSeconds: function (e) {
        this.time instanceof Date
          ? this.time.setSeconds(this.time.getSeconds() - e)
          : (this.time -= e);
      },
      subSecond: function () {
        this.subSeconds(1);
      },
      toString: function () {
        return this.getTimeSeconds().toString();
      },
    });
  })(jQuery),
  (function () {
    "use strict";
    FlipClock.Timer = FlipClock.Base.extend({
      callbacks: {
        destroy: !1,
        create: !1,
        init: !1,
        interval: !1,
        start: !1,
        stop: !1,
        reset: !1,
      },
      count: 0,
      factory: !1,
      interval: 1e3,
      animationRate: 1e3,
      constructor: function (e, t) {
        this.base(t),
          (this.factory = e),
          this.callback(this.callbacks.init),
          this.callback(this.callbacks.create);
      },
      getElapsed: function () {
        return this.count * this.interval;
      },
      getElapsedTime: function () {
        return new Date(this.time + this.getElapsed());
      },
      reset: function (e) {
        clearInterval(this.timer),
          (this.count = 0),
          this._setInterval(e),
          this.callback(this.callbacks.reset);
      },
      start: function (e) {
        (this.factory.running = !0),
          this._createTimer(e),
          this.callback(this.callbacks.start);
      },
      stop: function (e) {
        (this.factory.running = !1),
          this._clearInterval(e),
          this.callback(this.callbacks.stop),
          this.callback(e);
      },
      _clearInterval: function () {
        clearInterval(this.timer);
      },
      _createTimer: function (e) {
        this._setInterval(e);
      },
      _destroyTimer: function (e) {
        this._clearInterval(),
          (this.timer = !1),
          this.callback(e),
          this.callback(this.callbacks.destroy);
      },
      _interval: function (e) {
        this.callback(this.callbacks.interval), this.callback(e), this.count++;
      },
      _setInterval: function (e) {
        var t = this;
        t._interval(e),
          (t.timer = setInterval(function () {
            t._interval(e);
          }, this.interval));
      },
    });
  })(jQuery),
  (function (e) {
    FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({
      constructor: function (e, t) {
        this.base(e, t);
      },
      build: function (t) {
        var n = this,
          i = this.factory.$el.find("ul");
        this.factory.time.time ||
          ((this.factory.original = new Date()),
          (this.factory.time = new FlipClock.Time(
            this.factory,
            this.factory.original
          )));
        var t = t ? t : this.factory.time.getMilitaryTime(!1, this.showSeconds);
        t.length > i.length &&
          e.each(t, function (e, t) {
            n.createList(t);
          }),
          this.createDivider(),
          this.createDivider(),
          e(this.dividers[0]).insertBefore(
            this.lists[this.lists.length - 2].$el
          ),
          e(this.dividers[1]).insertBefore(
            this.lists[this.lists.length - 4].$el
          ),
          this.base();
      },
      flip: function (e, t) {
        this.autoIncrement(),
          (e = e ? e : this.factory.time.getMilitaryTime(!1, this.showSeconds)),
          this.base(e, t);
      },
    });
  })(jQuery),
  (function (e) {
    FlipClock.CounterFace = FlipClock.Face.extend({
      shouldAutoIncrement: !1,
      constructor: function (e, t) {
        "object" != typeof t && (t = {}),
          (e.autoStart = t.autoStart ? !0 : !1),
          t.autoStart && (this.shouldAutoIncrement = !0),
          (e.increment = function () {
            (e.countdown = !1), e.setTime(e.getTime().getTimeSeconds() + 1);
          }),
          (e.decrement = function () {
            e.countdown = !0;
            var t = e.getTime().getTimeSeconds();
            t > 0 && e.setTime(t - 1);
          }),
          (e.setValue = function (t) {
            e.setTime(t);
          }),
          (e.setCounter = function (t) {
            e.setTime(t);
          }),
          this.base(e, t);
      },
      build: function () {
        var t = this,
          n = this.factory.$el.find("ul"),
          i = this.factory.getTime().digitize([this.factory.getTime().time]);
        i.length > n.length &&
          e.each(i, function (e, n) {
            var i = t.createList(n);
            i.select(n);
          }),
          e.each(this.lists, function (e, t) {
            t.play();
          }),
          this.base();
      },
      flip: function (e, t) {
        this.shouldAutoIncrement && this.autoIncrement(),
          e ||
            (e = this.factory
              .getTime()
              .digitize([this.factory.getTime().time])),
          this.base(e, t);
      },
      reset: function () {
        (this.factory.time = new FlipClock.Time(
          this.factory,
          this.factory.original ? Math.round(this.factory.original) : 0
        )),
          this.flip();
      },
    });
  })(jQuery),
  (function (e) {
    FlipClock.DailyCounterFace = FlipClock.Face.extend({
      showSeconds: !0,
      constructor: function (e, t) {
        this.base(e, t);
      },
      build: function (t) {
        var n = this,
          i = this.factory.$el.find("ul"),
          o = 0;
        (t = t ? t : this.factory.time.getDayCounter(this.showSeconds)),
          t.length > i.length &&
            e.each(t, function (e, t) {
              n.createList(t);
            }),
          this.showSeconds
            ? e(this.createDivider("Seconds")).insertBefore(
                this.lists[this.lists.length - 2].$el
              )
            : (o = 2),
          e(this.createDivider("Minutes")).insertBefore(
            this.lists[this.lists.length - 4 + o].$el
          ),
          e(this.createDivider("Hours")).insertBefore(
            this.lists[this.lists.length - 6 + o].$el
          ),
          e(this.createDivider("Days", !0)).insertBefore(this.lists[0].$el),
          this.base();
      },
      flip: function (e, t) {
        e || (e = this.factory.time.getDayCounter(this.showSeconds)),
          this.autoIncrement(),
          this.base(e, t);
      },
    });
  })(jQuery),
  (function (e) {
    FlipClock.HourlyCounterFace = FlipClock.Face.extend({
      constructor: function (e, t) {
        this.base(e, t);
      },
      build: function (t, n) {
        var i = this,
          o = this.factory.$el.find("ul");
        (n = n ? n : this.factory.time.getHourCounter()),
          n.length > o.length &&
            e.each(n, function (e, t) {
              i.createList(t);
            }),
          e(this.createDivider("Seconds")).insertBefore(
            this.lists[this.lists.length - 2].$el
          ),
          e(this.createDivider("Minutes")).insertBefore(
            this.lists[this.lists.length - 4].$el
          ),
          t ||
            e(this.createDivider("Hours", !0)).insertBefore(this.lists[0].$el),
          this.base();
      },
      flip: function (e, t) {
        e || (e = this.factory.time.getHourCounter()),
          this.autoIncrement(),
          this.base(e, t);
      },
      appendDigitToClock: function (e) {
        this.base(e), this.dividers[0].insertAfter(this.dividers[0].next());
      },
    });
  })(jQuery),
  (function () {
    FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({
      clearExcessDigits: !1,
      constructor: function (e, t) {
        this.base(e, t);
      },
      build: function () {
        this.base(!0, this.factory.time.getMinuteCounter());
      },
      flip: function (e, t) {
        e || (e = this.factory.time.getMinuteCounter()), this.base(e, t);
      },
    });
  })(jQuery),
  (function (e) {
    FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({
      meridium: !1,
      meridiumText: "AM",
      build: function () {
        var t = this.factory.time.getTime(!1, this.showSeconds);
        this.base(t),
          (this.meridiumText = this.getMeridium()),
          (this.meridium = e(
            [
              '<ul class="flip-clock-meridium">',
              "<li>",
              '<a href="#">' + this.meridiumText + "</a>",
              "</li>",
              "</ul>",
            ].join("")
          )),
          this.meridium.insertAfter(this.lists[this.lists.length - 1].$el);
      },
      flip: function (e, t) {
        this.meridiumText != this.getMeridium() &&
          ((this.meridiumText = this.getMeridium()),
          this.meridium.find("a").html(this.meridiumText)),
          this.base(this.factory.time.getTime(!1, this.showSeconds), t);
      },
      getMeridium: function () {
        return new Date().getHours() >= 12 ? "PM" : "AM";
      },
      isPM: function () {
        return "PM" == this.getMeridium() ? !0 : !1;
      },
      isAM: function () {
        return "AM" == this.getMeridium() ? !0 : !1;
      },
    });
  })(jQuery),
  (function () {
    (FlipClock.Lang.Arabic = {
      years: "سنوات",
      months: "شهور",
      days: "أيام",
      hours: "ساعات",
      minutes: "دقائق",
      seconds: "ثواني",
    }),
      (FlipClock.Lang.ar = FlipClock.Lang.Arabic),
      (FlipClock.Lang["ar-ar"] = FlipClock.Lang.Arabic),
      (FlipClock.Lang.arabic = FlipClock.Lang.Arabic);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Danish = {
      years: "År",
      months: "Måneder",
      days: "Dage",
      hours: "Timer",
      minutes: "Minutter",
      seconds: "Sekunder",
    }),
      (FlipClock.Lang.da = FlipClock.Lang.Danish),
      (FlipClock.Lang["da-dk"] = FlipClock.Lang.Danish),
      (FlipClock.Lang.danish = FlipClock.Lang.Danish);
  })(jQuery),
  (function () {
    (FlipClock.Lang.German = {
      years: "Jahre",
      months: "Monate",
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
      seconds: "Sekunden",
    }),
      (FlipClock.Lang.de = FlipClock.Lang.German),
      (FlipClock.Lang["de-de"] = FlipClock.Lang.German),
      (FlipClock.Lang.german = FlipClock.Lang.German);
  })(jQuery),
  (function () {
    (FlipClock.Lang.English = {
      years: "Years",
      months: "Months",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    }),
      (FlipClock.Lang.en = FlipClock.Lang.English),
      (FlipClock.Lang["en-us"] = FlipClock.Lang.English),
      (FlipClock.Lang.english = FlipClock.Lang.English);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Spanish = {
      years: "Años",
      months: "Meses",
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    }),
      (FlipClock.Lang.es = FlipClock.Lang.Spanish),
      (FlipClock.Lang["es-es"] = FlipClock.Lang.Spanish),
      (FlipClock.Lang.spanish = FlipClock.Lang.Spanish);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Finnish = {
      years: "Vuotta",
      months: "Kuukautta",
      days: "Päivää",
      hours: "Tuntia",
      minutes: "Minuuttia",
      seconds: "Sekuntia",
    }),
      (FlipClock.Lang.fi = FlipClock.Lang.Finnish),
      (FlipClock.Lang["fi-fi"] = FlipClock.Lang.Finnish),
      (FlipClock.Lang.finnish = FlipClock.Lang.Finnish);
  })(jQuery),
  (function () {
    (FlipClock.Lang.French = {
      years: "Ans",
      months: "Mois",
      days: "Jours",
      hours: "Heures",
      minutes: "Minutes",
      seconds: "Secondes",
    }),
      (FlipClock.Lang.fr = FlipClock.Lang.French),
      (FlipClock.Lang["fr-ca"] = FlipClock.Lang.French),
      (FlipClock.Lang.french = FlipClock.Lang.French);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Italian = {
      years: "Anni",
      months: "Mesi",
      days: "Giorni",
      hours: "Ore",
      minutes: "Minuti",
      seconds: "Secondi",
    }),
      (FlipClock.Lang.it = FlipClock.Lang.Italian),
      (FlipClock.Lang["it-it"] = FlipClock.Lang.Italian),
      (FlipClock.Lang.italian = FlipClock.Lang.Italian);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Latvian = {
      years: "Gadi",
      months: "Mēneši",
      days: "Dienas",
      hours: "Stundas",
      minutes: "Minūtes",
      seconds: "Sekundes",
    }),
      (FlipClock.Lang.lv = FlipClock.Lang.Latvian),
      (FlipClock.Lang["lv-lv"] = FlipClock.Lang.Latvian),
      (FlipClock.Lang.latvian = FlipClock.Lang.Latvian);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Dutch = {
      years: "Jaren",
      months: "Maanden",
      days: "Dagen",
      hours: "Uren",
      minutes: "Minuten",
      seconds: "Seconden",
    }),
      (FlipClock.Lang.nl = FlipClock.Lang.Dutch),
      (FlipClock.Lang["nl-be"] = FlipClock.Lang.Dutch),
      (FlipClock.Lang.dutch = FlipClock.Lang.Dutch);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Norwegian = {
      years: "År",
      months: "Måneder",
      days: "Dager",
      hours: "Timer",
      minutes: "Minutter",
      seconds: "Sekunder",
    }),
      (FlipClock.Lang.no = FlipClock.Lang.Norwegian),
      (FlipClock.Lang.nb = FlipClock.Lang.Norwegian),
      (FlipClock.Lang["no-nb"] = FlipClock.Lang.Norwegian),
      (FlipClock.Lang.norwegian = FlipClock.Lang.Norwegian);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Portuguese = {
      years: "Anos",
      months: "Meses",
      days: "Dias",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    }),
      (FlipClock.Lang.pt = FlipClock.Lang.Portuguese),
      (FlipClock.Lang["pt-br"] = FlipClock.Lang.Portuguese),
      (FlipClock.Lang.portuguese = FlipClock.Lang.Portuguese);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Russian = {
      years: "лет",
      months: "месяцев",
      days: "дней",
      hours: "часов",
      minutes: "минут",
      seconds: "секунд",
    }),
      (FlipClock.Lang.ru = FlipClock.Lang.Russian),
      (FlipClock.Lang["ru-ru"] = FlipClock.Lang.Russian),
      (FlipClock.Lang.russian = FlipClock.Lang.Russian);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Swedish = {
      years: "År",
      months: "Månader",
      days: "Dagar",
      hours: "Timmar",
      minutes: "Minuter",
      seconds: "Sekunder",
    }),
      (FlipClock.Lang.sv = FlipClock.Lang.Swedish),
      (FlipClock.Lang["sv-se"] = FlipClock.Lang.Swedish),
      (FlipClock.Lang.swedish = FlipClock.Lang.Swedish);
  })(jQuery),
  (function () {
    (FlipClock.Lang.Chinese = {
      years: "年",
      months: "月",
      days: "日",
      hours: "时",
      minutes: "分",
      seconds: "秒",
    }),
      (FlipClock.Lang.zh = FlipClock.Lang.Chinese),
      (FlipClock.Lang["zh-cn"] = FlipClock.Lang.Chinese),
      (FlipClock.Lang.chinese = FlipClock.Lang.Chinese);
  })(jQuery);
