const PlayerConfig = require('./PlayerConfig');
const PlayerData = require('./PlayerData');

class Player {

    constructor(id, playerConfig, playerData){
        this.id = id;
        this.playerConfig = playerConfig;
        this.playerData = playerData;
    }
}

module.exports = Player;