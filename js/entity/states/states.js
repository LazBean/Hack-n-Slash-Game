class PatrolState extends State {
    constructor(actor) {
        super("Patrol", actor);
    }

    update(dt) {
        // Логика патрулирования
    }
}

class ChaseState extends State {
    constructor(actor) {
        super("Chase", actor);
    }

    update(dt) {
        // Логика преследования
    }
}

class AttackState extends State {
    constructor(actor) {
        super("Attack", actor);
    }

    update(dt) {
        // Логика атаки
    }
}

class DieState extends State {
    constructor(actor) {
        super("Die", actor);
    }

    enter(previousState) {
        super.enter(previousState);
        // Логика смерти, например, анимация умирания
    }
}
