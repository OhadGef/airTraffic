const config = {
    host: '127.0.0.1',
    // host: process.env.REDIS_HOST || '172.17.0.7',
    port: process.env.REDIS_PORT || 6379,
    KEY: process.env.REDIS_KEY || 'onAir1',
    SIMULATION_KEY:  process.env.REDIS_SIMULATION_KEY ||'jfk2',
    CHANNEL: process.env.CHANNEL || 'messageAdded',
    NUMBER_OF_LOOPS: Infinity , // Infinity
    START: process.env.START || 0,
    END :process.env.END ||-1,
    updateIntervalMs: 20000,
    setIntervalMs: 15000,
    setTimeoutMs: 5000,
    // api: 'https://com:hEYZaVPXdn@opensky-network.org/api/states/all',
    api: 'https://opensky-network.org/api/states/all'
};

module.exports = config;
