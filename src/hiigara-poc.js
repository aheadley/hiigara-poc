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
    fov: 90,
};

Hiigara = {};

Hiigara.init = function() {
    this._boxes = [];
    this._boxCount = 0;
    this._gl = CubicVR.init();
    this._canvas = CubicVR.getCanvas();
    this._scene = this._setupScene(this._canvas);
    this._setupControls(this._canvas, this._scene);

    var box = this.fillScene();



    CubicVR.MainLoop(this.renderLoop);
};

Hiigara.renderLoop = function(timer, gl) {
    if(!timer.locked()) {
        timer.lockFramerate(30.0);
    }

    Hiigara._boxes.forEach(function(v, i, a) {
        v.position.forEach(function(v2, i2, a2) {
            if(a2[i2] < 10.0) {
                a2[i2] += a2[i2] * 0.01;
            }
        });
    });

    Hiigara._scene.render();
};

Hiigara._setupScene = function(canvas) {
    var scene = new CubicVR.Scene(canvas.width, canvas.height, HIIGARA_CONFIG.fov);
    CubicVR.addResizeable(scene);
    scene.camera.position = [10, 10, 12];
    scene.camera.target = [0, 0, 0];
    return scene;
};

Hiigara._setupControls = function(canvas, scene) {
    var kbd = CubicVR.keyboard;
    var mvc = new CubicVR.MouseViewController(canvas, scene.camera);
};

Hiigara._createBox = function(size, pos) {
    var boxTexture = new CubicVR.TextTexture(["Box #", this._boxes.length],
    {
        color: "#000",
        bgcolor: "#fff",
        align: "center",
    });

    var boxMesh = new CubicVR.Mesh({
        primitive: {
            type: "box",
            size: size,
            material: {
                textures: {
                    color: boxTexture,
                },
            },
            uv: {
                projectionMode: "cubic",
                scale: [1, 1, 1],
            },
        },
        compile: true,
    });

    var boxObject = new CubicVR.SceneObject(boxMesh);

    boxObject.position = pos;

    this._scene.bind(boxObject);
    this._boxes.push(boxObject);

    return boxObject;
};

Hiigara.fillScene = function() {
    this._scene.bind(new CubicVR.Light({
        type: "point",
        method: "dynamic",
        position: [5.0, 5.0, -5.0],
        distance: 20.0,
        intensity: 2.0,
    }));

    this._createBox(1.5, [0.0, 0.0, 4.0]);
    this._createBox(0.5, [0.0, 3.0, 0.0]);
    this._createBox(0.8, [2.0, 0.0, 0.0]);
    this._createBox(1.0, [0.0, 0.0, 0.0]);
    this._createBox(2.0, [2.0, 2.0, 2.0]);
};
