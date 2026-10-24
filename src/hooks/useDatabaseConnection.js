import { useMemo } from 'react';
import { MongoClient } from 'mongodb';

/**
 * Hook for database connection utilities that can be reused across different schemas
 * @param {Object} config - Database configuration
 * @param {string} config.uri - MongoDB connection URI
 * @param {string} config.dbName - Database name
 * @param {string} config.collectionName - Collection name
 * @returns {Object} Database connection utilities
 */
export function useDatabaseConnection(config) {
  const {
    uri = process.env.MONGODB_URL || '',
    dbName = process.env.MONGODB_DB || '',
    collectionName
  } = config;

  // Validate required configuration
  if (!uri || !dbName || !collectionName) {
    throw new Error('Please define MONGODB_URL, MONGODB_DB environment variables and collectionName');
  }

  // Memoized database utilities
  const dbUtils = useMemo(() => {
    let cachedClient = null;
    let cachedDb = null;

    /**
     * Connect to MongoDB database
     * @returns {Promise<Object>} Database instance
     */
    const connectDB = async () => {
      if (cachedDb) {
        return cachedDb;
      }

      try {
        if (!cachedClient) {
          cachedClient = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000, // 5 seconds
            connectTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
            retryWrites: true,
            retryReads: true
          });
          await cachedClient.connect();
        }
        cachedDb = cachedClient.db(dbName);
        return cachedDb;
      } catch (error) {
        console.log('MongoDB connection error:', error);
        throw error;
      }
    };

    /**
     * Get collection instance
     * @returns {Promise<Object>} Collection instance
     */
    const getCollection = async () => {
      const db = await connectDB();
      return db.collection(collectionName);
    };

    /**
     * Close database connection
     * @returns {Promise<void>}
     */
    const closeConnection = async () => {
      if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
      }
    };

    /**
     * Check if database is connected
     * @returns {boolean} Connection status
     */
    const isConnected = () => {
      return cachedClient !== null && cachedDb !== null;
    };

    /**
     * Get connection info
     * @returns {Object} Connection information
     */
    const getConnectionInfo = () => {
      return {
        isConnected: isConnected(),
        dbName,
        collectionName,
        uri: uri ? `${uri.split('@')[1] || '***'}` : 'Not configured'
      };
    };

    return {
      connectDB,
      getCollection,
      closeConnection,
      isConnected,
      getConnectionInfo
    };
  }, [uri, dbName, collectionName]);

  return dbUtils;
} 