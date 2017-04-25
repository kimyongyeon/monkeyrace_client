var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 300, 400, Phaser.AUTO, 'content2', null);
                this.state.add('Boot', Client.Boot, false);
                this.state.add('Preloader', Client.Preloader, false);
                this.state.add('Scene', Client.Scene, false);
                this.state.start('Boot');
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
//window.onload = function () {
    
//};
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var Sprite = (function () {
            function Sprite(_name, _range) {
                if (_name === void 0) { _name = ""; }
                if (_range === void 0) { _range = 0; }
                this.scaleShadowValue = 0.2;
                this.scaleValue = 1;
                this.bFlip = false;
                this.bShadow = false;
                this.bInsertAnimation = false;
                this.reviceShadow = 0;
                this.range = 0;
                this.currentSpriteIndex = 0;
                this.sprite = [];
                this.spriteShadow = [];
                this.spriteIndex = [];
                this.insertAnim = [];
                this.name = _name;
                this.range = _range;
            }
            Sprite.prototype.addSprite = function (_game, _key, _show, _group) {
                if (_show === void 0) { _show = true; }
                if (_group === void 0) { _group = null; }
                this.setShadow(_game, _key, _show);
                var s = _game.add.sprite(0, 0, _key, _group);
                _game.physics.arcade.enable(s);
                if (_show) {
                    s.revive();
                }
                else {
                    s.kill();
                }
                s.scale.setTo(this.scaleValue, this.scaleValue);
                this.sprite.push(s);
            };
            Sprite.prototype.update = function () {
                if (this.bShadow) {
                    this.getSpriteShadow().x = this.getSprite().x;
                    this.getSpriteShadow().y = this.getSprite().y + this.getSprite().height - this.getSpriteShadow().height - this.reviceShadow;
                }
                if (this.getCurrentAnim() != null && this.getCurrentAnim().isPlaying == false &&
                    this.insertAnim.length > 0) {
                    this.insertAnim.splice(1, 1);
                    if (this.insertAnim.length == 1) {
                        this.animationPlay(this.insertAnim[0].key, this.insertAnim[0].speed, true);
                        this.insertAnim.shift();
                    }
                    else {
                        this.animationPlay(this.insertAnim[1].key, this.insertAnim[1].speed, false);
                    }
                }
            };
            Sprite.prototype.insertAnimation = function (_key, _frameRate) {
                if (this.insertAnim.length == 0) {
                    this.insertAnim.push({ "key": this.getCurrentAnim().name, "speed": this.getCurrentAnim().speed });
                    this.insertAnim.push({ "key": _key, "speed": _frameRate });
                }
                else if (this.insertAnim[this.insertAnim.length - 1].key == _key) {
                    return;
                }
                else {
                    this.insertAnim.push({ "key": _key, "speed": _frameRate });
                }
                if (this.insertAnim.length == 2) {
                    this.getCurrentAnim().stop();
                    this.animationPlay(_key, _frameRate, false);
                }
            };
            Sprite.prototype.addAnimation = function (_index, _key, _keyFrame) {
                if (_keyFrame === void 0) { _keyFrame = null; }
                this.sprite[_index].animations.add(_key, _keyFrame);
                this.spriteShadow[_index].animations.add(_key, _keyFrame);
                this.spriteIndex.push({ "key": _key, "index": _index });
                this.sprite[_index].animations.play(_key, 10, false);
                this.sprite[_index].animations.stop();
                this.sprite[_index].animations.currentAnim = null;
            };
            Sprite.prototype.addAnimationJson = function (_index, _key, _startFrameindex, _frameCount) {
                var array = [];
                var str;
                for (var i = _startFrameindex; i < _frameCount + _startFrameindex; i++) {
                    str = "0_000";
                    if (i < 10) {
                        str += "0";
                    }
                    str += i.toString();
                    str += ".png";
                    array.push(str);
                }
                this.addAnimation(_index, _key, array);
            };
            Sprite.prototype.setAniSpeed = function (_speed) {
                this.getSprite().animations.currentAnim.speed = _speed;
                if (this.bShadow) {
                    this.getSpriteShadow().animations.currentAnim.speed = _speed;
                }
            };
            Sprite.prototype.animationPlay = function (_key, _frameRate, _loop) {
                var index = this.getAnimationIndex(_key);
                if (this.getSprite().animations.currentAnim) {
                    if (this.getSprite().animations.currentAnim.name == _key ||
                        index < 0) {
                        return;
                    }
                }
                if (this.currentSpriteIndex != index) {
                    this.getSprite().kill();
                    this.sprite[index].revive();
                    var gapX = this.getWidth() - Math.abs(this.sprite[index].width);
                    this.sprite[index].x = this.getSprite().x + gapX / 2;
                    this.sprite[index].y = this.getSprite().y;
                    if (this.bShadow) {
                        this.getSpriteShadow().kill();
                        this.spriteShadow[index].revive();
                    }
                    this.currentSpriteIndex = index;
                }
                this.getSprite().animations.play(_key, _frameRate, _loop);
                if (this.bShadow) {
                    this.getSpriteShadow().animations.play(_key, _frameRate, _loop);
                }
            };
            Sprite.prototype.animationPlayIndex = function (_index, _frameRate, _loop) {
                if (this.currentSpriteIndex == _index && this.sprite.length <= _index)
                    return;
                if (this.currentSpriteIndex != _index) {
                    this.getSprite().kill();
                    this.sprite[_index].revive();
                    var gapX = this.getWidth() - Math.abs(this.sprite[_index].width);
                    this.sprite[_index].x = this.getSprite().x + gapX / 2;
                    this.sprite[_index].y = this.getSprite().y;
                    if (this.bShadow) {
                        this.getSpriteShadow().kill();
                        this.spriteShadow[_index].revive();
                    }
                    this.currentSpriteIndex = _index;
                }
                this.getSprite().animations.play(this.getAnimationKey(_index), _frameRate, _loop);
                if (this.bShadow) {
                    this.getSpriteShadow().animations.play(this.getAnimationKey(_index), _frameRate, _loop);
                }
            };
            Sprite.prototype.cropSprite = function (_sprIndex, _rect) {
                this.sprite[_sprIndex].crop(_rect, false);
                this.spriteShadow[_sprIndex].crop(_rect, false);
            };
            Sprite.prototype.setPosCenter = function (game, _x, _y) {
                this.getSprite().x = game.width / 2 - this.getWidth() / 2 + _x;
                this.getSprite().y = game.height / 2 - this.getSprite().height / 2 + _y;
            };
            Sprite.prototype.setFlip = function (_flip) {
                if (this.bFlip == _flip)
                    return;
                if (_flip) {
                    for (var i = 0; i < this.sprite.length; i++) {
                        this.sprite[i].anchor.x = 1;
                        this.sprite[i].scale.x = -this.scaleValue;
                    }
                }
                else {
                    for (var i = 0; i < this.sprite.length; i++) {
                        this.sprite[i].anchor.x = 0;
                        this.sprite[i].scale.x = this.scaleValue;
                    }
                }
                for (var i = 0; i < this.sprite.length; i++) {
                    this.spriteShadow[i].anchor.x = this.getSprite().anchor.x;
                    this.spriteShadow[i].scale.x = this.getSprite().scale.x;
                }
                this.bFlip = _flip;
            };
            Sprite.prototype.setTint = function (_tint) {
                for (var i = 0; i < this.sprite.length; i++) {
                    this.sprite[i].tint = _tint;
                }
            };
            Sprite.prototype.setVelocityX = function (_x) {
                this.getSprite().body.velocity.x = _x;
            };
            Sprite.prototype.setVelocityY = function (_y) {
                this.getSprite().body.velocity.y = _y;
            };
            Sprite.prototype.setPos = function (_x, _y) {
                this.getSprite().x = _x;
                this.getSprite().y = _y;
            };
            Sprite.prototype.setScaleValue = function (_value) {
                var _this = this;
                this.scaleValue = _value;
                this.range *= _value;
                this.sprite.map(function (s) {
                    s.scale.y = _value;
                    if (_this.bFlip)
                        s.scale.x = -_value;
                    else
                        s.scale.x = _value;
                });
            };
            Sprite.prototype.setShowShadow = function (_show) {
                if (this.bShadow == _show) {
                    return;
                }
                this.bShadow = _show;
                if (_show) {
                    this.getSpriteShadow().revive();
                }
                else {
                    this.getSpriteShadow().kill();
                }
            };
            Sprite.prototype.setShadow = function (_game, _key, _show) {
                var s = _game.add.sprite(0, 0, _key);
                s.scale.y = this.scaleValue * this.scaleShadowValue;
                s.tint = 0;
                if (_show && this.bShadow) {
                    s.revive();
                }
                else {
                    s.kill();
                }
                this.spriteShadow.push(s);
            };
            Sprite.prototype.setVisible = function (_visible) {
                this.sprite.map(function (s) {
                    s.visible = _visible;
                });
            };
            Sprite.prototype.getCurrentAnim = function () {
                return this.getSprite().animations.currentAnim;
            };
            Sprite.prototype.getAnimationIndex = function (_key) {
                for (var i = 0; i < this.spriteIndex.length; i++) {
                    if (this.spriteIndex[i].key == _key) {
                        return this.spriteIndex[i].index;
                    }
                }
                return -1;
            };
            Sprite.prototype.getAnimationKey = function (_index) {
                for (var i = 0; i < this.spriteIndex.length; i++) {
                    if (this.spriteIndex[i].index == _index) {
                        return this.spriteIndex[i].key;
                    }
                }
                return "";
            };
            Sprite.prototype.getSprite = function () {
                return this.sprite[this.currentSpriteIndex];
            };
            Sprite.prototype.getSpriteIndex = function (_index) {
                return this.sprite[_index];
            };
            Sprite.prototype.getPos = function () {
                return new Phaser.Point(this.getSprite().x, this.getSprite().y);
            };
            Sprite.prototype.getWorldPos = function () {
                return new Phaser.Point(this.getSprite().worldPosition.x, this.getSprite().worldPosition.y);
            };
            Sprite.prototype.getSpriteShadow = function () {
                return this.spriteShadow[this.currentSpriteIndex];
            };
            Sprite.prototype.getSpriteShadowIndex = function (_index) {
                return this.spriteShadow[_index];
            };
            Sprite.prototype.getWidth = function () {
                return Math.abs(Math.floor(this.getSprite().width));
            };
            Sprite.prototype.getCenterX = function () {
                return this.getSprite().x + this.getWidth() / 2;
            };
            return Sprite;
        }());
        Client.Sprite = Sprite;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
            };
            Boot.prototype.create = function () {
                this.stage.setBackgroundColor(0xFFFFFF);
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                if (this.game.device.desktop) {
                    this.scale.pageAlignHorizontally = true;
                }
                else {
                    this.scale.minWidth = 480;
                    this.scale.minHeight = 260;
                    this.scale.maxWidth = 1024;
                    this.scale.maxHeight = 768;
                    this.scale.forceLandscape = true;
                    this.scale.pageAlignHorizontally = true;
                    this.scale.refresh();
                }
                this.game.state.start('Preloader', true, false);
            };
            return Boot;
        }(Phaser.State));
        Client.Boot = Boot;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var scene;
        var textIndex;
        (function (textIndex) {
            textIndex[textIndex["waitCenter"] = 0] = "waitCenter";
            textIndex[textIndex["max"] = 1] = "max";
        })(textIndex || (textIndex = {}));
        var objectMgr = (function () {
            function objectMgr() {
                this.enemy = [];
                if (objectMgr._inst) {
                    throw new Error("error: instantiation failed: Use objectMgr.getInst() instead of new.");
                }
                objectMgr._inst = this;
            }
            objectMgr.getInst = function () {
                return objectMgr._inst;
            };
            ;
            objectMgr.prototype.init = function (_scene) {
                scene = _scene;
            };
            objectMgr.prototype.create = function () {
                this.background = scene.game.add.sprite(0, 0, 'ig1_background');
                this.background.width = scene.game.width;
                this.background.height = scene.game.height;
                for (var i = 0; i < scene.enemyCountMax; i++) {
                    var e = new Client.Sprite("dragon", 35);
                    e.addSprite(scene.game, 'horse');
                    e.setScaleValue(scene.enemyScale);
                    e.addAnimation(Client.fileIndex.idle, 'run', [0, 1, 2, 3]);
                    e.animationPlay('run', 10, true);
                    if (i % 2 == 0) {
                        e.setFlip(true);
                    }
                    this.enemy.push(e);
                }
                this.createFont();
            };
            objectMgr.prototype.createFont = function () {
                this.textRecord = scene.game.add.bitmapText(this.background.x + 10, this.background.y + 50, 'desyrel', '', 24);
                this.text = this.addText("A : left / D: right / S: game start", 0, this.background.height - 200, true);
                this.text.fill = 'red';
                this.text.fontSize = 18;
                this.text.fontWeight = 'bold';
            };
            objectMgr.prototype.collision = function (_enemy) {
                if (Client.playerMgr.getInst().isAlive == false)
                    return false;
                var e = _enemy.getSprite().x + _enemy.getWidth() / 2 - _enemy.range / 2;
                var p = Client.playerMgr.getInst().player.getSprite().x + Client.playerMgr.getInst().player.getWidth() / 2 - Client.playerMgr.getInst().player.range / 2;
                if (e + _enemy.range * 0.6 > p && e < p + Client.playerMgr.getInst().player.range * 0.6) {
                    Client.playerMgr.getInst().isAlive = false;
                    Client.playerMgr.getInst().player.setTint(Client.clrIndex.red);
                    Client.playerMgr.getInst().player.animationPlay('lose', 5, true);
                    this.text.visible = true;
                    return true;
                }
                return false;
            };
            objectMgr.prototype.resetGame = function () {
                var _this = this;
                this.enemy.forEach(function (e, i) {
                    e.getSprite().x = _this.background.x + Math.random() * 1000 % (scene.game.width - e.getWidth() + scene.enemyCreateWidthRange) - scene.enemyCreateWidthRange * 0.6;
                    e.getSprite().y = (e.getSprite().height * (scene.enemyCountMax / scene.enemyStartCount)) * (i + 1) * -1;
                    if (i >= scene.enemyStartCount) {
                        e.getSprite().visible = false;
                    }
                    e.animationPlay('run', 10, true);
                });
                this.textRecord.text = "0";
                this.text.visible = false;
            };
            objectMgr.prototype.addButton = function (_key, _x, _y, _frameOver, _frameOut, _frameDown, _bFiexed) {
                var btn = scene.game.add.button(_x, _y, _key, scene.onButton, scene, _frameOver, _frameOut, _frameDown);
                btn.fixedToCamera = _bFiexed;
                return btn;
            };
            objectMgr.prototype.addText = function (_str, _x, _y, _isCenter) {
                if (_isCenter === void 0) { _isCenter = false; }
                var style = { font: "16px Arial", fill: "#fff", align: "center" };
                var posY = _y;
                if (_isCenter) {
                    style.boundsAlignH = "center";
                    posY = 0;
                }
                var text = scene.game.add.text(_x, posY, _str, style);
                if (_isCenter) {
                    text.setTextBounds(0, _y, scene.game.width, 0);
                }
                return text;
            };
            objectMgr._inst = new objectMgr();
            return objectMgr;
        }());
        Client.objectMgr = objectMgr;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var scene;
        var playerMgr = (function () {
            function playerMgr() {
                this.playerRange = 62;
                this.isAlive = true;
                console.log("playerMgr :: 생성자 호출");
                if (playerMgr._instance) {
                    throw new Error("Error: Instantiation failed: Use playerMgr.getInst() instead of new.");
                }
                playerMgr._instance = this;
            }
            playerMgr.getInst = function () {
                return playerMgr._instance;
            };
            playerMgr.prototype.init = function (_scene) {
                scene = _scene;
            };
            playerMgr.prototype.create = function () {
                this.player = new Client.Sprite("ingameDragon", this.playerRange);
                this.player.addSprite(scene.game, 'ig1_dragon_idle', true);
                this.player.addSprite(scene.game, 'ig1_dragon_att', false);
                this.player.addSprite(scene.game, 'ig1_dragon_lose', false);
                this.player.addAnimation(Client.fileIndex.idle, 'stay', [0, 1, 2, 3, 4, 5]);
                this.player.addAnimation(Client.fileIndex.att, 'att', [0, 1, 2, 3, 4, 5, 6, 7]);
                this.player.addAnimation(Client.fileIndex.lose, 'lose', [0, 1, 2, 3, 4, 5]);
                this.player.setScaleValue(scene.playerScale);
                this.player.animationPlay('stay', 10, true);
                this.player.getSprite().y = Client.objectMgr.getInst().background.y + Client.objectMgr.getInst().background.height - this.player.getSprite().height - 7;
            };
            playerMgr.prototype.update = function () {
                if (Client.objectMgr.getInst().background.left >
                    this.player.getSprite().x + this.player.getWidth() / 2 - this.player.range / 2) {
                    this.player.getSprite().x++;
                    scene.moveSpeed = 0;
                }
                else if (Client.objectMgr.getInst().background.right <
                    this.player.getSprite().x + this.player.getWidth() / 2 + this.player.range / 2 + 14) {
                    this.player.getSprite().x--;
                    scene.moveSpeed = 0;
                }
                this.player.getSprite().x += scene.moveSpeed;
            };
            playerMgr.prototype.resetGame = function () {
                this.player.getSprite().x = Client.objectMgr.getInst().background.x + Client.objectMgr.getInst().background.width / 2 - this.player.getWidth() / 2;
                this.player.animationPlay('stay', 10, true);
                this.player.setTint(Client.clrIndex.white);
                this.isAlive = true;
            };
            playerMgr._instance = new playerMgr();
            return playerMgr;
        }());
        Client.playerMgr = playerMgr;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var jsonMgr = (function () {
            function jsonMgr() {
                this.table = [];
                if (jsonMgr.inst != null) {
                    throw new Error("Error: Instantiation failed: Use jsonMgr.getInst() instead of new.");
                }
                jsonMgr.inst = this;
            }
            jsonMgr.getInst = function () { return this.inst; };
            jsonMgr.prototype.init = function (_game, _count) {
                this.table.length = _count;
                this.game = _game;
            };
            jsonMgr.prototype.createTable = function (_index, _fileName) {
                this.table[_index] = this.game.cache.getJSON(_fileName);
            };
            jsonMgr.prototype.get = function (_index) {
                return this.table[_index];
            };
            jsonMgr.inst = new jsonMgr();
            return jsonMgr;
        }());
        Client.jsonMgr = jsonMgr;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var Player = (function () {
            function Player(_index) {
                this.attr = new Client.Sprite();
                this.index = _index;
            }
            Player.prototype.getWidth = function () {
                return Math.abs(Math.floor(this.attr.getSprite().width));
            };
            return Player;
        }());
        Client.Player = Player;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        var jsonIndex;
        (function (jsonIndex) {
            jsonIndex[jsonIndex["game"] = 0] = "game";
            jsonIndex[jsonIndex["max"] = 1] = "max";
        })(jsonIndex || (jsonIndex = {}));
        var Scene = (function (_super) {
            __extends(Scene, _super);
            function Scene() {
                _super.apply(this, arguments);
                this.moveSpeedMax = 5;
                this.moveAddValue = 0.5;
                this.playerScale = 0.7;
                this.enemyScale = 0.7;
                this.enemyStartCount = 8;
                this.enemyCountMax = 20;
                this.enemyMoveSpeed = 5;
                this.enemyCreateWidthRange = 50;
                this.record = 0;
                this.moveSpeed = 0;
                this.level = 0;
                this.enemyCount = 0;
            }
            Scene.prototype.create = function () {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                Client.jsonMgr.getInst().init(this.game, jsonIndex.max);
                Client.playerMgr.getInst().init(this);
                Client.objectMgr.getInst().init(this);
                Client.jsonMgr.getInst().createTable(jsonIndex.game, 'ingame_dragon');
                this.loadJSON(Client.jsonMgr.getInst().get(jsonIndex.game));
                Client.objectMgr.getInst().create();
                Client.playerMgr.getInst().create();
                this.resetGame();
                Client.playerMgr.getInst().isAlive = false;
                Client.objectMgr.getInst().text.visible = true;
            };
            Scene.prototype.update = function () {
                var _this = this;
                this.keyInput();
                Client.playerMgr.getInst().update();
                if (Client.playerMgr.getInst().isAlive == false)
                    return;
                var player = Client.playerMgr.getInst().player.getSprite();
                Client.objectMgr.getInst().enemy.forEach(function (e, i) {
                    if (e.getSprite().visible == false)
                        return;
                    e.getSprite().y += _this.enemyMoveSpeed;
                    if (Client.playerMgr.getInst().isAlive &&
                        e.getSprite().y + e.getSprite().height * 0.6 > player.y &&
                        e.getSprite().y < player.y + player.height * 0.6) {
                        Client.objectMgr.getInst().collision(e);
                    }
                    if (e.getSprite().y > _this.game.height) {
                        e.getSprite().x = Client.objectMgr.getInst().background.x + Math.random() * 1000 % (_this.game.width - e.getWidth() + _this.enemyCreateWidthRange) - _this.enemyCreateWidthRange * 0.6;
                        e.getSprite().y = e.getSprite().height * -1;
                        if (Client.playerMgr.getInst().isAlive) {
                            _this.record++;
                            Client.objectMgr.getInst().textRecord.text = _this.record.toString();
                            if (Math.floor(_this.record / 5) != _this.level) {
                                _this.level = Math.floor(_this.record / 5);
                                if (_this.enemyCount < _this.enemyCountMax) {
                                    Client.objectMgr.getInst().enemy[_this.enemyCount].setVisible(true);
                                    _this.enemyCount++;
                                }
                            }
                        }
                    }
                });
            };
            Scene.prototype.resetGame = function () {
                this.enemyCount = this.enemyStartCount;
                this.moveSpeed = 0;
                this.record = 0;
                this.level = 0;
                Client.playerMgr.getInst().resetGame();
                Client.objectMgr.getInst().resetGame();
            };
            Scene.prototype.keyInput = function () {
                if (this.game.input.keyboard.isDown(Phaser.KeyCode.A) && Client.playerMgr.getInst().isAlive) {
                    if (this.moveSpeed > (this.moveSpeedMax * -1))
                        this.moveSpeed -= this.moveAddValue;
                    Client.playerMgr.getInst().player.setFlip(false);
                }
                else if (this.game.input.keyboard.isDown(Phaser.KeyCode.D) && Client.playerMgr.getInst().isAlive) {
                    if (this.moveSpeed < this.moveSpeedMax)
                        this.moveSpeed += this.moveAddValue;
                    Client.playerMgr.getInst().player.setFlip(true);
                }
                else if (this.moveSpeed < 0) {
                    this.moveSpeed++;
                    if (this.moveSpeed > 0)
                        this.moveSpeed = 0;
                }
                else if (this.moveSpeed > 0) {
                    this.moveSpeed--;
                    if (this.moveSpeed < 0)
                        this.moveSpeed = 0;
                }
                if (this.isKeyDown(Phaser.KeyCode.S)) {
                    this.resetGame();
                }
            };
            Scene.prototype.onButton = function (button) {
            };
            Scene.prototype.isKeyDown = function (_key, _duration) {
                if (_duration === void 0) { _duration = true; }
                if (_duration) {
                    return this.game.input.keyboard.downDuration(_key, 1);
                }
                else {
                    return this.game.input.keyboard.isDown(_key);
                }
            };
            Scene.prototype.loadJSON = function (_json) {
                ;
                if (_json == null)
                    return;
                if (_json.moveSpeedMax)
                    this.moveSpeedMax = _json.moveSpeedMax;
                if (_json.moveAddValue)
                    this.moveAddValue = _json.moveAddValue;
                if (_json.playerScale)
                    this.playerScale = _json.playerScale;
                if (_json.enemyScale)
                    this.enemyScale = _json.enemyScale;
                if (_json.enemyStartCount)
                    this.enemyStartCount = _json.enemyStartCount;
                if (_json.enemyCountMax)
                    this.enemyCountMax = _json.enemyCountMax;
                if (_json.enemyCreateWidthRange)
                    this.enemyCreateWidthRange = _json.enemyCreateWidthRange;
                if (_json.enemyMoveSpeed)
                    this.enemyMoveSpeed = _json.enemyMoveSpeed;
            };
            return Scene;
        }(Phaser.State));
        Client.Scene = Scene;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var dodge;
(function (dodge) {
    var Client;
    (function (Client) {
        (function (fileIndex) {
            fileIndex[fileIndex["idle"] = 0] = "idle";
            fileIndex[fileIndex["att"] = 1] = "att";
            fileIndex[fileIndex["lose"] = 2] = "lose";
            fileIndex[fileIndex["max"] = 3] = "max";
        })(Client.fileIndex || (Client.fileIndex = {}));
        var fileIndex = Client.fileIndex;
        (function (clrIndex) {
            clrIndex[clrIndex["white"] = 16777215] = "white";
            clrIndex[clrIndex["red"] = 16724787] = "red";
            clrIndex[clrIndex["blue"] = 13311] = "blue";
            clrIndex[clrIndex["purple"] = 10040268] = "purple";
            clrIndex[clrIndex["green"] = 3394560] = "green";
            clrIndex[clrIndex["yellow"] = 13434624] = "yellow";
            clrIndex[clrIndex["black"] = 5592405] = "black";
            clrIndex[clrIndex["orange"] = 16744192] = "orange";
            clrIndex[clrIndex["max"] = 8] = "max";
        })(Client.clrIndex || (Client.clrIndex = {}));
        var clrIndex = Client.clrIndex;
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.spritesheet('horse', 'assets/sprites/horse.png', 107, 96);
                this.load.json('ingame_dragon', 'ingame_dragon.json');
                this.load.image('ig1_background', 'assets/sprites/ig01_back.png');
                this.load.spritesheet('ig1_button', 'assets/sprites/btn_ingame_33x33.png', 33, 33);
                this.load.spritesheet('ig1_dragon_idle', 'assets/sprites/ig01_dragon_idle 72x70.png', 72, 70);
                this.load.spritesheet('ig1_dragon_att', 'assets/sprites/ig01_dragon_att 125x70.png', 125, 70);
                this.load.spritesheet('ig1_dragon_lose', 'assets/sprites/ig01_dragon_lose 90x80.png', 90, 80);
                this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
            };
            Preloader.prototype.create = function () {
                var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startScene, this);
            };
            Preloader.prototype.startScene = function () {
                this.game.state.start('Scene', true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = dodge.Client || (dodge.Client = {}));
})(dodge || (dodge = {}));
var phaser_heedong;
(function (phaser_heedong) {
    var Client;
    (function (Client) {
        var SoundManager = (function () {
            function SoundManager(_game) {
                this.audio = [];
                this.game = _game;
            }
            ;
            SoundManager.prototype.addAudio = function (_id, _key, _volume, _loop) {
                if (!this.checkRegist(_id)) {
                    return;
                }
                this.audio.push({ "id": _id, "audio": this.game.add.audio(_key, _volume, _loop) });
            };
            SoundManager.prototype.setVolume = function (_id, _value) {
                this.audio[_id].audio.volume = _value;
            };
            SoundManager.prototype.getAudio = function (_id) {
                return this.audio[_id].audio;
            };
            SoundManager.prototype.play = function (_id, _newplay) {
                if (_newplay === void 0) { _newplay = true; }
                var index = this.getAudioIndex(_id);
                if (index < 0)
                    return;
                if (this.isPlay(index)) {
                    if (_newplay) {
                        this.audio[index].audio.stop();
                    }
                    else {
                        return;
                    }
                }
                this.audio[index].audio.duration;
                this.audio[index].audio.play();
            };
            SoundManager.prototype.setLoop = function (_id, _loop) {
                var index = this.getAudioIndex(_id);
                if (index < 0)
                    return;
                this.audio[index].audio.loop = _loop;
            };
            SoundManager.prototype.setMute = function (_mute) {
                for (var i = 0; i < this.audio.length; i++) {
                    this.audio[i].audio.mute = _mute;
                }
            };
            SoundManager.prototype.isPlay = function (_id) {
                return this.audio[_id].audio.isPlaying;
            };
            SoundManager.prototype.checkRegist = function (_id) {
                for (var i = 0; i < this.audio.length; i++) {
                    if (this.audio[i].id == _id) {
                        return false;
                    }
                }
                return true;
            };
            SoundManager.prototype.getAudioIndex = function (_id) {
                for (var i = 0; i < this.audio.length; i++) {
                    if (this.audio[i].id == _id) {
                        return i;
                    }
                }
                return -1;
            };
            return SoundManager;
        }());
        Client.SoundManager = SoundManager;
    })(Client = phaser_heedong.Client || (phaser_heedong.Client = {}));
})(phaser_heedong || (phaser_heedong = {}));
//# sourceMappingURL=game.js.map