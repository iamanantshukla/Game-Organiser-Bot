require('dotenv').config();

const User= require('./models/user')
const DB='mongodb+srv://dempressed:qwerty%40123@cluster0.u3woz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const mongoose=require('mongoose')



mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{
            console.log('MONGO CONNECTION OPEN')
        }).catch(err =>{
            console.log(err)
        })



const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', ()=>{
    console.log('User has logged in')
})

client.on('messageCreate', async message => {
    if(message.content==='!left'){
        const name=message.author.username;
        const tuser=await User.findOne({name: name})
        console.log(tuser)
        if(!tuser){
            message.reply('You are not added, use !add function')
        }else{
            const user=await User.updateOne({name: name}, {lastLeft: Date.now()});
            message.reply('You have been added')
        }
    }
    else if(message.content==='!add'){
        const name=message.author.username;

        const tuser=await User.findOne({name: name})
        if(tuser){
            message.reply('You are already added')
        }

        const user=new User({name: name})
        await user.save()
        message.reply(name+' added')
    }
    else if(message.content==='!last'){
        const name=message.author.username;
        const user=await User.findOne({name: name})
        if(!user){
            message.reply('You are not added, use !add function')
        }else{
            const date= new Date(user.toObject().lastLeft)
            const str=date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            message.reply(str)
        }
    }else if(message.content==='!result'){
        const users=await User.find({}).sort({lastLeft: 1});
        var str="";
        for(let i=0;i<users.length && i<2;i++){
            const name = users[i].toObject().name
            str=str+name+"\n";
        }
        message.reply(str)
    }else if(message.content==='!delete'){
        const name=message.author.username;
        const user=await User.deleteOne({name: name})
        message.reply('Successfully Deleted')
    }
});
client.login(process.env.DISCORD_BOT_ID)