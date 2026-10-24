export default function fetchRandomImages(imgItems, count) {
    // Ensure imgItems is an array and is not undefined
    if (!Array.isArray(imgItems)) {
      console.log("Invalid imgItems: Expected an array but got", typeof imgItems);
      return []; // Return an empty array if imgItems is not valid
    }
  
    // Shuffle and return random items if imgItems is valid
    const shuffled = [...imgItems].sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, count); // Return the first `count` items from shuffled array
  }