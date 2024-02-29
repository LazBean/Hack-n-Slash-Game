class State {
    constructor(name, actor) {
        this.name = name;
        this.actor = null;
    }

    enter(previousState) {
        console.log(`Entering state: ${this.name}`);
    }

    exit() {
        console.log(`Exiting state: ${this.name}`);
    }

    update(dt) {}
}

class StateMachine extends Component {
    constructor() {
        super();
        this.states = {};
        this.currentState = null;
    }

    addState(state) {
        this.states[state.name] = state;
        state.actor = this.gameObject;
    }

    setState(name) {
        if (this.currentState) {
            this.currentState.exit();
        }
        const prevState = this.currentState;
        this.currentState = this.states[name];
        if (this.currentState) {
            this.currentState.enter(prevState);
        }
    }

    update(dt) {
        if (this.currentState) {
            this.currentState.update(dt);
        }
    }
}



