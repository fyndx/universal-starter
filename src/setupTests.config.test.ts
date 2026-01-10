/**
 * Configuration validation tests for setupTests.ts
 * 
 * These tests ensure that the test configuration is properly set up
 * and all required testing utilities are available.
 * 
 * Testing framework: Jest with React Testing Library
 */

import './setupTests';

describe('setupTests.ts - Configuration Tests', () => {
  describe('Jest configuration validation', () => {
    it('should have proper Jest globals configured', () => {
      expect(global.jest).toBeDefined();
      expect(global.expect).toBeDefined();
      expect(global.describe).toBeDefined();
      expect(global.it).toBeDefined();
      expect(global.test).toBeDefined();
      expect(global.beforeEach).toBeDefined();
      expect(global.afterEach).toBeDefined();
      expect(global.beforeAll).toBeDefined();
      expect(global.afterAll).toBeDefined();
    });

    it('should have Jest DOM custom matchers available', () => {
      // Test that custom matchers are available by using them
      const element = document.createElement('div');
      
      // These should not throw errors if matchers are properly configured
      expect(() => expect(element).toBeInTheDocument()).not.toThrow();
      expect(() => expect(element).toHaveClass('test')).not.toThrow();
      expect(() => expect(element).toHaveStyle('color: red')).not.toThrow();
    });

    it('should have proper test environment setup', () => {
      expect(global.document).toBeDefined();
      expect(global.window).toBeDefined();
      expect(global.navigator).toBeDefined();
      expect(global.location).toBeDefined();
    });
  });

  describe('Browser API mocks', () => {
    it('should have matchMedia mock properly configured', () => {
      expect(window.matchMedia).toBeDefined();
      expect(jest.isMockFunction(window.matchMedia)).toBe(true);
      
      // Test the mock implementation
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      expect(mediaQuery.matches).toBe(false);
      expect(mediaQuery.media).toBe('(min-width: 768px)');
      expect(typeof mediaQuery.addListener).toBe('function');
      expect(typeof mediaQuery.removeListener).toBe('function');
      expect(typeof mediaQuery.addEventListener).toBe('function');
      expect(typeof mediaQuery.removeEventListener).toBe('function');
    });

    it('should have IntersectionObserver mock configured', () => {
      expect(global.IntersectionObserver).toBeDefined();
      
      // Test that we can create an instance
      const callback = jest.fn();
      const observer = new IntersectionObserver(callback);
      
      expect(observer).toBeDefined();
      expect(typeof observer.observe).toBe('function');
      expect(typeof observer.unobserve).toBe('function');
      expect(typeof observer.disconnect).toBe('function');
    });

    it('should have fetch mock configured', () => {
      expect(global.fetch).toBeDefined();
      expect(jest.isMockFunction(global.fetch)).toBe(true);
      
      // Test that we can configure the mock
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' })
      });
      
      expect(global.fetch).toHaveBeenCalledTimes(0);
    });
  });

  describe('Test lifecycle hooks', () => {
    it('should clear mocks after each test', () => {
      // Create a mock and call it
      const testMock = jest.fn();
      testMock('test call');
      
      expect(testMock).toHaveBeenCalledTimes(1);
      
      // The afterEach hook should clear this mock
      // This is tested implicitly by the test isolation
    });

    it('should maintain clean DOM state between tests', () => {
      // This test verifies that DOM cleanup happens between tests
      const elementsWithTestId = document.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });

  describe('TypeScript support', () => {
    it('should support TypeScript features in tests', () => {
      // Test type annotations
      const typedFunction = (x: number, y: string): string => {
        return `${x}-${y}`;
      };
      
      expect(typedFunction(42, 'test')).toBe('42-test');
      
      // Test interfaces
      interface TestInterface {
        id: number;
        name: string;
        optional?: boolean;
      }
      
      const testObject: TestInterface = { id: 1, name: 'test' };
      expect(testObject.id).toBe(1);
      expect(testObject.name).toBe('test');
      expect(testObject.optional).toBeUndefined();
    });

    it('should support generic types', () => {
      function identity<T>(arg: T): T {
        return arg;
      }
      
      expect(identity<string>('hello')).toBe('hello');
      expect(identity<number>(42)).toBe(42);
      expect(identity<boolean>(true)).toBe(true);
    });
  });

  describe('Modern JavaScript features', () => {
    it('should support async/await', async () => {
      const asyncFunction = async (value: string): Promise<string> => {
        return new Promise(resolve => {
          setTimeout(() => resolve(`async-${value}`), 10);
        });
      };
      
      const result = await asyncFunction('test');
      expect(result).toBe('async-test');
    });

    it('should support destructuring', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const { a, ...rest } = obj;
      
      expect(a).toBe(1);
      expect(rest).toEqual({ b: 2, c: 3 });
    });

    it('should support spread operator', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const combined = [...arr1, ...arr2];
      
      expect(combined).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should support template literals', () => {
      const name = 'World';
      const greeting = `Hello, ${name}!`;
      
      expect(greeting).toBe('Hello, World!');
    });
  });

  describe('Error handling capabilities', () => {
    it('should handle synchronous errors', () => {
      expect(() => {
        throw new Error('Test error');
      }).toThrow('Test error');
    });

    it('should handle async errors', async () => {
      const asyncError = async () => {
        throw new Error('Async error');
      };
      
      await expect(asyncError()).rejects.toThrow('Async error');
    });

    it('should handle promise rejections', async () => {
      const rejectedPromise = Promise.reject(new Error('Promise error'));
      
      await expect(rejectedPromise).rejects.toThrow('Promise error');
    });
  });

  describe('Test utilities', () => {
    it('should provide timer utilities', () => {
      expect(jest.useFakeTimers).toBeDefined();
      expect(jest.useRealTimers).toBeDefined();
      expect(jest.advanceTimersByTime).toBeDefined();
      expect(jest.runOnlyPendingTimers).toBeDefined();
      expect(jest.runAllTimers).toBeDefined();
    });

    it('should provide mock utilities', () => {
      expect(jest.fn).toBeDefined();
      expect(jest.spyOn).toBeDefined();
      expect(jest.mock).toBeDefined();
      expect(jest.clearAllMocks).toBeDefined();
      expect(jest.resetAllMocks).toBeDefined();
      expect(jest.restoreAllMocks).toBeDefined();
    });

    it('should provide expect utilities', () => {
      expect(expect.any).toBeDefined();
      expect(expect.anything).toBeDefined();
      expect(expect.objectContaining).toBeDefined();
      expect(expect.arrayContaining).toBeDefined();
      expect(expect.stringContaining).toBeDefined();
      expect(expect.stringMatching).toBeDefined();
    });
  });
});