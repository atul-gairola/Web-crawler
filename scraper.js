const puppeteer = require("puppeteer");
const DataModel = require("./db");

( async () => {
  // browser initialization 
  const browser = await puppeteer.launch({
      headless: false,
      userDataDir: './cache',
    });
  const page = await browser.newPage();
  
  // Configure the navigation timeout
  page.setDefaultNavigationTimeout(0);

  // Navigate to the assigned url
  await page.goto("https://betalist.com/markets");

  // acquiring the links from the industry page
  const industry_data = await page.evaluate(() =>
    [...document.querySelectorAll(".tag--card")].map((cur) => {
      return {
        industryName: cur.innerText,
        industryLink: cur.href,
      };
    })
  );

  // looping through all the industry links
  for (let i = 0; i < industry_data.length; i++) {
    await page.goto(industry_data[i].industryLink);
    await page.waitFor(1000);

    // storing the links of all startups for current industry in the loop
    const startup_links = await page.evaluate(() =>
      [...document.querySelectorAll(".startupCard__visual")].map(
        (cur) => cur.href
      )
    );
    
    //looping through all the startup links and storing data of each startup
    for (let j = 0; j < startup_links.length; j++) {

      await page.goto(startup_links[j], { waitUntil: 'networkidle2' });
            
      // scraping data
      const startupData = await page.evaluate(() => {
        
        // dom elements to be scraped
        const DOM = {
        DOMName: document.querySelector(".startup__summary__name"),
        DOMPitch: document.querySelector(".startup__summary__pitch"),
        DOMDescription: document.querySelector(".startup__description"),
        DOMSiteLink: document.querySelector(".button2--contrast"),
        DOMMakers: [...document.querySelectorAll(".maker__details")]
        }
        
        return {  
          name: (DOM.DOMName) ? DOM.DOMName.innerText : null,
          pitch: (DOM.DOMPitch) ? DOM.DOMPitch.innerText : null,
          description: (DOM.DOMDescription) ? DOM.DOMDescription.innerText : null,
          siteLink: (DOM.DOMSiteLink) ? DOM.DOMSiteLink.href : null,
          makers: (DOM.DOMMakers.length > 0) ? DOM.DOMMakers.map(
            (cur) => cur.innerText
          ) : null,
        };
      });

      const startupDataCategorized = {
        industryName: industry_data[i].industryName,  
        startupData
      }

    //  console.log(startupData);  to check the data being saved

    //  saving data to mongoDB 
      const doc = new DataModel(startupDataCategorized);
      doc.save((err) => {
           if(err)
           console.log(err);
           else(err)
           console.log('doc added');
         }) 

    }

  }
  await browser.close();

})();

