# Deployment runbook -- cecilecallens.art on Netlify

This file is the step-by-step human runbook for shipping the site.
Everything that can be done in code/config is already done (netlify.toml,
Identity widget, base layout snippet). What remains requires the Netlify
dashboard, GitHub, and DNS access.

---

## 1. Create the GitHub repository

1. Go to <https://github.com/new>.
2. Repository name: **cecilecallens** (under the account that will own the
   Netlify connection -- use `cecilecallens` org if it exists, or your own
   account).
3. Visibility: **Private** (paintings are copyrighted work).
4. Do NOT initialise with a README, .gitignore or licence.
5. In your terminal, from the project root:

```bash
cd /Users/vincent/Developer/cedar/cecilecallens
git remote add origin git@github.com:<owner>/cecilecallens.git
git push -u origin main
```

Replace `<owner>` with the GitHub username or org.

The old repo `cecilecallens/cecilecallens.github.io` stays untouched as a
rollback.

---

## 2. Create the Netlify site

1. Log into <https://app.netlify.com>.
2. Click **Add new site > Import an existing project**.
3. Connect to **GitHub** and select the `cecilecallens` repository.
4. Netlify should auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 22 (set in netlify.toml)
5. Click **Deploy site**.
6. Wait for the first build to succeed. Check the deploy log for errors.
7. Note the auto-generated Netlify URL (e.g.
   `https://random-name.netlify.app`). Verify the site loads correctly.

---

## 3. Enable Netlify Identity

> Netlify Identity and Git Gateway are in maintenance mode. If you cannot
> enable a new Identity instance, skip to section 10 (Fallback: GitHub
> OAuth).

1. In the Netlify dashboard, go to **Site configuration > Identity**.
2. Click **Enable Identity**.
3. Under **Registration**, select **Invite only** (the artist is the only
   editor; no open signups).
4. Under **External providers**, you can leave this empty (email+password is
   fine for a single user).
5. Go to the **Identity** tab and click **Invite users**.
6. Enter: `cecilecallensartiste@gmail.com`
7. The artist will receive an email invitation. She clicks the link, sets a
   password, and her account is created.

---

## 4. Enable Git Gateway

1. In the Netlify dashboard, go to **Site configuration > Identity > Services**.
2. Under **Git Gateway**, click **Enable Git Gateway**.
3. If prompted, grant Netlify access to the GitHub repository.
4. Git Gateway is now active. Decap CMS will use it to commit changes on
   behalf of the authenticated user.

---

## 5. End-to-end test

This is the real acceptance criterion. Do this before touching DNS.

1. Open `https://<your-netlify-url>.netlify.app/admin/`.
2. Log in with the invited email (`cecilecallensartiste@gmail.com`). If the
   invite has not been accepted yet, log in with your own Netlify Identity
   account (invite yourself first).
3. In the CMS, create a test painting:
   - Title: "Test -- a supprimer"
   - Category: pick any
   - Image: upload a small test image
   - Dimensions: "10cm x 10cm"
   - Technique: Acrylique
   - Click **Publish** (or Save, depending on the Decap version).
4. Go to the GitHub repo. Confirm a new commit appeared in `main` with the
   test painting file.
5. Go to the Netlify deploys page. Confirm a new deploy was triggered and
   succeeded.
6. Visit the live site. Confirm the test painting appears in the gallery.
7. Go back to `/admin/`, delete the test painting entry, and publish the
   deletion.
8. Confirm the commit, rebuild, and that the painting is gone from the live
   site.

If all eight steps pass, the loop is closed.

---

## 6. Custom domain

The domain `cecilecallens.art` currently points to GitHub Pages via a CNAME
record. The cutover should be planned so the site is never fully down.

### Option A: Netlify DNS (recommended)

1. In the Netlify dashboard, go to **Domain management > Add a domain**.
2. Enter `cecilecallens.art`.
3. Netlify will offer to set up Netlify DNS. Accept.
4. Netlify will give you **nameserver records** (e.g.
   `dns1.p01.nsone.net`, etc.).
5. Go to your domain registrar for `cecilecallens.art` and change the
   nameservers to the ones Netlify provided.
6. DNS propagation takes 15 min to 48 hours. During this time, some users
   will see the old GitHub Pages site and some the new Netlify site.

### Option B: External DNS (keep existing registrar DNS)

If you prefer not to delegate DNS to Netlify:

1. In the Netlify dashboard, go to **Domain management > Add a domain**.
2. Add `cecilecallens.art` as a custom domain.
3. Netlify will show you the required DNS records:
   - **A record**: `cecilecallens.art` -> `75.2.60.5` (Netlify's load
     balancer; check the dashboard for the current IP)
   - **CNAME record**: `www.cecilecallens.art` -> `<your-site>.netlify.app`
4. At your registrar, remove the old GitHub Pages CNAME record and add the
   records above.

### Cutover plan

- Before changing DNS, verify the site works perfectly on the
  `*.netlify.app` URL.
- Keep the old `cecilecallens.github.io` repo and its GitHub Pages active as
  rollback. If something goes wrong after switching DNS, point the domain
  back to GitHub Pages.
- Once DNS has propagated and the new site is confirmed live on
  `cecilecallens.art`, the old repo can be archived (but not deleted).

---

## 7. TLS certificate

1. After DNS propagation is complete and `cecilecallens.art` resolves to
   Netlify, go to **Domain management > HTTPS**.
2. Click **Provision certificate** (Netlify uses Let's Encrypt).
3. Wait a few minutes for the certificate to be issued.
4. Verify by visiting `https://cecilecallens.art` and checking the padlock.
5. Ensure **Force HTTPS** is enabled (it usually is by default).

---

## 8. Build hook (optional)

Not required for the Decap -> Git -> build path (pushes already trigger
builds). But if you ever need to trigger a rebuild from outside:

1. Go to **Site configuration > Build & deploy > Build hooks**.
2. Click **Add build hook**, name it (e.g. "Manual rebuild"), select the
   `main` branch.
3. Copy the webhook URL. A POST request to it triggers a rebuild.

---

## 9. Post-deploy checklist

- [ ] Site loads on `https://cecilecallens.art`
- [ ] HTTPS works, certificate is valid
- [ ] All gallery sections display with paintings
- [ ] Lightbox opens on painting click
- [ ] Expositions section shows correctly
- [ ] Contact section displays email and phone
- [ ] `/admin/` loads the Decap CMS login screen
- [ ] Login with Identity works
- [ ] CMS shows all four collections (Categories, Tableaux, Expositions,
      Parametres du site)
- [ ] End-to-end edit/publish/rebuild cycle works
- [ ] Old site `cecilecallens.github.io` still accessible as fallback
- [ ] sitemap.xml is accessible
- [ ] robots.txt is accessible
- [ ] Lighthouse scores 95+ on Performance, Accessibility, Best Practices, SEO

---

## 10. Fallback: GitHub OAuth (if Netlify Identity cannot be provisioned)

If Identity is unavailable (maintenance mode), switch Decap to the GitHub
OAuth backend. The content model and frontend are unchanged.

### Step 1: Change the CMS backend config

Edit `public/admin/config.yml`. Replace the backend block:

```yaml
# Before (git-gateway)
backend:
  name: git-gateway
  branch: main

# After (github)
backend:
  name: github
  repo: <owner>/cecilecallens
  branch: main
```

### Step 2: Remove the Identity widget

- In `public/admin/index.html`, remove the line:
  ```html
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  ```
- In `src/layouts/BaseLayout.astro`, remove both Identity-related script
  tags (the `netlify-identity-widget.js` script and the redirect snippet
  below it).

### Step 3: Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> (or the org's settings).
2. Click **New OAuth App**.
3. Fill in:
   - Application name: `Cecile Callens CMS`
   - Homepage URL: `https://cecilecallens.art`
   - Authorization callback URL:
     `https://cecilecallens.art/.netlify/functions/oauth-callback`
4. Note the **Client ID** and generate a **Client Secret**.

### Step 4: Deploy the OAuth provider as a Netlify Function

Create `netlify/functions/oauth.js` and `netlify/functions/oauth-callback.js`
using the `netlify-cms-oauth-provider-node` pattern, or use the simpler
approach with `@openlab/vercel-netlify-cms-github-auth` adapted for Netlify
Functions.

Alternatively, use the community package:

```bash
npm install netlify-cms-oauth-provider-node
```

Set environment variables in the Netlify dashboard (Site configuration >
Environment variables):

- `OAUTH_GITHUB_CLIENT_ID` = (from step 3)
- `OAUTH_GITHUB_CLIENT_SECRET` = (from step 3)

### Step 5: Alternative -- Sveltia CMS

If the OAuth function approach is too complex, replace Decap CMS with
Sveltia CMS. It is a drop-in replacement that supports direct GitHub auth
without a separate OAuth provider.

In `public/admin/index.html`, replace:

```html
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
```

with:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

The `config.yml` stays the same (with `name: github` backend). Sveltia
handles OAuth internally via GitHub device flow.

### Step 6: Test

Regardless of which OAuth path you chose, verify the full loop:
login -> edit -> commit -> rebuild -> live.

The artist will need a GitHub account in this scenario. Create one for her
or walk her through it.

---

## 11. Guide pour l'artiste -- Comment mettre a jour votre site

> Ce guide est a imprimer ou envoyer par email a Cecile.

### Connexion

1. Ouvrez votre navigateur et allez a l'adresse :
   **https://cecilecallens.art/admin/**
2. Entrez votre email (`cecilecallensartiste@gmail.com`) et votre mot de
   passe.
3. Vous arrivez sur le tableau de bord de votre site.

### Ajouter un tableau

1. Dans le menu de gauche, cliquez sur **Tableaux**.
2. Cliquez sur **Nouveau Tableau**.
3. Remplissez les champs :
   - **Titre** : le nom du tableau
   - **Categorie** : choisissez la famille de couleurs (Les ocres, Les
     bleus, etc.)
   - **Image** : cliquez sur "Choisir une image" et selectionnez la photo
     du tableau depuis votre ordinateur
   - **Dimensions** : par exemple "116cm x 84cm"
   - **Technique** : Acrylique, Huile, Technique mixte, Mixte ou Pastel
   - **Annee** : facultatif
   - **Disponible** : decochez si le tableau est vendu ou dans votre
     collection personnelle
4. Cliquez sur **Publier** en haut a droite.
5. Attendez 1 a 2 minutes. Votre tableau apparait sur le site.

### Modifier un tableau

1. Dans **Tableaux**, cliquez sur le tableau a modifier.
2. Faites vos changements.
3. Cliquez sur **Publier**.

### Supprimer un tableau

1. Dans **Tableaux**, cliquez sur le tableau a supprimer.
2. Cliquez sur **Supprimer** (en bas ou dans le menu).
3. Confirmez la suppression.

### Ajouter une exposition

1. Dans le menu de gauche, cliquez sur **Expositions**.
2. Cliquez sur **Nouvelle Exposition**.
3. Remplissez le titre, le lieu, les dates de debut et de fin.
4. Ajoutez une image ou une description si vous le souhaitez.
5. Cliquez sur **Publier**.

Les expositions a venir et passees se classent automatiquement selon les
dates.

### Modifier la biographie ou les informations de contact

1. Dans le menu de gauche, cliquez sur **Parametres du site**.
2. Cliquez sur **Parametres generaux**.
3. Modifiez le texte de la biographie, la photo, l'email, le telephone, ou
   le texte mis en avant sur la page d'accueil.
4. Cliquez sur **Publier**.

### En cas de probleme

- Si le site ne se met pas a jour apres 5 minutes, essayez de vider le
  cache de votre navigateur (Ctrl+Maj+Suppr ou Cmd+Maj+Suppr).
- Si vous ne pouvez plus vous connecter, contactez Vincent.
- Ne supprimez jamais les categories existantes sans en parler a Vincent,
  cela pourrait desorganiser la galerie.

---

## Notes techniques

- Node version: 22 (pinned in `netlify.toml` and `package.json` engines)
- Build command: `npm run build` (Astro SSG)
- Publish directory: `dist`
- CMS: Decap CMS 3.x at `/admin/`
- Auth: Netlify Identity + Git Gateway (primary), GitHub OAuth (fallback)
- Old site rollback: `cecilecallens/cecilecallens.github.io` on GitHub Pages
