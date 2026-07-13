# Vendor Invoice Portal (Test Fixture)

A pure static website serving as a test fixture for an AI web scraping agent. It requires zero build steps and functions immediately when hosted at the root of a GitHub Pages domain.

## Authentication
The portal simulates a basic login gateway. 
* **Username:** `admin`
* **Password:** `admin`

For MFA login:
* **Username:** `admin2`
* **Password:** `admin2`

Login is verified client-side using JavaScript. Upon success, a `sessionStorage` flag (`auth=true`) is created. If an agent attempts to access `invoices.html` or `invoice.html` without this flag, it will be forcefully redirected to `index.html`.

## Date Generation Logic
To ensure the test fixture is always relevant, invoices are generated dynamically on page load in `invoices.html`. The script calculates exactly 61 invoices, ranging from **30 days prior** to today's date, to **30 days ahead** of today's date. The Due Date is always calculated as `Invoice Date + 14 days`.

## Customizing the Single Invoice View
In `invoice.html`, look for the large comment block titled `TEMPLATE INJECTION ZONE`. 
1. Delete the placeholder HTML inside the box.
2. Paste your own invoice formatting/branding.
3. Keep the specific `<span>` tags with the IDs `dyn-id`, `dyn-date`, `dyn-due`, and `dyn-amount`. The JavaScript at the bottom of the file reads URL search parameters from `invoices.html` and injects the dynamic values into these exact IDs.
4. To add a static PDF, update the `href=""` inside the `<a class="pdf-btn">` tag in the template block to point to your provided PDF file (e.g., `href="Adjusted_Invoice.pdf"`).

## How to Publish on GitHub Pages
1. Create a new repository on GitHub.
2. Commit and push these 5 files directly to the root of the `main` branch.
3. In your repository on GitHub, navigate to **Settings** > **Pages**.
4. Under "Build and deployment", set the **Source** to "Deploy from a branch".
5. Set the **Branch** to `main` and the folder to `/ (root)`.
6. Click **Save**. Within a few minutes, your static site will be live and ready for your AI agent to test.
