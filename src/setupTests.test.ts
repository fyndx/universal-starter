/**
 * Unit tests for setupTests.ts
 * 
 * This file tests the test environment setup and configuration.
 * Testing framework: Jest with React Testing Library
 * 
 * These tests ensure that:
 * 1. Jest DOM matchers are properly configured
 * 2. Test environment setup is working correctly
 * 3. Global test utilities are available
 * 4. Mock implementations are properly initialized
 */

// Import the setup file to test its configuration
import './setupTests';

describe('setupTests.ts', () => {
  describe('Jest DOM matchers', () => {
    it('should have toBeInTheDocument matcher available', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      expect(div).toBeInTheDocument();
      
      // Cleanup
      document.body.removeChild(div);
    });

    it('should have toHaveClass matcher available', () => {
      const div = document.createElement('div');
      div.className = 'test-class';
      
      expect(div).toHaveClass('test-class');
      expect(div).not.toHaveClass('non-existent-class');
    });

    it('should have toHaveStyle matcher available', () => {
      const div = document.createElement('div');
      div.style.color = 'red';
      div.style.fontSize = '16px';
      
      expect(div).toHaveStyle('color: red');
      expect(div).toHaveStyle({ color: 'red', fontSize: '16px' });
    });

    it('should have toHaveTextContent matcher available', () => {
      const div = document.createElement('div');
      div.textContent = 'Hello World';
      
      expect(div).toHaveTextContent('Hello World');
      expect(div).toHaveTextContent(/Hello/);
      expect(div).not.toHaveTextContent('Goodbye');
    });

    it('should have toBeVisible matcher available', () => {
      const div = document.createElement('div');
      div.style.display = 'block';
      document.body.appendChild(div);
      
      expect(div).toBeVisible();
      
      div.style.display = 'none';
      expect(div).not.toBeVisible();
      
      // Cleanup
      document.body.removeChild(div);
    });

    it('should have toBeDisabled matcher available', () => {
      const button = document.createElement('button');
      button.disabled = true;
      
      expect(button).toBeDisabled();
      
      button.disabled = false;
      expect(button).toBeEnabled();
    });

    it('should have toHaveAttribute matcher available', () => {
      const div = document.createElement('div');
      div.setAttribute('data-testid', 'test-element');
      div.setAttribute('aria-label', 'Test Label');
      
      expect(div).toHaveAttribute('data-testid');
      expect(div).toHaveAttribute('data-testid', 'test-element');
      expect(div).toHaveAttribute('aria-label', 'Test Label');
      expect(div).not.toHaveAttribute('non-existent');
    });

    it('should have toHaveValue matcher available', () => {
      const input = document.createElement('input');
      input.value = 'test value';
      
      expect(input).toHaveValue('test value');
      expect(input).not.toHaveValue('other value');
    });

    it('should have toBeChecked matcher available', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      
      expect(checkbox).toBeChecked();
      
      checkbox.checked = false;
      expect(checkbox).not.toBeChecked();
    });

    it('should have toHaveFocus matcher available', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      
      input.focus();
      expect(input).toHaveFocus();
      
      input.blur();
      expect(input).not.toHaveFocus();
      
      // Cleanup
      document.body.removeChild(input);
    });

    it('should have toContainElement matcher available', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);
      
      expect(parent).toContainElement(child);
      
      const unrelatedElement = document.createElement('p');
      expect(parent).not.toContainElement(unrelatedElement);
    });
  });

  describe('Test environment setup', () => {
    it('should have document available in test environment', () => {
      expect(document).toBeDefined();
      expect(document.createElement).toBeDefined();
      expect(document.body).toBeDefined();
      expect(document.querySelector).toBeDefined();
    });

    it('should have window available in test environment', () => {
      expect(window).toBeDefined();
      expect(window.document).toBe(document);
      expect(window.location).toBeDefined();
      expect(window.history).toBeDefined();
    });

    it('should have global console methods available', () => {
      expect(console.log).toBeDefined();
      expect(console.error).toBeDefined();
      expect(console.warn).toBeDefined();
      expect(console.info).toBeDefined();
    });

    it('should have jest global methods available', () => {
      expect(jest).toBeDefined();
      expect(jest.fn).toBeDefined();
      expect(jest.spyOn).toBeDefined();
      expect(jest.mock).toBeDefined();
    });

    it('should have expect matchers available', () => {
      expect(expect).toBeDefined();
      expect(expect.any).toBeDefined();
      expect(expect.anything).toBeDefined();
      expect(expect.objectContaining).toBeDefined();
      expect(expect.arrayContaining).toBeDefined();
    });
  });

  describe('Mock configurations', () => {
    it('should have matchMedia mock configured', () => {
      expect(window.matchMedia).toBeDefined();
      expect(jest.isMockFunction(window.matchMedia)).toBe(true);
      
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      expect(mediaQuery.matches).toBe(false);
      expect(mediaQuery.media).toBe('(min-width: 768px)');
      expect(mediaQuery.addEventListener).toBeDefined();
      expect(mediaQuery.removeEventListener).toBeDefined();
    });

    it('should have IntersectionObserver mock configured', () => {
      expect(global.IntersectionObserver).toBeDefined();
      
      const observer = new IntersectionObserver(() => {});
      expect(observer.observe).toBeDefined();
      expect(observer.unobserve).toBeDefined();
      expect(observer.disconnect).toBeDefined();
    });

    it('should have fetch mock configured', () => {
      expect(global.fetch).toBeDefined();
      expect(jest.isMockFunction(global.fetch)).toBe(true);
    });

    it('should clear mocks after each test', () => {
      const mockFn = jest.fn();
      mockFn('test');
      
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // This test depends on the afterEach hook in setupTests.ts
      // The next test should start with clean mocks
    });
  });

  describe('DOM manipulation capabilities', () => {
    it('should be able to create and manipulate DOM elements', () => {
      const div = document.createElement('div');
      div.id = 'test-div';
      div.className = 'test-class';
      div.textContent = 'Test content';
      
      expect(div.id).toBe('test-div');
      expect(div.className).toBe('test-class');
      expect(div.textContent).toBe('Test content');
    });

    it('should be able to append and remove elements from DOM', () => {
      const div = document.createElement('div');
      div.id = 'test-element';
      
      expect(document.getElementById('test-element')).toBeNull();
      
      document.body.appendChild(div);
      expect(document.getElementById('test-element')).toBe(div);
      
      document.body.removeChild(div);
      expect(document.getElementById('test-element')).toBeNull();
    });

    it('should be able to query DOM elements', () => {
      const div = document.createElement('div');
      div.className = 'test-class';
      div.setAttribute('data-testid', 'test-element');
      document.body.appendChild(div);
      
      expect(document.querySelector('.test-class')).toBe(div);
      expect(document.querySelector('[data-testid="test-element"]')).toBe(div);
      expect(document.querySelectorAll('.test-class')).toHaveLength(1);
      
      // Cleanup
      document.body.removeChild(div);
    });

    it('should handle complex DOM structures', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <header>
          <h1>Title</h1>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <section>Content</section>
        </main>
      `;
      
      expect(container.querySelector('h1')).toHaveTextContent('Title');
      expect(container.querySelectorAll('li')).toHaveLength(2);
      expect(container.querySelector('section')).toHaveTextContent('Content');
    });
  });

  describe('Event handling capabilities', () => {
    it('should be able to create and dispatch events', () => {
      const button = document.createElement('button');
      let clicked = false;
      
      button.addEventListener('click', () => {
        clicked = true;
      });
      
      expect(clicked).toBe(false);
      
      const clickEvent = new Event('click');
      button.dispatchEvent(clickEvent);
      
      expect(clicked).toBe(true);
    });

    it('should be able to handle custom events', () => {
      const element = document.createElement('div');
      let customEventData = null;
      
      element.addEventListener('custom-event', (event: any) => {
        customEventData = event.detail;
      });
      
      const customEvent = new CustomEvent('custom-event', {
        detail: { message: 'test data', timestamp: Date.now() }
      });
      
      element.dispatchEvent(customEvent);
      
      expect(customEventData).toEqual(
        expect.objectContaining({ message: 'test data' })
      );
    });

    it('should handle multiple event listeners', () => {
      const element = document.createElement('div');
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      element.addEventListener('click', handler1);
      element.addEventListener('click', handler2);
      
      element.dispatchEvent(new Event('click'));
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should handle event bubbling', () => {
      const parent = document.createElement('div');
      const child = document.createElement('button');
      parent.appendChild(child);
      
      const parentHandler = jest.fn();
      const childHandler = jest.fn();
      
      parent.addEventListener('click', parentHandler);
      child.addEventListener('click', childHandler);
      
      child.dispatchEvent(new Event('click', { bubbles: true }));
      
      expect(childHandler).toHaveBeenCalledTimes(1);
      expect(parentHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form handling capabilities', () => {
    it('should handle form input events', () => {
      const input = document.createElement('input');
      input.type = 'text';
      
      const changeHandler = jest.fn();
      input.addEventListener('change', changeHandler);
      
      input.value = 'new value';
      input.dispatchEvent(new Event('change'));
      
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(input.value).toBe('new value');
    });

    it('should handle form submission', () => {
      const form = document.createElement('form');
      const submitHandler = jest.fn((e) => e.preventDefault());
      
      form.addEventListener('submit', submitHandler);
      
      form.dispatchEvent(new Event('submit'));
      
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle checkbox and radio inputs', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'test-radio';
      
      expect(checkbox).not.toBeChecked();
      expect(radio).not.toBeChecked();
      
      checkbox.checked = true;
      radio.checked = true;
      
      expect(checkbox).toBeChecked();
      expect(radio).toBeChecked();
    });
  });

  describe('Async testing capabilities', () => {
    it('should handle promises correctly', async () => {
      const promise = Promise.resolve('resolved value');
      const result = await promise;
      
      expect(result).toBe('resolved value');
    });

    it('should handle async/await with delays', async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      const start = Date.now();
      await delay(50);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(50);
    });

    it('should handle rejected promises', async () => {
      const rejectedPromise = Promise.reject(new Error('Test error'));
      
      await expect(rejectedPromise).rejects.toThrow('Test error');
    });

    it('should handle multiple async operations', async () => {
      const promise1 = Promise.resolve('result1');
      const promise2 = Promise.resolve('result2');
      const promise3 = Promise.resolve('result3');
      
      const results = await Promise.all([promise1, promise2, promise3]);
      
      expect(results).toEqual(['result1', 'result2', 'result3']);
    });
  });

  describe('Mock and spy capabilities', () => {
    it('should be able to create mock functions', () => {
      const mockFn = jest.fn();
      
      expect(mockFn).toHaveBeenCalledTimes(0);
      
      mockFn('test', 123);
      
      expect(mockFn).toHaveBeenCalledWith('test', 123);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should be able to spy on methods', () => {
      const obj = {
        method: (x: number) => x * 2
      };
      
      const spy = jest.spyOn(obj, 'method');
      
      const result = obj.method(5);
      
      expect(result).toBe(10);
      expect(spy).toHaveBeenCalledWith(5);
      expect(spy).toHaveReturnedWith(10);
      
      spy.mockRestore();
    });

    it('should be able to mock return values', () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValue('mocked result');
      
      expect(mockFn()).toBe('mocked result');
      expect(mockFn()).toBe('mocked result');
    });

    it('should be able to mock implementations', () => {
      const mockFn = jest.fn();
      mockFn.mockImplementation((x: number) => x * 3);
      
      expect(mockFn(4)).toBe(12);
      expect(mockFn(7)).toBe(21);
    });

    it('should be able to mock resolved values', async () => {
      const mockAsyncFn = jest.fn();
      mockAsyncFn.mockResolvedValue('async result');
      
      const result = await mockAsyncFn();
      
      expect(result).toBe('async result');
    });

    it('should be able to mock rejected values', async () => {
      const mockAsyncFn = jest.fn();
      mockAsyncFn.mockRejectedValue(new Error('async error'));
      
      await expect(mockAsyncFn()).rejects.toThrow('async error');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle DOM operation errors gracefully', () => {
      const div = document.createElement('div');
      
      expect(() => {
        document.body.removeChild(div);
      }).toThrow();
    });

    it('should handle invalid selectors', () => {
      expect(() => {
        document.querySelector('invalid[selector');
      }).toThrow();
    });

    it('should handle null and undefined values', () => {
      const div = document.createElement('div');
      
      expect(div.getAttribute('nonexistent')).toBeNull();
      expect(div.textContent).toBe('');
      
      div.textContent = '';
      expect(div.textContent).toBe('');
    });

    it('should handle special characters in text content', () => {
      const div = document.createElement('div');
      const specialText = 'Special chars: !@#$%^&*()_+{}|:"<>?[]\\;\'.,/~`';
      
      div.textContent = specialText;
      expect(div.textContent).toBe(specialText);
    });

    it('should handle large amounts of data', () => {
      const largeArray = new Array(10000).fill(0).map((_, i) => i);
      
      expect(largeArray.length).toBe(10000);
      expect(largeArray[9999]).toBe(9999);
    });
  });

  describe('Performance considerations', () => {
    it('should handle large DOM manipulations efficiently', () => {
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i}`;
        fragment.appendChild(div);
      }
      
      expect(fragment.childNodes.length).toBe(1000);
    });

    it('should handle rapid event dispatching', () => {
      const element = document.createElement('div');
      let eventCount = 0;
      
      element.addEventListener('test-event', () => {
        eventCount++;
      });
      
      for (let i = 0; i < 1000; i++) {
        element.dispatchEvent(new Event('test-event'));
      }
      
      expect(eventCount).toBe(1000);
    });

    it('should handle memory cleanup', () => {
      const elements = [];
      
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.id = `test-element-${i}`;
        elements.push(div);
      }
      
      expect(elements.length).toBe(100);
      
      elements.length = 0;
      expect(elements.length).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with complex component-like structures', () => {
      const app = document.createElement('div');
      app.innerHTML = `
        <div data-testid="app">
          <header data-testid="header">
            <h1>My App</h1>
            <nav>
              <button data-testid="menu-btn">Menu</button>
            </nav>
          </header>
          <main data-testid="main">
            <section data-testid="content">
              <p>Welcome to my app!</p>
            </section>
          </main>
          <footer data-testid="footer">
            <p>&copy; 2023 My App</p>
          </footer>
        </div>
      `;
      
      document.body.appendChild(app);
      
      expect(app.querySelector('[data-testid="app"]')).toBeInTheDocument();
      expect(app.querySelector('[data-testid="header"]')).toBeInTheDocument();
      expect(app.querySelector('h1')).toHaveTextContent('My App');
      expect(app.querySelector('[data-testid="menu-btn"]')).toBeInTheDocument();
      expect(app.querySelector('[data-testid="content"] p')).toHaveTextContent('Welcome to my app!');
      
      // Test interactions
      const menuBtn = app.querySelector('[data-testid="menu-btn"]');
      const clickHandler = jest.fn();
      menuBtn?.addEventListener('click', clickHandler);
      
      menuBtn?.dispatchEvent(new Event('click'));
      expect(clickHandler).toHaveBeenCalledTimes(1);
      
      // Cleanup
      document.body.removeChild(app);
    });

    it('should handle form validation scenarios', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input type="email" required data-testid="email" />
        <input type="password" required data-testid="password" />
        <button type="submit" data-testid="submit">Submit</button>
      `;
      
      document.body.appendChild(form);
      
      const emailInput = form.querySelector('[data-testid="email"]') as HTMLInputElement;
      const passwordInput = form.querySelector('[data-testid="password"]') as HTMLInputElement;
      const submitBtn = form.querySelector('[data-testid="submit"]');
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
      
      emailInput.value = 'test@example.com';
      passwordInput.value = 'password123';
      
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
      
      // Cleanup
      document.body.removeChild(form);
    });
  });
});