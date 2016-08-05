# gopher-dance-party-frontend

Quickly made express.js frontend for a creature dance party. Wombats and Gophers currently supported.

Fully Dockerized for extra fun (and on the Docker hub). Docker images automatically built using CircleCI.

## Running

```
node app.js
```

### Configuration

Done via environment variables for lazy.

* `CREATURE_IMAGE` - Path (local or remote) to dancing creature image.
* `DANCE_PARTY_TITLE` - Title of Dance Party
* `STATE_SERVER` - Hostname and port of persistence service (see `gopher-dance-party-dancefloor`)

See also:

* Realtime Communication (socket.io): https://github.com/smithclay/gopher-dance-party-socket
* Persistence (GoLang): https://github.com/smithclay/gopher-dance-party-dancefloor


