// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-work-amp-life",
          title: "Work &amp; Life",
          description: "Work hard, play harder 🤓",
          section: "Navigation",
          handler: () => {
            window.location.href = "/work_life/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Publications in reversed chronological order. Feel free to find the PDF version of some papers as they abide with publishers&#39; copyright rules.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "$${\LARGE \textit{vita brevis, ars longa}}$$",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-family",
          title: "Family",
          description: "$${\Large \textit{Love always protects, always trusts, always hopes, always perseveres.}}$$",
          section: "Navigation",
          handler: () => {
            window.location.href = "/family/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
      
        title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
      section: "Posts",
      handler: () => {
        
          window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
        
      },
    },{id: "post-displaying-external-posts-on-your-al-folio-blog",
      
        title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
        
      },
    },{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-chuqi-photography",
          title: 'Chuqi Photography',
          description: "Some stupid but funny photos for my beloved cat, Chuqi",
          section: "Projects",handler: () => {
              window.location.href = "/projects/chuqi_photography/";
            },},{id: "projects-cuisine-recipes",
          title: 'Cuisine Recipes',
          description: "Self-scribed secret recipes for both authentic Chinese and Western cuisines",
          section: "Projects",handler: () => {
              window.location.href = "/cuisine_recipes";
            },},{id: "projects-cuisine-recipes",
          title: 'Cuisine Recipes',
          description: "Self-scribed secret recipes for both authentic Chinese and Western cuisines",
          section: "Projects",handler: () => {
              window.location.href = "/cuisine_recipes_zh";
            },},{id: "projects-electric-gas-heat-coordination",
          title: 'Electric-Gas-Heat Coordination',
          description: "Energy hub scheduling with multiple energy networks",
          section: "Projects",handler: () => {
              window.location.href = "/projects/electric_gas_heat_coordination/";
            },},{id: "projects-midas-scheduling",
          title: 'MIDAS-Scheduling',
          description: "Open-source codebase for scheduling in Python",
          section: "Projects",handler: () => {
              window.location.href = "/projects/midas_scheduling/";
            },},{id: "projects-solver-tuning-for-beginners",
          title: 'Solver Tuning for Beginners',
          description: "Beginner&#39;s guide on how to effectively make your optimization solver a pro",
          section: "Projects",handler: () => {
              window.location.href = "/projects/solver_tuning_for_beginners/";
            },},{id: "projects-solver-tuning-for-beginners",
          title: 'Solver Tuning for Beginners',
          description: "Beginner&#39;s guide on how to effectively make your optimization solver a pro",
          section: "Projects",handler: () => {
              window.location.href = "/work_life/solver";
            },},{id: "projects-solver-tuning-for-beginners",
          title: 'Solver Tuning for Beginners',
          description: "Beginner&#39;s guide on how to effectively make your optimization solver a pro",
          section: "Projects",handler: () => {
              window.location.href = "/projects/solver_tuning_for_beginners_save/";
            },},{id: "projects-unit-startup-shutdown-prediction",
          title: 'Unit Startup/Shutdown Prediction',
          description: "Use ML/DL for generation apparatus modeling",
          section: "Projects",handler: () => {
              window.location.href = "/projects/unit_startup_shutdown_prediction/";
            },},{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=gMaOSxgAAAAJ", "_blank");
        },
      },{
        id: 'social-ieee',
        title: 'IEEE Xplore',
        section: 'Socials',
        handler: () => {
          window.open("https://ieeexplore.ieee.org/author/37086397759/", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%62%69%73%74%6F%75%72%79%30%30%37@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/gabrieledogawa", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/shengfei-yin", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0001-6108-3813", "_blank");
        },
      },{
        id: 'social-telegram',
        title: 'telegram',
        section: 'Socials',
        handler: () => {
          window.open("https://telegram.me/GabrielYin", "_blank");
        },
      },{
        id: 'social-semanticscholar',
        title: 'Semantic Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://www.semanticscholar.org/author/Shengfei-Yin/50880941", "_blank");
        },
      },{
        id: 'social-publons',
        title: 'Publons',
        section: 'Socials',
        handler: () => {
          window.open("https://publons.com/a/ACI-6878-2022/", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Shengfei-Yin/", "_blank");
        },
      },{
        id: 'social-MyWorld',
        title: 'Myworld',
        section: 'Socials',
        handler: () => {
          window.open("https://www.gabriel-yin.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
