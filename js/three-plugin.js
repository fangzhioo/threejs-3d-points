/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Convolution shader
 * ported from o3d sample to WebGL / GLSL
 * http://o3d.googlecode.com/svn/trunk/samples/convolution.html
 */ (THREE.ConvolutionShader = {
  defines: { KERNEL_SIZE_FLOAT: "25.0", KERNEL_SIZE_INT: "25" },
  uniforms: {
    tDiffuse: { value: null },
    uImageIncrement: { value: new THREE.Vector2(0.001953125, 0) },
    cKernel: { value: [] },
  },
  vertexShader: [
    "uniform vec2 uImageIncrement;",
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}",
  ].join("\n"),
  fragmentShader: [
    "uniform float cKernel[ KERNEL_SIZE_INT ];",
    "uniform sampler2D tDiffuse;",
    "uniform vec2 uImageIncrement;",
    "varying vec2 vUv;",
    "void main() {",
    "vec2 imageCoord = vUv;",
    "vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",
    "for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {",
    "sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];",
    "imageCoord += uImageIncrement;",
    "}",
    "gl_FragColor = sum;",
    "}",
  ].join("\n"),
  buildKernel: function (e) {
    function t(e, t) {
      return Math.exp(-(e * e) / (2 * t * t));
    }
    var i,
      n,
      r,
      o,
      a = 25,
      s = 2 * Math.ceil(3 * e) + 1;
    for (
      s > a && (s = a), o = 0.5 * (s - 1), n = new Array(s), r = 0, i = 0;
      s > i;
      ++i
    )
      (n[i] = t(i - o, e)), (r += n[i]);
    for (i = 0; s > i; ++i) n[i] /= r;
    return n;
  },
}),
  /**
   * @author alteredq / http://alteredqualia.com/
   *
   * Full-screen textured quad shader
   */ (THREE.CopyShader = {
    uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}",
    ].join("\n"),
    fragmentShader: [
      "uniform float opacity;",
      "uniform sampler2D tDiffuse;",
      "varying vec2 vUv;",
      "void main() {",
      "vec4 texel = texture2D( tDiffuse, vUv );",
      "gl_FragColor = opacity * texel;",
      "}",
    ].join("\n"),
  }),
  /**
   * @author alteredq / http://alteredqualia.com/
   *
   * Film grain & scanlines shader
   *
   * - ported from HLSL to WebGL / GLSL
   * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
   *
   * Screen Space Static Postprocessor
   *
   * Produces an analogue noise overlay similar to a film grain / TV static
   *
   * Original implementation and noise algorithm
   * Pat 'Hawthorne' Shearon
   *
   * Optimized scanlines + noise version with intensity scaling
   * Georg 'Leviathan' Steinrohder
   *
   * This version is provided under a Creative Commons Attribution 3.0 License
   * http://creativecommons.org/licenses/by/3.0/
   */ (THREE.FilmShader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      nIntensity: { value: 0.5 },
      sIntensity: { value: 0.05 },
      sCount: { value: 4096 },
      grayscale: { value: 1 },
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}",
    ].join("\n"),
    fragmentShader: [
      "#include <common>",
      "uniform float time;",
      "uniform bool grayscale;",
      "uniform float nIntensity;",
      "uniform float sIntensity;",
      "uniform float sCount;",
      "uniform sampler2D tDiffuse;",
      "varying vec2 vUv;",
      "void main() {",
      "vec4 cTextureScreen = texture2D( tDiffuse, vUv );",
      "float dx = rand( vUv + time );",
      "vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );",
      "vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",
      "cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",
      "cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",
      "if( grayscale ) {",
      "cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",
      "}",
      "gl_FragColor =  vec4( cResult, cTextureScreen.a );",
      "}",
    ].join("\n"),
  }),
  /**
   * @author alteredq / http://alteredqualia.com/
   *
   * Focus shader
   * based on PaintEffect postprocess from ro.me
   * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
   */ (THREE.FocusShader = {
    uniforms: {
      tDiffuse: { value: null },
      screenWidth: { value: 1024 },
      screenHeight: { value: 1024 },
      sampleDistance: { value: 0.794 },
      waveFactor: { value: 0.00125 },
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}",
    ].join("\n"),
    fragmentShader: [
      "uniform float screenWidth;",
      "uniform float screenHeight;",
      "uniform float sampleDistance;",
      "uniform float waveFactor;",
      "uniform sampler2D tDiffuse;",
      "varying vec2 vUv;",
      "void main() {",
      "vec4 color, org, tmp, add;",
      "float sample_dist, f;",
      "vec2 vin;",
      "vec2 uv = vUv;",
      "add = color = org = texture2D( tDiffuse, uv );",
      "vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );",
      "sample_dist = dot( vin, vin ) * 2.0;",
      "f = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;",
      "vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );",
      "add += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "add += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );",
      "if( tmp.b < color.b ) color = tmp;",
      "color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );",
      "color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );",
      "gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );",
      "}",
    ].join("\n"),
  }),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.EffectComposer = function (e, t) {
    if (((this.renderer = e), void 0 === t)) {
      var i = {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          stencilBuffer: !1,
        },
        n = e.getSize();
      t = new THREE.WebGLRenderTarget(n.width, n.height, i);
    }
    (this.renderTarget1 = t),
      (this.renderTarget2 = t.clone()),
      (this.writeBuffer = this.renderTarget1),
      (this.readBuffer = this.renderTarget2),
      (this.passes = []),
      void 0 === THREE.CopyShader &&
        console.error("THREE.EffectComposer relies on THREE.CopyShader"),
      (this.copyPass = new THREE.ShaderPass(THREE.CopyShader));
  }),
  Object.assign(THREE.EffectComposer.prototype, {
    swapBuffers: function () {
      var e = this.readBuffer;
      (this.readBuffer = this.writeBuffer), (this.writeBuffer = e);
    },
    addPass: function (e) {
      this.passes.push(e);
      var t = this.renderer.getSize();
      e.setSize(t.width, t.height);
    },
    insertPass: function (e, t) {
      this.passes.splice(t, 0, e);
    },
    render: function (e) {
      var t,
        i,
        n = !1,
        r = this.passes.length;
      for (i = 0; r > i; i++)
        if (((t = this.passes[i]), t.enabled !== !1)) {
          if (
            (t.render(this.renderer, this.writeBuffer, this.readBuffer, e, n),
            t.needsSwap)
          ) {
            if (n) {
              var o = this.renderer.context;
              o.stencilFunc(o.NOTEQUAL, 1, 4294967295),
                this.copyPass.render(
                  this.renderer,
                  this.writeBuffer,
                  this.readBuffer,
                  e
                ),
                o.stencilFunc(o.EQUAL, 1, 4294967295);
            }
            this.swapBuffers();
          }
          void 0 !== THREE.MaskPass &&
            (t instanceof THREE.MaskPass
              ? (n = !0)
              : t instanceof THREE.ClearMaskPass && (n = !1));
        }
    },
    reset: function (e) {
      if (void 0 === e) {
        var t = this.renderer.getSize();
        (e = this.renderTarget1.clone()), e.setSize(t.width, t.height);
      }
      this.renderTarget1.dispose(),
        this.renderTarget2.dispose(),
        (this.renderTarget1 = e),
        (this.renderTarget2 = e.clone()),
        (this.writeBuffer = this.renderTarget1),
        (this.readBuffer = this.renderTarget2);
    },
    setSize: function (e, t) {
      this.renderTarget1.setSize(e, t), this.renderTarget2.setSize(e, t);
      for (var i = 0; i < this.passes.length; i++) this.passes[i].setSize(e, t);
    },
  }),
  (THREE.Pass = function () {
    (this.enabled = !0),
      (this.needsSwap = !0),
      (this.clear = !1),
      (this.renderToScreen = !1);
  }),
  Object.assign(THREE.Pass.prototype, {
    setSize: function () {},
    render: function () {
      console.error(
        "THREE.Pass: .render() must be implemented in derived pass."
      );
    },
  }),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.MaskPass = function (e, t) {
    THREE.Pass.call(this),
      (this.scene = e),
      (this.camera = t),
      (this.clear = !0),
      (this.needsSwap = !1),
      (this.inverse = !1);
  }),
  (THREE.MaskPass.prototype = Object.assign(
    Object.create(THREE.Pass.prototype),
    {
      constructor: THREE.MaskPass,
      render: function (e, t, i) {
        var n = e.context,
          r = e.state;
        r.buffers.color.setMask(!1),
          r.buffers.depth.setMask(!1),
          r.buffers.color.setLocked(!0),
          r.buffers.depth.setLocked(!0);
        var o, a;
        this.inverse ? ((o = 0), (a = 1)) : ((o = 1), (a = 0)),
          r.buffers.stencil.setTest(!0),
          r.buffers.stencil.setOp(n.REPLACE, n.REPLACE, n.REPLACE),
          r.buffers.stencil.setFunc(n.ALWAYS, o, 4294967295),
          r.buffers.stencil.setClear(a),
          e.render(this.scene, this.camera, i, this.clear),
          e.render(this.scene, this.camera, t, this.clear),
          r.buffers.color.setLocked(!1),
          r.buffers.depth.setLocked(!1),
          r.buffers.stencil.setFunc(n.EQUAL, 1, 4294967295),
          r.buffers.stencil.setOp(n.KEEP, n.KEEP, n.KEEP);
      },
    }
  )),
  (THREE.ClearMaskPass = function () {
    THREE.Pass.call(this), (this.needsSwap = !1);
  }),
  (THREE.ClearMaskPass.prototype = Object.create(THREE.Pass.prototype)),
  Object.assign(THREE.ClearMaskPass.prototype, {
    render: function (e) {
      e.state.buffers.stencil.setTest(!1);
    },
  }),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.RenderPass = function (e, t, i, n, r) {
    THREE.Pass.call(this),
      (this.scene = e),
      (this.camera = t),
      (this.overrideMaterial = i),
      (this.clearColor = n),
      (this.clearAlpha = void 0 !== r ? r : 0),
      (this.clear = !0),
      (this.clearDepth = !1),
      (this.needsSwap = !1);
  }),
  (THREE.RenderPass.prototype = Object.assign(
    Object.create(THREE.Pass.prototype),
    {
      constructor: THREE.RenderPass,
      render: function (e, t, i) {
        var n = e.autoClear;
        (e.autoClear = !1),
          (this.scene.overrideMaterial = this.overrideMaterial);
        var r, o;
        this.clearColor &&
          ((r = e.getClearColor().getHex()),
          (o = e.getClearAlpha()),
          e.setClearColor(this.clearColor, this.clearAlpha)),
          this.clearDepth && e.clearDepth(),
          e.render(
            this.scene,
            this.camera,
            this.renderToScreen ? null : i,
            this.clear
          ),
          this.clearColor && e.setClearColor(r, o),
          (this.scene.overrideMaterial = null),
          (e.autoClear = n);
      },
    }
  )),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.BloomPass = function (e, t, i, n) {
    THREE.Pass.call(this),
      (e = void 0 !== e ? e : 1),
      (t = void 0 !== t ? t : 25),
      (i = void 0 !== i ? i : 4),
      (n = void 0 !== n ? n : 256);
    var r = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    (this.renderTargetX = new THREE.WebGLRenderTarget(n, n, r)),
      (this.renderTargetY = new THREE.WebGLRenderTarget(n, n, r)),
      void 0 === THREE.CopyShader &&
        console.error("THREE.BloomPass relies on THREE.CopyShader");
    var o = THREE.CopyShader;
    (this.copyUniforms = THREE.UniformsUtils.clone(o.uniforms)),
      (this.copyUniforms.opacity.value = e),
      (this.materialCopy = new THREE.ShaderMaterial({
        uniforms: this.copyUniforms,
        vertexShader: o.vertexShader,
        fragmentShader: o.fragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: !0,
      })),
      void 0 === THREE.ConvolutionShader &&
        console.error("THREE.BloomPass relies on THREE.ConvolutionShader");
    var a = THREE.ConvolutionShader;
    (this.convolutionUniforms = THREE.UniformsUtils.clone(a.uniforms)),
      (this.convolutionUniforms.uImageIncrement.value = THREE.BloomPass.blurX),
      (this.convolutionUniforms.cKernel.value = THREE.ConvolutionShader.buildKernel(
        i
      )),
      (this.materialConvolution = new THREE.ShaderMaterial({
        uniforms: this.convolutionUniforms,
        vertexShader: a.vertexShader,
        fragmentShader: a.fragmentShader,
        defines: {
          KERNEL_SIZE_FLOAT: t.toFixed(1),
          KERNEL_SIZE_INT: t.toFixed(0),
        },
      })),
      (this.needsSwap = !1),
      (this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.scene = new THREE.Scene()),
      (this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null)),
      (this.quad.frustumCulled = !1),
      this.scene.add(this.quad);
  }),
  (THREE.BloomPass.prototype = Object.assign(
    Object.create(THREE.Pass.prototype),
    {
      constructor: THREE.BloomPass,
      render: function (e, t, i, n, r) {
        r && e.context.disable(e.context.STENCIL_TEST),
          (this.quad.material = this.materialConvolution),
          (this.convolutionUniforms.tDiffuse.value = i.texture),
          (this.convolutionUniforms.uImageIncrement.value =
            THREE.BloomPass.blurX),
          e.render(this.scene, this.camera, this.renderTargetX, !0),
          (this.convolutionUniforms.tDiffuse.value = this.renderTargetX.texture),
          (this.convolutionUniforms.uImageIncrement.value =
            THREE.BloomPass.blurY),
          e.render(this.scene, this.camera, this.renderTargetY, !0),
          (this.quad.material = this.materialCopy),
          (this.copyUniforms.tDiffuse.value = this.renderTargetY.texture),
          r && e.context.enable(e.context.STENCIL_TEST),
          e.render(this.scene, this.camera, i, this.clear);
      },
    }
  )),
  (THREE.BloomPass.blurX = new THREE.Vector2(0.001953125, 0)),
  (THREE.BloomPass.blurY = new THREE.Vector2(0, 0.001953125)),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.ShaderPass = function (e, t) {
    THREE.Pass.call(this),
      (this.textureID = void 0 !== t ? t : "tDiffuse"),
      e instanceof THREE.ShaderMaterial
        ? ((this.uniforms = e.uniforms), (this.material = e))
        : e &&
          ((this.uniforms = THREE.UniformsUtils.clone(e.uniforms)),
          (this.material = new THREE.ShaderMaterial({
            defines: e.defines || {},
            uniforms: this.uniforms,
            vertexShader: e.vertexShader,
            fragmentShader: e.fragmentShader,
          }))),
      (this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.scene = new THREE.Scene()),
      (this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null)),
      (this.quad.frustumCulled = !1),
      this.scene.add(this.quad);
  }),
  (THREE.ShaderPass.prototype = Object.assign(
    Object.create(THREE.Pass.prototype),
    {
      constructor: THREE.ShaderPass,
      render: function (e, t, i) {
        this.uniforms[this.textureID] &&
          (this.uniforms[this.textureID].value = i.texture),
          (this.quad.material = this.material),
          this.renderToScreen
            ? e.render(this.scene, this.camera)
            : e.render(this.scene, this.camera, t, this.clear);
      },
    }
  )),
  /**
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.FilmPass = function (e, t, i, n) {
    THREE.Pass.call(this),
      void 0 === THREE.FilmShader &&
        console.error("THREE.FilmPass relies on THREE.FilmShader");
    var r = THREE.FilmShader;
    (this.uniforms = THREE.UniformsUtils.clone(r.uniforms)),
      (this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: r.vertexShader,
        fragmentShader: r.fragmentShader,
      })),
      void 0 !== n && (this.uniforms.grayscale.value = n),
      void 0 !== e && (this.uniforms.nIntensity.value = e),
      void 0 !== t && (this.uniforms.sIntensity.value = t),
      void 0 !== i && (this.uniforms.sCount.value = i),
      (this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.scene = new THREE.Scene()),
      (this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null)),
      (this.quad.frustumCulled = !1),
      this.scene.add(this.quad);
  }),
  (THREE.FilmPass.prototype = Object.assign(
    Object.create(THREE.Pass.prototype),
    {
      constructor: THREE.FilmPass,
      render: function (e, t, i, n) {
        (this.uniforms.tDiffuse.value = i.texture),
          (this.uniforms.time.value += n),
          (this.quad.material = this.material),
          this.renderToScreen
            ? e.render(this.scene, this.camera)
            : e.render(this.scene, this.camera, t, this.clear);
      },
    }
  )),
  /**
   * Break faces with edges longer than maxEdgeLength
   * - not recursive
   *
   * @author alteredq / http://alteredqualia.com/
   */ (THREE.TessellateModifier = function (e) {
    this.maxEdgeLength = e;
  }),
  (THREE.TessellateModifier.prototype.modify = function (e) {
    for (
      var t,
        i = [],
        n = [],
        r = this.maxEdgeLength * this.maxEdgeLength,
        o = 0,
        a = e.faceVertexUvs.length;
      a > o;
      o++
    )
      n[o] = [];
    for (var o = 0, a = e.faces.length; a > o; o++) {
      var s = e.faces[o];
      if (s instanceof THREE.Face3) {
        var c = s.a,
          h = s.b,
          l = s.c,
          u = e.vertices[c],
          p = e.vertices[h],
          d = e.vertices[l],
          f = u.distanceToSquared(p),
          m = p.distanceToSquared(d),
          g = u.distanceToSquared(d);
        if (f > r || m > r || g > r) {
          var v = e.vertices.length,
            y = s.clone(),
            x = s.clone();
          if (f >= m && f >= g) {
            var b = u.clone();
            if (
              (b.lerp(p, 0.5),
              (y.a = c),
              (y.b = v),
              (y.c = l),
              (x.a = v),
              (x.b = h),
              (x.c = l),
              3 === s.vertexNormals.length)
            ) {
              var _ = s.vertexNormals[0].clone();
              _.lerp(s.vertexNormals[1], 0.5),
                y.vertexNormals[1].copy(_),
                x.vertexNormals[0].copy(_);
            }
            if (3 === s.vertexColors.length) {
              var w = s.vertexColors[0].clone();
              w.lerp(s.vertexColors[1], 0.5),
                y.vertexColors[1].copy(w),
                x.vertexColors[0].copy(w);
            }
            t = 0;
          } else if (m >= f && m >= g) {
            var b = p.clone();
            if (
              (b.lerp(d, 0.5),
              (y.a = c),
              (y.b = h),
              (y.c = v),
              (x.a = v),
              (x.b = l),
              (x.c = c),
              3 === s.vertexNormals.length)
            ) {
              var _ = s.vertexNormals[1].clone();
              _.lerp(s.vertexNormals[2], 0.5),
                y.vertexNormals[2].copy(_),
                x.vertexNormals[0].copy(_),
                x.vertexNormals[1].copy(s.vertexNormals[2]),
                x.vertexNormals[2].copy(s.vertexNormals[0]);
            }
            if (3 === s.vertexColors.length) {
              var w = s.vertexColors[1].clone();
              w.lerp(s.vertexColors[2], 0.5),
                y.vertexColors[2].copy(w),
                x.vertexColors[0].copy(w),
                x.vertexColors[1].copy(s.vertexColors[2]),
                x.vertexColors[2].copy(s.vertexColors[0]);
            }
            t = 1;
          } else {
            var b = u.clone();
            if (
              (b.lerp(d, 0.5),
              (y.a = c),
              (y.b = h),
              (y.c = v),
              (x.a = v),
              (x.b = h),
              (x.c = l),
              3 === s.vertexNormals.length)
            ) {
              var _ = s.vertexNormals[0].clone();
              _.lerp(s.vertexNormals[2], 0.5),
                y.vertexNormals[2].copy(_),
                x.vertexNormals[0].copy(_);
            }
            if (3 === s.vertexColors.length) {
              var w = s.vertexColors[0].clone();
              w.lerp(s.vertexColors[2], 0.5),
                y.vertexColors[2].copy(w),
                x.vertexColors[0].copy(w);
            }
            t = 2;
          }
          i.push(y, x), e.vertices.push(b);
          for (var E = 0, M = e.faceVertexUvs.length; M > E; E++)
            if (e.faceVertexUvs[E].length) {
              var T = e.faceVertexUvs[E][o],
                S = T[0],
                A = T[1],
                R = T[2];
              if (0 === t) {
                var L = S.clone();
                L.lerp(A, 0.5);
                var P = [S.clone(), L.clone(), R.clone()],
                  C = [L.clone(), A.clone(), R.clone()];
              } else if (1 === t) {
                var L = A.clone();
                L.lerp(R, 0.5);
                var P = [S.clone(), A.clone(), L.clone()],
                  C = [L.clone(), R.clone(), S.clone()];
              } else {
                var L = S.clone();
                L.lerp(R, 0.5);
                var P = [S.clone(), A.clone(), L.clone()],
                  C = [L.clone(), A.clone(), R.clone()];
              }
              n[E].push(P, C);
            }
        } else {
          i.push(s);
          for (var E = 0, M = e.faceVertexUvs.length; M > E; E++)
            n[E].push(e.faceVertexUvs[E][o]);
        }
      }
    }
    (e.faces = i), (e.faceVertexUvs = n);
  });
