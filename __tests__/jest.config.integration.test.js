const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Jest Configuration Integration Tests', () => {
  let config;

  beforeEach(() => {
    delete require.cache[require.resolve('../jest.config.js')];
    config = require('../jest.config.js');
  });

  describe('Configuration Loading', () => {
    test('should load configuration without syntax errors', () => {
      expect(() => {
        const loadedConfig = require('../jest.config.js');
        expect(loadedConfig).toBeDefined();
      }).not.toThrow();
    });

    test('should be loadable by Jest CLI', (done) => {
      const jestProcess = spawn('node', ['-e', `
        try {
          const config = require('./jest.config.js');
          console.log('CONFIG_LOADED');
          process.exit(0);
        } catch (error) {
          console.error('CONFIG_ERROR:', error.message);
          process.exit(1);
        }
      `], { cwd: process.cwd() });

      let output = '';
      jestProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      jestProcess.stderr.on('data', (data) => {
        output += data.toString();
      });

      jestProcess.on('close', (code) => {
        expect(output).toContain('CONFIG_LOADED');
        expect(code).toBe(0);
        done();
      });
    }, 10000);
  });

  describe('File System Integration', () => {
    test('should reference valid paths', () => {
      // Test setup files exist if configured
      if (config.setupFilesAfterEnv) {
        config.setupFilesAfterEnv.forEach(file => {
          const resolvedPath = path.resolve(file);
          // Only check if file exists if it's not a node_modules package
          if (!file.startsWith('@') && !file.includes('node_modules')) {
            expect(fs.existsSync(resolvedPath)).toBe(true);
          }
        });
      }

      if (config.setupFiles) {
        config.setupFiles.forEach(file => {
          const resolvedPath = path.resolve(file);
          if (!file.startsWith('@') && !file.includes('node_modules')) {
            expect(fs.existsSync(resolvedPath)).toBe(true);
          }
        });
      }
    });

    test('should validate glob patterns match expected file structure', () => {
      if (config.testMatch) {
        config.testMatch.forEach(pattern => {
          // Basic validation that patterns are glob-like
          expect(pattern).toMatch(/\*|\?|\[|\]/);
          expect(pattern).not.toMatch(/\*\*\*+/); // No triple asterisks
        });
      }
    });

    test('should have coverage directory that can be created', () => {
      if (config.coverageDirectory) {
        const coverageDir = path.resolve(config.coverageDirectory);
        // Directory should be a valid path
        expect(path.isAbsolute(coverageDir)).toBe(true);
        
        // Test that parent directory exists or can be created
        const parentDir = path.dirname(coverageDir);
        expect(fs.existsSync(parentDir) || parentDir === path.resolve('.')).toBe(true);
      }
    });
  });

  describe('Pattern Matching Integration', () => {
    test('should have patterns that can match real files', () => {
      // Create a temporary test file to verify patterns work
      const testFile = path.join(__dirname, 'temp.test.js');
      fs.writeFileSync(testFile, 'test("dummy", () => {});');

      try {
        const matchesTestPattern = config.testMatch.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(testFile);
        });

        expect(matchesTestPattern).toBe(true);
      } finally {
        // Clean up
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
      }
    });

    test('should properly ignore specified paths', () => {
      const shouldIgnore = [
        'node_modules/some-package/test.js',
        'dist/bundle.test.js',
        'build/output.test.js'
      ];

      shouldIgnore.forEach(testPath => {
        const shouldBeIgnored = config.testPathIgnorePatterns.some(pattern => {
          const regex = new RegExp(pattern);
          return regex.test(testPath);
        });
        expect(shouldBeIgnored).toBe(true);
      });
    });
  });

  describe('Coverage Integration', () => {
    test('should have coverage patterns that target source files', () => {
      const sourceFiles = [
        'src/index.js',
        'src/utils/helper.js',
        'src/components/Button.js'
      ];

      sourceFiles.forEach(sourceFile => {
        const shouldInclude = config.collectCoverageFrom.some(pattern => {
          if (pattern.startsWith('!')) return false;
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(sourceFile);
        });
        expect(shouldInclude).toBe(true);
      });
    });

    test('should exclude test files from coverage', () => {
      const testFiles = [
        'src/index.test.js',
        'src/utils/helper.spec.js',
        '__tests__/setup.js'
      ];

      testFiles.forEach(testFile => {
        const shouldExclude = config.collectCoverageFrom.some(pattern => {
          if (!pattern.startsWith('!')) return false;
          const regex = new RegExp(pattern.substring(1).replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(testFile);
        });
        expect(shouldExclude).toBe(true);
      });
    });
  });

  describe('Module Resolution Integration', () => {
    test('should handle module extensions correctly', () => {
      expect(config.moduleFileExtensions).toContain('js');
      
      // Test that common file extensions are supported
      const importantExtensions = ['js', 'json'];
      importantExtensions.forEach(ext => {
        expect(config.moduleFileExtensions).toContain(ext);
      });
    });

    test('should validate transform patterns if present', () => {
      if (config.transform) {
        Object.keys(config.transform).forEach(pattern => {
          // Test that pattern is a valid regex
          expect(() => new RegExp(pattern)).not.toThrow();
        });
      }
    });
  });
});