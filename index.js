//Script to get Hypixel SkyWars Statistics of a set of players and total them all up.
//Written by KAD7
//Forum thread: https://hypixel.net/threads/forum-communitys-skywars-statistics.872767/

//Dependencies
const request = require('node-superfetch');
const players = require("./players.json"); //remove domer, px, Kqwqii, GamerTrollMonky7

var errPlayers = [], c = 0, names = [];

//Total SkyWars stats
var kills = 0, deaths = 0, assists = 0, wins = 0, losses = 0, survived_players = 0, chests_opened = 0, eggs_thrown = 0, enderpearls_thrown = 0;
var arrows_shot = 0, arrows_hit = 0, blocks_broken = 0, blocks_placed = 0, items_enchanted = 0, experience = 0, coins = 0, souls_gathered = 0, cosmetic_tokens = 0;


async function getSkyWarsStats(uuid){
  try{
      const { body } = await request.get(`https://api.hypixel.net/player?key=[redacted]&uuid=${uuid}`);
      if(body.player == null){
          return "no stats";
      }
      else{
        var skywarsStats = body.player.stats.SkyWars;
        names.push(body.player.displayname);
        return skywarsStats;
      }
  }catch(e){
      return;
  }
}

function printTotals(){
    //Formatting
    var kd = kills / deaths;
    var wl = wins / losses;
    var hm = arrows_hit / arrows_shot;
    var level = Math.floor((experience - 15000) / 10000 + 12);
    var line1 = `Total Kills: ${kills.toLocaleString('en')}\nTotal Assists: ${assists.toLocaleString('en')}\nTotal Deaths: ${deaths.toLocaleString('en')}\nKill/Death Ratio: ${kd}\nTotal Wins: ${wins.toLocaleString('en')}\nTotal Losses: ${losses.toLocaleString('en')}\nWin/Loss Ratio: ${wl}\nTotal Survived Players: ${survived_players.toLocaleString('en')}\n\n`;
    var line2 = `Total Blocks Broken: ${blocks_broken.toLocaleString('en')}\nTotal Blocks Placed: ${blocks_placed.toLocaleString('en')}\nTotal Souls Gathered: ${souls_gathered.toLocaleString('en')}\nTotal Eggs Thrown: ${eggs_thrown.toLocaleString('en')}\nTotal Enderpearls Thrown: ${enderpearls_thrown.toLocaleString('en')}\nTotal Chest Opened: ${chests_opened.toLocaleString('en')}\nTotal Items Enchanted: ${items_enchanted.toLocaleString('en')}\n\n`;
    var line3 = `Total Arrows Shot: ${arrows_shot.toLocaleString('en')}\nTotal Arrows Hit: ${arrows_hit.toLocaleString('en')}\nArrow Hit/Miss Ratio: ${hm}\n\n`
    var line4 = `Collective SkyWars Level: ${level.toLocaleString('en')}\nTotal SkyWars Experience: ${experience.toLocaleString('en')}\nTotal Coins: ${coins.toLocaleString('en')}\nTotal Cosmetic Tokens: ${cosmetic_tokens.toLocaleString('en')}\n`
    
    //Printing
    console.log(line1 + line2 + line3 + line4 + "\n\nTotal players: " + players.length + "\n\nCould not retrieve stats for following players:\n" + errPlayers.join("\n"));
    console.log("\n============Names============");
    console.log(names.join("\n"));
}

var sumStats = setInterval(async function(){
    if(c > players.length - 1){
      await printTotals();
      clearInterval(sumStats);
    }
    else{
        console.log(`Processed[${c + 1}]: ${players[c]}`);
        var swStats = await getSkyWarsStats(players[c]);
        if(swStats == 'no stats' || !swStats || !swStats.kills){
            errPlayers.push(players[c]);
        }
        else{
            assists += !swStats.assists ? 0 : swStats.assists;
            wins += !swStats.wins ? 0 : swStats.wins;
            enderpearls_thrown += !swStats.enderpearls_thrown ? 0 : swStats.enderpearls_thrown;
            items_enchanted += !swStats.items_enchanted ? 0 : swStats.items_enchanted;
            experience += !swStats.skywars_experience ? 0 : swStats.skywars_experience;
            cosmetic_tokens += !swStats.cosmetic_tokens ? 0 : swStats.cosmetic_tokens;
            kills += swStats.kills;
            deaths += swStats.deaths;
            losses += swStats.losses;
            survived_players += swStats.survived_players;
            chests_opened += !swStats.chests_opened ? 0 : swStats.chests_opened;
            eggs_thrown += swStats.egg_thrown;
            arrows_shot += swStats.arrows_shot;
            arrows_hit += swStats.arrows_hit;
            blocks_broken += swStats.blocks_broken;
            blocks_placed += swStats.blocks_placed;
            coins += swStats.coins;
            souls_gathered += swStats.souls_gathered;       
        }  
        c++;
    }   
}, 1000);


