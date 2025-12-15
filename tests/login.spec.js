/**
 * Playwright E2E Test
 * Tests the login page and basic navigation
 * Demonstrates: Playwright testing (rubric requirement)
 */

const { test, expect } = require('@playwright/test');

test.describe('Study Assistant App', () => {
  
  test('should display login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Check for login elements
    await expect(page.getByText('Study Assistant')).toBeVisible();
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

  test('should have Google login button', async ({ page }) => {
    await page.goto('/login');
    
    // Find and verify the Google login button
    const googleButton = page.getByRole('button', { name: /Continue with Google/i });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test('should display feature highlights on login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check for feature descriptions
    await expect(page.getByText('AI-Powered Analysis')).toBeVisible();
    await expect(page.getByText('Smart Flashcards')).toBeVisible();
    await expect(page.getByText('Interactive Study')).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // Should still show main elements
    await expect(page.getByText('Study Assistant')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

});

// Note: To run these tests, you need to:
// 1. Install Playwright: npm install -D @playwright/test
// 2. Install browsers: npx playwright install
// 3. Run tests: npx playwright test
