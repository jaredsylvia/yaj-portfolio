// parse the name of the subdirectory to determine the cache duration
const parseCacheDuration = (subdir) => {
    // check subdir for a number followed by a time unit
    const match = subdir.match(/^(\d+)([smhdwy])$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
  
      // convert to milliseconds
      const timeUnits = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000,
      };
  
      const duration = value * timeUnits[unit];
      return duration;
    }
  
    return 0; 
  };
  
  module.exports = { parseCacheDuration };
  