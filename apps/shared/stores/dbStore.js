'use strict'

import OrbitDB from 'orbit-db'

export function initialize(IPFS) {

    // Create IPFS instance
    const ipfs = new IPFS({
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
       
       // type = feed or log

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
        db = await orbitdb.open(address, { sync: true })
        await load(db, 'Loading database...')

    } catch (e) {
        console.error(e)
    }
}


export async function resetDatabase(db) {

        if (db) {
            await db.close()
        }
}

export async function load(db) {
    // When the database is ready (ie. loaded), display results
    db.events.on('ready', () => queryAndRender(db))
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => queryAndRender(db))
    // When we update the database, display result
    db.events.on('write', () => queryAndRender(db))



    db.events.on('ready', () => {
        // TODO
    })

    // Load locally persisted database
    await db.load()
}

async function startWriter() {
    // Start update/insert
    
}

export function query(db) {
    if (db.type === 'eventlog')
        return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'feed')
        return db.iterator({ limit: 5 }).collect()
    else
        throw new Error("Unknown datatbase type: ", db.type)
}