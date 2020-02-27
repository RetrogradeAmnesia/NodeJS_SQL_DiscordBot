const request = require('request');
const fetch = require('node-fetch');

module.exports = {
    name: 'reddit',
    description: 'Pull some reddit posts!',
    execute(message, args) {
      
      function GetRandomNumber(min, max) {
        return Math.floor(min + Math.random()*(max + 1 - min))
      }
      function random_item(items){
        return items[Math.floor(Math.random()*items.length)];
      }

      var SubredditArray = [
        "AskReddit",
        "politics",
        "The_Donald",
        "worldnews",
        "nba",
        "videos",
        "funny",
        "todayilearned",
        "soccer",
        "CFB",
        "pics",
        "gaming",
        "movies",
        "news",
        "gifs",
        "nfl",
        "BlackPeopleTwitter",
        "mildlyinteresting",
        "leagueoflegends",
        "aww",
        "WTF",
        "Showerthoughts",
        "relationships",
        "me_irl",
        "technology",
        "dankmemes",
        "DestinyTheGame",
        "Overwatch",
        "television",
        "hockey",
        "Bitcoin",
        "Jokes",
        "MMA",
        "SquaredCircle",
        "marvelstudios",
        "interestingasfuck",
        "Games",
        "science",
        "PrequelMemes",
        "conspiracy",
        "AdviceAnimals",
        "fantasyfootball",
        "gonewild",
        "wow",
        "OldSchoolCool",
        "Tinder",
        "pcmasterrace",
        "europe",
        "sports",
        "trashy",
        "PoliticalHumor",
        "IAmA",
        "DotA2",
        "NintendoSwitch",
        "hiphopheads",
        "Rainbow6",
        "StarWarsBattlefront",
        "GlobalOffensive",
        "FireEmblemHeroes",
        "Unexpected",
        "dbz",
        "2007scape",
        "NatureIsFuckingLit",
        "oddlysatisfying",
        "iamverysmart",
        "niceguys",
        "ChapoTrapHouse",
        "legaladvice",
        "CrappyDesign",
        "arrow",
        "Android",
        "Documentaries",
        "anime",
        "MurderedByWords",
        "PUBATTLEGROUNDS",
        "hmmm",
        "4chan",
        "LivestreamFail",
        "rupaulsdragrace",
        "MovieDetails",
        "trees",
        "TwoXChromosomes",
        "WWII",
        "JusticeServed",
        "explainlikeimfive",
        "ComedyCemetery",
        "personalfinance",
        "MrRobot",
        "ProgrammerHumor",
        "books",
        "insanepeoplefacebook",
        "mildlyinfuriatingrterpacks",
        "canada",
        "LateStageCapitalism",
        "therewasanattempt",
        "MaliciousCompliance",
        "reactiongifs",
        "tumblr",
        "tifu",
        "FlashTV",
        "woahdude",
        "Cricket",
        "KotakuInAction",
        "Futurology",
        "NSFW_GIF",
        "Sneakers",
        "blackpeoplegifs",
        "RoastMe",
        "HighQualityGifs",
        "facepalm",
        "freefolk",
        "justneckbeardthings",
        "CatastrophicFailure",
        "Damnthatsinteresting",
        "electronics",
        "instant_regret",
        "InternetIsBeautiful",
        "PowerShell",
        "sysadmin",
        "justfuckmyshitup",
        "wellthatsucks",
        "instantkarma",
        "LifeProTips",
        "WatchPeopleDieInside",
        "Whatcouldgowrong",
        "Funny",
        "space",
        "ShittyLifeProTips",
        "mildlyinfuriating",
        "assholedesign",
        "iamverybadass",
        "yesyesyesyesno",
        "Crappydesign",
        "cursedimages"
      ];
      var RandomSubReddit = random_item(SubredditArray)
    
      // Check if request is to be from SubredditArray (if no arguments provided)
      // else, run request against arg[0] which is the subreddit to be requested
      let selectedsubreddit = args[0];
        function reddit_dataconfirm() {
        var RandomSubReddit = random_item(SubredditArray)
          if ( typeof args[0] !== 'undefined' && args[0] ){
          //do stuff if args[0] is defined and not null
          subreddit = `${args}`
          }
          else{
          // if null
          subreddit = `${RandomSubReddit}`
          }
          return subreddit
        }
        var valueout = reddit_dataconfirm();
    
      fetch(`https://api.reddit.com/r/${valueout}/.json?limit=100`)
        .then(response => response.json())
        .then(response => {
        do {
          var NumberSelected = GetRandomNumber(1,100)
          var titlelengthvalue = response.data.children[NumberSelected].data.title.length
          var selftext = response.data.children[NumberSelected].data.selftext.length
          // console.log(titlelengthvalue)
        }
        while(titlelengthvalue > 256 && selftext > 2048 )
    
        datapull = response.data.children[NumberSelected].data
        var subreddit = datapull.subreddit
        var selftext = datapull.selftext
        var title = datapull.title
        var author = datapull.author
        var score = datapull.score
        var url = datapull.url
        var subreddit_name_prefixed = datapull.subreddit_name_prefixed
        var permalink = 'https://reddit.com' + datapull.permalink
        var num_comments = datapull.num_comments
    
        var RedditPullData = {
        "embed": {
          "title": title,
          "description": selftext,
          "color": 16598528,
          "footer": {
          "icon_url": `http://icons.iconarchive.com/icons/uiconstock/socialmedia/256/Reddit-icon.png`,
          "text": "Random Reddit-Pull"
          },
          "image": {
          "url": datapull.url
          },
          "fields": [
          {
            "name": "SubReddit",
            "value": subreddit_name_prefixed,
            "inline": true
          },
          {
            "name": "Post Author",
            "value": "r/" + author,
            "inline": true
          },
          {
            "name": "Upvote Score",
            "value": score,
            "inline": true
          },
          {
            "name": "Number of Comments",
            "value": num_comments,
            "inline": true
          },
          {
            "name": "Post URL",
            "value": 'https://reddit.com' + datapull.permalink,
            "inline": true
          }
          ]
        }
        };
        message.channel.send(RedditPullData);
      });
    
       
    },
};