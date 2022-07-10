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
## Properties and methods
**Properties**
1. `length` (readonly): the number of values currently available cache
2. `keys` (readonly): an array of the currently available keys

**Methods / functions**
1. `set(key: string, options: { ttl?: number, valueOrFunction: unknown })`: Set a value in cache. Returns a Promise containing the value that has been set.

    **Parameters:**
    - `key`: Required: the key (as a string) of the cache entry
    - `options`: Required: an object containg the properties:
        - `ttl`: Optionnal: The time to live in milliseconds of the cached entry. When time is out, the cached entry will be deleted. If this property is missing, undefined or <= 0  the cached value will never be automatically deleted.
        - `valueOrFunction`: Required: Any value (object, array, string, boolean, ...) or a function. If this property is a function it will be executed to retrieve it's result as a value to put in the cache. If the function returns a Promise, the resolved value will be used.

    **Example:**
    ```
    const myCar = await CarController.findOne(1);
    cacheManager.set('car/id=1', myCar);
    ```
2. `get(key: string, options?: { ttl?: number, valueOrFunction: unknown })`: Get a value from cache. Returns a Promise, with the cached value if existing, otherwise *undefined*.

    **Parameters:**
    - `key`: Required: the key (as a string) of the cache entry
    - `options`: Optional: an object containg the following properties:
        - `ttl`: Optionnal: The time to live in milliseconds of the cached entry. When time is out, the cached entry will be deleted. If this property is missing, undefined or <= 0  the cached value will never be automatically deleted.
        - `valueOrFunction`: Optional: Any value (object, array, string, boolean, ...) or a function. If the `key` wasn't found in the cache, the entry will be set (as by the 
        `set` function here above.

    **Example:**
    ```
    const myCar = await cacheManager.get('car/id=1', { ttl: 5000, () => CarController.findOne(1));
    ``` 

3. `delete(key: string | string[])`: Delete cached entries by their key. If an array of keys is passed to the function, each entry will be deleted. If `key` is missing in the cache, it will be ignored. This method returns nothing. 
4. `clear()`: Delete all entries in the cache. This method returns nothing.

## First thing to do
Make the use of the cache manager global in your project:
- Import class
- Export an instance of the class 

In index.ts (or app.ts), add :

```
import CacheManager from './utils/cacheManager';
export const cacheManager = new CacheManager();
```
### Add to controllers or routes
