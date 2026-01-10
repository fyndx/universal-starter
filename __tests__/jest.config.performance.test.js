const fs = require('fs');
const { performance } = require('perf_hooks');

describe('Jest Configuration Performance Tests', () => {
  describe('Configuration Loading Performance', () => {
    test('should load configuration quickly', () => {
      const iterations = 20;
      const times = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        
        delete require.cache[require.resolve('../jest.config.js')];
        require('../jest.config.js');
        
        const end = performance.now();
        times.push(end - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      
      expect(avgTime).toBeLessThan(5); // Average under 5ms
      expect(maxTime).toBeLessThan(20); // Max under 20ms
    });

    test('should not perform expensive operations during config load', () => {
      const originalExistsSync = fs.existsSync;
      let fileSystemCalls = 0;
      
      fs.existsSync = jest.fn((...args) => {
        fileSystemCalls++;
        return originalExistsSync.apply(fs, args);
      });

      try {
        delete require.cache[require.resolve('../jest.config.js')];
        require('../jest.config.js');
        
        // Should not make excessive filesystem calls
        expect(fileSystemCalls).toBeLessThan(5);
      } finally {
        fs.existsSync = originalExistsSync;
      }
    });
  });

  describe('Configuration Optimization', () => {
    test('should have optimized ignore patterns', () => {
      const config = require('../jest.config.js');
      
      if (config.testPathIgnorePatterns) {
        const patterns = config.testPathIgnorePatterns;
        
        // Should have node_modules ignored
        expect(patterns).toContain('/node_modules/');
        
        // Should not have redundant patterns
        const uniquePatterns = [...new Set(patterns)];
        expect(uniquePatterns.length).toBe(patterns.length);
        
        // Should not have overly broad patterns
        expect(patterns).not.toContain('*');
        expect(patterns).not.toContain('**');
      }
    });

    test('should have efficient coverage collection', () => {
      const config = require('../jest.config.js');
      
      if (config.collectCoverageFrom) {
        const patterns = config.collectCoverageFrom;
        
        // Should target specific directories
        const hasSpecificPaths = patterns.some(pattern => 
          pattern.includes('src/') || pattern.includes('lib/')
        );
        expect(hasSpecificPaths).toBe(true);
        
        // Should exclude test files
        const hasTestExclusion = patterns.some(pattern => 
          pattern.startsWith('!') && pattern.includes('test')
        );
        expect(hasTestExclusion).toBe(true);
      }
    });

    test('should have reasonable test matching patterns', () => {
      const config = require('../jest.config.js');
      
      expect(config.testMatch).toBeDefined();
      expect(config.testMatch.length).toBeLessThan(10); // Not too many patterns
      
      // Should have efficient patterns
      config.testMatch.forEach(pattern => {
        expect(pattern).not.toMatch(/\*\*.*\*\*.*\*\*/); // No excessive globbing
      });
    });
  });

  describe('Memory Usage', () => {
    test('should not create large objects during configuration', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Load config multiple times
      for (let i = 0; i < 10; i++) {
        delete require.cache[require.resolve('../jest.config.js')];
        require('../jest.config.js');
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryDiff = finalMemory - initialMemory;
      
      // Should not use excessive memory (less than 500KB)
      expect(memoryDiff).toBeLessThan(500 * 1024);
    });

    test('should be garbage collectable', () => {
      let config = require('../jest.config.js');
      expect(config).toBeDefined();
      
      // Clear reference
      config = null;
      delete require.cache[require.resolve('../jest.config.js')];
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Config should be re-loadable
      const newConfig = require('../jest.config.js');
      expect(newConfig).toBeDefined();
    });
  });
});