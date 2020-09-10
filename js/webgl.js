const webglJsons = [
  "../json/cpgame3.json",
  "../json/cpac5.json",
  "../json/cpbook2.json",
  "../json/cpmovie4.json",
  "../json/cpkv3.json",
  "../json/qr.json",
];
const webglBanners = [
  "//game.gtimg.cn/images/up/act/a20170301pre/images/three/banner1.png",
  "//game.gtimg.cn/images/up/act/a20170301pre/images/three/banner2.png",
  "//game.gtimg.cn/images/up/act/a20170301pre/images/three/banner3.png",
  "//game.gtimg.cn/images/up/act/a20170301pre/images/three/banner4.png",
];
const gradientPng = "../img/gradient.png";

(function () {
  // init
  function initWebGL() {
    // 创建渲染器
    createRenderer();
    // 创建场景
    createScene();
    // 创建相机
    createCamera();
    // 创建效果合成器
    createEffectComposer();
    // 创建加载器
    createJSONLoader();
  }
  function animate() {
    // 渲染场景
    requestAnimationFrame(animate),
      TWEEN.update(),
      Z && (g_points_1.geometry.verticesNeedUpdate = true),
      b(),
      m(),
      g(),
      c(),
      g_composer.render();
  }
  function createRenderer() {
    (g_renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })),
      g_renderer.setSize(g_width, g_height),
      (g_renderer.sortObjects = false),
      (g_renderer.autoClear = false),
      (g_renderer.domElement.id = "mainanim"),
      document.body.appendChild(g_renderer.domElement),
      window.addEventListener("resize", d),
      window.addEventListener("orientationchange", d);
  }
  function createCamera() {
    (g_camera = new THREE.PerspectiveCamera(
      ismobile ? 100 : 75,
      g_width / g_height,
      1,
      5e4
    )),
      g_camera.position.set(0, 0, 1e3),
      g_camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  function createScene() {
    (g_scene = new THREE.Scene()),
      debug ||
        ((g_scene.fog = new THREE.FogExp2(328972, 5e-4)),
        g_renderer.setClearColor(g_scene.fog.color));
  }
  function createJSONLoader() {
    if (!ismobile) var e = new THREE.TessellateModifier(0.01);
    var t = 0,
      i = [...webglJsons],
      n = [700, 700, 1e3, 1200, 1500, 500],
      r = [
        [72, 30, 60],
        [0, -30, 0],
        [0, 0, 0],
        [90, 180, 0],
        [10, 0, 0],
        [0, 0, 0],
      ],
      o = [
        [-400, 100, 0],
        [400, 0, 0],
        [-500, 150, 0],
        [0, 0, 0],
        [0, -500, 0],
        [0, 0, 0],
      ];
    ismobile &&
      ((n = [700, 700, 1e3, 1200, 2e3, 500]),
      (r = [
        [72, 30, 60],
        [0, -30, 0],
        [10, 0, 0],
        [90, 180, 0],
        [-10, 0, 0],
        [0, 0, 0],
      ]),
      (o = [
        [-250, 200, 0],
        [400, 50, 0],
        [-100, 250, 0],
        [0, 200, 0],
        [0, -800, 0],
        [0, 0, 0],
      ])),
      i.forEach(function (s, c) {
        new THREE.JSONLoader().load(s, function (h) {
          $("body").trigger("resloading");
          resloaded += 0.1; // 这里是进度加载的进度累加
          s.match(/.*\/(.*?\.json)$/)[1];
          c !== i.length - 2 || ismobile || e.modify(h),
            ismobile && h.vertices.length > 4e3,
            h.center(),
            h.normalize(),
            h.rotateX((3.14 * r[c][0]) / 180),
            h.rotateY((3.14 * r[c][1]) / 180),
            h.rotateZ((3.14 * r[c][2]) / 180),
            h.scale(n[c], n[c], n[c]),
            h.translate(o[c][0], o[c][1], o[c][2]);
          var l = [];
          h.vertices.forEach(function () {
            l.push(new THREE.Color("hsl(160, 100%, 100%)"));
          });
          for (var u = 0; u < h.faces.length; u++) {
            var p = h.faces[u];
            (l[p.a] =
              p.vertexColors[0] ||
              new THREE.Color(
                "hsl(" + (160 + 0 * Math.random()) + ", 100%, 100%)"
              )),
              (l[p.b] =
                p.vertexColors[1] ||
                new THREE.Color(
                  "hsl(" + (160 + 0 * Math.random()) + ", 100%, 100%)"
                )),
              (l[p.c] =
                p.vertexColors[2] ||
                new THREE.Color(
                  "hsl(" + (160 + 0 * Math.random()) + ", 100%, 100%)"
                ));
          }
          (h.colors = l), (j[c] = h), t++, t === i.length && a();
        });
      });
  }

  function a() {
    var e = new THREE.Geometry(),
      t = 1e3,
      i = Math.max.apply(
        null,
        j.map(function (e) {
          return e.vertices.length;
        })
      );
    e.colors = [];
    for (var n = 0; i > n; n++)
      e.vertices.push(
        1e6 > n
          ? new THREE.Vector3(
              getRangeRandom(-1 * t, t),
              getRangeRandom(-1 * t, t),
              getRangeRandom(-12 * t, 1 * t)
            )
          : new THREE.Vector3(0, 0, 0)
      ),
        e.colors.push(
          new THREE.Color("hsl(" + (180 + 10 * Math.random()) + ", 100%, 100%)")
        );
    var r = new THREE.TextureLoader();
    r.crossOrigin = "";
    r.load(gradientPng, function (i) {
      var n = new THREE.PointsMaterial({
        size: 5,
        map: i,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: THREE.VertexColors,
      });
      g_points_1 = new THREE.Points(e, n);
      g_points_1.position.z = -1 * t;
      h();
    });
  }
  function s() {
    var e = new THREE.Geometry(),
      t = 1500,
      i = 500;
    e.colors = [];
    for (var n = 0; i > n; n++)
      e.vertices.push(
        new THREE.Vector3(
          getRangeRandom(-1 * t, t),
          getRangeRandom(-1 * t, t),
          getRangeRandom(-1 * t, t)
        )
      ),
        e.colors.push(
          new THREE.Color("hsl(" + (190 + 30 * Math.random()) + ", 0%, 100%)")
        );
    var r = new THREE.TextureLoader();
    (r.crossOrigin = ""),
      r.load(gradientPng, function (i) {
        var n = new THREE.PointsMaterial({
          size: 7,
          map: i,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          vertexColors: THREE.VertexColors,
        });
        (g_points_2 = new THREE.Points(e, n)),
          (g_points_2.position.z = -1 * t),
          (g_points_2.position.x = -0.1 * t),
          (g_points_3 = new THREE.Points(e, n)),
          (g_points_3.position.z = -1.1 * t),
          (g_points_3.position.y = -0.2 * t),
          (g_points_4 = new THREE.Points(e, n)),
          (g_points_4.position.z = -1.2 * t),
          g_scene.add(g_points_2),
          g_scene.add(g_points_3),
          g_scene.add(g_points_4);
      });
  }
  function c() {
    g_points_2 &&
      introed &&
      ((g_points_2.rotation.x -= g_options.firefly / 1.5),
      (g_points_3.rotation.y += g_options.firefly),
      (g_points_4.rotation.z += g_options.firefly / 2));
  }

  function h() {
    // ???
    g_object3D = new THREE.Object3D();
    g_object3D.add(g_points_1);
    var e = [...webglBanners],
      t = 3e3,
      i = -1e3,
      n = new THREE.PlaneBufferGeometry(1024, 512),
      r = 0;
    for (var o = 0; o < e.length; o++)
      !(function (o) {
        var a = new THREE.TextureLoader();
        a.crossOrigin = "";
        a.load(e[o], function (a) {
          $("body").trigger("resloading"), (resloaded += 0.1);
          var s = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            color: 16777215,
            map: a,
            transparent: true,
          });
          s.map = a;
          var c = new THREE.Mesh(n, s);
          c.position.z = i - t * o;
          g_object3D.add(c);
          r++;
          if (r === e.length) {
            g_object3D.position.z = -2e3;
            g_scene.add(g_object3D);
            $("body").trigger("resloaded");
          }
        });
      })(o);
  }

  function introBox() {
    for (
      var e,
        i = debug ? 2e3 : 25e3,
        n = 5,
        r = 1e3,
        o = 3e3,
        a = new TWEEN.Tween(g_points_1.position)
          .to({ z: 0.1 }, i)
          .easing(TWEEN.Easing.Linear.None)
          .delay(1e3)
          .onUpdate(function () {})
          .onStart(function () {})
          .onComplete(function () {}),
        s = [],
        c = 0;
      n > c;
      c++
    )
      (e = new TWEEN.Tween(g_object3D.position)
        .to({ z: r + o * c }, i / n)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(function () {})
        .onStart(function () {})
        .onComplete(function () {})),
        s.push(e);
    for (var c = 0; c < s.length - 1; c++) s[c].chain(s[c + 1]);
    s[0].start(),
      a.start(),
      setTimeout(function () {
        introed || (v(), $("body").trigger("introed"));
      }, i - 1e3),
      animate();
  }
  function createEffectComposer() {
    // 效果合成器 https://threejs.org/docs/#manual/zh/introduction/How-to-use-post-processing
    var renderPass = new THREE.RenderPass(g_scene, g_camera),
      bloomPass = new THREE.BloomPass(0.75),
      filmPass = new THREE.FilmPass(0.5, 0.5, 1500, false);
    // 着色器 效果-发光发亮！
    g_shader = new THREE.ShaderPass(THREE.FocusShader);
    g_shader.uniforms.screenWidth.value = window.innerWidth;
    g_shader.uniforms.screenHeight.value = window.innerHeight;
    g_shader.renderToScreen = true;
    g_composer = new THREE.EffectComposer(g_renderer);
    g_composer.addPass(renderPass);
    g_composer.addPass(bloomPass);
    g_composer.addPass(filmPass);
    g_composer.addPass(g_shader);
  }
  function p(e) {
    isnowpop ||
      X ||
      ((V = 3e-4 * (e.clientX - g_half_width)),
      (k = 1e-4 * (e.clientY - g_half_height)));
  }
  function d() {
    (g_camera.aspect = window.innerWidth / window.innerHeight),
      g_camera.updateProjectionMatrix(),
      g_renderer.setSize(window.innerWidth, window.innerHeight),
      g_composer.reset(),
      (g_shader.uniforms.screenWidth.value = window.innerWidth),
      (g_shader.uniforms.screenHeight.value = window.innerHeight);
  }
  function skipIntrobox() {
    TWEEN.removeAll(),
      (g_points_1.position.z = 0.1),
      v(),
      $("body").trigger("introed");
  }
  function m() {
    g_points_1 &&
      introed &&
      stormed &&
      !X &&
      ((G += g_options.qrcode), (g_points_1.rotation.y = 0.2 * Math.sin(G)));
  }
  function g() {
    X && ((V = 0), (k = 0)),
      (g_scene.rotation.y += (V - g_scene.rotation.y) / 50),
      (g_scene.rotation.x += (k - g_scene.rotation.x) / 50);
  }
  function v() {
    var e = 1e3;
    g_scene.remove(g_object3D),
      g_points_1.geometry.vertices.forEach(function (t) {
        (t.x = getRangeRandom(-1 * e, 1 * e)),
          (t.y = getRangeRandom(-1 * e, 1 * e)),
          (t.z = getRangeRandom(-1 * e, 1 * e));
      }),
      (g_points_1.geometry.verticesNeedUpdate = true),
      g_scene.add(g_points_1),
      document.body.addEventListener("mousemove", p),
      s();
  }
  function startStorm() {
    (g_points_1.rotation.y = 3.14 * -0.4),
      new TWEEN.Tween(g_points_1.rotation)
        .easing(TWEEN.Easing.Quintic.Out)
        .to({ y: 0 }, 1e4)
        .onUpdate(function () {})
        .onComplete(function () {
          stormed = true;
        })
        .start();
  }
  function toggleParticle(e) {
    (q = "undefined" == typeof e ? ++q % j.length : e % j.length),
      (X = e === j.length - 2);
    Z = true;
    clearTimeout(g_timer);
    g_timer = setTimeout(function () {
      Z = false;
    }, Y * (J + 2));
    var t = j[q];
    g_points_1.material.tween ||
      (g_points_1.material.tween = new TWEEN.Tween(g_points_1.material).easing(
        TWEEN.Easing.Exponential.In
      )),
      g_points_1.material.tween.stop(),
      ismobile ||
        (q === j.length - 1
          ? ((g_options.qrcode = g_options.qrcodeFAST),
            clearTimeout(g_timer2),
            (g_points_1.material.map = null),
            (g_points_1.material.needsUpdate = true),
            20 !== g_points_1.material.size &&
              g_points_1.material.tween.to({ size: 20 }, Y * (J + 1)).start())
          : ((g_options.qrcode = g_options.qrcodeSLOW),
            (g_timer2 = setTimeout(function () {
              var e = new THREE.TextureLoader();
              (e.crossOrigin = ""),
                e.load(gradientPng, function (e) {
                  (g_points_1.material.map = e),
                    (g_points_1.material.needsUpdate = true);
                });
            }, Y * (J + 1))),
            5 !== g_points_1.material.size &&
              g_points_1.material.tween.to({ size: 5 }, Y * (J + 1)).start())),
      g_points_1.geometry.vertices.forEach(function (e, i) {
        var n = g_points_1.geometry.colors[i],
          r = i % t.vertices.length,
          o = t.vertices[r],
          a =
            t.colors[r] ||
            new THREE.Color(
              "hsl(" + (160 + 3 * Math.random()) + ", 100%, 100%)"
            ),
          s = [n.r, n.g, n.b],
          c = [a.r - s[0], a.g - s[1], a.b - s[2]];
        e.tweenvtx ||
          ((e.tweenvtx = new TWEEN.Tween(e)
            .easing(TWEEN.Easing.Exponential.In)
            .onUpdate(function (e) {
              (n.r = s[0] + c[0] * e),
                (n.g = s[1] + c[1] * e),
                (n.b = s[2] + c[2] * e);
            })
            .onStart(function () {})
            .onComplete(function () {
              e.tweenvtx.isplaying = false;
            })),
          (e.tweenvtx.isplaying = false)),
          e.tweenvtx.stop(),
          (e.tweenvtx.isplaying = true),
          e.tweenvtx
            .to({ x: o.x, y: o.y, z: o.z }, Y)
            .delay(J * Y * Math.random())
            .start();
      });
    if (!g_tweener_1) {
      g_tweener_1 = new TWEEN.Tween(g_options).easing(
        TWEEN.Easing.Exponential.In
      );
      g_tweener_2 = new TWEEN.Tween(g_options).easing(
        TWEEN.Easing.Exponential.In
      );
    }
    g_tweener_1.stop();
    g_tweener_2.stop();
    g_tweener_1
      .to({ firefly: g_options.fireflyFAST }, 0.5 * Y * (J + 1))
      .chain(g_tweener_2);
    g_tweener_2.to({ firefly: g_options.fireflySLOW }, 0.5 * Y * (J + 1));
    g_tweener_1.start();
    Y = 1e3;
    J = 0.5;
  }
  function b() {
    if (q % j.length === j.length - 2) {
      var e = j[q % j.length],
        t = { x: 0, y: -150, z: 0 };
      g_points_1.geometry.vertices.forEach(function (i, n) {
        if (!i.tweenvtx.isplaying) {
          var r = n % e.vertices.length,
            o = e.vertices[r],
            a = Math.sqrt(Math.pow(i.x - t.x, 2) + Math.pow(i.z - t.z, 2));
          i.y = o.y + (Math.sin(a / 70 + Q) * a) / 30;
        }
      }),
        (g_points_1.geometry.verticesNeedUpdate = true),
        (Q -= 0.015);
    }
  }
  function getRangeRandom(e, t) {
    return Math.random() * (t - e) + e;
  }
  // main
  var g_scene,
    g_camera,
    g_renderer,
    g_composer,
    g_points_1,
    g_points_2,
    g_points_3,
    g_points_4,
    g_shader,
    g_object3D,
    g_timer,
    g_timer2,
    g_tweener_1,
    g_tweener_2,
    g_width = window.innerWidth,
    g_height = window.innerHeight,
    g_half_width = window.innerWidth / 2,
    g_half_height = window.innerHeight / 2,
    G = 0,
    V = 0,
    k = 0,
    j = [],
    g_options = {
      firefly: 0.002,
      fireflySLOW: 0.002,
      fireflyFAST: 0.04,
      qrcode: 0.001,
      qrcodeFAST: 0.01,
      qrcodeSLOW: 0.001,
    },
    X = false,
    q = -1,
    Y = 1500,
    Z = false,
    J = 1.7,
    Q = 0;
  initWebGL();
  window.toggleParticle = toggleParticle;
  window.introBox = introBox;
  window.skipIntrobox = skipIntrobox;
  window.startStorm = startStorm;
})();
