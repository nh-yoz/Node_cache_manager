interface cacheEntry {
    value: any
    limit: number
    timeout: NodeJS.Timeout | null
}

interface setOptions {
    ttl?: number; // ttl in milliseconds
    valueOrFunction: (() => void) | unknown;
}

class CacheManager {
    private cache: { [key: string]: cacheEntry | null } = {};

    get length():number {
        return Object.keys(this.cache).length;
    }

    get keys(): string[] {
        return Object.keys(this.cache);
    }

    private add = (key:string, value: any, ttl: number): cacheEntry => {
        const newEntry: cacheEntry = {
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

    public async set(key: string, options: setOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const ttl = options.ttl ? Math.max(0, options.ttl) : 0;
            if (typeof options.valueOrFunction === 'function') {
                const newValue = options.valueOrFunction();
                if (newValue instanceof Promise) {
                    newValue
                        .then(res => {
                            resolve(this.add(key, res, ttl).value);
                        })
                        .catch((err: any) => reject(err));
                } else {
                    resolve(this.add(key, newValue, ttl).value);
                }
            } else {
                resolve(this.add(key, options.valueOrFunction, ttl).value);
            }
        });
    }


    public async get(key: string, options?: setOptions):Promise<any | undefined> {
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
                    this.remove(key);
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


    public remove = (key:string | string[]) => {
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