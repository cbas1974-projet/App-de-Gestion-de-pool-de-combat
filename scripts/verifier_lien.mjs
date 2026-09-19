// Ouvre une ou plusieurs adresses de l'application dans un vrai navigateur et
// vérifie que l'onglet Entraînement fonctionne (génération d'une séance,
// images chargées, aucune erreur JavaScript).
// Usage : node scripts/verifier_lien.mjs <url1> [url2 ...]
import { chromium } from 'playwright-core';

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('Donnez au moins une adresse à vérifier.');
  process.exit(2);
}

const navigateur = await chromium.launch({ channel: process.env.CANAL_NAVIGATEUR || 'chrome' });
let toutOk = true;

for (const url of urls) {
  const erreurs = [];
  const page = await navigateur.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'fr-FR' });
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });
  try {
    const reponse = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    const statut = reponse ? reponse.status() : 0;
    const type = reponse ? reponse.headers()['content-type'] : '';
    await page.getByRole('button', { name: /Entraînement/ }).click({ timeout: 15000 });
    await page.getByRole('button', { name: /Générer la séance/ }).click({ timeout: 15000 });
    await page.waitForTimeout(800);
    const images = await page.evaluate(() => [...document.images].map((i) => i.complete && i.naturalWidth > 0));
    const seance = await page.getByText('Séance proposée').count();
    const ok = statut === 200 && seance > 0 && images.length > 0 && images.every(Boolean) && erreurs.length === 0;
    toutOk &&= ok;
    console.log(`${ok ? 'OK    ' : 'ECHEC '} ${url}`);
    console.log(`       statut ${statut}, type ${type}, séance ${seance ? 'affichée' : 'absente'}, images ${images.filter(Boolean).length}/${images.length}, erreurs ${erreurs.length}`);
    for (const e of erreurs.slice(0, 5)) console.log(`       erreur : ${e}`);
  } catch (e) {
    toutOk = false;
    console.log(`ECHEC  ${url}`);
    console.log(`       ${String(e.message).split('\n')[0]}`);
    for (const err of erreurs.slice(0, 5)) console.log(`       erreur : ${err}`);
  } finally {
    await page.close();
  }
}

await navigateur.close();
process.exit(toutOk ? 0 : 1);
