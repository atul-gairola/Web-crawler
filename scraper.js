const puppeteer = require("puppeteer");

module.exports = async () => {
  // browser initialization 
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  // Configure the navigation timeout
  page.setDefaultNavigationTimeout(0);

  // Navigate to the assigned url
  await page.goto("https://betalist.com/markets");

  // temporary data container
  const overallData = [];

  // acquiring the links from the industry page
  const industry_data = await page.evaluate(() =>
    [...document.querySelectorAll(".tag--card")].map((cur) => {
      return {
        industryName: cur.innerText,
        industryLink: cur.href,
      };
    })
  );

  // looping through all the links
  for (let i = 0; i < industry_data.length; i++) {
    await page.goto(industry_data[i].industryLink);
    await page.waitFor(1000);

    const industryWiseData = {
      industryName: industry_data[i].industryName,
      data: [],
    };

    // storing the links of all startups for current industry in the loop
    const startup_links = await page.evaluate(() =>
      [...document.querySelectorAll(".startupCard__visual")].map(
        (cur) => cur.href
      )
    );
    
    //looping through all the startup links and storing data of each startup
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

    overallData.push(industryWiseData);
  }
  await browser.close();

  return overallData;
};

