require("dotenv").config(); //載入.env環境檔
const { Capabilities, Builder, By, Key, until } = require("selenium-webdriver"); // 加入虛擬網頁套件
const chrome = require("selenium-webdriver/chrome");
const path = require("path"); //用於處理文件路徑的小工具
const fs = require("fs"); //讀取檔案用
const { CronJob } = require("cron");
const { Table } = require("./table");
const {delay, log} = require("./function")

const table = new Table(process.env.STDID, process.env.STDPWD)

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
		opts.addArguments("enable-logging")
		opts.addArguments("--disable-extensions");
		opts.addArguments("-enable-webgl");
		opts.addArguments("--disable-gpu")
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
			"https://accounts.google.com/signin/v2/identifier?ltmpl=meet&continue=https%3A%2F%2Fmeet.google.com%3Fhs%3D193&&o_ref=https%3A%2F%2Fwww.google.com%2F&_ga=2.155881595.1533375318.1653442791-696588692.1653442791&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
		);

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

		await delay(5000);

		async function joinMeet(url) {
			try {
				await driver.get(url);
				await delay(7000);
				await driver
					.wait(
						until.elementLocated(
							By.xpath(
								'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]/div/div/div[1]'
							)
						),
						5000
					)
					.click();
				await driver
					.wait(
						until.elementLocated(
							By.xpath(
								'//\*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]/div/div[1]'
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
			} catch (err) {
				return driver.get(url);
			}
		}

		async function test() {
			const class_ = await table.getClass(2,3);
			await log(`加入課程: ${class_.name}`);
			await joinMeet(class_.online.url);
			await log("加入完成");
		}

		test();

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

openCrawlerWeb(); //打開爬蟲網頁
