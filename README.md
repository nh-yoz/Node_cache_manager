# Node cache manager
A node cache manager for local cache (using RAM) .

# Summary
Using cache is an efficient way to speed up applications.

This repo contains a simple cache manager using the computer's/server's ram. This may be a good idea if you are running an api on one single server (without cache sharing between servers) and if the cache is not to big. 

The example in this repo is an api using NodeJS and express but you can easily adapt it for use on front-end React, Vue or another framework based on Node.

There is no actual db, it's simulated using a service.

The module doing the trick is cacheManager.ts in /src/utils

# Get running
```yarn install```

```yarn dev```

# Try it out
- Try at http://localhost:3000
- The api path is /cars

Download the postman-collection from the repository.
