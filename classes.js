const chinese = {
	name: "國文",
	code: ["fyjqx6o"],
	url: ["https://meet.google.com/zmc-arfi-sas?hs=179"],
	group: false,
};

const english = {
	name: "英文",
	code: ["kxjuhxs"],
	url: ["https://meet.google.com/vfc-cidz-czy"],
	group: false,
};

const math = {
	name: "數學",
	code: ["oiww36n"],
	url: ["https://meet.google.com/kxx-fiwu-hvu"],
	group: false,
};

const sport = {
	name: "體育",
	code: ["xk5iuoh"],
	url: ["https://meet.google.com/bsa-nrrw-cmk"],
	group: false,
};

const social = {
	name: "公民",
	code: ["6wvxmy3"],
	url: ["https://meet.google.com/sbt-yzon-ort"],
	group: false,
};

const computer = {
	name: "計算機原理",
	code: ["oz5onm7"],
	url: ["https://meet.google.com/unn-qdpi-jxn"],
	group: false,
};

const code = {
	name: "硬體介面設計實習(程式設計)",
	code: ["ekqwlis"],
	url: ["https://meet.google.com/ppi-wvjg-jme"],
	group: false,
};

const microp = {
	name: "週邊電路實習(微處理機)",
	code: ["6yq7orm"],
	url: ["https://meet.google.com/rqx-evsd-dpi?authuser=0"],
	group: false,
};

const read = {
	name: "彈性學習",
	code: ["no3kavi"],
	url: ["https://meet.google.com/pcj-cnyx-nkv"],
	group: false,
};

const group = {
	name: "團體活動(班會)",
	code: ["no3kavi"],
	url: ["https://meet.google.com/pcj-cnyx-nkv"],
	group: false,
};

const socialgroup = {
	name: "社團",
	code: ["無"],
	url: ["無"],
	group: false,
};

const practice = {
	name: "實習",
	code: ["4dqs5iy", "ml4tqlv", "未知", "未知"],
	url: [
		"https://meet.google.com/vzr-cobo-poq",
		"https://meet.google.com/ign-xzuj-ggo",
		"未知",
		"未知",
	],
	groups: ["網頁設計", "電腦介面控制", "電器修護", "套裝軟體"],
	group: true,
};

const electricity = {
	name: "介面技術(基本電學)",
	code: ["oyilptt", "wljel3r", "n72praf"],
	url: [
		"https://meet.google.com/ooe-rger-wmp",
		"https://meet.google.com/hfi-wqgb-gqg",
		"https://meet.google.com/yqa-ooen-ypv",
	],
	groups: ["A組", "B組", "C組"],
	group: true,
};

const electronics = {
	name: "感測器電路(電子學)",
	code: ["nd5vzn7", "jrexzt5", "hpqsyt6"],
	url: [
		"https://meet.google.com/lookup/ctoguikpd4",
		"https://meet.google.com/xcc-wqtu-ghc",
		"https://meet.google.com/lookup/bt45vlfb4a",
	],
	groups: ["A組", "B組", "C組"],
	group: true,
};

const c = {
	name: "",
	code: [""],
	url: [""],
	group: false,
};

module.exports = {
	classes: [
		[sport, computer, math, math, c, chinese, english, english, electricity],
		[code, code, code, read, c, computer, math, electricity, electronics],
		[electricity, electricity, english, english, c, electronics, electronics, chinese, math],
		[electronics, practice, practice, practice, c, microp, microp, microp, chinese],
		[chinese, chinese, social, sport, c, math, group, socialgroup, english],
	],
};
