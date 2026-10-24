from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./src/style.css">','<style>'+(root/'src/style.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./src/app.js"></script>','<script>'+(root/'src/app.js').read_text().replace('</script>','<\\/script>')+'</script>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1600,'height':950});errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.set_content(html,wait_until='load')
 page.wait_for_timeout(150)
 print('initialized',page.evaluate('window.SUBSTRATE?.App.initialized'),'errors',errors)
 page.locator('[data-action=sample]').click();print('sample count',page.evaluate('window.SUBSTRATE.App.doc.elements.length'))
 page.locator('[data-tool=wall]').click();r=page.locator('#viewport').bounding_box()
 page.mouse.click(r['x']+200,r['y']+230);page.mouse.click(r['x']+380,r['y']+230)
 print('post draw',page.evaluate('window.SUBSTRATE.App.doc.elements.length'))
 page.locator('[data-action=undo]').click();print('undo',page.evaluate('window.SUBSTRATE.App.doc.elements.length'))
 page.locator('[data-action=redo]').click();print('redo',page.evaluate('window.SUBSTRATE.App.doc.elements.length'))
 page.locator('[data-view=iso]').click();page.locator('[data-action=sheet]').first.click();print('sheet svg',page.locator('#overlay svg').count())
 page.screenshot(path=str(root/'preview.png'))
 print('ERRORS',errors)
 b.close()
