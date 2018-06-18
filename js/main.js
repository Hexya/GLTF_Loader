var container, stats, controls;
var camera, scene, renderer, light, mixer;
var clock = new THREE.Clock();
var config = require('./config');
var UserUpdate = require('./userUpdate');


var Main = function() {

    this.init = function() {
        this.initScene();
        this.animate();
    }

    this.initScene = function() {

        this.container = document.createElement( 'div' );
        this.container.classList.add("model-cont");
        document.body.appendChild( this.container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set( 0, 0, 3 );

        //controls = new THREE.OrbitControls( camera );
        //controls.target.set( 0, -0.2, -0.2 );

        scene = new THREE.Scene();
        // PLANE
        var planeGeometry = new THREE.CircleBufferGeometry(0.5, 25);
        var planeMaterial = new THREE.MeshStandardMaterial();
        var herbsMaterial = new THREE.TextureLoader().load('texture/herbs.jpg');
        planeMaterial.map = herbsMaterial;
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.position.set( 0.2, -0.7, 0.1);
        plane.rotation.x = -0.5 * Math.PI;
        scene.add(plane);

        // CONTOUR
        var torusGeometry = new THREE.TorusGeometry(0.5,0.04,10,50);
        var torusMaterial = new THREE.MeshBasicMaterial('red');
        var metMaterial = new THREE.TextureLoader().load('texture/bmet.jpg');
        torusMaterial.map = metMaterial;
        var torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set( 0.2, -0.7, 0.1);
        torus.rotation.x = -0.5 * Math.PI;
        torus.name = 'Torus'
        scene.add(torus);

        // LIGHT
        light = new THREE.HemisphereLight( 0xbbbbff, 'rgb(232, 196, 99)' );
        light.position.set( 20, 0, 0 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( -40, 60, -10 );
        scene.add( light );

        //LOADER MODEL
        this.loaded(plane, torus);

        // RENDERER
        renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true } );
        renderer.setClearColor( 0xffffff, 0);
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        //renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.gammaOutput = true;
        this.container.appendChild( renderer.domElement );

        window.addEventListener( 'resize', this.onWindowResize, false );


        // STATS
        stats = new Stats();
        this.container.appendChild( stats.dom );
    }

//LOADER
    this.loaded = function(plane, torus) {
        // MODEL
        var loader = new THREE.GLTFLoader();
        loader.load( 'model/dressed.gltf', function ( gltf ) {

            // ALL ELEMENT SCENE
            var persona = gltf.scene;
            config.model = persona;

            persona.scale.set(0.08,0.08,0.08);
            persona.position.set( 0.2, -0.7, 0);
            persona.rotation.set( 0, 3, 0);
            persona.castShadow = true;
            scene.rotation.set( 0.5, -0.5, 0);

            // COLOR CHILD OF THE SCENE
            persona.traverse( (child) => {
                var modelPart = child.name;
                switch(modelPart) {
                    case 'body':
                        child.material.color = new THREE.Color('rgb(236, 217, 188)');
                        //child.material.emissive = new THREE.Color('rgb(201, 160, 94)');
                        child.material.emissive = new THREE.Color('rgb(193, 145, 51)');
                        break;
                    case 'hair':
                        child.material.color = new THREE.Color('pink');
                        //child.material.emissive = new THREE.Color('black'); //brown
                        child.material.emissive = new THREE.Color('rgb(252, 232, 81)');
                        break;
                    case 'eye':
                        child.material.color = new THREE.Color('rgb(131, 236, 239)');
                    break;
                    case 'robe':
                        //child.material.emissive = new THREE.Color('red');
                        child.material.emissive = new THREE.Color('rgb(0, 244, 159)');
                        break;
                    case 'robeFrou':
                        child.material.emissive = new THREE.Color('white');
                    break;
                    case 'shoe_2subdiv_shoe.001_0' || 'shoe_2subdiv_shoe.001_1':
                        child.material.color = new THREE.Color('white')
                    break;
                    case 'shoe_2subdiv_shoe.001_3':
                        child.material.color = new THREE.Color('grey')
                    break;
                }
            // console.log('Name: '+ child.name);
        });

            // ANIMATIONS
            var animations = gltf.animations;

            if ( animations && animations.length ) {
                mixer = new THREE.AnimationMixer( persona );

                var talk = mixer.clipAction(animations[1]);
                var stretch = mixer.clipAction(animations[2]);
                var tPose = mixer.clipAction(animations[3]);
                var walk = mixer.clipAction(animations[4]);
                // console.log(animations);

                // DETAILS
                function talking() {
                    tPose.play();
                    talk.play();
                    plane.scale.set(1,1,1)
                    torus.scale.set(1,1,1)
                    plane.position.set( 0.2, -0.7, 0.1);
                    torus.position.set( 0.2, -0.7, 0.1);
                }
                function stretching() {
                    tPose.play();
                    stretch.play();
                    plane.scale.set(1,1,1)
                    torus.scale.set(1,1,1)
                    plane.position.set( 0.2, -0.8, 0.1);
                    torus.position.set( 0.2, -0.8, 0.1);
                }
                function walking() {
                    tPose.play();
                    walk.play();
                    plane.scale.set(1.5,1.5,1.5)
                    torus.scale.set(1.5,1.5,1.5)
                    plane.position.set( 0, -0.7, 0.1);
                    torus.position.set( 0, -0.7, 0.1);
                }
                function posing() {
                    tPose.play();
                    action.stop();
                    plane.scale.set(1,1,1)
                    torus.scale.set(1,1,1)
                    plane.position.set( 0.2, -0.7, 0.1);
                    torus.position.set( 0.2, -0.7, 0.1);
                }
                // AFFECTATION TOUCHE
                window.onkeydown = function(e) {
                    var key = e.keyCode || e.which;
                    for(var i = 0; i < animations.length;i++) {
                        // action.stop();
                        // tPose.play();
                        mixer._nActiveActions = 0;
                        //tPose.play();

                        switch (key) {
                            case 37: //left talk
                                talking();
                                break;
                            case 39:  //right ninja
                                stretching();
                                break;
                            case 38: //top walk
                                walking();
                                break;
                            case 32: //space tPose
                                posing();
                                break;
                        }
                    }
                }

                // Update user container
                var userUpdate = new UserUpdate(scene, persona, camera, talking, walking, stretching, mixer);
            }
            scene.add( persona );
        } );
    }

// RESIZE
    this.onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

// UPDATE
    this.animate = () => {

        requestAnimationFrame( this.animate );

        if (mixer) mixer.update(clock.getDelta());

        renderer.render( scene, camera );

        stats.update();
    }
    this.init();
}

module.exports = Main;