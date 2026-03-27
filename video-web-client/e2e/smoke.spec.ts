import { expect, test } from '@playwright/test'

test.describe('App Smoke Test', () => {
  test('redirects to trending and loads layout', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*\/trending/)
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('h1')).toContainText('Trending')
  })

  test('navigates to login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/.*\/login/)
  })
})
