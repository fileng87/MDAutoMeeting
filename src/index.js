require("dotenv").config(); //載入.env環境檔
const { Capabilities, Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path"); 
const fs = require("fs");
const { CronJob } = require("cron");
const { Table } = require("./table");
const { delay, log } = require("./function")

const table = new Table(process.env.STDID, process.env.STDPWD)

function checkDriver() {
	try {
		chrome.getDefaultService();
	} catch {
		console.warn("找不到預設driver!");

		const file_path = "./chromedriver.exe";
		console.log(path.join(__dirname, file_path));

		if (fs.existsSync(path.join(__dirname, file_path))) {
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
			return;
		}

		let opts = new chrome.Options();
		opts.addArguments("start-maximized");
		opts.addArguments("--disable-extensions");
		opts.addArguments("-enable-webgl");
		opts.addArguments("--disable-gpu")
		opts.excludeSwitches("enable-logging")
		opts.setUserPreferences({
			"profile.default_content_setting_values.media_stream_mic": 1,
			"profile.default_content_setting_values.media_stream_camera": 1,
			"profile.default_content_setting_values.geolocation": 1,
			"profile.default_content_setting_values.notifications": 1,
		});

		let driver = await new Builder().forBrowser("chrome")
			.setChromeOptions(opts).build();
		try {
		driver.get(
			"https://accounts.google.com/signin/v2/identifier?hl=zh-tw&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
		);
		
		log("開始後會根據時間自動加入會議")
		log("開始登入Google帳號...")
		await driver
			.wait(until.elementLocated(By.id("identifierId"), 5000))
			.sendKeys(process.env.ACCOUNT);
		await driver
			.wait(until.elementLocated(By.xpath('//\*[@id="identifierNext"]/div/button')))
			.click();
		await delay(2000);
		await driver
			.wait(
				until.elementLocated(By.xpath('//\*[@id="password"]/div[1]/div/div[1]/input'), 5000)
			)
			.sendKeys(process.env.PASSWD);
		await driver
			.wait(until.elementLocated(By.xpath('//\*[@id="passwordNext"]/div/button')))
			.click();
		log("Google帳號登入完成!")
		log("會議開始前請勿關閉視窗...")

		await delay(5000);

		const nowClass = getClass();
		if(nowClass != 0){
			const class_ = await table.getClass(new Date().getDay(),nowClass);
			await log(`加入課程: ${class_.name}`);
			await joinMeet(class_.online.url);
			await log("加入完成");
		}

		async function joinMeet(url) {
			try {
				log("開始加入線上會議...")
				await driver.get(url+"?authuser=0");
				await delay(7000);
				await driver
					.wait(
						until.elementLocated(
							By.xpath(
								'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]'
							)
						),
						5000
					)
					.click();
				await driver
					.wait(
						until.elementLocated(
							By.xpath(
								'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]'
							)
						),
						5000
					)
					.click();

				await delay(2000);

				await driver
					.wait(
						until.elementLocated(
							By.xpath(
								'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]/button'
							)
						),
						5000
					)
					.click();
				log("線上會議加入完成...")
			} catch (err) {
				log(err)
				return joinMeet(url);
			}
		}

		const morning = new CronJob("0 10 8 * * 1-5", async () => {
			await log("加入課程: 早修");
			await joinMeet(process.env.MORNING);
			await log("課程:早修 加入完成");
		});
		morning.start();

		let jobs = [];
		for (let i = 8; i <= 15; i++) {
			if (i === 12) continue;
			let job;
			if(i > 12){
				job = new CronJob(`0 20 ${i} * * 1-5`, async () => {
					const clase = await table.getClass(new Date().getDay(),i - 8);
					await log(`加入課程: ${clase.name}`);
					await joinMeet(clase.online.url);
					await log("加入完成");
				});
				continue;
			}
			//* 23 ${i} * * 1-5
			job = new CronJob(`0 20 ${i} * * 1-5`, async () => {
				const clase = await table.getClass(new Date().getDay(),i - 7);
				await log(`加入課程: ${clase.name}`);
				await joinMeet(clase.online.url);
				await log("加入完成");
			});
			job.start();
			jobs.push(job);
		}
	} catch (err) {
		driver.quit();
		return log(err);
	}
}

function getClass(){
	const date = new Date();
	const h = date.getHours();
	const m = date.getMinutes();
	const nowTime = getMinute(h, m);
	let nowClass = 0;
	for(let i=8;i<16;i++){
		if(i==12) continue;

		nowClass++;
		if(i==11||i==16){
			if(getMinute(i, 25)<nowTime&&nowTime<getMinute(i+1, 10)){
				return nowClass;
			}
		} else if(getMinute(i, 25)<nowTime&&nowTime<getMinute(i+1, 15)){
			return nowClass;
		}
	}

	return 0;
}

function getMinute(h, m){
	return h*60+m;
}

openCrawlerWeb();
