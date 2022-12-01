# Fabriq Splash Page

An interactive demo visualising Fabriq architecture.

## Configuring Archetypes

A number of Archetypes can be configured which can alter the looping video displayed, and change the story within each modules' tooltip.

The source can be found within `./data/archetypes.yml`. The source should always be changed within YAML, then converted to JSON by running `yarn run content`. The start command will also trigger this conversion.

_Note: Once integrated into the larger Fabriq demo, we may well choose to just host the JSON as the source, and continue to update the archetypes from within this repo, then send over the new file._

## Integration Notes

- json and mp4 files are likely to change. These will be sent across manually for integration in future.

## Integration Steps

1. Migrate the code in `App.js` into a new component, `SplashPage` or similar.
2. Add types (apologies, I favoured speed to develop this)
3. Implement the soft redirects to relevant apps, marked with `todo` in `App.js`
4. Add new dependencdies to package.json (probably just react-draggable and lodash-es)

## Known Issues

- Interaction areas are currently quite large, so tooltips open quite a lot when dragging around. These bounds are configured in the yml/json, so will be reduced in size. I will probably add clear 'trigger markers' in the actual design, then target them specifically.