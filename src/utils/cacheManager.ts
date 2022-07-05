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

interface CacheEntry {
    value: unknown
    limit: number
    timeout: NodeJS.Timeout | null
}

interface SetOptions {
    ttl?: number; // ttl in milliseconds
    valueOrFunction: (() => void) | unknown;
}

class CacheManager {
    // The cache. Object key -> value. Initialised to be an empty object
    private cache: { [key: string]: CacheEntry | null } = {};

    get length():number {
        return Object.keys(this.cache).length;
    }

    get keys(): string[] {
        return Object.keys(this.cache);
    }

    /**
     * Adds an entry to the cache (private)
     * @param {string} key - the key used for the cached value
     * @param {unknown} value - the value to put into cache
     * @param {number} ttl - TimeToLive in ms. When expired, the cached value (with key) will be deleted
     */ 
    private add = (key:string, value: unknown, ttl: number): CacheEntry => {
        const newEntry: CacheEntry = {
            value: value,
            limit: Date.now().valueOf() + ttl,
            timeout: ttl ? setTimeout(() => { this.cache[key] = null; delete this.cache[key]; }, ttl) : null
        };
        const oldEntry = this.cache[key];
        if (oldEntry) {
            oldEntry.value = null;
            if (oldEntry.timeout) {
                clearTimeout(oldEntry.timeout);
            }
        }
        this.cache[key] = newEntry;
        return newEntry;
    }

    /**
    * Adds an entry to the cache (public)
    * @param {string} key - the key used for the cached value
    * @param {SetOptions} options - { ttl }: TimeToLive in ms. If not supplied, will never be deleted; { valueOrFunction }: the value to cache. If a function is supplied the value returned by the function will be used
    */
    public async set(key: string, options: SetOptions): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const ttl = options.ttl ? Math.max(0, options.ttl) : 0;
            if (typeof options.valueOrFunction === 'function') {
                const newValue = options.valueOrFunction();
                if (newValue instanceof Promise) {
                    newValue
                        .then(res => {
                            resolve(this.add(key, res, ttl).value);
                        })
                        .catch((err: unknown) => reject(err));
                } else {
                    resolve(this.add(key, newValue, ttl).value);
                }
            } else {
                resolve(this.add(key, options.valueOrFunction, ttl).value);
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
                if (!existing.timeout || existing.limit > Date.now().valueOf()) {
                    console.log('Using cached value:', existing.value);
                    resolve(existing.value);
                } else if (options) {
                    this.set(key, options)
                        .then(res => resolve(res))
                        .catch(err => reject(err))
                } else {
                    this.delete(key);
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
        const existingKeys = this.keys;
        const keys = key.filter(item => item !== '' && existingKeys.includes(item));
        keys.forEach(key => {
            const itemToDelete = this.cache[key];
            if (itemToDelete) {
                if (itemToDelete.timeout) {
                    clearTimeout(itemToDelete.timeout);
                }
                this.cache[key] = null;
                delete this.cache[key];
            }
        });
    }

    /**
    * Clears the entire cache
    */
    public clear() {
        Object.values(this.cache).forEach(itemToDelete => {
            if (itemToDelete) {
                if (itemToDelete.timeout) {
                    clearTimeout(itemToDelete.timeout);
                }
                itemToDelete.value = null;
            }
        });
        this.cache = {};
    }
}

const cacheManager = new CacheManager(); 

export default cacheManager;