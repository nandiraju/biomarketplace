# iCore Clinical Biobank Marketplace

This repository hosts a clinical biobank marketplace mockup designed under the 1Cell.Ai branding guidelines. It coordinates biosample procurement workflows across distributed laboratory networks (LIMS nodes) and research sponsors.

## Key Features

1. **Dual Landing Pages & Role Gateways**:
   - **Unified Gateway**: An entry screen allowing users to choose their operational pathway.
   - **Sponsor & Researcher Portal**: Tailored for research leads to publish study cohorts, review pricing quotes, pay biobanks directly, and track transit logistics.
   - **Biobank Partner Portal**: Tailored for repository managers to synchronize catalogs with physical inventories, submit price estimates, match specimen barcodes, and dispatch packages.
2. **Direct Payout Model**:
   - Payments are transferred wallet-to-wallet directly from the researcher to the target biobank core upon quote acceptance (bypassing escrow holds for streamlined laboratory cash flow).
3. **iTracker Cold-Chain System**:
   - Real-time dry-ice thermal telemetry logging (`-80°C`) and simulated GPS cargo tracking.
4. **Direct Financial Ledger**:
   - Transparent ledger documenting transactions, payouts, and earnings summaries for each laboratory node (Dana-Farber `DFCI`, MD Anderson `MDAB`, and Mayo Clinic `MCTH`).

---

## Accessing and Launching Portals

### 1. Local Development Launch

First, ensure you have [Node.js](https://nodejs.org/) installed, then execute:

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Once running, navigate to the local server URL (usually `http://localhost:5173`) in your browser.

- You will land on the **Unified Gateway Page**.
- Click **Enter Sponsor Portal** to view the **Sponsor & Researcher Landing Page** and click **Start your biobank request** to open the Researcher Dashboard.
- Click **Enter Biobank Portal** to view the **Biobank Partner Landing Page** and click **Access Biobank Core Portal** to open the Biobank Login Form.

### 2. Biobank Login Authorization

To access LIMS inventories and submit quotes:
- Select your target Biobank node (e.g. *Dana-Farber Cancer Biobank*).
- Enter any token/password for sandbox credentials (sandbox bypasses validation).
- Once connected, the sidebar updates with your coordinator profile, and you can access the quoting and inventory workspaces.

---

## Deployment to GitHub Pages

This project is configured for seamless deployment to GitHub Pages at:
`https://nandiraju.github.io/biomarketplace/`

### 1. Configuration Settings
- **Base URL Path**: The base path is set to `/biomarketplace/` in `vite.config.js` to handle relative routing under subfolders.
- **Relative Assets**: All core icons and logo image paths (`logo-dark-text.png`, `logo-light-text.png`) use base-relative paths to prevent `404` loading errors.

### 2. Automated Deployment Workflow
A GitHub Actions workflow is active under `.github/workflows/deploy.yml`. 

To deploy:
1. Make sure GitHub Pages deployment source is set to **GitHub Actions** in your repository settings:
   - Go to `Settings` -> `Pages` in your GitHub repository.
   - Under `Build and deployment` -> `Source`, select **GitHub Actions**.
2. Commit your local changes and push to the remote repository:
   ```bash
   git add .
   git commit -m "Configure direct payments, dual landing pages, and deployment"
   git push -u origin main
   ```
3. GitHub Actions will automatically compile the React bundle and deploy the static artifacts to GitHub Pages.
