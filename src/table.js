const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const { log } = require("./function");

class Table {
    url = "http://libauto.mingdao.edu.tw/AACourses/Web/wLogin.php";
    cookie;

    constructor (stdID, stdPWD){
        this.stdID = stdID
        this.stdPWD = stdPWD
    }

    async getCookie(){
        try {
            log("開始抓取cookie...");
            const res = await axios({
                responseType: "arraybuffer",
                method: "get",
                url: this.url,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47",
                },
                transformResponse: [
                    (data) => {
                        return iconv.decode(Buffer.from(data), "big5");
                    },
                ],
            });
            const returnCookie = await res.headers["set-cookie"][0];
            this.cookie = returnCookie.slice(0, 36);
            log("cookie抓取完成!");
            return this.cookie;
        } catch (err) {
            log(err);
            return;
        }
    }

    async getHtml() {
        try {
            await this.getCookie();
            log("開始抓取課表資訊...");
            const res = await axios({
                responseType: "arraybuffer",
                method: "post",
                url: this.url,
                headers: {
                    "Cookie": this.cookie,
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47",
                },
                data: `sureReg=YES&goURL=&accessWay=ACCOUNT&HTTP_REFERER=http%3A%2F%2Flibauto.mingdao.edu.tw%2FAACourses%2FWeb%2FqWTT.php&wRole=STD&stdID=${encodeURI(
                    this.stdID
                )}&stdPWD=${encodeURI(this.stdPWD)}&uRFID=&Submit=%BDT%A9w%B5n%A4J`,
                transformResponse: [
                    (data) => {
                        return iconv.decode(Buffer.from(data), "big5");
                    },
                ],
            });
            this.html = res.data;
            log("課表資訊抓取完畢!");
            return this.html;
        } catch (err) {
            log(err);
            return;
        }
    }

    async getClass(day, period) {
        try {
            await this.getHtml();
            const $ = cheerio.load(`${this.html}`)
            const location = "table tbody tr td span div div.";
            const f_sPeriodsem = $(`#F_sPeriodsem option:selected`).val()
            const online = await this.getOnline(day,period, f_sPeriodsem);
            //F_行_列(start=1)
            const class_ = {
                name: $(`#F_${day}_${period} ${location}subj`).text(),
                teacher: $(`#F_${day}_${period} ${location}tea`).text(),
                online:online
            }
            return class_;
        } catch (err) {
            log(err);
            return;
        }
    }

    async getOnline(day, period, f_sPeriodsem) {
        try {
            const $ = cheerio.load(`${this.html}`)
            log(`開始抓取線上會議連結... (星期: ${day}, 節數: ${period})`);
            const id = $(`#F_${day}_${period}_P div img`).attr("id").slice(6);
            const res = await axios({
                method: "get",
                url: `http://libauto.mingdao.edu.tw/AACourses/Web/qVT.php?F_sPeriodsem=${f_sPeriodsem}&eID=${id}`,
                headers: {
                    "Cookie": this.cookie,
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47",
                },
                transformResponse: [
                    (data) => {
                        return iconv.decode(Buffer.from(data), "big5");
                    },
                ],
            });

            const form = cheerio.load(res.data);
            const online = form(`#main div.vtC`).text().trim().split(/ +/);
            const url = online[0];
            const code = online[1];
            log(`線上會議連結抓取完畢!`);
            return { url: url, code: code };
        } catch (err) {
            log(err);
            return;
        }
    }
}

module.exports = {
    Table:Table
}