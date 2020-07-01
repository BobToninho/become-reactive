export class Dependency {
	constructor() {
		// The targets that are dependent and should be run when notify() is called
		this.subscribers = []
	}

	depend(target) {
		if (target && !this.subscribers.includes(target)) {
			this.subscribers.push(target)
		}
	}

	notify() {
		this.subscribers.forEach(sub => sub())
	}
}
