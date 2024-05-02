# Chami's shelter plugins

You should be using pnpm with this ideally.
You can build all plugins with `pnpm lune ci`.

Or just add the plugins to your shelter instance directly using a URL like so:
`https://raw.githubusercontent.com/planetarian/shelter-plugins/master/dist/plugin-name-here`

## twit-fixer

Automatically converts all twitter/X links you send to use `fxtwitter.com`, while removing the query portion of the URL (the `?something=whatever` stuff) and applying `/en` to provide automatic translation in the embed.

## username-display

Makes discord display usernames in chat like `username (Nickname)`.
