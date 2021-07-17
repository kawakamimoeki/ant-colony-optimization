/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function setup () {
  createCanvas(windowWidth, windowHeight)
  foods = []
  pheromones = []
  ants = []
  frameRate(30)
  colony = new Colony(width / 2, height / 2)
  for (let i = 0; i < 20; i++) {
    foods.push(new Food(random(0, width), random(0, height)))
  }
  for (let i = 0; i < 70; i++) {
    // ants.push(new Ant(random(0, width), random(0, height)))
    ants.push(new Ant(colony.x, colony.y))
  }
}

function draw () {
  background(255)
  colony.update()
  foods.forEach(food => food.update())
  pheromones.forEach(pheromone => pheromone.update())
  ants.forEach(ant => ant.update())
}

class Ant {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.r = random(0, 2 * PI)
    this.status = 'search'
    this.attracted = []
  }

  update () {
    if (this.status === 'search') {
      foods.forEach(food => {
        if (food.stock > 0 && dist(this.x, this.y, food.x, food.y) < food.stock / 2) {
          this.status = 'takeout'
          food.stock -= 1
        } else if (food.stock > 0 && dist(this.x, this.y, food.x, food.y) < 40) {
          this.r = createVector(food.x - this.x, food.y - this.y).heading()
        }
      })

      pheromones.forEach(pheromone => {
        if (dist(this.x, this.y, pheromone.x, pheromone.y) < 0.01 * pheromone.strength) {
          this.attracted.push(pheromone)
        } else if (!this.attracted.includes(pheromone) && dist(this.x, this.y, pheromone.x, pheromone.y) < 0.02 * pheromone.strength) {
          this.r = createVector(pheromone.x - this.x, pheromone.y - this.y).heading()
        }
      })

      if (random(1) < 0.01) {
        this.r += random(-0.5 * PI, 0.5 * PI)
      }
    }

    if (this.status === 'takeout') {
      this.r = createVector(colony.x - this.x, colony.y - this.y).heading()
      if (frameCount % 50 === 0) {
        pheromones.push(new Pheromone(this.x, this.y))
      }
    }

    this.attracted = this.attracted.filter(a => pheromones.includes(a))

    if (dist(this.x, this.y, colony.x, colony.y) < 10) {
      this.status = 'search'
    }

    const v = random(0, 4)
    this.x += v * cos(this.r)
    this.y += v * sin(this.r)

    if (this.x > width) this.x %= width
    if (this.y > height) this.y %= height
    if (this.x < 0) this.x += width
    if (this.y < 0) this.y += height

    if (this.status === 'takeout') {
      stroke(0, 204, 20)
    } else {
      noStroke()
    }
    fill(0)
    circle(this.x, this.y, 6)
    fill(255)
  }
}

class Pheromone {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.strength = 2550
  }

  update () {
    if (this.strength < 0) {
      pheromones = pheromones.filter(n => n !== this)
    }
    this.strength -= 3
    fill(255, 255 - this.strength / 10, 255 - this.strength / 10)
    noStroke()
    circle(this.x, this.y, 5)
    stroke(0)
    fill(255)
  }
}

class Food {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.stock = 20
  }

  update () {
    fill(0, 204, 20)
    circle(this.x, this.y, this.stock)
  }
}

class Colony {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  update () {
    fill(0)
    circle(this.x, this.y, 10)
    fill(255)
  }
}
