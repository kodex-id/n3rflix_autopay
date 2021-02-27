const puppeteer = require('puppeteer');
const fetch     = require('node-fetch');
const fs = require('fs');
const fsa = require("async-file");
const filemu = "cc.txt";

(async () => {

    await fs.readFile(filemu, async function(err, data) {
        if (err) throw err;
        const array = data
        .toString()
        .replace(/\r/g, "")
        .split('\n')
        
        for(let i = 0; i < array.length; i++){
        const GenerateData = () => new Promise((resolve,reject) =>
            {
                fetch("https://api.randomuser.me/", {
                    'method': 'GET'
                })
                .then(res => res.json())
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
            });
        const empas = array[i].split('|')
        const cc = empas[0]
        const exp = empas[1] + "/" + empas[2].substr(-2, 2)
        const cvv = empas[3]
        const password = 'katasandimu'
        const Resultdata = await GenerateData()
        const first_name = Resultdata.results[0].name.first
        const last_name = Resultdata.results[0].name.last
        const email = Resultdata.results[0].email.replace('example.com', 'domainmu.com')

    const browser = await puppeteer.launch({
        headless:false,
        devtools:false,
    })
    const page = await browser.newPage()
    await page.goto("https://www.netflix.com", {waitUntil: "networkidle2"})
    try {
    await page.waitForSelector("input[type=email]")
    console.log("|- Menginput email " + email + " Done!")
    await page.type("input[type=email]", email, {delay:"15"})
    await page.click("#appMountPoint > div > div > div > div > div > div.our-story-cards > div.our-story-card.hero-card.hero_fuji.vlv > div.our-story-card-text > form > div > div")
    await page.waitForNavigation()
    if(await page.url().indexOf("registration") > -1) {
        await page.click("#appMountPoint > div > div > div.simpleContainer > div > div.submitBtnContainer")
        await page.waitForTimeout(1500)
        console.log("|- Menginput Password ...")
        await page.type("#id_password", password)
        await page.click("#appMountPoint > div > div > div.simpleContainer > div > form > div.submitBtnContainer")
        await page.waitForTimeout(1500)
        if (await page.url().indexOf("signup") > -1) {
            await page.click("#appMountPoint > div > div > div.simpleContainer > div > div.submitBtnContainer")
            await page.waitForTimeout(1500)
            if(await page.url().indexOf("planform") > -1) {
                await page.click("#appMountPoint > div > div > div.simpleContainer > div > div.planFormContainer > div.planGrid.planGrid--has4Plans > div > div > label:nth-child(2)")
                console.log("|- Memilih Plan ...")
                await page.click('button.nf-btn.nf-btn-primary.nf-btn-solid.nf-btn-oversize')
                await page.waitForTimeout(1500)
                if (await page.url().indexOf("payment")) {
                    await page.click("#creditOrDebitCardDisplayStringId")
                    await page.waitForTimeout(1500)
                    if(await page.url().indexOf("creditoption")) {
                        console.log("|- Menginput cc "+cc.slice(12))
                        let accept = 0
                            await page.type("#id_firstName", first_name, {delay:"15"})
                            await page.type("#id_lastName", last_name, {delay:15})
                            await page.type("#id_creditCardNumber", cc)
                            await page.type("#id_creditExpirationMonth", exp, {delay:15})
                            await page.type("#id_creditCardSecurityCode", cvv, {delay: 15})
                            if(accept === 0) {
                                await page.click("#tou-rest-no_trial > div")
                            }
                            accept = accept + 1
                            await page.click("#simplicityPayment-Start")
                            await page.waitForTimeout(5000)
                            if(await page.url().indexOf("orderfinal") > -1) {
                                console.log("|- Sukses Email"+email)
                                await fsa.appendFile("result_sukses.txt", email+"|"+password+"|"+cc+"|"+exp+"|"+cvv+"\n", "utf-8");
                                break
                            } else if(await page.url().indexOf("otpPhoneEntry") > -1) {
                                console.log("otp sob :(")
                                continue
                            } else {
                                console.log("|x Gagal :(\n")
                                await browser.close()
                                continue
                            }
                    }
                }
            }
        }
    } else {
        console.log("|x Gagal Mendaftar :(\n")
        await browser.close()
        continue
    }
} catch (err) {
        console.log("|x Gagal Mendaftar :(\n")
        await browser.close()
        continue}
}})})();
