/**
 * Universal Order API Service
 * A reusable service for fetching and saving order of items across different schemas
 */

// Factory function to create an order API service for any schema
function createOrderAPIService(config) {
    const {
      schemaName,
      endpoint = `/api/${schemaName}/reorder`,
      dataField = `reordered${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)}s`
    } = config;
  
    // Fetch items from the specified schema
    async function fetchItems(signal) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal, // Add AbortSignal support
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // The API returns an array of items
        return await response.json();
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`${schemaName} fetch aborted`);
          return null;
        }
        console.log(`Failed to fetch ${schemaName}:`, error);
        throw new Error(`Failed to load ${schemaName}. Please check your connection and try again.`);
      }
    }
  
    // Save the new order of items
    async function saveOrder(reorderedItems, signal) {
      try {
        const requestBody = { [dataField]: reorderedItems };
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal, // Add AbortSignal support
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`${schemaName} save aborted`);
          return null;
        }
        console.log(`Failed to save ${schemaName} order:`, error);
        throw new Error(`Failed to save ${schemaName} order. Please try again.`);
      }
    }
  
    return {
      fetchItems,
      saveOrder,
      schemaName,
      endpoint
    };
  }
  
  // Export the factory function for creating order API services
  export default createOrderAPIService;
  export { createOrderAPIService };