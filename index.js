require("dotenv").config(); //載入.env環境檔
const { Builder, By, Key, until } = require("selenium-webdriver"); // 加入虛擬網頁套件
const chrome = require("selenium-webdriver/chrome");
const path = require("path"); //用於處理文件路徑的小工具
const fs = require("fs"); //讀取檔案用
const { CronJob } = require("cron")
const { classes } = require("./classes");

function delay(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function checkDriver() {
	try {
		chrome.getDefaultService(); //確認是否有預設
	} catch {
		console.warn("找不到預設driver!");

		//'./chromedriver.exe'記得調整成自己的路徑
		const file_path = "./chromedriver.exe";
		//請確認印出來日誌中的位置是否與你路徑相同
		console.log(path.join(__dirname, file_path));

		//確認路徑下chromedriver.exe是否存在
		if (fs.existsSync(path.join(__dirname, file_path))) {
			//設定driver路徑
			const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build();
			chrome.setDefaultService(service);
			console.log("設定driver路徑");
		} else {
			console.error("無法設定driver路徑");
			return false;
		}
	}
	return true;
}

async function openCrawlerWeb() {
	if (!checkDriver()) {
		// 檢查Driver是否是設定，如果無法設定就結束程式
		return;
	}

	let opts = new chrome.Options();
	opts.addArguments("start-maximized");
	opts.addArguments("--disable-extensions");
    opts.addArguments("-enable-webgl")
    opts.addArguments("--no-sandbox")
    opts.addArguments("--disable-dev-shm-usage")
	opts.setUserPreferences({
		"profile.default_content_setting_values.media_stream_mic": 1,
		"profile.default_content_setting_values.media_stream_camera": 1,
		"profile.default_content_setting_values.geolocation": 1,
		"profile.default_content_setting_values.notifications": 1,
	});

	// 建立這個broswer的類型
	let driver = await new Builder().forBrowser("chrome").setChromeOptions(opts).build();

	driver.get("https://accounts.google.com/signin/v2/identifier?ltmpl=meet&continue=https%3A%2F%2Fmeet.google.com%3Fhs%3D193&&o_ref=https%3A%2F%2Fwww.google.com%2F&_ga=2.155881595.1533375318.1653442791-696588692.1653442791&flowName=GlifWebSignIn&flowEntry=ServiceLogin"); //透國這個driver打開網頁

	await driver
		.wait(until.elementLocated(By.id("identifierId"), 5000))
		.sendKeys(process.env.ACCOUNT);
	await driver
		.wait(until.elementLocated(By.xpath('//\*[@id="identifierNext"]/div/button')))
		.click();
	await delay(2000);
	await driver
		.wait(until.elementLocated(By.xpath('//\*[@id="password"]/div[1]/div/div[1]/input'), 5000))
		.sendKeys(process.env.PASSWD);
	await driver.wait(until.elementLocated(By.xpath('//\*[@id="passwordNext"]/div/button'))).click();

	await delay(5000);

	async function joinMeet(url) {
		await driver.get(url);
		await delay(10000);
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]/div/div/div[1]'
					)
				),
				10000
			)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]/div/div[1]'
					)
				),
				10000
			)
			.click();

        await delay(2000)

		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]/button'
					)
				),
				10000
			)
			.click();
	}

	async function test() {
		await log("加入課程: 早修");
        await joinMeet("https://meet.google.com/pcj-cnyx-nkv")
		await log("加入完成");
	}

	const morning = new CronJob("0 10 8 * * 1-5", async () => {
		await log("加入課程: 早修");
        await joinMeet("https://meet.google.com/pcj-cnyx-nkv")
		await log("課程:早修 加入完成");
    });
    morning.start();

    let jobs = [];
	for (let i = 8; i <= 16; i++) {
		if (i === 12) continue;
		//* 23 ${i} * * 1-5
		const job = new CronJob(`0 20 ${i} * * 1-5`, async () => {
            const clase = classes[new Date().getDay() - 1][i - 8];
			await log(`加入課程: ${clase.name}`);
        	await joinMeet(clase.url[0]);
			await log("加入完成");
        })
        job.start();
		jobs.push(job);
    }
}

function log(str){
	const date = new Date()
	const Y = date.getFullYear().toString().padStart(4, "0")
	const M = date.getMonth().toString().padStart(2, "0")
	const D = date.getDate().toString().padStart(2, "0")
	const h = date.getHours().toString().padStart(2, "0")
	const m = date.getMinutes().toString().padStart(2, "0")
	const s = date.getSeconds().toString().padStart(2, "0")
	const time = `${Y}-${M}-${D}T${h}:${m}:${s}`
	console.log(`%c${time} | `+`${str}`, "color:#91ddff")
}
openCrawlerWeb(); //打開爬蟲網頁
