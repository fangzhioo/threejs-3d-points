// 获取粒子效果的js
const webglJsPath = "/js/webgl.js";
const defaultPopImg =
  "//game.gtimg.cn/images/up/act/a20170301pre/images/three/banner0.jpg";
const bgMp3 = "//game.gtimg.cn/images/up/act/a20170301pre/media/bg.mp3";

// 尺寸调整
function adjustSize() {
  $("html").css({ fontSize: ($(window).width() / 1920) * 100 });
}

// pop弹窗方法
function pop(e, t, n) {
  (isnowpop = !0), (e = e || defaultPopImg);
  var i = $("#pop");
  (isnowpop = !0),
    i.addClass("show"),
    n && i.addClass("tall"),
    $("img", i).attr("src", e),
    $("a", i).attr("href", t),
    $.fn.fullpage.setAllowScrolling(false);
}

// 初始化fullpage方法
function initFullpage() {
  console.log("initFullpage");
  $("#fullpage").fullpage({
    lazyLoading: !1,
    anchors: ["g", "a", "l", "f", "u"],
    menu: "#sidenav",
    afterRender: function () {
      setTimeout(function () {
        $(".fullpage").addClass("fullpage-inited");
      }, 1e3);
    },
    onLeave: function (e, t) {
      toggleParticle(t - 1);
    },
    afterLoad: function (e, t) {
      // 6 === t && setTimeout(function () {}, 1200);
    },
  });
  supportWebGL && $.fn.fullpage.setAllowScrolling(false);
}

// 兼容全屏方法
(function () {
  "use strict";
  var e = "undefined" != typeof module && module.exports,
    t = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
    n = (function () {
      for (
        var e,
          t = [
            [
              "requestFullscreen",
              "exitFullscreen",
              "fullscreenElement",
              "fullscreenEnabled",
              "fullscreenchange",
              "fullscreenerror",
            ],
            [
              "webkitRequestFullscreen",
              "webkitExitFullscreen",
              "webkitFullscreenElement",
              "webkitFullscreenEnabled",
              "webkitfullscreenchange",
              "webkitfullscreenerror",
            ],
            [
              "webkitRequestFullScreen",
              "webkitCancelFullScreen",
              "webkitCurrentFullScreenElement",
              "webkitCancelFullScreen",
              "webkitfullscreenchange",
              "webkitfullscreenerror",
            ],
            [
              "mozRequestFullScreen",
              "mozCancelFullScreen",
              "mozFullScreenElement",
              "mozFullScreenEnabled",
              "mozfullscreenchange",
              "mozfullscreenerror",
            ],
            [
              "msRequestFullscreen",
              "msExitFullscreen",
              "msFullscreenElement",
              "msFullscreenEnabled",
              "MSFullscreenChange",
              "MSFullscreenError",
            ],
          ],
          n = 0,
          i = t.length,
          o = {};
        i > n;
        n++
      )
        if (((e = t[n]), e && e[1] in document)) {
          for (n = 0; n < e.length; n++) o[t[0][n]] = e[n];
          return o;
        }
      return !1;
    })(),
    i = {
      request: function (e) {
        var i = n.requestFullscreen;
        (e = e || document.documentElement), e[i]();
      },
      exit: function () {
        document[n.exitFullscreen]();
      },
      toggle: function (e) {
        this.isFullscreen ? this.exit() : this.request(e);
      },
      onchange: function (e) {
        document.addEventListener(n.fullscreenchange, e, !1);
      },
      onerror: function (e) {
        document.addEventListener(n.fullscreenerror, e, !1);
      },
      raw: n,
    };
  return n
    ? (Object.defineProperties(i, {
        isFullscreen: {
          get: function () {
            return Boolean(document[n.fullscreenElement]);
          },
        },
        element: {
          enumerable: !0,
          get: function () {
            return document[n.fullscreenElement];
          },
        },
        enabled: {
          enumerable: !0,
          get: function () {
            return Boolean(document[n.fullscreenEnabled]);
          },
        },
      }),
      void (e ? (module.exports = i) : (window.screenfull = i)))
    : void (e ? (module.exports = !1) : (window.screenfull = !1));
})();

var jsBeginTime = new Date(),
  resloaded = 0,
  ismobile = false,
  isnowpop = false,
  introed = !1,
  stormed = !1,
  debug = false;

// ?
if ("undefined" != typeof NotifyMe) {
  NotifyMe.myAlert = function (e) {
    console.log(e);
  };
}

// touch event
var touchclick = "touchstart" in document ? "touchstart" : "click";

// 窗口监听
$(window).on("resize orientationchange", adjustSize);
adjustSize();

// 移动端判断
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  ismobile = true;
  $("body").addClass("mobile");
  $(".loadingwrapper").hide();
  setTimeout(function () {
    $(".loadingwrapper").show();
  }, 1e3);
}

$("#fullpage .dot").prepend("<b></b>");

$("#pop .pop-close").on("click", function () {
  (isnowpop = false),
    $("#pop").removeClass("show tall"),
    $.fn.fullpage.setAllowScrolling(true);
});
$("#pop").on("click", function () {
  setTimeout(function () {
    (isnowpop = !1),
      $("#pop").removeClass("show tall"),
      $.fn.fullpage.setAllowScrolling(true);
  }, 500);
});

$(".dot").on("click", function () {
  var e = $("#fullpage .active").index("#fullpage .section"),
    t = this.className.match(/dot-(\d)/)[1] || 99;
  var n = $(".popimg", this).data("src"),
    i = $(".popimg", this).data("href"),
    o = null !== n.match(/tall/gi);
  console.log(n, i, o, e + t);
  pop(n, i, o);
});

$(window).on("load", function () {});

// 加载
$("body").on("resloaded", function () {
  console.log("resloaded");
  var e = new Date() - jsBeginTime,
    t = e > 4500 ? 0 : 4500 - e;
  $("body").addClass("resloaded");
  if (ismobile) {
    setTimeout(
      function () {
        $(".loadingtxt i").hide();
        $(".btn-introbox").addClass("show");
        $("#loading").one(touchclick, function () {
          introBox();
          skipIntrobox();
          $("body").addClass("fadeloading");
          $("body").trigger("fadeloading");
          setTimeout(
            function () {
              $("body").addClass("hideloading");
            },
            debug ? 0 : 3000
          );
        });
      },
      debug ? 0 : t
    );
  } else {
    setTimeout(
      function () {
        $("body").trigger("fadeloading"), $("body").addClass("fadeloading");
      },
      debug ? 0 : t
    );
    setTimeout(
      function () {
        $(".loadingtxt i").hide(), $("body").addClass("hideloading");
      },
      debug ? 0 : t + 2000
    );
    setTimeout(
      function () {
        $(".skipintro").removeClass("hide");
      },
      debug ? 0 : t + 1000
    );
    setTimeout(
      function () {
        $(".skipintro").addClass("show");
      },
      debug ? 0 : t + 1100
    );
    introBox();
    skipIntrobox();
  }
});
// 重置路由 hash
location.hash = "";

$("body").on("fadeloading", function () {
  console.log("introed");
  $(this).addClass("introed"), initFullpage();
  introed = true;
  startStorm();
  setTimeout(function () {
    toggleParticle(0),
      setTimeout(function () {
        $.fn.fullpage.setAllowScrolling(true);
      }, 4e3);
  }, 1500);
});

// jquery 自定义加载事件
$("body").on("resloading", function () {
  $(".loadingtxt i").text(parseInt(100 * resloaded) + "%");
});

$("#pop").hover3d({ sensitivity: 100, selector: ".pop-in", shine: true });

// 添加背景音乐
if ("undefined" != typeof Audio) {
  var mySound = new Audio(bgMp3);
  mySound.loop = true;
  mySound.play();
  $(".btn-introbox").on("click", function () {
    mySound.play();
  }),
    $(".control .music")
      .addClass("show")
      .on("click", function () {
        mySound.paused
          ? (mySound.play(), $(this).removeClass("mute"))
          : (mySound.pause(), $(this).addClass("mute"));
      });
}

// 支持全屏 - 按钮展示
if (screenfull.enabled) {
  $(".control .fullsc")
    .addClass("show")
    .click(function () {
      screenfull.toggle(), $(this).toggleClass("enabled");
    });
}

// 浏览器支持webGL
if (supportWebGL) {
  $.getScript(webglJsPath, function () {}), $("body").addClass("webglyes");
} else {
  toggleParticle = function () {};
  $("body").addClass("webglno");
  $("body").addClass("introed");
  $("body").addClass("resloaded");
  $("body").addClass("hideloading");
  $(".chromeframe").addClass("show");
  initFullpage();
  introed = true;
  // ((toggleParticle = function () {}),
  // $("body").addClass("webglno"),
  // $("body").addClass("introed"),
  // $("body").addClass("resloaded"),
  // $("body").addClass("hideloading"),
  // $(".chromeframe").addClass("show"),
  // initFullpage(),
  // (introed = !0)),
  $(".skipintro").one(touchclick, function () {
    skipIntrobox(), $(this).removeClass("show"), $(this).addClass("hide");
  });
}

// 二维码的hover展示
$(".qrcode")
  .on("mouseenter", function () {
    toggleParticle(5), $("body").addClass("qring");
  })
  .on("mouseleave", function () {
    var e = $("#fullpage .active").index("#fullpage .section");
    (0 > e || e > 5) && (e = 0),
      toggleParticle(e),
      $("body").removeClass("qring");
  });
