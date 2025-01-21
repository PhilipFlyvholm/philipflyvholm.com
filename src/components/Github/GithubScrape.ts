export function getInfo(username: string, cache: boolean) {
    const cacheKeys = {
      content: `gh_info_content.${username}`,
      expire_at: `gh_info_expire.${username}`,
    };
    if (cache) {
      const currentCacheExpire = localStorage.getItem(cacheKeys.expire_at);
      if (currentCacheExpire && Date.now() < +currentCacheExpire) {
        const content = localStorage.getItem(cacheKeys.content);
        if (content) {
          return Promise.resolve(content);
        }
      }
    }
  
    return fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`)
      .then((r) => r.text())
      .then((body) => {
        if (cache) {
          localStorage.setItem(cacheKeys.content, body);
          localStorage.setItem(
            cacheKeys.expire_at,
            Date.now() + 1000 * 60 * 60 * 24 + ""
          );
        }
        return body;
      });
  }
  function extractNumbers(inputString: string): string[] {
    const regex = /\b\d+\b/g;
    return inputString.match(regex) || [];
  }
  
  function scrapeActivity(container: HTMLElement) {
    const header = container.querySelector("h2");
    const activity = container.querySelector(
      "#user-activity-overview div div div div div"
    );
    if (header && activity) {
      const contributions = extractNumbers(header.innerText)[0];
      const repos = activity.querySelectorAll("a");
      const links: { text: string; href: string }[] = [];
      repos.forEach((element) =>
        links.push({
          text: element.innerText.split("/").pop() || "",
          href: `https://github.com/${element.innerText}`,
        })
      );
      const otherReposRegex = /(\b\d+\b)\s+other\s+repositories/;
      const otherReposMatch = (activity as HTMLElement).innerText.match(
        otherReposRegex
      );
      const numOfotherRepos = otherReposMatch ? otherReposMatch[1] : 0;
      const repoText = links
        .map(({ text, href }) => `<a href="${href}" target="_blank" class="capitalize">${text}</a>`)
        .join(", ");
  
      return `In the past year, I've made <span class="font-bold">${contributions}</span> contributions to various projects. Most recently to ${repoText} and <span class="font-bold">${numOfotherRepos}</span> other repositories`;
    } else {
      return `Github activity`;
    }
  }
  
  function scrapeCalendar(container: HTMLElement) {
    const days = container.querySelectorAll(
      ".ContributionCalendar table.ContributionCalendar-grid .ContributionCalendar-day"
    );
    if (!days) {
      return;
    }
    const cal: { level: number; date: Date }[] = [];
    days.forEach((dayElement) => {
      //get data-level
      const dayElementDiv = dayElement as HTMLElement;
      const level = dayElementDiv.dataset.level;
      if (!level) {
        return;
      }
  
      const date = dayElementDiv.dataset.date;
      if (!date) {
        return;
      }
      cal.push({
        level: +level,
        date: new Date(date),
      });
    });
    //Convert to html
    const calHtml = cal
      .slice(0, 52 * 7)
      .map((day, i) => {
        const y = i % 7;
        const x = i % 52;
        return `<circle class="day" data-level="${
          day.level
        }" data-date="${day.date.toISOString()}" cx="${x + 0.5}" cy="${
          y + 0.5
        }" r=".4"></circle>`;
      })
      .join("\n");
  
    return '<svg viewBox="0 0 52 7">' + calHtml + "</svg>";
  }
  
  export async function getGithub(
    username: string
  ): Promise<{ text: string; calendarHTML: string }> {
    const content = await getInfo(username, true);
    const container = document.createElement("div");
    container.innerHTML = content;
    const activity = scrapeActivity(container);
    const calendar = scrapeCalendar(container);
    return {
      text: activity,
      calendarHTML: calendar || "",
    };
  }