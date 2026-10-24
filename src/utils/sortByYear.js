const sortByYear = (items) => {
    return items.slice().sort((a, b) => {
      const yearA = parseInt(a?.year) || 0;
      const yearB = parseInt(b?.year) || 0;
      return yearB - yearA; // Descending order (newest first)
    });
  };

export default sortByYear;