/**
 * Hiigara POC
 * Copyright (C) 2013  Alex Headley <aheadley@waysaboutstuff.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


HIIGARA_CONFIG = {
    fov: 75,
    fog_min: 150,
    fog_max: 250,
    // fog_color: 0xDFDFDF,
    fog_color: 0x00,
};

Hiigara = {
    GFX: {},
    PHYSICS: {},
    AI: {},
    LOGIC: {},
};

Hiigara._setupScene = function() {
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog( HIIGARA_CONFIG.fog_color, HIIGARA_CONFIG.fog_min,
        HIIGARA_CONFIG.fog_max );
    return scene;
};

Hiigara._setupCamera = function() {
    var cam = new THREE.PerspectiveCamera(HIIGARA_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        0.1, 1000 );
    return cam;
};

Hiigara._setupRenderer = function() {
    var rndr = new THREE.WebGLRenderer({
        canvas: $("#hiigara_canvas")[0],
        precision: "highp",
        antialias: true,
    });
    rndr.setSize(window.innerWidth, window.innerHeight);
    rndr.setClearColor(HIIGARA_CONFIG.fog_color, 1);
    return rndr;
};

Hiigara._setupControls = function() {
    var controls = new THREE.TrackballControls(this._camera);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 5.0;
    controls.panSpeed = 5.0;
    controls.noZoom = false;
    controls.noPan = false;
    controls.noRoll = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    return controls;
}

Hiigara.init = function() {
    this._scene = this._setupScene();
    this._camera = this._setupCamera();
    this._renderer = this._setupRenderer();
    this._controls = this._setupControls();

    this.populateScene();

    this._camera.position.x = 15;
    this._camera.position.y = -15;
    this._camera.position.z = 15;

    Hiigara.render();
};

Hiigara.render = function() {
    requestAnimationFrame(Hiigara.render);
    Hiigara._renderer.render(Hiigara._scene, Hiigara._camera);
    Hiigara._controls.update();
};

Hiigara.populateScene = function() {
    var plight = new THREE.PointLight(0xff, 1, 100);
    plight.position.set(0, 0, 0);
    this._scene.add(plight);

    var amLight = new THREE.AmbientLight(0x404040);
    this._scene.add(amLight);

    var ships = [];
    for(var i = 0; i < 10; i++) {
        ships.push(this._buildShip());
    }
    this._ships = ships;

    this._scene.add(new THREE.Mesh(
        new THREE.CircleGeometry(HIIGARA_CONFIG.fog_max,
            HIIGARA_CONFIG.fog_max),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.25,
            color: 0x303030,
            side: THREE.DoubleSide,
        })));
};

Hiigara._buildShip = function() {
    var geometry = new THREE.CubeGeometry(3, 1, 1);
    var material = new THREE.MeshLambertMaterial({
        color: THREE.Math.randInt(0x00, 0xFFFFFF),
    });
    // material.ambient = material.color;
    var ship = new THREE.Mesh(geometry, material);
    ship.position.set(
        THREE.Math.randInt(0, 20)-10,
        THREE.Math.randInt(0, 20)-10,
        THREE.Math.randInt(0, 20)-10);
    ship.castShadow = true;
    ship.receiveShadow = true;

    this._scene.add(ship);
    return ship;
};
