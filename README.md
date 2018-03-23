# lookup-slack-bot

This is the slack bot that responds to the `/lookup` commands in Twilio's slack instance.

## architecture

+----------------------+                   +---------------------------+
|                      |                   |                           |
|                      +-----------------> |     Twilio Function       |
|      Slack Bot/App   |                   |                           |
|   (runs in Slack]    |                   |        (function.js)      |
|                      | <---------------+ |                           |
+----------------------+                   +---------------------------+

## Slack Bot Setup

(Currently, Twilio internal only). 
https://api.slack.com/apps/A64CF5C5P/general?

### Setup

1. Set Features -> Interactive Components -> Request URL to your Twilio function URL
2. Create Features -> Slash Command (ex. `/lookup`). Set it's request URL to the Twilio function URL 

### Ideas

- [ ] Todo : Make the slack bot public and allow users to link it with their own hosted Twilio function or Twilio account. 


## Twilio Function Setup

Currently, runs in @devarshi 's Twilio account.

### Setup

1. Setup a function with the code in function.js
2. Turn off signature validation
3. Enable ACCOUNT_SID and AUTH_TOKEN here : https://www.twilio.com/console/runtime/functions/configure
4. Add LOOKUP_SLACKBOT_TOKEN env variable here : https://www.twilio.com/console/runtime/functions/configure . Set it to the Verification Token from your Slackbot's Settings -> Basic Information -> App Credentials -> Verification Token

5. If you want to use it with the Add-ons, make sure those Add-ons are installed in your Twilio account.

