const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://betalist.com/markets");

  const overallData = [];

  const industry_data = await page.evaluate(() =>
    [...document.querySelectorAll(".tag--card")].map((cur) => {
      return {
        industryName: cur.innerText,
        industryLink: cur.href,
      };
    })
  );

  for (let i = 0; i < industry_data.length; i++) {
    await page.goto(industry_data[i].industryLink);
    await page.waitFor(1000);

    const industryWiseData = {
      industryName: industry_data[i].industryName,
      data: [],
    };

    const startup_links = await page.evaluate(() =>
      [...document.querySelectorAll(".startupCard__visual")].map(
        (cur) => cur.href
      )
    );

    for (let j = 0; j < startup_links.length; j++) {
      await page.goto(startup_links[j]);
      await page.waitFor(1000);
      const eachData = await page.evaluate(() => {
        return {
          name: document.querySelector(".startup__summary__name").innerText,
          pitch: document.querySelector(".startup__summary__pitch").innerText,
          description: document.querySelector(".startup__description")
            .innerText,
          siteLink: document.querySelector(".button2--contrast").href,
          makers: [...document.querySelectorAll(".maker__details")].map(
            (cur) => cur.innerText
          ),
        };
      });

      industryWiseData.data.push(eachData);
    }

    console.log(industryWiseData);

    overallData.push(industryWiseData);
  }
  await browser.close();
})();
