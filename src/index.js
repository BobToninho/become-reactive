// https://medium.com/vue-mastery/the-best-explanation-of-javascript-reactivity-fea6112dd80d
// https://www.vuemastery.com/courses/advanced-components/evan-you-on-proxies/
class Dependency {
	constructor() {
		// The targets that are dependent and should be run when notify() is called
		this.subscribers = []
	}

	depend() {
		if (target && !this.subscribers.includes(target)) {
			this.subscribers.push(target)
		}
	}

	notify() {
		this.subscribers.forEach(sub => sub())
	}
}

function watch(func) {
	target = func
	target()
	target = null
}

let data = { price: 5, quantity: 2 }
let target = null

let deps = new Map() // Let's store all of our data's deps in a map
Object.keys(data).forEach(key => {
	// Each property gets a dependency instance
	deps.set(key, new Dependency())
})

console.log(deps)

let originalData = { ...data } // Save old data object
data = new Proxy(originalData, {
	// Override data to have a proxy in the middle
	get(obj, key) {
		console.log('Proxy getter', arguments)
		deps.get(key).depend() // <-- Remember the target we're running
		return obj[key] // call original data
	},
	set(obj, key, newVal) {
		console.log('Proxy setter', arguments)
		obj[key] = newVal // Set original data to new value
		deps.get(key).notify() // <-- Re-run stored functions
		return true
	}
})

let total = 0

watch(() => {
	console.log('Watched function call')
	total = data.price * data.quantity
})

console.log('Total:', total)
// data.price = 20
// data.quantity = 1
// console.log('Total:', total)
// data.price = 100
// console.log('Total:', total)
