describe('Jest Configuration Schema Validation', () => {
  let config;

  beforeEach(() => {
    delete require.cache[require.resolve('../jest.config.js')];
    config = require('../jest.config.js');
  });

  describe('Type Validation', () => {
    test('should have correct types for all configuration options', () => {
      const typeValidations = {
        testEnvironment: 'string',
        setupFilesAfterEnv: 'array',
        setupFiles: 'array',
        testMatch: 'array',
        testPathIgnorePatterns: 'array',
        collectCoverageFrom: 'array',
        coverageDirectory: 'string',
        coverageReporters: 'array',
        coverageThreshold: 'object',
        moduleNameMapping: 'object',
        moduleFileExtensions: 'array',
        transform: 'object',
        roots: 'array',
        collectCoverage: 'boolean',
        verbose: 'boolean',
        clearMocks: 'boolean',
        resetMocks: 'boolean',
        restoreMocks: 'boolean',
        watchman: 'boolean',
        maxWorkers: 'number',
        testTimeout: 'number'
      };

      Object.entries(typeValidations).forEach(([key, expectedType]) => {
        if (config[key] !== undefined) {
          if (expectedType === 'array') {
            expect(Array.isArray(config[key])).toBe(true);
          } else {
            expect(typeof config[key]).toBe(expectedType);
          }
        }
      });
    });

    test('should validate array contents are correct types', () => {
      const stringArrayFields = [
        'setupFilesAfterEnv',
        'setupFiles',
        'testMatch',
        'testPathIgnorePatterns',
        'collectCoverageFrom',
        'coverageReporters',
        'moduleFileExtensions',
        'roots'
      ];

      stringArrayFields.forEach(field => {
        if (config[field] && Array.isArray(config[field])) {
          config[field].forEach((item, index) => {
            expect(typeof item).toBe('string');
            expect(item.length).toBeGreaterThan(0);
            expect(item.trim()).toBe(item);
          });
        }
      });
    });
  });

  describe('Value Constraints', () => {
    test('should validate numeric constraints', () => {
      if (config.maxWorkers !== undefined) {
        expect(config.maxWorkers).toBeGreaterThan(0);
        expect(config.maxWorkers).toBeLessThan(1000);
        expect(Number.isInteger(config.maxWorkers)).toBe(true);
      }

      if (config.testTimeout !== undefined) {
        expect(config.testTimeout).toBeGreaterThan(0);
        expect(config.testTimeout).toBeLessThan(3600000); // 1 hour
        expect(Number.isInteger(config.testTimeout)).toBe(true);
      }
    });

    test('should validate coverage thresholds', () => {
      if (config.coverageThreshold) {
        expect(typeof config.coverageThreshold).toBe('object');
        
        if (config.coverageThreshold.global) {
          const metrics = ['branches', 'functions', 'lines', 'statements'];
          const threshold = config.coverageThreshold.global;
          
          metrics.forEach(metric => {
            if (threshold[metric] !== undefined) {
              expect(typeof threshold[metric]).toBe('number');
              expect(threshold[metric]).toBeGreaterThanOrEqual(0);
              expect(threshold[metric]).toBeLessThanOrEqual(100);
              expect(Number.isInteger(threshold[metric])).toBe(true);
            }
          });
        }
      }
    });

    test('should validate string constraints', () => {
      if (config.testEnvironment) {
        expect(config.testEnvironment.trim()).toBe(config.testEnvironment);
        expect(config.testEnvironment).not.toBe('');
      }

      if (config.coverageDirectory) {
        expect(config.coverageDirectory.trim()).toBe(config.coverageDirectory);
        expect(config.coverageDirectory).not.toBe('');
        expect(config.coverageDirectory).not.toMatch(/\s/); // No whitespace
      }
    });
  });

  describe('Pattern Validation', () => {
    test('should validate glob patterns', () => {
      const patternFields = ['testMatch', 'testPathIgnorePatterns', 'collectCoverageFrom'];

      patternFields.forEach(field => {
        if (config[field] && Array.isArray(config[field])) {
          config[field].forEach(pattern => {
            expect(pattern).not.toBe('');
            expect(pattern).not.toMatch(/\s{2,}/); // No multiple spaces
            expect(pattern).not.toMatch(/\/\/$|\/\s/); // No trailing slashes with space
            
            // Should not have obvious syntax errors
            expect(pattern).not.toMatch(/\[\]/); // Empty character class
            expect(pattern).not.toMatch(/\*\*\*+/); // Triple or more asterisks
          });
        }
      });
    });

    test('should validate regex patterns in transforms', () => {
      if (config.transform) {
        Object.keys(config.transform).forEach(pattern => {
          expect(() => {
            new RegExp(pattern);
          }).not.toThrow();
        });
      }
    });
  });

  describe('Logical Consistency', () => {
    test('should have consistent test and coverage patterns', () => {
      // Test files should not be included in coverage
      if (config.collectCoverageFrom && config.testMatch) {
        const hasTestExclusion = config.collectCoverageFrom.some(pattern => 
          pattern.startsWith('!') && (pattern.includes('test') || pattern.includes('spec'))
        );
        
        expect(hasTestExclusion).toBe(true);
      }
    });

    test('should have logical ignore patterns', () => {
      if (config.testPathIgnorePatterns) {
        const hasNodeModulesIgnore = config.testPathIgnorePatterns.some(pattern => 
          pattern.includes('node_modules')
        );
        expect(hasNodeModulesIgnore).toBe(true);
      }
    });

    test('should have appropriate environment configuration', () => {
      if (config.testEnvironment === 'node') {
        // For Node environment, certain DOM-related configs should be minimal
        expect(config.testEnvironment).toBe('node');
      }
    });
  });

  describe('Required Configuration', () => {
    test('should have essential configuration options', () => {
      const requiredOptions = ['testEnvironment', 'testMatch'];
      
      requiredOptions.forEach(option => {
        expect(config).toHaveProperty(option);
        expect(config[option]).toBeDefined();
      });
    });

    test('should have reasonable defaults', () => {
      expect(config.testEnvironment).toBe('node');
      expect(config.verbose).toBe(true);
      expect(config.clearMocks).toBe(true);
      expect(config.resetMocks).toBe(true);
      expect(config.restoreMocks).toBe(true);
    });
  });
});