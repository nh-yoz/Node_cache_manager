/* CACHEMANAGER 
 * 
 * Cachemanager for NodeJs using server's RAM.
 * 
 * Available properties:
 * - length (readonly): the number of values in cache
 * - keys (readonly): returns list of all keys
 * 
 * Available methods:
 * - set: Sets a value in cache
 * - get: Get existing cached value
 * - delete: Delete existing cached value 
 * - clear: Delete all cached values
 */

interface CacheValue {
    value: unknown
};

interface CacheEntry extends CacheValue {
    limit?: number
    timeout?: NodeJS.Timeout
}

interface SetOptions {
    ttl?: number; // time-to-live in milliseconds
    valueOrFunction: (() => void) | unknown;
}

class CacheManager {
    // The cache. Object key -> value. Initialised to be an empty object
    private cache: { [key: string]: CacheEntry } = {};

    get length():number {
        return Object.keys(this.cache).length;
    }

    get keys(): string[] {
        return Object.keys(this.cache);
    }

    /**
     * Adds an entry to the cache (private)
     * @param {string} key - Required: the key used for the cached value
     * @param {unknown} value - Required: the value to put into cache
     * @param {number} ttl - TimeToLive in ms. When expired, the cached value (with key) will be deleted. If <= 0, store until manually delete
     */ 
    private addEntry = (key: string, value: unknown, ttl: number): CacheEntry => {
        // First, remove existing cache entry if exists
        this.removeEntry(key);
        const newEntry: CacheEntry = { value: value };
        if (ttl > 0) {
            newEntry.limit = Date.now().valueOf() + Math.ceil(ttl);
            newEntry.timeout = setTimeout(() => { this.removeEntry(key) }, ttl);
        }
        this.cache[key] = newEntry;
        return newEntry;
    }

    /**
     * Removes an entry to the cache (private)
     * @param {string} key - Required: the key used for the cached value
     */ 
    private removeEntry = (key:string): void => {
        if (Object.keys(this.cache).includes(key)) {
            const oldEntry = this.cache[key];
            // Clear value and remove timeout from existing cache entry if exists
            if (oldEntry.value) oldEntry.value = false;
            if (oldEntry.timeout) {
                clearTimeout(oldEntry.timeout);
                oldEntry.timeout = undefined;
            }
            delete this.cache[key];
        }
    }

    /**
    * Adds an entry to the cache (public)
    * @param {string} key - the key used for the cached value
    * @param {SetOptions} options - { ttl }: TimeToLive in ms. If not supplied, will never be deleted; { valueOrFunction }: the value to cache. If a function is supplied the value returned by the function will be used
    */
    public async set(key: string, options: SetOptions): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const ttl = options.ttl ? options.ttl : 0;
            if (typeof options.valueOrFunction === 'function') {
                const newValue = options.valueOrFunction();
                if (newValue instanceof Promise) {
                    newValue
                        .then(res => resolve(this.addEntry(key, res, ttl).value))
                        .catch((err: unknown) => {
                            console.error(err);
                            reject(err);
                        })
                } else {
                    resolve(this.addEntry(key, newValue, ttl).value);
                }
            } else {
                resolve(this.addEntry(key, options.valueOrFunction, ttl).value);
            }
        });
    }

    /**
    * Adds an entry to the cache (public)
    * @param {string} key - the key used for the cached value
    * @param {SetOptions} options - if supplied, will set a new value based on options (see 'set' function)
    */
    public async get(key: string, options?: SetOptions):Promise<unknown | undefined> {
        return new Promise((resolve, reject) => {
            const existing = this.cache[key];
            if (existing) {                
                if (!existing.timeout || (existing.limit && existing.limit > Date.now().valueOf())) {
                    console.info('Using cached value:', existing.value);
                    resolve(existing.value);
                } else if (options) {
                    this.set(key, options)
                        .then(res => resolve(res))
                        .catch(err => reject(err))
                } else {
                    this.removeEntry(key);
                    resolve(undefined);
                }
            } else if (options) {
                this.set(key, options)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            } else {
                resolve(undefined);
            }
        });
    }

    /**
    * Deletes an entry from the cache
    * @param {string} key - the key used for the cached value
    */
    public delete = (key:string | string[]) => {
        if (!Array.isArray(key)) {
            key = [key];
        }
        key.forEach(key => this.removeEntry(key));
    }

    /**
    * Clears the entire cache
    */
    public clear = () => {
        this.delete(Object.keys(this.cache));
        this.cache = {};
    }
}


export default CacheManager;
