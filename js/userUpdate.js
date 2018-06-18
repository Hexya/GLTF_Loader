var colorContainer  = require('./template/update.tpl');
var config          = require('./config');

var UserUpdate = function(scene, persona, camera, talking, walking, stretching, mixer) {
    this.scene = scene;
    this.persona = persona;
    this.camera = camera;
    this.talking = talking;
    this.walking = walking;
    this.stretching = stretching;
    this.mixer = mixer;
    this.container;

    this.targetPosX = this.scene.position.x;
    this.targetPosY = this.scene.position.y;
    this.targetPosZ = this.scene.position.z;
    this.targetRotX = this.scene.rotation.x;
    this.targetRotY = this.scene.rotation.y;
    this.targetRotZ = this.scene.rotation.z;

    this.active = 0;


    this.init = function() {
        this.contUpdate();
        this.updatePos();
        this.rotate();
        this.translate();
        this.zoom();
        this.clickAnim();
        this.faceZoom();
        this.clothes();
    }

    // CONTAINER UPDATE
    this.contUpdate = function() {
        this.container = $('<div class="update-container"></div>');
        $('body').append(this.container)
        this.colorContainer = $(colorContainer);
        this.container.append(this.colorContainer);

        // COLOR BLOCK
        for (var i = 0; i < config.hairColor.length; i++) { //hair
            $('.hair-blocs').append('<div class="hair-color hair-color'+i+' blocs-color"></div>');
            $('.hair-color'+i).css('background',config.hairColor[i]);
        }
        for (var i = 0; i < config.skinColor.length; i++) { //skin
            $('.skin-blocs').append('<div class="skin-color skin-color'+i+' blocs-color"></div>');
            $('.skin-color'+i).css('background',config.skinColor[i]);
        }
        for (var i = 0; i < config.eyesColor.length; i++) { //eyes
            $('.eyes-blocs').append('<div class="eyes-color eyes-color'+i+' blocs-color"></div>');
            $('.eyes-color'+i).css('background',config.eyesColor[i]);
        }
        for (var i = 0; i < config.dressColor.length; i++) { //dress
            $('.robe-blocs').append('<div class="robe-color dress-color'+i+' blocs-color"></div>');
            $('.top-dress-blocs').append('<div class="top-dress-color dress-color'+i+' blocs-color"></div>');
            $('.shoes-blocs1').append('<div class="shoesP1-color dress-color'+i+' blocs-color"></div>');
            $('.shoes-blocs2').append('<div class="shoesP2-color dress-color'+i+' blocs-color"></div>');
            $('.dress-color'+i).css('background',config.dressColor[i]);
        }

        // ASSIGN COLOR
        $('.blocs-color').click((e) => {
            //console.log($(e.currentTarget).closest('.blocs').data('type'))
            var type = $(e.currentTarget).closest('.blocs').data('type');
            $(e.currentTarget).closest('.blocs').children().removeClass('active')
            $(e.currentTarget).addClass('active');
            config.model.traverse( (child) => {
                if (child.name === type ) { //body
                    child.material.emissive = new THREE.Color($(e.currentTarget).css("background-color"));
                }
                /*else if (child.name === 'shoe_2subdiv_shoe.001_0' || child.name === 'shoe_2subdiv_shoe.001_1' || child.name === 'shoe_2subdiv_shoe.001_3'){
                    child.material.color = new THREE.Color($(e.currentTarget).css("background-color"));
                }*/
            })
        })

        $('.blocs-color').click((e) => {
            //console.log($(e.currentTarget).closest('.blocs').data('shoes'))
            var shoes = $(e.currentTarget).closest('.blocs').data('shoes');
            $(e.currentTarget).closest('.blocs').children().removeClass('active')
            $(e.currentTarget).addClass('active');
            config.model.traverse( (child) => {
                if (child.name === shoes){
                    child.material.color = new THREE.Color($(e.currentTarget).css("background-color"));
                }
            })
        })

    }

    // ROTATION
    this.rotate = function() {
        var myself = this;
        this.rotate = $('<div class="cont-moove rotate">' +
            '<div class="rot arrow-left" data-type="left"></div>' +
            '<div class="rot arrow-right" data-type="right"></div>' +
            '<div class="rot arrow-top" data-type="top"></div>' +
            '<div class="rot arrow-bottom" data-type="bottom"></div>' +
            '</div>');
        this.container.append(this.rotate);

        $('.rot').on('mouseover', function () {
            direction($(this).attr('data-type'))
        })
        function direction(type) {
            if(type === 'right') { myself.scene.rotation.y += 0.01; }
            if(type === 'left') { myself.scene.rotation.y -= 0.01; }
            if(type === 'bottom') { myself.scene.rotation.x -= 0.01; }
            if(type === 'top') { myself.scene.rotation.x += 0.01; }
            var continious = setTimeout(() => {direction(type);}, 10);
            $('.arrow-' + type).on('mouseout', function() {
                clearInterval(continious);
            });
        }
    }

    //TRANSLATION
    this.translate = function() {
        var myself = this;
        this.rotate = $('<div class="cont-moove translate">' +
            '<div class="trans arrow-left" data-type="left"></div>' +
            '<div class="trans arrow-right" data-type="right"></div>' +
            '<div class="trans arrow-top" data-type="top"></div>' +
            '<div class="trans arrow-bottom" data-type="bottom"></div>' +
            '</div>');
        this.container.append(this.rotate);

        $('.trans').on('mouseover', function () {
            direction($(this).attr('data-type'))
        })
        function direction(type) {
            if(type === 'right') { myself.scene.position.x += 0.003; }
            if(type === 'left') { myself.scene.position.x -= 0.003; }
            if(type === 'bottom') { myself.scene.position.y -= 0.003; }
            if(type === 'top') { myself.scene.position.y += 0.003; }
            var continious = setTimeout(() => {direction(type);}, 10);
            $('.arrow-' + type).on('mouseout', function() {
                clearInterval(continious);
            });
        }
    }

    //ZOOM
    this.zoom = function () {
        var myself = this;
        var zoomElement = $('<div class="zoom">' +
            '<div class="side circle-more" data-type="more">+</div>' +
            '<div class="side circle-less" data-type="less">-</div>' +
            '</div>');
        this.container.append(zoomElement);

        $('.side').on('mouseover', function () {
            moreLess($(this).attr('data-type'))
        })
        function moreLess(type) {
            if(type === 'more') { myself.scene.position.z += 0.01;}
            if(type === 'less') { myself.scene.position.z -= 0.01;}
        var continious = setTimeout(() => {moreLess(type);}, 10);
        $('.circle-' + type).on('mouseout', function() {
            clearInterval(continious);
        });
        }
    }
    // Target ZOOM
    this.faceZoom = function () {
        var faceZoomElement = $('<div class="face-zoom">' +
            '<div class="zoom-target face " data-type="face"><img src="./texture/anim/face.png"></div>' +
            '<div class="zoom-target global" data-type="global"><img src="./texture/anim/global.png"></div>' +
            '</div>');
        this.container.append(faceZoomElement);
        $('.face').on('click', () => {
            this.targetPosX = -0.15;
            this.targetPosY = -0.5;
            this.targetPosZ = 1.85;
            this.targetRotX = 0.35;
            this.targetRotY = -0.5;
            this.targetRotZ = 0;
            this.active = 1;
            setTimeout(() => {this.active =0;}, 2000);
        })
        $('.global').on('click', () => {
            this.targetPosX = 0;
            this.targetPosY = 0;
            this.targetPosZ = 0;
            this.targetRotX = 0.5;
            this.targetRotY = -0.5;
            this.targetRotZ = 0;
            this.active = 1;
            setTimeout(() => {this.active =0;}, 2000);
        })
    }

    // INTERPOLATION
    this.updatePos = () => {
        requestAnimationFrame( this.updatePos );
            this.scene.position.x += ((this.targetPosX - this.scene.position.x) * 0.1) * this.active;
            this.scene.position.y += ((this.targetPosY - this.scene.position.y) * 0.1) * this.active;
            this.scene.position.z += ((this.targetPosZ - this.scene.position.z) * 0.1) * this.active;
            this.scene.rotation.x += ((this.targetRotX - this.scene.rotation.x) * 0.1) * this.active;
            this.scene.rotation.y += ((this.targetRotY - this.scene.rotation.y) * 0.1) * this.active;
            this.scene.rotation.z += ((this.targetRotZ - this.scene.rotation.z) * 0.1) * this.active;
        //Valeur actuelle += ( valeur d'arrivé - valeur actuelle ) * easing   *active 0/1 pour eviter le retour constant
    }

    // ANIM Click
    this.clickAnim = function () {
        var animBlock = $('<div class="anim-content">' +
            '<p>Animation:</p>' +
            '<div class="blocs-anim talk"><img src="./texture/anim/talking.png"></div>' +
            '<div class="blocs-anim walk"><img src="./texture/anim/walking.png"></div>' +
            '<div class="blocs-anim stretch"><img src="./texture/anim/stretching.png"></div>' +
            '</div>')
        this.container.append(animBlock);
        $('.talk').on('click', () => {
            this.mixer._nActiveActions = 0;
            this.talking();
        });
        $('.walk').on('click', () => {
            this.mixer._nActiveActions = 0;
            this.walking();
        });
        $('.stretch').on('click', () => {
            this.mixer._nActiveActions = 0;
            this.stretching();
        });

    }

    // ADD DELETE ELEM
    this.clothes = function () {
        var clothesBlock = $('<div class="clothes-content">' +
            '<p>Clothes:</p>' +
            '<div class="blocs-clothes nude"><img src="./texture/anim/nude.png"></div>' +
            '<div class="blocs-clothes apparel"><img src="./texture/anim/apparel.png"></div>' +
            '</div>')
        this.container.append(clothesBlock);
        console.log(persona.children[0].children[0]) //elem
        var shoes = this.persona.children[0].children[0].children[3];
        var robeFrou = this.persona.children[0].children[0].children[5];
        var robe = this.persona.children[0].children[0].children[4];
        $('.nude').on('click', () => {
            this.persona.children[0].children[0].remove(shoes);
            this.persona.children[0].children[0].remove(robeFrou);
            this.persona.children[0].children[0].remove(robe);
        })
        $('.apparel').on('click', () => {
            this.persona.children[0].children[0].add(shoes);
            this.persona.children[0].children[0].add(robeFrou);
            this.persona.children[0].children[0].add(robe);
        })

    }


    this.init();
}

module.exports = UserUpdate;