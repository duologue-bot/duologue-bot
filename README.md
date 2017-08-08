# lizziesnoggin

A private place for ideas to come to life.

Code in this repository makes things happen here:

https://www.lizziesnoggin.com

Bot: https://www.facebook.com/messages/t/1072414536220500


## Getting Started

### Installation

```
nvm install 7
nvm alias default 7
git clone git@github.com:cliftonc/lizziesnoggin.git
cd lizziesnoggin
npm i -g yarn nodemon now
yarn install
```

### Running it locally

In tab 1:

```
cd lizziesnoggin
npm run dev
```

In tab 2:

```
cd lizziesnoggin
ngrok http --hostname caitlin-bot.eu.ngrok.io --region eu 8572
```

### Deploying Live

We deploy this to Zeit now.sh, you need to be part of the Duologue team to do this:

First up:

```
npm i -g now
now switch duologue
```

From within the project (once you confirm your changes all work locally):

```
now
now alias
```

Enjoy!

### In facebook

Go here: https://developers.facebook.com/apps/1110953255676533/webhooks/

Edit subscription.
Paste in your ngrok url base.

### Using the bot

To test, go here: https://www.facebook.com/Local-lizzie-1674726786164847/

Talk to it :)

Live bot lives here: https://www.facebook.com/Duologue-2165944153632193/ 


### See the glorious output of your work
* https://www.lizziesnoggin.com/api/state
* https://www.lizziesnoggin.com/api/configuration

### Adjusting your state machine

`state-definition` is the events that point each state to each other.  Each event needs a `name`, a `from` and a `to`.  Your `state-messages` hold the definitions for each state.

So from a user's point of view interacting with the bot, typing, "Help, I don't understand what this is!" will cause the action `help` in `state-definitions`, leading to the state `showHelp` in `state-messages`.

There are two types of messages, `quickReplies` which have buttons that take a user to another state, and longer conversational text which users give free-text responses to. The bot 'listens' to the free-text responses for specific keywords, which send the user to the right state.

### Caitlin Notes of useful stuff
#### Facebook Messenger tutorial stuff
Send stuff to the messenger api: https://developers.facebook.com/docs/messenger-platform/send-api-reference

#### Conversation Interaction Design
Repairing broken conversations: https://developers.google.com/actions/design/how-conversations-work#repair

#### utf 8 emoji
Copy from this dictionary of awesomeness: https://codepoints.net/U+1F913?lang=en
