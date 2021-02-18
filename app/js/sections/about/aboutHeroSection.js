import Section from 'core/section';
import gsap from 'gsap';
import Video from 'components/common/video';
import './imagesloaded.pkgd.min';
import THREE from 'three';


export default class AboutHeroSection extends Section {
    _setupSection(config) {
        super._setupSection(config);
        this._scrollText = this._el.querySelector('.scroll-text');

        this._marquee = gsap.to(this._scrollText, 6, {
            x: '-25%',
            ease: 'none',
            repeat: -1,
        });
        this._marquee.play(); 

        const videos = [...this._el.querySelectorAll('.video-js')];
        this._videos = videos.map(v => new Video({ el: v }));
        this._videos.forEach(v => v.activate());
        this.initTeamList();
        this.initEffect();
    }
      
    resize(width, height) {
        super.resize(width, height);
        this._videos.forEach(v => v.resize());
     }

    _activate(delay, direction) { 
        this._videos.forEach(v => v.activate());
    }

    _deactivate(delay, direction) {

    }

    _show(direction) {

    }

    _hide(direction) {

    }

    initTeamList() {
        (function () {
            function lerp(current, target, speed = 0.1, limit = 0.001) {
                let change = (target - current) * speed;
                if (Math.abs(change) < limit) {
                    change = target - current;
                }
                return change;
            }
        
            const baseContent = document.getElementById("base-content");
        
            const foldWrapper = document.getElementById("fold-wrapper");
        
            const btn = document.getElementById("btn-debug");
            const toggleDebug = () => {
                document.body.classList.toggle("debug");
            };
            btn.addEventListener("click", toggleDebug);
        
            let state = {
                scroll: 0,
                targetScroll: 0,
                progress: 0,
                targetProgress: 0,
                disposed: false
            };
            // The folds can be either pre-generated or Folded dom can generate them for you.
            class FoldedDom {
                constructor(wrapper, folds = null) {
                    this.wrapper = wrapper;
                    this.folds = folds;
                    this.centerHeight = 0;
                }
                createFold(side = "center", index = 0) {
                    const fold = document.createElement("div");
                    fold.classList.add("fold");
                    switch (side) {
                        case "before":
                            fold.classList.add("fold-before");
                            fold.classList.add("fold-before-" + index);
                            break;
                        case "after":
                            fold.classList.add("fold-after");
                            fold.classList.add("fold-after-" + index);
                            break;
                        default:
                            fold.classList.add("fold-middle");
                            break;
                    }
        
                    const content = this.baseContent.cloneNode(true);
        
                    content.classList.remove("base-content");
                    content.id = "";
        
                    const scroller = document.createElement("div");
                    scroller.classList.add("fold-scroller");
                    scroller.append(content);
        
                    fold.append(scroller);
        
                    return fold;
                }
                generateSide(baseContent, foldCount, side) {
                    const centerFold = this.createFold(0, 0);
        
                    const beforeFolds = [];
                    const afterFolds = [];
                    for (let i = 0; i < foldCount; i++) {
                        beforeFolds.push(this.createFold("before", i + 1));
                        afterFolds.push(this.createFold("after", i + 1));
                    }
        
                    // Reverse to pace index 0 next to the center element
                    let folds = beforeFolds
                        .reverse()
                        .concat(centerFold)
                        .concat(afterFolds);
                    const foldedDomEle = document.createElement("div");
                    foldedDomEle.classList.add("wrapper-3d");
                    foldedDomEle.classList.add("side-" + side);
                    folds.forEach(fold => {
                        foldedDomEle.append(fold);
                    });
                    this.wrapper.append(foldedDomEle);
        
                    return { folds, wrapper: foldedDomEle };
                }
                generateFolds(baseContent, foldCount) {
                    this.baseContent = baseContent;
        
                    const leftFolds = this.generateSide(baseContent, 1, "left");
                    const rightFolds = this.generateSide(baseContent, 1, "right");
        
                    this.centerFold =
                        rightFolds.folds[Math.floor(leftFolds.folds.length / 2)];
        
                    this.leftFolds = leftFolds;
                    this.rightFolds = rightFolds;
                    // return folds;
                }
                updateStyles(progress) {
                    let leftFolds = this.leftFolds.folds;
                    let rightFolds = this.rightFolds.folds;
                    let center = Math.floor(leftFolds.length / 2);
                    let scroll = center * -100;
        
                    for (let i = 0; i < leftFolds.length; i++) {
                        let foldLeft = leftFolds[i];
                        let foldRight = rightFolds[i];
                        const centerRelativeIndex = i - center;
                        let percentage = `${scroll - centerRelativeIndex * 100 + 100}%`;
                        let pixels = 0;
                        let translateY = percentage;
                        // The top folds are easy to sync because we only need to move them by 100% of the folds
                        if (centerRelativeIndex > 0) {
                            // The bottom folds, start at some place in the center(exactly height of middle folds).
                            // So to sync it up it needs to use pixels of the content instead.
                            pixels += -this.centerFold.offsetHeight;
                            translateY = `${pixels}px`;
                        }
                        foldLeft.children[0].style.transform = `translateY(${translateY})`;
                        foldLeft.children[0].children[0].style.transform = `translateY(${progress}px)`;
                        foldRight.children[0].style.transform = `translate(-50%, ${translateY})`;
                        foldRight.children[0].children[0].style.transform = `translateY(${progress}px)`;
                    }
                }
            }
        
            // We want the scroll to be inside the middle fold.
            // So it needs to be height of screen + the height of the content - minus the height of the fold.
            // This makes it so we only create a scrollbar if the content is bigger than the middle fold.
            let foldedDomCenter;
            let tick = () => {
                if (state.disposed) return;
                document.body.style.height =
                    foldedDomCenter.centerFold.children[0].children[0].clientHeight +
                    -foldedDomCenter.centerFold.clientHeight +
                    window.innerHeight +
                    "px";
        
                state.targetScroll = -(
                    document.documentElement.scrollTop || document.body.scrollTop
                );
        
                state.scroll += lerp(state.scroll, state.targetScroll, 0.1, 0.0001);
        
                let progress = state.scroll;
                foldedDomCenter.updateStyles(progress + baseContent.offsetTop);
                requestAnimationFrame(tick);
            };
        
            /***********************************/
            /********** Preload stuff **********/
        
            // Preload images
            const preloadImages = () => {
                return new Promise((resolve, reject) => {
                    imagesLoaded(document.querySelectorAll('.content__img'), resolve);
                });
            };
            // And then..
            preloadImages().then(() => {
                // Remove the loader
                document.body.classList.remove('loading');
                // INITIALIZE
                foldedDomCenter = new FoldedDom(foldWrapper);
                const foldCount = 1;
                foldedDomCenter.generateFolds(baseContent, foldCount);
                tick();
            });
        })();
    }

    initEffect() { 
        class EffectShell {
        constructor(container = document.body, itemsWrapper = null) {
          this.container = container
          this.itemsWrapper = itemsWrapper
          if (!this.container || !this.itemsWrapper) return
          this.setup()
          this.initEffectShell().then(() => {
            console.log('load finished')
            this.isLoaded = true
            if (this.isMouseOver) this.onMouseOver(this.tempItemIndex)
            this.tempItemIndex = null
          })
          this.createEventsListeners()
        }
      
        setup() {
          window.addEventListener('resize', this.onWindowResize.bind(this), false)
      
          // renderer
          this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
          this.renderer.setSize(this.viewport.width, this.viewport.height)
          this.renderer.setPixelRatio(window.devicePixelRatio)
          this.container.appendChild(this.renderer.domElement)
      
          // scene
          this.scene = new THREE.Scene()
      
          // camera
          this.camera = new THREE.PerspectiveCamera(
            40,
            this.viewport.aspectRatio,
            0.1,
            100
          )
          this.camera.position.set(0, 0, 3)
      
          //mouse
          this.mouse = new THREE.Vector2()
      
          // console.log(this.viewSize)
          // let pg = new THREE.PlaneBufferGeometry(
          //   this.viewSize.width,
          //   this.viewSize.height,
          //   1,
          //   1
          // )
          // let pm = new THREE.MeshBasicMaterial({ color: 0xff0000 })
          // let mm = new THREE.Mesh(pg, pm)
          // this.scene.add(mm)
      
          // time
          this.timeSpeed = 2
          this.time = 0
          this.clock = new THREE.Clock()
      
          // animation loop
          this.renderer.setAnimationLoop(this.render.bind(this))
        }
      
        render() {
          // called every frame
          this.time += this.clock.getDelta() * this.timeSpeed
          this.renderer.render(this.scene, this.camera)
        }
      
        initEffectShell() {
          let promises = []
      
          this.items = this.itemsElements
      
          const THREEtextureLoader = new THREE.TextureLoader()
          this.items.forEach((item, index) => {
            // create textures
            promises.push(
              this.loadTexture(
                THREEtextureLoader,
                item.img ? item.img.src : null,
                index
              )
            )
          })
      
          return new Promise((resolve, reject) => {
            // resolve textures promises
            Promise.all(promises).then(promises => {
              // all textures are loaded
              promises.forEach((promise, index) => {
                // assign texture to item
                this.items[index].texture = promise.texture
              })
              resolve()
            })
          })
        }
      
        createEventsListeners() {
          this.items.forEach((item, index) => {
            item.element.addEventListener(
              'mouseover',
              this._onMouseOver.bind(this, index),
              false
            )
          })
      
          this.container.addEventListener(
            'mousemove',
            this._onMouseMove.bind(this),
            false
          )
          this.itemsWrapper.addEventListener(
            'mouseleave',
            this._onMouseLeave.bind(this),
            false
          )
        }
      
        _onMouseLeave(event) {
          this.isMouseOver = false
          this.onMouseLeave(event)
        }
      
        _onMouseMove(event) {
          // get normalized mouse position on viewport
          this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
          this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1
      
          this.onMouseMove(event)
        }
      
        _onMouseOver(index, event) {
          this.tempItemIndex = index
          this.onMouseOver(index, event)
        }
      
        onWindowResize() {
          this.camera.aspect = this.viewport.aspectRatio
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(this.viewport.width, this.viewport.height)
        }
      
        onUpdate() {}
      
        onMouseEnter(event) {}
      
        onMouseLeave(event) {}
      
        onMouseMove(event) {}
      
        onMouseOver(index, event) {}
      
        get viewport() {
          let width = this.container.clientWidth
          let height = this.container.clientHeight
          let aspectRatio = width / height
          return {
            width,
            height,
            aspectRatio
          }
        }
      
        get viewSize() {
          // fit plane to screen
          // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f
      
          let distance = this.camera.position.z
          let vFov = (this.camera.fov * Math.PI) / 180
          let height = 2 * Math.tan(vFov / 2) * distance
          let width = height * this.viewport.aspectRatio
          return { width, height, vFov }
        }
      
        get itemsElements() {
          // convert NodeList to Array
          const items = [...this.itemsWrapper.querySelectorAll('.link')]
      
          //create Array of items including element, image and index
          return items.map((item, index) => ({
            element: item,
            img: item.querySelector('img') || null,
            index: index
          }))
        }
      
        loadTexture(loader, url, index) {
          // https://threejs.org/docs/#api/en/loaders/TextureLoader
          return new Promise((resolve, reject) => {
            if (!url) {
              resolve({ texture: null, index })
              return
            }
            // load a resource
            loader.load(
              // resource URL
              url,
      
              // onLoad callback
              texture => {
                resolve({ texture, index })
              },
      
              // onProgress callback currently not supported
              undefined,
      
              // onError callback
              error => {
                console.error('An error happened.', error)
                reject(error)
              }
            )
          })
        }
      }
      class TrailsEffect extends EffectShell {
        constructor(container = document.body, itemsWrapper = null, options = {}) {
          super(container, itemsWrapper)
          if (!this.container || !this.itemsWrapper) return
      
          options.strength = options.strength || 0.25
          options.amount = options.amount || 5
          options.duration = options.duration || 0.5
          this.options = options
      
          this.init()
        }
      
        init() {
          this.position = new THREE.Vector3(0, 0, 0)
          this.scale = new THREE.Vector3(1, 1, 1)
          this.geometry = new THREE.PlaneBufferGeometry(1, 1, 16, 16)
          //shared uniforms
          this.uniforms = {
            uTime: {
              value: 0
            },
            uTexture: {
              value: null
            },
            uOffset: {
              value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: {
              value: 0
            }
          }
          this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
              uniform vec2 uOffset;
      
              varying vec2 vUv;
      
              vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
                float M_PI = 3.1415926535897932384626433832795;
                position.x = position.x + (sin(uv.y * M_PI) * offset.x);
                position.y = position.y + (sin(uv.x * M_PI) * offset.y);
                return position;
              }
      
              void main() {
                vUv = uv;
                vec3 newPosition = position;
                newPosition = deformationCurve(position,uv,uOffset);
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
              }
            `,
            fragmentShader: `
              uniform sampler2D uTexture;
              uniform float uAlpha;
              uniform vec2 uOffset;
      
              varying vec2 vUv;
      
              void main() {
                vec3 color = texture2D(uTexture,vUv).rgb;
                gl_FragColor = vec4(color,uAlpha);
              }
            `,
            transparent: true
          })
          this.plane = new THREE.Mesh(this.geometry, this.material)
      
          this.trails = []
          for (let i = 0; i < this.options.amount; i++) {
            let plane = this.plane.clone()
            this.trails.push(plane)
            this.scene.add(plane)
          }
        }
      
        onMouseEnter() {
          if (!this.currentItem || !this.isMouseOver) {
            this.isMouseOver = true
            // show plane
            TweenLite.to(this.uniforms.uAlpha, 0.5, {
              value: 1,
              ease: Power4.easeOut
            })
          }
        }
      
        onMouseLeave(event) {
          TweenLite.to(this.uniforms.uAlpha, 0.5, {
            value: 0,
            ease: Power4.easeOut
          })
        }
      
        onMouseMove(event) {
          // project mouse position to world coodinates
          let x = this.mouse.x.map(
            -1,
            1,
            -this.viewSize.width / 2,
            this.viewSize.width / 2
          )
          let y = this.mouse.y.map(
            -1,
            1,
            -this.viewSize.height / 2,
            this.viewSize.height / 2
          )
      
          TweenLite.to(this.position, 1, {
            x: x,
            y: y,
            ease: Power4.easeOut,
            onUpdate: () => {
              // compute offset
              let offset = this.position
                .clone()
                .sub(new THREE.Vector3(x, y, 0))
                .multiplyScalar(-this.options.strength)
              this.uniforms.uOffset.value = offset
            }
          })
      
          this.trails.forEach((trail, index) => {
            let duration =
              this.options.duration * this.options.amount -
              this.options.duration * index
            TweenLite.to(trail.position, duration, {
              x: x,
              y: y,
              ease: Power4.easeOut
            })
          })
        }
      
        onMouseOver(index, e) {
          if (!this.isLoaded) return
          this.onMouseEnter()
          if (this.currentItem && this.currentItem.index === index) return
          this.onTargetChange(index)
        }
      
        onTargetChange(index) {
          // item target changed
          this.currentItem = this.items[index]
          if (!this.currentItem.texture) return
      
          // compute image ratio
          let imageRatio =
            this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight
          this.scale = new THREE.Vector3(imageRatio, 1, 1)
          this.uniforms.uTexture.value = this.currentItem.texture
          //this.plane.scale.copy(this.scale)
          this.trails.forEach(trail => {
            trail.scale.copy(this.scale)
          })
        }
      }
      
    }
      
}

