# Fabriq Splash Page

An interactive demo visualising Fabriq architecture.

## Configuring Archetypes

A number of Archetypes can be configured which can alter the looping video displayed, and change the story within each modules' tooltip.

The source can be found within `./data/archetypes.yml`. The source should always be changed within YAML, then converted to JSON by running `yarn run content`. The start command will also trigger this conversion.

_Note: Once integrated into the larger Fabriq demo, we may well choose to just host the JSON as the source, and continue to update the archetypes from within this repo, then send over the new file._