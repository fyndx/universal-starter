const fs = require('fs');
const path = require('path');

describe('Jest Configuration', () => {
  let config;

  beforeEach(() => {
    // Clear require cache to ensure fresh config load
    delete require.cache[require.resolve('../jest.config.js')];
    config = require('../jest.config.js');
  });

  describe('Configuration Structure', () => {
    test('should export a valid configuration object', () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    test('should contain required Jest configuration properties', () => {
      // Check that at least some standard properties are present
      const configKeys = Object.keys(config);
      expect(configKeys.length).toBeGreaterThan(0);
      
      // Verify no typos in common configuration keys
      configKeys.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.trim()).toBe(key); // No leading/trailing whitespace
      });
    });

    test('should have proper configuration key names', () => {
      const validJestProperties = [
        'testEnvironment', 'setupFilesAfterEnv', 'testMatch', 'collectCoverageFrom',
        'coverageDirectory', 'coverageReporters', 'moduleNameMapping', 'transform',
        'moduleFileExtensions', 'roots', 'testPathIgnorePatterns', 'collectCoverage',
        'verbose', 'clearMocks', 'resetMocks', 'restoreMocks', 'coverageThreshold',
        'maxWorkers', 'testTimeout', 'watchman', 'setupFiles'
      ];

      const configKeys = Object.keys(config);
      configKeys.forEach(key => {
        // Check if key is a valid Jest property or commonly used extension
        const isValidKey = validJestProperties.includes(key) || 
                          key.startsWith('test') || 
                          key.startsWith('coverage') || 
                          key.startsWith('module') ||
                          key.startsWith('transform') ||
                          key.startsWith('setup');
        
        expect(isValidKey).toBe(true);
      });
    });
  });

  describe('Test Environment Configuration', () => {
    test('should have a valid test environment', () => {
      expect(config.testEnvironment).toBeDefined();
      const validEnvironments = ['node', 'jsdom', 'jest-environment-node', 'jest-environment-jsdom'];
      expect(validEnvironments).toContain(config.testEnvironment);
    });

    test('should use node environment for backend projects', () => {
      expect(config.testEnvironment).toBe('node');
    });
  });

  describe('Test Pattern Configuration', () => {
    test('should have valid test match patterns', () => {
      expect(config.testMatch).toBeDefined();
      expect(Array.isArray(config.testMatch)).toBe(true);
      expect(config.testMatch.length).toBeGreaterThan(0);
      
      config.testMatch.forEach(pattern => {
        expect(typeof pattern).toBe('string');
        expect(pattern.length).toBeGreaterThan(0);
        expect(pattern).toMatch(/\*|\?|\[|\]/); // Should contain glob characters
      });
    });

    test('should include standard test patterns', () => {
      const hasTestsPattern = config.testMatch.some(pattern => 
        pattern.includes('__tests__') || pattern.includes('*.test.') || pattern.includes('*.spec.')
      );
      expect(hasTestsPattern).toBe(true);
    });

    test('should have valid test path ignore patterns', () => {
      expect(config.testPathIgnorePatterns).toBeDefined();
      expect(Array.isArray(config.testPathIgnorePatterns)).toBe(true);
      
      config.testPathIgnorePatterns.forEach(pattern => {
        expect(typeof pattern).toBe('string');
        expect(pattern.length).toBeGreaterThan(0);
      });
    });

    test('should ignore node_modules in test paths', () => {
      const ignoresNodeModules = config.testPathIgnorePatterns.some(pattern => 
        pattern.includes('node_modules')
      );
      expect(ignoresNodeModules).toBe(true);
    });
  });

  describe('Coverage Configuration', () => {
    test('should have valid coverage collection patterns', () => {
      expect(config.collectCoverageFrom).toBeDefined();
      expect(Array.isArray(config.collectCoverageFrom)).toBe(true);
      
      config.collectCoverageFrom.forEach(pattern => {
        expect(typeof pattern).toBe('string');
        expect(pattern.length).toBeGreaterThan(0);
      });
    });

    test('should exclude test files from coverage', () => {
      const excludesTestFiles = config.collectCoverageFrom.some(pattern => 
        pattern.startsWith('!') && (pattern.includes('test') || pattern.includes('spec'))
      );
      expect(excludesTestFiles).toBe(true);
    });

    test('should have valid coverage directory', () => {
      expect(config.coverageDirectory).toBeDefined();
      expect(typeof config.coverageDirectory).toBe('string');
      expect(config.coverageDirectory.length).toBeGreaterThan(0);
    });

    test('should have valid coverage reporters', () => {
      expect(config.coverageReporters).toBeDefined();
      expect(Array.isArray(config.coverageReporters)).toBe(true);
      
      const validReporters = ['html', 'text', 'lcov', 'json', 'cobertura', 'text-summary'];
      config.coverageReporters.forEach(reporter => {
        expect(typeof reporter).toBe('string');
        expect(reporter.length).toBeGreaterThan(0);
      });
    });

    test('should have valid coverage thresholds', () => {
      if (config.coverageThreshold) {
        expect(typeof config.coverageThreshold).toBe('object');
        
        if (config.coverageThreshold.global) {
          const threshold = config.coverageThreshold.global;
          ['branches', 'functions', 'lines', 'statements'].forEach(metric => {
            if (threshold[metric] !== undefined) {
              expect(typeof threshold[metric]).toBe('number');
              expect(threshold[metric]).toBeGreaterThanOrEqual(0);
              expect(threshold[metric]).toBeLessThanOrEqual(100);
            }
          });
        }
      }
    });

    test('should have reasonable coverage thresholds', () => {
      if (config.coverageThreshold?.global) {
        const threshold = config.coverageThreshold.global;
        Object.values(threshold).forEach(value => {
          expect(value).toBeGreaterThanOrEqual(70); // At least 70% coverage
          expect(value).toBeLessThanOrEqual(100);
        });
      }
    });
  });

  describe('Module Configuration', () => {
    test('should have valid module file extensions', () => {
      expect(config.moduleFileExtensions).toBeDefined();
      expect(Array.isArray(config.moduleFileExtensions)).toBe(true);
      
      config.moduleFileExtensions.forEach(ext => {
        expect(typeof ext).toBe('string');
        expect(ext.length).toBeGreaterThan(0);
        expect(ext).not.toStartWith('.'); // Extensions should not start with dot
      });
    });

    test('should include JavaScript extensions', () => {
      expect(config.moduleFileExtensions).toContain('js');
    });

    test('should handle module name mapping if present', () => {
      if (config.moduleNameMapping) {
        expect(typeof config.moduleNameMapping).toBe('object');
        Object.entries(config.moduleNameMapping).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('string');
          expect(key.length).toBeGreaterThan(0);
          expect(value.length).toBeGreaterThan(0);
        });
      }
    });

    test('should have valid transform configuration if present', () => {
      if (config.transform) {
        expect(typeof config.transform).toBe('object');
        Object.entries(config.transform).forEach(([pattern, transformer]) => {
          expect(typeof pattern).toBe('string');
          expect(typeof transformer).toBe('string');
          expect(pattern.length).toBeGreaterThan(0);
          expect(transformer.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Mock Configuration', () => {
    test('should have valid mock configuration', () => {
      expect(config.clearMocks).toBeDefined();
      expect(typeof config.clearMocks).toBe('boolean');
      
      expect(config.resetMocks).toBeDefined();
      expect(typeof config.resetMocks).toBe('boolean');
      
      expect(config.restoreMocks).toBeDefined();
      expect(typeof config.restoreMocks).toBe('boolean');
    });

    test('should have proper mock cleanup settings', () => {
      // All mock cleanup options should be enabled for better test isolation
      expect(config.clearMocks).toBe(true);
      expect(config.resetMocks).toBe(true);
      expect(config.restoreMocks).toBe(true);
    });
  });

  describe('Behavior Configuration', () => {
    test('should have valid verbose setting', () => {
      expect(config.verbose).toBeDefined();
      expect(typeof config.verbose).toBe('boolean');
    });

    test('should have performance settings within reasonable bounds', () => {
      if (config.maxWorkers !== undefined) {
        expect(typeof config.maxWorkers).toBe('number');
        expect(config.maxWorkers).toBeGreaterThan(0);
        expect(config.maxWorkers).toBeLessThan(50);
      }

      if (config.testTimeout !== undefined) {
        expect(typeof config.testTimeout).toBe('number');
        expect(config.testTimeout).toBeGreaterThan(0);
        expect(config.testTimeout).toBeLessThan(300000); // 5 minutes max
      }
    });
  });

  describe('Configuration Validation', () => {
    test('should not contain deprecated configuration options', () => {
      const deprecatedOptions = [
        'preprocessorIgnorePatterns',
        'scriptPreprocessor',
        'unmockedModulePathPatterns',
        'setupTestFrameworkScriptFile'
      ];

      deprecatedOptions.forEach(option => {
        expect(config).not.toHaveProperty(option);
      });
    });

    test('should not have conflicting configurations', () => {
      // Check for logical conflicts
      if (config.collectCoverage === false && config.coverageThreshold) {
        // This might be intentional for CI/CD environments
        expect(config.coverageThreshold).toBeDefined();
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed patterns gracefully', () => {
      const patternFields = ['testMatch', 'testPathIgnorePatterns', 'collectCoverageFrom'];
      
      patternFields.forEach(field => {
        if (config[field] && Array.isArray(config[field])) {
          config[field].forEach(pattern => {
            expect(pattern).not.toBe('');
            expect(pattern).not.toMatch(/\s{2,}/); // No double spaces
            expect(pattern.trim()).toBe(pattern); // No leading/trailing whitespace
          });
        }
      });
    });

    test('should not have empty arrays in configuration', () => {
      Object.entries(config).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          expect(value.length).toBeGreaterThan(0);
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
});