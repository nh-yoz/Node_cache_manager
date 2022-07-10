# Node cache manager
A node cache manager for local cache (using RAM) .

# Summary
Using cache is an efficient way to speed up applications.

This repo contains a simple cache manager using the server's ram. This may be a good idea if you are running an api on one single server (without cache sharing between servers) and if the cache is not to big. 

The example in this repo is an api using NodeJS and express but you can easily adapt it for use on front-end React, Vue or another framework based on Node.

There is no actual db, it's simulated using a service.

The module doing the trick is cacheManager.ts in /src/utils

# Install and use the demo
**Prerequisites:** Have [NodeJs](https://nodejs.org) installed.

Download the repo from Github.com/nh-yoz:

**From linux terminal**
- Using https from terminal: ```git clone https://github.com/nh-yoz/Node_cache_manager.git```
- Using SSH: ```git clone git@github.com:nh-yoz/Node_cacDZhe_manager.git```
- Using Github CLI: ```gh repo clone nh-yoz/Node_cache_manager```

**From downloaded zip**
- Unzip the file in the directory where you want it.

### Install
From the terminal, move into the 'Node_cache_manager' directory, download and install the node_modules.

**Using node package manager (npm)**: ```npm install```

**Using yarn**: ```yarn install```

###  Run the development server
**Using node package manager (npm)**: ```npm run dev```

**Using yarn**: ```yarn dev```

### Try it out
- Try at http://localhost:3000. You can use [postman](https://www.postman.com/downloads/) and import then collection from the repository (Node_cache_manager/CacheManager.postman_collection.json)
- Using Swagger-UI at http://localhost:3000/doc

# How to use it
Will soon be available...