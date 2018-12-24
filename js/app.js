// Inimigos que nosso jogador deve evitar
class Character {
  constructor(sprite, x, y) {
    this.sprite = sprite;
    this.x = x * 101;
    this.y = y * 70;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  update(dt) {
  }
}

class Enemy extends Character {
  // As variáveis aplicadas a nossas instâncias entram aqui.
  // Fornecemos uma a você para que possa começcar.
  constructor(sprite, y, x, speed) {
    super(sprite, y, x, speed);
    this.speed = speed;
  }
}

// Atualize a posição do inimigo, método exigido pelo jogo
// Parâmetro: dt, um delta de tempo entre ticks
Enemy.prototype.update = function (dt) {
  // Você deve multiplicar qualquer movimento pelo parâmetro
  // dt, o que garantirá que o jogo rode na mesma velocidade
  // em qualquer computador.
  this.x += this.speed * dt * 75;
  if (this.x >= 505) {
    this.x = -101;
  }
}

// Desenhe o inimigo na tela, método exigido pelo jogo
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Agora, escreva sua própria classe de jogador
// Esta classe exige um método update(),
// um render() e um handleInput().
class Player extends Character {

  constructor(sprite, y, x) {
    super(sprite, y, x);
    this.vidas = 3;
    this.level = 1;
  }

  handleInput(key) {
    if (this.vidas !== 0 && this.level < 5) {
      switch (key) {
        case 'left':
          this.x -= (this.x <= 0) ? 0 : 101;
          break;

        case 'right':
          this.x += (this.x >= 404) ? 0 : 101;
          break;

        case 'up':
          this.y -= 70;
          break;

        case 'down':
          this.y += (this.y >= 420) ? 0 : 70;
          break;
      }
    } else {
      if (key === 'space')
        this.restartGame();
    }
  }

  render() {
    super.render();

    //criando score
    ctx.font = '22px "Permanent Marker"';
    ctx.textAlign = "center";
    ctx.fillText("Vidas: ", 40, 40);
    ctx.fillText(this.vidas, 80, 40);
    ctx.fillText("Level:", 450, 40);
    ctx.fillText(this.level, 490, 40);

    // vitoria
    if (this.vidas === 0) {
      ctx.drawImage(Resources.get('images/gameover.png'), 0, 50, 505, 554);
    }

    // game over
    if (this.level === 5) {
      ctx.drawImage(Resources.get('images/youwin.png'), 0, 50, 505, 554);
    }
  }

  update() {
    this.checkCollisions();
    this.increaseLevel();
  }

  /*
   * Aumenta o level adicionando novos inimigos
   * e altera sua velocidade.
   */
  increaseLevel() {
    if (this.y < 70 && this.level <= 5) {
      this.y = 350;
      this.x = 202;
      this.level++;
      if (this.level < 5) {
        for (let enemy of allEnemies) {
          enemy.speed += 0.3;
        }
        switch (this.level) {
          case 2:
            allEnemies.push(new Enemy('images/enemy-bug.png', -4, 1, 1.2));
            break;
          case 3:
            allEnemies.push(new Enemy('images/enemy-bug.png', -7, 3, 1.3));
            break;
          case 4:
            allEnemies.push(new Enemy('images/enemy-bug.png', -3, 2, 1.4));
            break;
        }
      }
    }
  }

  // reseta os inimigos ao level e velocidade
  decreaseLevel() {
    if (this.level > 1) {
      for (let element of allEnemies) {
        element.speed -= (this.level - 1) * 0.3;
      }
    }
  }

  // Verifica as colisões com os inimigos
  checkCollisions() {
    for (const enemy of allEnemies) {
      if (enemy.x >= (this.x - 90) && enemy.x <= (this.x + 90) && this.y === enemy.y) {
        this.decreaseLevel();
        this.x = 202;
        this.y = 350;
        this.vidas--;
        this.level = 1;
        allEnemies.length = 3;

      }
    }
  }

  // Resetar o jogo
  restartGame() {
    this.decreaseLevel();
    this.level = 1;
    this.vidas = 3;
    allEnemies.length = 3;
    this.y = 350;
    this.x = 202;
  }
}

// Represente seus objetos como instâncias.
// Coloque todos os objetos inimgos numa array allEnemies
// Coloque o objeto do jogador numa variável chamada jogador.
let player = new Player('images/char-boy.png', 2, 5);

let allEnemies = [
  new Enemy('images/enemy-bug.png', -1, 1, 1.1),
  new Enemy('images/enemy-bug.png', -3, 2, 1.3),
  new Enemy('images/enemy-bug.png', -5, 3, 1.2)
];

// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
