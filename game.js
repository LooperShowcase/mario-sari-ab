kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0.5, 1, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("cloud", "cloud.png");
loadSprite("Gomba", "evil_mushroom.png");
loadSprite("death", "ground.png");

loadSound("G_S", "gameSound.mp3");
loadSound("J_S", "jumpSound.mp3");

scene("over", () => {
  add([
    text("Game Over!\nPress R to restart", 32),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyPress("r" || "R", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("G_S");

  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), "mushroom", body()],
    "=": [sprite("block"), solid()],
    c: [sprite("cloud"), scale(2)],
    "!": [sprite("pipe"), solid(), "pipe"],
    "@": [sprite("pipe"), solid(), "pipe2"],
    ")": [sprite("pipe"), solid(), "finish"],
    "%": [sprite("surprise"), solid(), "coin_surprise"],
    "&": [sprite("surprise"), solid(), "mushroom_surprise"],
    x: [sprite("unboxed"), solid()],
    "^": [sprite("Gomba"), solid(), body(), "gomba"],
    "*": [sprite("death"), solid(), "death"],
  };

  const map = [
    "                                                              =",
    "       c  c  c  c                                             =",
    "                                 c  c  c                      =",
    "                       $                                      =",
    "                $              &==                            =",
    "                                                              =",
    "               ===                $                           =",
    "                                                              =",
    "            $                   %===%                         =",
    "          %===&                                               =",
    "                                                              =",
    "                !          @                           )      =",
    "     $        ^                         ^      ^              =",
    "======================     ====================================",
    "======================     ====================================",
    "======================*****====================================",
  ];
  let gameLevel = addLevel(map, key);
  let score = 0;

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([
    text("score:\n" + score),
    origin("center"),
    pos(30, 120),
    layer("ui"),
    {
      value: score,
    },
  ]);

  let isJumping = false;
  let checker = 0;

  keyDown("right", () => {
    player.move(100, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 10) {
      player.move(-100, 0);
    }
  });

  keyPress("up", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(400);
      play("J_S");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin_surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 2));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("mushroom_surprise")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));

      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  player.collides("coin", (x) => {
    destroy(x);
    scoreLabel.value += 100;
    scoreLabel.text = "score:\n" + scoreLabel.value;
  });

  action("mushroom", (x) => {
    x.move(20, 0);
  });

  action("gomba", (x) => {
    x.move(-30, 0);
  });

  player.collides("death", (x) => {
    destroy(player);
    go("over");
  });

  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(10);
  });

  player.collides("pipe", (x) => {
    keyPress("down", () => {
      if (player.pos.x < x.pos.x + 70) {
        if (player.isBig()) {
          player.pos.x = player.pos.x + 220;
        } else {
          player.pos.x = player.pos.x + 240;
        }
      }
    });
  });

  player.collides("gomba", (x) => {
    if (x.grounded()) {
      if (isJumping) {
        destroy(x);
      } else {
        destroy(player);
        go("over");
      }
    } else {
      destroy(player);
      go("over");
    }
  });

  player.collides("finish", (x) => {
    keyPress("down", () => {
      if (scoreLabel.value >= 400) {
        player.smallify();
        go("level2");
      }
    });
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos.x = player.pos.x - 300;
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
});

scene("level2", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("G_S");

  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), "mushroom", body()],
    "=": [sprite("block"), solid()],
    c: [sprite("cloud"), scale(2)],
    "!": [sprite("pipe"), solid(), "pipe"],
    ")": [sprite("pipe"), solid(), "finish"],
    "@": [sprite("pipe"), solid(), "pipe2"],
    "%": [sprite("surprise"), solid(), "coin_surprise"],
    "&": [sprite("surprise"), solid(), "mushroom_surprise"],
    x: [sprite("unboxed"), solid()],
    "^": [sprite("Gomba"), solid(), body(), "gomba"],
    "*": [sprite("death"), solid(), "death"],
  };

  const map = [
    "                                                              =",
    "       c  c  c  c                                             =",
    "                                 c  c  c                      =",
    "                       $                                      =",
    "                $              &==                            =",
    "                                                              =",
    "               ===                $                           =",
    "                                  =====                       =",
    "                                                              =",
    "         ===               $                                  =",
    "                                                              =",
    "                !          @                           )      =",
    "       $                        $       ^      ^              =",
    "======================     ====================================",
    "======================     ====================================",
    "======================*****====================================",
  ];
  let gameLevel = addLevel(map, key);

  let score = 0;

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([
    text("score:\n" + score),
    origin("center"),
    pos(30, 120),
    layer("ui"),
    {
      value: score,
    },
  ]);

  let isJumping = false;
  let checker = 0;

  keyDown("right", () => {
    player.move(100, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 10) {
      player.move(-100, 0);
    }
  });

  keyPress("up", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(400);
      play("J_S");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin_surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 2));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("mushroom_surprise")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));

      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  player.collides("coin", (x) => {
    destroy(x);
    scoreLabel.value += 100;
    scoreLabel.text = "score:\n" + scoreLabel.value;
  });

  player.collides("death", (x) => {
    destroy(player);
    go("over");
  });

  action("mushroom", (x) => {
    x.move(20, 0);
  });

  action("gomba", (x) => {
    x.move(-30, 0);
  });

  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(10);
  });

  player.collides("pipe", (x) => {
    keyPress("down", () => {
      if (player.pos.x < x.pos.x + 70) {
        if (player.isBig()) {
          player.pos.x = player.pos.x + 220;
        } else {
          player.pos.x = player.pos.x + 240;
        }
      }
    });
  });

  player.collides("gomba", (x) => {
    if (x.grounded()) {
      if (isJumping) {
        destroy(x);
      } else {
        destroy(player);
        go("over");
      }
    } else {
      destroy(player);
      go("over");
    }
  });

  player.collides("finish", (x) => {
    keyPress("down", () => {
      if (scoreLabel.value >= 400) {
        go("level2");
      }
    });
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos.x = player.pos.x - 300;
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
});

start("game");
