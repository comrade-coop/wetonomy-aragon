'use strict'

import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

export function initialize(IPFS, ORBITDB) {
    let orbitdb, database
    let count = 0
    let interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
    let updateInterval
    let dbType, dbAddress

    // Create IPFS instance
    const ipfs = new Ipfs({
        start: true,
        EXPERIMENTAL: {
            pubsub: true,
        },
        config: {
            Addresses: {
                Swarm: [
                    
                ]
            },
        }
    })

    ipfs.on('error', (e) => handleError(e))
    ipfs.on('ready', () => {
        orbitdb = new OrbitDB(ipfs)
    })   
}

export async function createDatabase() {
    await resetDatabase(db)

    try {
        const name = dbnameField.value
        const type = createType.value
        const publicAccess = publicCheckbox.checked

        db = await orbitdb.open(name, {
            // If database doesn't exist, create it
            create: true,
            overwrite: true,
            // Load only the local version of the database, 
            // don't load the latest from the network yet
            localOnly: false,
            type: type,
            // If "Public" flag is set, allow anyone to write to the database,
            // otherwise only the creator of the database can write
            write: publicAccess ? ['*'] : [],
        })

        await load(db, 'Creating database...')
        startWriter(db, interval)
    } catch (e) {
        console.error(e)
    }
}


export async function openDatabase() {
    const address = dbAddressField.value

    await resetDatabase(db)

    try {
        statusElm.innerHTML = "Connecting to peers..."
        db = await orbitdb.open(address, { sync: true })
        await load(db, 'Loading database...')

        if (!readonlyCheckbox.checked) {
            startWriter(db, interval)
        } else {
            writerText.innerHTML = `Listening for updates to the database...`
        }
    } catch (e) {
        console.error(e)
    }
}

async function update(database) {
    count++

    const time = new Date().toISOString()
    const idx = Math.floor(Math.random() * creatures.length)
    const creature = creatures[idx]

    if (database.type === 'eventlog') {
        const value = "GrEEtinGs from " + orbitdatabase.id + " " + creature + ": Hello #" + count + " (" + time + ")"
        await database.add(value)
    } else if (database.type === 'feed') {
        const value = "GrEEtinGs from " + orbitdatabase.id + " " + creature + ": Hello #" + count + " (" + time + ")"
        await database.add(value)
    } else if (database.type === 'docstore') {
        const value = { _id: 'peer1', avatar: creature, updated: time }
        await database.put(value)
    } else if (database.type === 'keyvalue') {
        await database.set('mykey', creature)
    } else if (database.type === 'counter') {
        await database.inc(1)
    } else {
        throw new Error("Unknown datatbase type: ", database.type)
    }
}

export async function resetDatabase(database) {
    clearInterval(updateInterval)

    if (db) {
        await db.close()
    }

    interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
}

export async function load(database, statusText) {
    // When the database is ready (ie. loaded), display results
    db.events.on('ready', () => queryAndRender(db))
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => queryAndRender(database))
    // When we update the database, display result
    database.events.on('write', () => queryAndRender(database))

    database.events.on('replicate.progress', () => queryAndRender(database))

    // Hook up to the load progress event and render the progress
    let maxTotal = 0, loaded = 0
    database.events.on('load.progress', (address, hash, entry, progress, total) => {
        loaded++
        maxTotal = Math.max.apply(null, [progress, maxTotal, progress, 0])
        total = Math.max.apply(null, [progress, maxTotal, total, 0])
    })

    database.events.on('ready', () => {
        // Set the status text
        setTimeout(() => {
            // statusElm.innerHTML = 'Database is ready'
        }, 1000)
    })

    // Load locally persisted database
    await database.load()
}

async function startWriter(database, interval) {

    // Start update/insert loop
    updateInterval = setInterval(async () => {
        try {
            await update(database)
        } catch (e) {
            console.error(e.toString())
            if (e.toString() === 'Error: Not allowed to write') {
                clearInterval(updateInterval)
            }
        }
    }, interval)
}

export function query(database) {
    if (database.type === 'eventlog')
        return database.iterator({ limit: 5 }).collect()
    else if (database.type === 'feed')
        return database.iterator({ limit: 5 }).collect()
    else if (database.type === 'docstore')
        return database.get('peer1')
    else if (database.type === 'keyvalue')
        return database.get('mykey')
    else if (database.type === 'counter')
        return database.value
    else
        throw new Error("Unknown datatbase type: ", database.type)
}

