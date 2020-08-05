require('dotenv').config()
const express = require('express')
const Discord = require('discord.js');
const client = new Discord.Client();
const bodyParser = require('body-parser')
const Recaptcha = require('express-recaptcha').RecaptchaV2
const RECAPTCHA_SITE_KEY_V2 = process.env.key
const RECAPTCHA_SECRET_KEY_V2 = process.env.secret
const app = express()
const recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY_V2, RECAPTCHA_SECRET_KEY_V2)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', recaptcha.middleware.render, async (req, res) => {
    let guild = client.guilds.cache.get("738863349957263514")
    res.render('index', {post:'/', captcha: res.recaptcha, path:req.path, count: guild.memberCount, url: req.protocol + '://' + req.get('host') + req.originalUrl})
})
app.post('/', recaptcha.middleware.verify, async (req, res) => {
    if (!req.recaptcha.error) {
        let invite = await client.channels.cache.get("738864778289872908").createInvite(
            {
              maxAge: 3600,
              maxUses: 1,
              unique: true
            }
    )
    res.redirect(invite)
    } else {
        res.sendStatus(401)
    }
})
client.once('ready', () => {
    console.log(`DI active as ${client.user.username}`)
})

client.login(process.env.token)
const listener = app.listen(process.env.port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });