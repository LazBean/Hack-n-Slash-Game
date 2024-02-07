class Motor extends Component {
    constructor(gameObject) {
      super(gameObject);
      this.speed = 4;
      this.vel = {x: 0, y: 0, z: 0};
      this.dir = {x: 0, y: 0, z: 0};
      this.isActing = false;
      this.actionTimer = 0;
      this.collide = true;
    }
  
    update(dt) {
      if (this.isActing) {
        this.actionTimer -= dt;
        if (this.actionTimer <= 0) {
          this.isActing = false;
        }
        return;
      }
  
      // Рассчитываем новую позицию с учетом скорости и направления
      let newPos = {
        x: this.gameObject.transform.position.x + this.vel.x * dt,
        y: this.gameObject.transform.position.y + this.vel.y * dt,
        z: this.gameObject.transform.position.z + this.vel.z * dt,
      };
  
      // Здесь должна быть логика проверки столкновений
      // Если столкновений нет, обновляем позицию объекта
      this.gameObject.transform.position = newPos;
  
      // Дополнительная логика для управления состоянием движения
      // Например, обработка прыжка или атаки
    }
  
    setDirection(x, y, z) {
      this.dir = {x, y, z};
      // Обновляем скорость в соответствии с направлением
      this.vel = {
        x: this.speed * this.dir.x,
        y: this.speed * this.dir.y,
        z: this.speed * this.dir.z,
      };
    }
  
    // Методы для управления состояниями действий, например, прыжок или атака
    jump() {
      // Реализация прыжка
    }
  
    attack() {
      // Реализация атаки
    }
  
    collision(){
		es = getEntitiesToCollideWith(this.pos);
		for(var i=0; i<es.length; i++) {
			var e = es[i];

			if(e.collide == false) continue;

			var hit = collidesCircles(this.pos, 0.3, e.pos, 0.3);
			if(hit.isCollides){
				this.pos = {
					x:this.pos.x + hit.normal.x * hit.overlap, 
					y:this.pos.y + hit.normal.y * hit.overlap, 
					z:this.pos.z + hit.normal.z * hit.overlap
				};
			}
		}
	}
  }
  