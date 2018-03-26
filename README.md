# lookup-slack-bot

This is the slack bot that responds to the `/lookup` commands in your Slack instance.
You can try a publically available [Lookup](https://www.twilio.com/lookup) or when logged into your [Twilio Console](https://www.twilio.com/console/lookup)


## Architecture

```
+----------------------+                   +---------------------------+
|                      |                   |                           |
|     Slack Bot/App    +-----------------> |     Twilio Function       |
|                      |                   |                           |
|   (runs in Slack]    |                   |        (function.js)      |
|                      | <---------------+ |                           |
+----------------------+                   +---------------------------+
```

## Twilio Add-Ons Setup
1. Enable Add-ons in the [Console](twilio.com/console/lookup/add-ons)
    *  Make sure you filter the list by the Lookup Category
1. Take note of the unique name for each enabled add-on.
1. Update the list of add-ons at the top of the function.js file.

## Twilio Function Setup
1. Setup a [function](https://www.twilio.com/console/runtime/functions/manage) with the code in function.js
1. Turn off signature validation inside your function
1. Enable ACCOUNT_SID and AUTH_TOKEN here: https://www.twilio.com/console/runtime/functions/configure
1. Add LOOKUP_SLACKBOT_TOKEN env variable here : https://www.twilio.com/console/runtime/functions/configure 
    * Set it to the Verification Token from your Slackbot's Settings -> Basic Information -> App Credentials -> Verification Token

## Slack Bot Setup
1. Browse to [api.slack.com](https://api.slack.com/) and login.
1. Create a new Slack App.   Name the app and select your development Slack workspace.
1. Open the newly created app.
1. Browse to:  Basic Information -> Add Features and Functionality 
    1. Interactive Components -> Add the Twilio Function URL as the `Request URL`
    1. Create Features -> Slash Command (e.g. `/lookup`).
1. Browse to Install App to install it in your workspace.

## Using Lookup in Slack
1. Wait a few minutes.  Perhaps restart Slack.
1. Simply type `/lookup 12024561414`
1. Select different enabled Lookup addons from the dropdown for additional information

### Lookup in Slack
![Lookup in Slack](https://github.com/AuthySE/lookup-slack-bot/blob/master/Lookup-in-Slack.png)


