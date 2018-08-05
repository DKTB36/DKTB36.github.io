/* get-distance.js */

function getDistance(vectorA, vectorB) {
  const dx = vectorB.x - vectorA.x;
  const dy = vectorB.y - vectorA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/* node.js */

class Node {
  constructor(options) {
    const defaults = {
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      radius: 2
    };

    Object.assign(this, options, defaults);
  }

  render(context) {
    const { x, y, radius } = this;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255,255,255,0.1)";
    context.fill();
  }

  update(context, width, height) {
    const { x, y, vx, vy } = this;

    this.x += vx;
    this.y += vy;

    if (x < 0) {
      this.x = width;
    } else if (x > width) {
      this.x = 0
    }

    if (y < 0) {
      this.y = height;
    } else if (y > height) {
      this.y = 0
    }

    this.render(context);
  }
}

/* nodes.js */

class Nodes {
  constructor(options) {
    const defaults = {
      length: 50,
      maxDistance: 200
    };

    Object.assign(this, options, defaults);

    this.init();
  }

  init() {
    const { length, width, height } = this;

    this.nodes = [];

    for (let i = 0; i < length; i++) {
      this.nodes.push(new Node({
        x: Math.random() * width,
        y: Math.random() * height
      }));
    }
  }

  render(context) {
    const { length, nodes, maxDistance, width, height } = this;

    for (let i = 0; i < length; i++) {
      this.nodes[i].update(context, width, height);
    }

    for (let i = 0; i < length - 1; i++) {
      const nodeA = nodes[i];

      for (let j = i + 1; j < length; j++) {
        const nodeB = nodes[j];
        const distance = getDistance(nodeA, nodeB);

        if (distance < maxDistance) {
          context.lineWidth = 1 - distance / maxDistance;
          context.beginPath();
          context.moveTo(nodeA.x, nodeA.y);
          context.lineTo(nodeB.x, nodeB.y);
          context.strokeStyle = "rgba(255,255,255,0.2)";
          context.stroke();
        }

      }

    }

  }

}

/* node-garden.js */

class NodeGarden {
  constructor(element, options) {
    const defaults = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    Object.assign(this, options, defaults);

    this.element = element;

    this.init();
  }

  init() {
    const canvas  = document.querySelector(this.element);
    this.context = canvas.getContext('2d');

    const width  = canvas.width  = this.width;
    const height = canvas.height = this.height;

    this.nodes = new Nodes({
      width,
      height
    });
  }

  render(context) {
    this.nodes.render(context)
  }

  update() {
    const { context, width, height } = this;

    this.context.clearRect(0, 0, width, height);
    this.render(context);

    requestAnimationFrame(this.update.bind(this));
  }

}

/* app.js */

const nodeGarden = new NodeGarden('.js-canvas');

nodeGarden.update();