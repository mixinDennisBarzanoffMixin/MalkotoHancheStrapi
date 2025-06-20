'use strict';

module.exports = async (ctx, next) => {
  // Minimal permissions policy - just continue to next middleware
  return next();
}; 