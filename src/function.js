function delay(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function log(str) {
	const date = new Date();
	const Y = date.getFullYear().toString().padStart(4, "0");
	const M = date.getMonth().toString().padStart(2, "0");
	const D = date.getDate().toString().padStart(2, "0");
	const h = date.getHours().toString().padStart(2, "0");
	const m = date.getMinutes().toString().padStart(2, "0");
	const s = date.getSeconds().toString().padStart(2, "0");
	const time = `${Y}-${M}-${D}T${h}:${m}:${s}`;
	console.log(`%c${time} | ` + `${str}`, "color:#91ddff");
}

module.exports = {
    log:log,
    delay:delay
}