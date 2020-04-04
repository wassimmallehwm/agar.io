const io = require('../server').io;
const checkForOrbCollisions = require('./checkCollision').checkForOrbCollisions
const checkForPlayerCollisions = require('./checkCollision').checkForPlayerCollisions

//=========CLASSES==========
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
//=======END CLASSES=========

let orbs = [];
let players = [];
let settings = {
    defaultOrbs :50,
    defaultSpeed : 8,
    defaultSize : 6,
    defaultZoom : 1.5,
    worldWidth : 400,
    worldHeight : 400
}
initGame();


//send message to every connected socket 30 fps
setInterval(() => {
    if(players.length > 0){
        io.to('game').emit('tock', {
            players
        });
    }
}, 33)

io.sockets.on('connect', (socket) => {
    let player = {};

    socket.on('init', (data) => {

        socket.join('game');

        let playerConfig = new PlayerConfig(settings);
        let playerData = new PlayerData(settings, data.playerName);
        player = new Player(socket.id, playerConfig, playerData);
        players.push(playerData);

        //send message to this client 30 fps
        setInterval(() => {
            socket.emit('ticktock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            });
        }, 33)

        socket.emit('initReturn', {orbs});
    })


    socket.on('tick', (data) => {
        speed = player.playerConfig.speed
        xV = player.playerConfig.xVector = data.xVector;
        yV = player.playerConfig.yVector = data.yVector;

        if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)) {
            player.playerData.locY -= speed * yV;
        } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)) {
            player.playerData.locX += speed * xV;
        } else {
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        let capturedOrb = checkForOrbCollisions(
            player.playerData,
            player.playerConfig,
            orbs,
            settings
        );
        capturedOrb.then((data) => {
            //Orbs collision

            const orbData = {
                orbIndex : data,
                newOrb: orbs[data]
            }

            //change leader board
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            io.sockets.emit('orbSwitch', orbData);
        }).catch(() => {
            // no collision
        })

        //Plzyer Collision
        let playerDeath = checkForPlayerCollisions(
            player.playerData,
            player.playerConfig,
            players,
            player.id
        );
        playerDeath.then((data) => {
            //change leader board
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            // a player was absorbed
            io.sockets.emit('playerDeath', data);
        }).catch(() => {
            //no collision
        })

    })

    socket.on('disconnect', () => {
        if(player.playerData){
            players.forEach((curPlayer, i) => {
                if(curPlayer.uid == player.playerData.uid){
                    players.splice(i, 1);
                }
            })
        }
    })

    
})

function getLeaderBoard(){
    //Sort players
    players.sort((a, b) => {
        return b.score - a.score;
    })
    let leaderBoard = players.map((curPlayer) => {
        return {
            name : curPlayer.name,
            score : curPlayer.score    
        }
    })
    return leaderBoard;
}

function initGame(){

    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings))
    }

}






module.exports = io